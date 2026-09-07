from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import Exam
from schemas import ExamCreate, ExamResponse
from auth import get_current_user


router = APIRouter(
    prefix="/exams",
    tags=["Exams"]
)


@router.post("/", response_model=ExamResponse)
def create_exam(
    exam_data: ExamCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    # Only examiner can create examinations
    if current_user.role != "examiner":
        raise HTTPException(
            status_code=403,
            detail="Only examiners can create examinations"
        )

    # Validate values
    if exam_data.duration_minutes <= 0:
        raise HTTPException(
            status_code=400,
            detail="Duration must be greater than 0"
        )

    if exam_data.total_questions <= 0:
        raise HTTPException(
            status_code=400,
            detail="Total questions must be greater than 0"
        )

    if exam_data.maximum_marks <= 0:
        raise HTTPException(
            status_code=400,
            detail="Maximum marks must be greater than 0"
        )

    if exam_data.end_time <= exam_data.start_time:
        raise HTTPException(
            status_code=400,
            detail="End time must be after start time"
        )

    new_exam = Exam(
        examiner_id=current_user.id,
        exam_name=exam_data.exam_name,
        subject=exam_data.subject,
        duration_minutes=exam_data.duration_minutes,
        start_time=exam_data.start_time,
        end_time=exam_data.end_time,
        total_questions=exam_data.total_questions,
        maximum_marks=exam_data.maximum_marks
    )

    db.add(new_exam)
    db.commit()
    db.refresh(new_exam)

    return new_exam


@router.get("/my-exams", response_model=list[ExamResponse])
def get_my_exams(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    if current_user.role != "examiner":
        raise HTTPException(
            status_code=403,
            detail="Only examiners can view examinations"
        )

    exams = (
        db.query(Exam)
        .filter(Exam.examiner_id == current_user.id)
        .order_by(Exam.created_at.desc())
        .all()
    )

    return exams