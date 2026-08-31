from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status
)

from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from sqlalchemy.orm import Session

from database import get_db
from models import User

from schemas import (
    RegisterRequest,
    LoginRequest,
    UserResponse,
    TokenResponse
)

from auth import (
    hash_password,
    verify_password,
    create_access_token,
    decode_access_token
)


# ==========================================
# ROUTER
# ==========================================

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


# ==========================================
# JWT AUTHENTICATION
# ==========================================

security = HTTPBearer()


# ==========================================
# REGISTER
# ==========================================

@router.post(
    "/register",
    response_model=UserResponse
)
def register(
    user_data: RegisterRequest,
    db: Session = Depends(get_db)
):

    # Check if email already exists
    existing_user = db.query(User).filter(
        User.email == user_data.email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Allowed roles
    allowed_roles = [
        "student",
        "examiner",
        "admin"
    ]

    # Validate role
    if user_data.role not in allowed_roles:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid role"
        )

    # Hash password
    hashed_password = hash_password(
        user_data.password
    )

    # Create new user
    new_user = User(
        name=user_data.name,
        email=user_data.email,
        password_hash=hashed_password,
        role=user_data.role
    )

    # Save user to database
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


# ==========================================
# LOGIN
# ==========================================

@router.post(
    "/login",
    response_model=TokenResponse
)
def login(
    login_data: LoginRequest,
    db: Session = Depends(get_db)
):

    # Find user by email
    user = db.query(User).filter(
        User.email == login_data.email
    ).first()

    # User doesn't exist
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # Verify password
    password_valid = verify_password(
        login_data.password,
        user.password_hash
    )

    if not password_valid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # Create JWT access token
    access_token = create_access_token(
        user_id=user.id,
        role=user.role
    )

    # Return JWT
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": user.role
    }


# ==========================================
# GET CURRENT USER
# ==========================================

@router.get(
    "/me",
    response_model=UserResponse
)
def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):

    # Get JWT token
    token = credentials.credentials

    # Decode JWT
    payload = decode_access_token(token)

    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )

    # Get user ID from JWT
    user_id = payload.get("sub")

    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )

    # Find user
    user = db.query(User).filter(
        User.id == int(user_id)
    ).first()

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    return user