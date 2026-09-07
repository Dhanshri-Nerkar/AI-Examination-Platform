from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
from models import User
from schemas import (
    RegisterRequest,
    LoginRequest,
    UserResponse,
    TokenResponse,
)

from auth import (
    hash_password,
    verify_password,
    create_access_token,
)


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


# ============================================================
# REGISTER
# ============================================================

@router.post(
    "/register",
    response_model=UserResponse
)
def register(
    user_data: RegisterRequest,
    db: Session = Depends(get_db)
):

    # --------------------------------------------------------
    # 1. Check whether email already exists
    # --------------------------------------------------------

    existing_user = (
        db.query(User)
        .filter(User.email == user_data.email)
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )


    # --------------------------------------------------------
    # 2. Only student and examiner can register
    # --------------------------------------------------------

    if user_data.role not in [
        "student",
        "examiner"
    ]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only student and examiner registration is allowed"
        )


    # --------------------------------------------------------
    # 3. Determine account status
    # --------------------------------------------------------

    if user_data.role == "student":

        # Students are immediately active
        user_status = "active"

    else:

        # Examiners require Admin approval
        user_status = "pending"


    # --------------------------------------------------------
    # 4. Hash password
    # --------------------------------------------------------

    hashed_password = hash_password(
        user_data.password
    )


    # --------------------------------------------------------
    # 5. Create user
    # --------------------------------------------------------

    new_user = User(
        name=user_data.name,
        email=user_data.email,
        password_hash=hashed_password,
        role=user_data.role,
        status=user_status
    )


    db.add(new_user)
    db.commit()
    db.refresh(new_user)


    # --------------------------------------------------------
    # 6. Return user
    # --------------------------------------------------------

    return new_user


# ============================================================
# LOGIN
# ============================================================

@router.post(
    "/login",
    response_model=TokenResponse
)
def login(
    login_data: LoginRequest,
    db: Session = Depends(get_db)
):

    # --------------------------------------------------------
    # 1. Find user
    # --------------------------------------------------------

    user = (
        db.query(User)
        .filter(User.email == login_data.email)
        .first()
    )


    # --------------------------------------------------------
    # 2. Check user exists
    # --------------------------------------------------------

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )


    # --------------------------------------------------------
    # 3. Verify password
    # --------------------------------------------------------

    if not verify_password(
        login_data.password,
        user.password_hash
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )


    # --------------------------------------------------------
    # 4. Check examiner approval
    # --------------------------------------------------------

    if user.role == "examiner":

        if user.status == "pending":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Your examiner account is waiting for Admin approval"
            )

        if user.status == "rejected":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Your examiner registration was rejected by Admin"
            )

        if user.status != "approved":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Your examiner account is not approved"
            )


    # --------------------------------------------------------
    # 5. Check Admin
    # --------------------------------------------------------

    if user.role == "admin":

        if user.status != "active":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Admin account is inactive"
            )


    # --------------------------------------------------------
    # 6. Check Student
    # --------------------------------------------------------

    if user.role == "student":

        if user.status != "active":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Student account is inactive"
            )


    # --------------------------------------------------------
    # 7. Create JWT token
    # --------------------------------------------------------

    access_token = create_access_token(
        user_id=user.id,
        role=user.role
    )


    # --------------------------------------------------------
    # 8. Return JWT
    # --------------------------------------------------------

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": user.role
    }