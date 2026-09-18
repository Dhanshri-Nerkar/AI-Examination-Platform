from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db

from models import (
    Exam,
    Question,
    ExamQuestion,
    ExamAttempt,
    StudentAnswer,
)

from schemas import (
    ExamStartResponse,
    StudentQuestionResponse,
    StudentExamPaperResponse,
    StudentAnswerCreate,
    ExamSubmitResponse,
    StudentExamResponse,
    StudentExamListResponse,
)

from auth import get_current_user


router = APIRouter(
    prefix="/exams/student",
    tags=["Student Examinations"],
)


# ============================================================
# STUDENT CHECK
# ============================================================

def require_student(current_user):
    if current_user.role != "student":
        raise HTTPException(
            status_code=403,
            detail="Only students can access examinations.",
        )


@router.get(
    "/exams",
    response_model=StudentExamListResponse,
)
def get_student_exams(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    require_student(current_user)

    now = datetime.now()

    exams = (
        db.query(Exam)
        .filter(
            Exam.is_published.is_(True),
        )
        .order_by(
            Exam.start_time.asc()
        )
        .all()
    )

    available_exams = []
    completed_exams = []

    for exam in exams:

        # --------------------------------------------------------
        # Find this student's latest attempt for this exam
        # --------------------------------------------------------

        attempt = (
            db.query(ExamAttempt)
            .filter(
                ExamAttempt.exam_id == exam.id,
                ExamAttempt.student_id == current_user.id,
            )
            .order_by(
                ExamAttempt.id.desc()
            )
            .first()
        )

        # --------------------------------------------------------
        # Student has submitted this examination
        # --------------------------------------------------------

        if attempt and attempt.status == "submitted":

            completed_exams.append(
                StudentExamResponse(
                    id=exam.id,
                    examiner_id=exam.examiner_id,
                    exam_name=exam.exam_name,
                    subject=exam.subject,
                    duration_minutes=exam.duration_minutes,
                    start_time=exam.start_time,
                    end_time=exam.end_time,
                    total_questions=exam.total_questions,
                    maximum_marks=exam.maximum_marks,
                    is_published=exam.is_published,
                    attempt_id=attempt.id,
                    attempt_status=attempt.status,
                )
            )

            continue

        # --------------------------------------------------------
        # Student has an unfinished attempt
        # --------------------------------------------------------

        if attempt and attempt.status == "in_progress":

            available_exams.append(
                StudentExamResponse(
                    id=exam.id,
                    examiner_id=exam.examiner_id,
                    exam_name=exam.exam_name,
                    subject=exam.subject,
                    duration_minutes=exam.duration_minutes,
                    start_time=exam.start_time,
                    end_time=exam.end_time,
                    total_questions=exam.total_questions,
                    maximum_marks=exam.maximum_marks,
                    is_published=exam.is_published,
                    attempt_id=attempt.id,
                    attempt_status=attempt.status,
                )
            )

            continue

        # --------------------------------------------------------
        # No attempt exists
        # --------------------------------------------------------

        # If exam has ended and student never attempted it,
        # DO NOT mark it as completed.
        if exam.end_time is not None:

            end_time = exam.end_time

            if end_time.tzinfo is not None:
                end_time = end_time.replace(
                    tzinfo=None
                )

            if now > end_time:
                continue

        # --------------------------------------------------------
        # Exam is upcoming or currently active
        # --------------------------------------------------------

        available_exams.append(
            StudentExamResponse(
                id=exam.id,
                examiner_id=exam.examiner_id,
                exam_name=exam.exam_name,
                subject=exam.subject,
                duration_minutes=exam.duration_minutes,
                start_time=exam.start_time,
                end_time=exam.end_time,
                total_questions=exam.total_questions,
                maximum_marks=exam.maximum_marks,
                is_published=exam.is_published,
                attempt_id=None,
                attempt_status=None,
            )
        )

    return {
        "available": available_exams,
        "completed": completed_exams,
    }




# ============================================================
# START EXAM
# ============================================================

@router.post(
    "/{exam_id}/start",
    response_model=ExamStartResponse,
)
def start_exam(
    exam_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    require_student(current_user)

    # --------------------------------------------------------
    # Find published exam
    # --------------------------------------------------------

    exam = (
        db.query(Exam)
        .filter(
            Exam.id == exam_id,
            Exam.is_published.is_(True),
        )
        .first()
    )

    if not exam:
        raise HTTPException(
            status_code=404,
            detail="Examination not found or not published.",
        )

    # --------------------------------------------------------
    # Current server time
    # --------------------------------------------------------

    now = datetime.now()

    # --------------------------------------------------------
    # Start time
    # --------------------------------------------------------

    start_time = exam.start_time

    if start_time is not None:
        if start_time.tzinfo is not None:
            start_time = start_time.replace(
                tzinfo=None
            )

        if now < start_time:
            raise HTTPException(
                status_code=400,
                detail="This examination has not started yet.",
            )

    # --------------------------------------------------------
    # End time
    # --------------------------------------------------------

    end_time = exam.end_time

    if end_time is not None:
        if end_time.tzinfo is not None:
            end_time = end_time.replace(
                tzinfo=None
            )

        if now > end_time:
            raise HTTPException(
                status_code=400,
                detail="This examination has already ended.",
            )

    # --------------------------------------------------------
    # Existing attempt
    # --------------------------------------------------------

    existing_attempt = (
        db.query(ExamAttempt)
        .filter(
            ExamAttempt.exam_id == exam_id,
            ExamAttempt.student_id == current_user.id,
        )
        .order_by(
            ExamAttempt.id.desc()
        )
        .first()
    )

    if existing_attempt:

        if existing_attempt.status == "submitted":
            raise HTTPException(
                status_code=400,
                detail="You have already submitted this examination.",
            )

        return {
            "attempt_id": existing_attempt.id,
            "exam_id": existing_attempt.exam_id,
            "student_id": existing_attempt.student_id,
            "started_at": existing_attempt.started_at,
            "submitted_at": existing_attempt.submitted_at,
            "status": existing_attempt.status,
        }

    # --------------------------------------------------------
    # Create attempt
    # --------------------------------------------------------

    attempt = ExamAttempt(
        exam_id=exam_id,
        student_id=current_user.id,
        started_at=datetime.now(),
        status="in_progress",
        score=0,
    )

    db.add(attempt)

    db.commit()

    db.refresh(attempt)

    # --------------------------------------------------------
    # Return attempt
    # --------------------------------------------------------

    return {
        "attempt_id": attempt.id,
        "exam_id": attempt.exam_id,
        "student_id": attempt.student_id,
        "started_at": attempt.started_at,
        "submitted_at": attempt.submitted_at,
        "status": attempt.status,
    }


# ============================================================
# GET STUDENT QUESTION PAPER
# ============================================================

@router.get(
    "/{exam_id}/paper",
    response_model=StudentExamPaperResponse,
)
def get_student_paper(
    exam_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    require_student(current_user)

    # --------------------------------------------------------
    # Find exam
    # --------------------------------------------------------

    exam = (
        db.query(Exam)
        .filter(
            Exam.id == exam_id,
            Exam.is_published.is_(True),
        )
        .first()
    )

    if not exam:
        raise HTTPException(
            status_code=404,
            detail="Examination not found.",
        )

    # --------------------------------------------------------
    # Find active attempt
    # --------------------------------------------------------

    attempt = (
        db.query(ExamAttempt)
        .filter(
            ExamAttempt.exam_id == exam_id,
            ExamAttempt.student_id == current_user.id,
            ExamAttempt.status == "in_progress",
        )
        .order_by(
            ExamAttempt.id.desc()
        )
        .first()
    )

    if not attempt:
        raise HTTPException(
            status_code=400,
            detail="Please start the examination first.",
        )

    # --------------------------------------------------------
    # Get exam questions
    # --------------------------------------------------------

    exam_questions = (
        db.query(ExamQuestion)
        .filter(
            ExamQuestion.exam_id == exam_id
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

        questions.append(
            StudentQuestionResponse(
                id=question.id,
                question_text=question.question_text,
                question_type=question.question_type,
                difficulty=question.difficulty,
                option_a=question.option_a,
                option_b=question.option_b,
                option_c=question.option_c,
                option_d=question.option_d,
                marks=question.marks,
            )
        )

    # --------------------------------------------------------
    # Return paper
    # --------------------------------------------------------

    return StudentExamPaperResponse(
        attempt_id=attempt.id,
        exam_id=exam.id,
        exam_name=exam.exam_name,
        subject=exam.subject,
        duration_minutes=exam.duration_minutes,
        maximum_marks=exam.maximum_marks,
        started_at=attempt.started_at,
        questions=questions,
    )


# ============================================================
# SAVE STUDENT ANSWER
# ============================================================

@router.post(
    "/{exam_id}/answer"
)
def save_answer(
    exam_id: int,
    answer_data: StudentAnswerCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    require_student(current_user)

    # --------------------------------------------------------
    # Find attempt
    # --------------------------------------------------------

    attempt = (
        db.query(ExamAttempt)
        .filter(
            ExamAttempt.id == answer_data.attempt_id,
            ExamAttempt.exam_id == exam_id,
            ExamAttempt.student_id == current_user.id,
        )
        .first()
    )

    if not attempt:
        raise HTTPException(
            status_code=404,
            detail="Exam attempt not found.",
        )

    if attempt.status == "submitted":
        raise HTTPException(
            status_code=400,
            detail="This examination has already been submitted.",
        )

    # --------------------------------------------------------
    # Verify question
    # --------------------------------------------------------

    exam_question = (
        db.query(ExamQuestion)
        .filter(
            ExamQuestion.exam_id == exam_id,
            ExamQuestion.question_id == answer_data.question_id,
        )
        .first()
    )

    if not exam_question:
        raise HTTPException(
            status_code=400,
            detail="This question does not belong to the examination.",
        )

    # --------------------------------------------------------
    # Existing answer
    # --------------------------------------------------------

    existing_answer = (
        db.query(StudentAnswer)
        .filter(
            StudentAnswer.attempt_id == attempt.id,
            StudentAnswer.question_id == answer_data.question_id,
        )
        .first()
    )

    if existing_answer:

        existing_answer.selected_answer = (
            answer_data.selected_answer
        )

    else:

        new_answer = StudentAnswer(
            attempt_id=attempt.id,
            question_id=answer_data.question_id,
            selected_answer=answer_data.selected_answer,
        )

        db.add(new_answer)

    db.commit()

    return {
        "message": "Answer saved successfully."
    }


# ============================================================
# SUBMIT EXAM
# ============================================================

@router.post(
    "/{exam_id}/submit",
    response_model=ExamSubmitResponse,
)
def submit_exam(
    exam_id: int,
    attempt_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    require_student(current_user)

    # --------------------------------------------------------
    # Find exam
    # --------------------------------------------------------

    exam = (
        db.query(Exam)
        .filter(
            Exam.id == exam_id
        )
        .first()
    )

    if not exam:
        raise HTTPException(
            status_code=404,
            detail="Examination not found.",
        )

    # --------------------------------------------------------
    # Find attempt
    # --------------------------------------------------------

    attempt = (
        db.query(ExamAttempt)
        .filter(
            ExamAttempt.id == attempt_id,
            ExamAttempt.exam_id == exam_id,
            ExamAttempt.student_id == current_user.id,
        )
        .first()
    )

    if not attempt:
        raise HTTPException(
            status_code=404,
            detail="Exam attempt not found.",
        )

    if attempt.status == "submitted":
        raise HTTPException(
            status_code=400,
            detail="Examination already submitted.",
        )

    # --------------------------------------------------------
    # Get answers
    # --------------------------------------------------------

    answers = (
        db.query(StudentAnswer)
        .filter(
            StudentAnswer.attempt_id == attempt.id
        )
        .all()
    )

    correct_answers = 0
    wrong_answers = 0
    total_score = 0

    # --------------------------------------------------------
    # Evaluate answers
    # --------------------------------------------------------

    for answer in answers:

        question = (
            db.query(Question)
            .filter(
                Question.id == answer.question_id
            )
            .first()
        )

        if not question:
            continue

        if not answer.selected_answer:

            answer.is_correct = False
            answer.marks_awarded = 0

            continue

        if (
            question.correct_answer
            and
            answer.selected_answer.strip().lower()
            ==
            question.correct_answer.strip().lower()
        ):

            answer.is_correct = True
            answer.marks_awarded = question.marks

            total_score += question.marks

            correct_answers += 1

        else:

            answer.is_correct = False
            answer.marks_awarded = 0

            wrong_answers += 1

    # --------------------------------------------------------
    # Calculate unanswered
    # --------------------------------------------------------

    total_questions = (
        db.query(ExamQuestion)
        .filter(
            ExamQuestion.exam_id == exam_id
        )
        .count()
    )

    answered_question_ids = {
        answer.question_id
        for answer in answers
        if answer.selected_answer
    }

    unanswered = max(
        0,
        total_questions - len(answered_question_ids)
    )

    # --------------------------------------------------------
    # Update attempt
    # --------------------------------------------------------

    attempt.score = total_score

    attempt.status = "submitted"

    attempt.submitted_at = datetime.now()

    db.commit()

    db.refresh(attempt)

    # --------------------------------------------------------
    # Return result
    # --------------------------------------------------------

    return ExamSubmitResponse(
        attempt_id=attempt.id,
        exam_id=exam.id,
        score=total_score,
        maximum_marks=exam.maximum_marks,
        correct_answers=correct_answers,
        wrong_answers=wrong_answers,
        unanswered=unanswered,
        submitted_at=attempt.submitted_at,
        status=attempt.status,
    )



@router.get(
    "/{exam_id}/result",
    response_model=ExamSubmitResponse,
)
def get_exam_result(
    exam_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    require_student(current_user)

    # --------------------------------------------------------
    # Find the examination
    # --------------------------------------------------------

    exam = (
        db.query(Exam)
        .filter(
            Exam.id == exam_id,
            Exam.is_published.is_(True),
        )
        .first()
    )

    if not exam:
        raise HTTPException(
            status_code=404,
            detail="Examination not found.",
        )

    # --------------------------------------------------------
    # Find ONLY this student's submitted attempt
    # --------------------------------------------------------

    attempt = (
        db.query(ExamAttempt)
        .filter(
            ExamAttempt.exam_id == exam_id,
            ExamAttempt.student_id == current_user.id,
            ExamAttempt.status == "submitted",
        )
        .order_by(
            ExamAttempt.id.desc()
        )
        .first()
    )

    if not attempt:
        raise HTTPException(
            status_code=404,
            detail="Result is not available because you have not submitted this examination.",
        )

    # --------------------------------------------------------
    # Get student's answers
    # --------------------------------------------------------

    answers = (
        db.query(StudentAnswer)
        .filter(
            StudentAnswer.attempt_id == attempt.id
        )
        .all()
    )

    correct_answers = 0
    wrong_answers = 0
    answered_question_ids = set()

    for answer in answers:

        if answer.selected_answer:
            answered_question_ids.add(
                answer.question_id
            )

        question = (
            db.query(Question)
            .filter(
                Question.id == answer.question_id
            )
            .first()
        )

        if not question:
            continue

        if not answer.selected_answer:
            continue

        if (
            question.correct_answer
            and
            answer.selected_answer.strip().lower()
            ==
            question.correct_answer.strip().lower()
        ):
            correct_answers += 1
        else:
            wrong_answers += 1

    # --------------------------------------------------------
    # Calculate unanswered questions
    # --------------------------------------------------------

    total_questions = (
        db.query(ExamQuestion)
        .filter(
            ExamQuestion.exam_id == exam_id
        )
        .count()
    )

    unanswered = max(
        0,
        total_questions - len(answered_question_ids)
    )

    # --------------------------------------------------------
    # Return persistent result
    # --------------------------------------------------------

    return ExamSubmitResponse(
        attempt_id=attempt.id,
        exam_id=exam.id,
        score=attempt.score or 0,
        maximum_marks=exam.maximum_marks,
        correct_answers=correct_answers,
        wrong_answers=wrong_answers,
        unanswered=unanswered,
        submitted_at=attempt.submitted_at,
        status=attempt.status,
    )