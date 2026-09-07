from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
from models import User

from auth import get_current_admin


router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)


# ============================================================
# GET PENDING EXAMINERS
# ============================================================

@router.get("/examiners/pending")
def get_pending_examiners(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):

    examiners = (
        db.query(User)
        .filter(
            User.role == "examiner",
            User.status == "pending"
        )
        .order_by(User.created_at.desc())
        .all()
    )

    return examiners


# ============================================================
# APPROVE EXAMINER
# ============================================================

@router.put("/examiners/{user_id}/approve")
def approve_examiner(
    user_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):

    examiner = (
        db.query(User)
        .filter(
            User.id == user_id,
            User.role == "examiner"
        )
        .first()
    )

    if examiner is None:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Examiner not found"
        )


    examiner.status = "approved"

    db.commit()
    db.refresh(examiner)


    return {
        "message": "Examiner approved successfully",
        "user": {
            "id": examiner.id,
            "name": examiner.name,
            "email": examiner.email,
            "role": examiner.role,
            "status": examiner.status
        }
    }


# ============================================================
# REJECT EXAMINER
# ============================================================

@router.put("/examiners/{user_id}/reject")
def reject_examiner(
    user_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):

    examiner = (
        db.query(User)
        .filter(
            User.id == user_id,
            User.role == "examiner"
        )
        .first()
    )

    if examiner is None:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Examiner not found"
        )


    examiner.status = "rejected"

    db.commit()
    db.refresh(examiner)


    return {
        "message": "Examiner rejected successfully",
        "user": {
            "id": examiner.id,
            "name": examiner.name,
            "email": examiner.email,
            "role": examiner.role,
            "status": examiner.status
        }
    }