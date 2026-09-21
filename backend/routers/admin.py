from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from database import get_db
from models import (
    User,
    Exam,
    ExamAttempt,
    StudentAnswer,
    Question,
    ExamQuestion
)
from auth import get_current_admin


router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)


# ============================================================
# PENDING EXAMINER REQUESTS
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


# ============================================================
# DASHBOARD STATISTICS
# ============================================================

@router.get("/dashboard/stats")
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):

    total_students = (
        db.query(User)
        .filter(User.role == "student")
        .count()
    )

    total_examiners = (
        db.query(User)
        .filter(User.role == "examiner")
        .count()
    )

    approved_examiners = (
        db.query(User)
        .filter(
            User.role == "examiner",
            User.status == "approved"
        )
        .count()
    )

    pending_examiners = (
        db.query(User)
        .filter(
            User.role == "examiner",
            User.status == "pending"
        )
        .count()
    )

    rejected_examiners = (
        db.query(User)
        .filter(
            User.role == "examiner",
            User.status == "rejected"
        )
        .count()
    )

    total_exams = db.query(Exam).count()

    published_exams = (
        db.query(Exam)
        .filter(Exam.is_published == True)
        .count()
    )

    unpublished_exams = (
        db.query(Exam)
        .filter(Exam.is_published == False)
        .count()
    )

    total_attempts = db.query(ExamAttempt).count()

    submitted_attempts = (
        db.query(ExamAttempt)
        .filter(ExamAttempt.status == "submitted")
        .count()
    )

    in_progress_attempts = (
        db.query(ExamAttempt)
        .filter(ExamAttempt.status == "in_progress")
        .count()
    )

    return {
        "users": {
            "total_students": total_students,
            "total_examiners": total_examiners,
            "approved_examiners": approved_examiners,
            "pending_examiners": pending_examiners,
            "rejected_examiners": rejected_examiners
        },
        "examinations": {
            "total_exams": total_exams,
            "published_exams": published_exams,
            "unpublished_exams": unpublished_exams
        },
        "attempts": {
            "total_attempts": total_attempts,
            "submitted_attempts": submitted_attempts,
            "in_progress_attempts": in_progress_attempts
        }
    }


# ============================================================
# ALL USERS
# ============================================================

@router.get("/users")
def get_all_users(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):

    users = (
        db.query(User)
        .order_by(User.created_at.desc())
        .all()
    )

    return [
        {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "status": user.status,
            "created_at": user.created_at
        }
        for user in users
    ]


# ============================================================
# UPDATE USER STATUS
# ============================================================

@router.put("/users/{user_id}/status")
def update_user_status(
    user_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    # ------------------------------------------------------------
    # ADMIN ACCOUNTS CANNOT BE DEACTIVATED
    # ------------------------------------------------------------

    if user.role == "admin":
        raise HTTPException(
            status_code=400,
            detail="Admin accounts cannot be deactivated."
        )

    # ------------------------------------------------------------
    # TOGGLE STATUS
    # ------------------------------------------------------------

    if user.status == "active":
        user.status = "inactive"

    elif user.status == "inactive":

        if user.role == "examiner":
            user.status = "approved"
        else:
            user.status = "active"

    elif user.status == "approved":
        user.status = "inactive"

    elif user.status == "rejected":
        raise HTTPException(
            status_code=400,
            detail="Rejected examiners must be approved before activation."
        )

    elif user.status == "pending":
        raise HTTPException(
            status_code=400,
            detail="Pending examiners must be approved first."
        )

    else:
        user.status = "active"

    db.commit()
    db.refresh(user)

    return {
        "message": "User status updated successfully",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "status": user.status
        }
    }

# ============================================================
# ADMIN - ALL EXAMINATIONS
# ============================================================

@router.get("/exams")
def get_all_examinations(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):

    exams = (
        db.query(
            Exam,
            User.name.label("examiner_name"),
            User.email.label("examiner_email"),
            func.count(ExamAttempt.id).label("attempt_count"),
            func.count(ExamQuestion.id).label("question_count")
        )
        .join(
            User,
            User.id == Exam.examiner_id
        )
        .outerjoin(
            ExamAttempt,
            ExamAttempt.exam_id == Exam.id
        )
        .outerjoin(
            ExamQuestion,
            ExamQuestion.exam_id == Exam.id
        )
        .group_by(
            Exam.id,
            User.name,
            User.email
        )
        .order_by(
            Exam.created_at.desc()
        )
        .all()
    )

    current_time = datetime.now()

    result = []

    for exam, examiner_name, examiner_email, attempt_count, question_count in exams:

        # Determine examination status
        if not exam.is_published:
            exam_status = "Draft"

        elif current_time < exam.start_time:
            exam_status = "Upcoming"

        elif current_time <= exam.end_time:
            exam_status = "Live"

        else:
            exam_status = "Completed"

        result.append({
            "id": exam.id,
            "examiner_id": exam.examiner_id,
            "examiner_name": examiner_name,
            "examiner_email": examiner_email,

            "exam_name": exam.exam_name,
            "subject": exam.subject,

            "duration_minutes": exam.duration_minutes,

            "start_time": exam.start_time,
            "end_time": exam.end_time,

            "total_questions": exam.total_questions,
            "question_count": question_count,

            "maximum_marks": exam.maximum_marks,

            "is_published": exam.is_published,

            "status": exam_status,

            "attempt_count": attempt_count,

            "created_at": exam.created_at
        })

    return result


# ============================================================
# ADMIN - PUBLISH EXAM
# ============================================================

@router.patch("/exams/{exam_id}/publish")
def admin_publish_exam(
    exam_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):

    exam = (
        db.query(Exam)
        .filter(Exam.id == exam_id)
        .first()
    )

    if exam is None:
        raise HTTPException(
            status_code=404,
            detail="Examination not found"
        )

    exam.is_published = True

    db.commit()
    db.refresh(exam)

    return {
        "message": "Examination published successfully",
        "exam_id": exam.id,
        "is_published": exam.is_published
    }


# ============================================================
# ADMIN - UNPUBLISH EXAM
# ============================================================

@router.patch("/exams/{exam_id}/unpublish")
def admin_unpublish_exam(
    exam_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):

    exam = (
        db.query(Exam)
        .filter(Exam.id == exam_id)
        .first()
    )

    if exam is None:
        raise HTTPException(
            status_code=404,
            detail="Examination not found"
        )

    exam.is_published = False

    db.commit()
    db.refresh(exam)

    return {
        "message": "Examination unpublished successfully",
        "exam_id": exam.id,
        "is_published": exam.is_published
    }


# ============================================================
# ADMIN - VIEW ALL EXAMINATIONS
# ============================================================

@router.get("/exams")
def get_all_examinations(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    """
    Admin can view all examinations created by examiners.
    """

    exams = (
        db.query(Exam)
        .order_by(Exam.created_at.desc())
        .all()
    )

    result = []

    for exam in exams:

        # Get examiner
        examiner = (
            db.query(User)
            .filter(User.id == exam.examiner_id)
            .first()
        )

        # Count total attempts
        total_attempts = (
            db.query(func.count(ExamAttempt.id))
            .filter(
                ExamAttempt.exam_id == exam.id
            )
            .scalar()
        )

        # Count submitted attempts
        submitted_attempts = (
            db.query(func.count(ExamAttempt.id))
            .filter(
                ExamAttempt.exam_id == exam.id,
                ExamAttempt.status == "submitted"
            )
            .scalar()
        )

        result.append({
            "id": exam.id,
            "examiner_id": exam.examiner_id,

            "examiner_name": (
                examiner.name
                if examiner
                else "Unknown Examiner"
            ),

            "examiner_email": (
                examiner.email
                if examiner
                else ""
            ),

            "exam_name": exam.exam_name,
            "subject": exam.subject,

            "duration_minutes": exam.duration_minutes,

            "start_time": exam.start_time,
            "end_time": exam.end_time,

            "total_questions": exam.total_questions,
            "maximum_marks": exam.maximum_marks,

            "is_published": exam.is_published,

            "total_attempts": total_attempts or 0,
            "submitted_attempts": submitted_attempts or 0,

            "created_at": exam.created_at
        })

    return result

# ============================================================
# ADMIN - VIEW EXAMINATION DETAILS
# ============================================================

@router.get("/exams/{exam_id}")
def get_exam_details(
    exam_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    exam = db.query(Exam).filter(Exam.id == exam_id).first()

    if not exam:
        raise HTTPException(
            status_code=404,
            detail="Examination not found"
        )

    # ------------------------------------------------------------
    # EXAMINER
    # ------------------------------------------------------------

    examiner = (
        db.query(User)
        .filter(User.id == exam.examiner_id)
        .first()
    )

    # ------------------------------------------------------------
    # ATTEMPTS
    # ------------------------------------------------------------

    attempts = (
        db.query(ExamAttempt)
        .filter(ExamAttempt.exam_id == exam.id)
        .order_by(ExamAttempt.started_at.desc())
        .all()
    )

    attempt_list = []

    for attempt in attempts:

        student = (
            db.query(User)
            .filter(User.id == attempt.student_id)
            .first()
        )

        attempt_list.append({
            "id": attempt.id,
            "student_id": attempt.student_id,
            "student_name": (
                student.name
                if student
                else "Unknown Student"
            ),
            "student_email": (
                student.email
                if student
                else ""
            ),
            "started_at": attempt.started_at,
            "submitted_at": attempt.submitted_at,
            "status": attempt.status,
            "score": attempt.score if attempt.score is not None else 0
        })

    # ------------------------------------------------------------
    # EXAM QUESTIONS
    # ------------------------------------------------------------

    exam_questions = (
        db.query(ExamQuestion)
        .filter(ExamQuestion.exam_id == exam.id)
        .order_by(ExamQuestion.question_order.asc())
        .all()
    )

    questions = []

    for exam_question in exam_questions:

        question = (
            db.query(Question)
            .filter(
                Question.id == exam_question.question_id
            )
            .first()
        )

        if question:

            questions.append({
                "id": question.id,
                "question_order": exam_question.question_order,
                "subject": question.subject,
                "question_text": question.question_text,
                "question_type": question.question_type,
                "difficulty": question.difficulty,
                "option_a": question.option_a,
                "option_b": question.option_b,
                "option_c": question.option_c,
                "option_d": question.option_d,
                "marks": question.marks
            })

    # ------------------------------------------------------------
    # ATTEMPT STATISTICS
    # ------------------------------------------------------------

    total_attempts = len(attempts)

    submitted_attempts = len([
        attempt
        for attempt in attempts
        if attempt.status == "submitted"
    ])

    in_progress_attempts = len([
        attempt
        for attempt in attempts
        if attempt.status == "in_progress"
    ])

    # ------------------------------------------------------------
    # RESPONSE
    # ------------------------------------------------------------

    return {

        "exam": {
            "id": exam.id,
            "exam_name": exam.exam_name,
            "subject": exam.subject,
            "duration_minutes": exam.duration_minutes,
            "start_time": exam.start_time,
            "end_time": exam.end_time,
            "total_questions": exam.total_questions,
            "maximum_marks": exam.maximum_marks,
            "is_published": exam.is_published,
            "created_at": exam.created_at
        },

        "examiner": {
            "id": examiner.id if examiner else None,
            "name": (
                examiner.name
                if examiner
                else "Unknown Examiner"
            ),
            "email": (
                examiner.email
                if examiner
                else ""
            )
        },

        "attempts": {
            "total": total_attempts,
            "submitted": submitted_attempts,
            "in_progress": in_progress_attempts,
            "students": attempt_list
        },

        "questions": questions
    }

@router.get("/exams/{exam_id}/attempts/{attempt_id}")
def get_attempt_details(
    exam_id: int,
    attempt_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    # ------------------------------------------------------------
    # FIND EXAM
    # ------------------------------------------------------------

    exam = (
        db.query(Exam)
        .filter(Exam.id == exam_id)
        .first()
    )

    if not exam:
        raise HTTPException(
            status_code=404,
            detail="Examination not found"
        )

    # ------------------------------------------------------------
    # FIND ATTEMPT
    # ------------------------------------------------------------

    attempt = (
        db.query(ExamAttempt)
        .filter(
            ExamAttempt.id == attempt_id,
            ExamAttempt.exam_id == exam_id
        )
        .first()
    )

    if not attempt:
        raise HTTPException(
            status_code=404,
            detail="Attempt not found"
        )

    # ------------------------------------------------------------
    # FIND STUDENT
    # ------------------------------------------------------------

    student = (
        db.query(User)
        .filter(User.id == attempt.student_id)
        .first()
    )

    # ------------------------------------------------------------
    # FIND STUDENT ANSWERS
    # ------------------------------------------------------------

    answers = (
        db.query(StudentAnswer)
        .filter(
            StudentAnswer.attempt_id == attempt.id
        )
        .all()
    )

    answer_map = {
        answer.question_id: answer
        for answer in answers
    }

    # ------------------------------------------------------------
    # FIND EXAM QUESTIONS
    # ------------------------------------------------------------

    exam_questions = (
        db.query(ExamQuestion)
        .filter(
            ExamQuestion.exam_id == exam.id
        )
        .order_by(
            ExamQuestion.question_order.asc()
        )
        .all()
    )

    questions = []

    for exam_question in exam_questions:

        question = (
            db.query(Question)
            .filter(
                Question.id == exam_question.question_id
            )
            .first()
        )

        if not question:
            continue

        answer = answer_map.get(question.id)

        questions.append({
            "question_id": question.id,
            "question_order": exam_question.question_order,

            "question_text": question.question_text,
            "question_type": question.question_type,
            "difficulty": question.difficulty,

            "option_a": question.option_a,
            "option_b": question.option_b,
            "option_c": question.option_c,
            "option_d": question.option_d,

            "correct_answer": question.correct_answer,

            "selected_answer": (
                answer.selected_answer
                if answer
                else None
            ),

            "is_correct": (
                answer.is_correct
                if answer
                else None
            ),

            "marks": question.marks,

            "marks_awarded": (
                answer.marks_awarded
                if answer
                else 0
            )
        })

    # ------------------------------------------------------------
    # RESPONSE
    # ------------------------------------------------------------

    return {
        "exam": {
            "id": exam.id,
            "exam_name": exam.exam_name,
            "subject": exam.subject,
            "maximum_marks": exam.maximum_marks,
            "total_questions": exam.total_questions
        },

        "student": {
            "id": student.id if student else None,
            "name": (
                student.name
                if student
                else "Unknown Student"
            ),
            "email": (
                student.email
                if student
                else ""
            )
        },

        "attempt": {
            "id": attempt.id,
            "started_at": attempt.started_at,
            "submitted_at": attempt.submitted_at,
            "status": attempt.status,
            "score": attempt.score or 0
        },

        "questions": questions
    }