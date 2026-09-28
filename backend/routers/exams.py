from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session

from database import get_db
from models import (
    Exam,
    Question,
    ExamQuestion,
    ExamAttempt,
    StudentAnswer,
    User,
)
from schemas import (
    ExamCreate,
    ExamResponse,
    QuestionCreate,
    QuestionResponse,
    ExamQuestionCreate,
    ExamQuestionResponse
)
from auth import get_current_user


import io
import csv
import re

import pandas as pd
from pypdf import PdfReader
from docx import Document


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

    question_counts = {
        "MCQ": exam_data.mcq_questions,
        "True/False": exam_data.true_false_questions,
        "Short Answer": exam_data.short_answer_questions,
        "Long Answer": exam_data.long_answer_questions,
    }

    if any(count < 0 for count in question_counts.values()):
        raise HTTPException(
            status_code=400,
            detail="Question type counts cannot be negative"
        )

    count_total = sum(question_counts.values())

    if count_total <= 0:
        raise HTTPException(
            status_code=400,
            detail="Please specify at least one question across the four question types"
        )

    if count_total != exam_data.total_questions:
        raise HTTPException(
            status_code=400,
            detail=(
                f"Question type counts must add up to {exam_data.total_questions}. "
                f"Currently they add up to {count_total}."
            )
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
        mcq_questions=exam_data.mcq_questions,
        true_false_questions=exam_data.true_false_questions,
        short_answer_questions=exam_data.short_answer_questions,
        long_answer_questions=exam_data.long_answer_questions,
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



@router.post("/questions/import")
async def import_questions(
    file: UploadFile = File(...),
    current_user=Depends(get_current_user)
):
    """
    Extract questions from PDF, DOCX, CSV or Excel files.

    The questions are returned to the frontend for review.
    They are NOT saved to the database here.
    """

    if current_user.role != "examiner":
        raise HTTPException(
            status_code=403,
            detail="Only examiners can import questions"
        )

    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="Please select a file"
        )

    filename = file.filename.lower()

    allowed_extensions = (
        ".pdf",
        ".docx",
        ".csv",
        ".xlsx",
        ".xls"
    )

    if not filename.endswith(allowed_extensions):
        raise HTTPException(
            status_code=400,
            detail=(
                "Unsupported file type. "
                "Please upload PDF, Word, CSV or Excel."
            )
        )

    try:
        file_bytes = await file.read()

        if not file_bytes:
            raise HTTPException(
                status_code=400,
                detail="The uploaded file is empty."
            )

        if filename.endswith(".pdf"):
            questions = extract_from_pdf(file_bytes)

        elif filename.endswith(".docx"):
            questions = extract_from_docx(file_bytes)

        elif filename.endswith(".csv"):
            questions = extract_from_csv(file_bytes)

        elif filename.endswith((".xlsx", ".xls")):
            questions = extract_from_excel(file_bytes)

        else:
            questions = []

        return {
            "filename": file.filename,
            "count": len(questions),
            "questions": questions
        }

    except HTTPException:
        raise

    except Exception as error:
        print("Question import error:", error)

        raise HTTPException(
            status_code=400,
            detail=(
                "Unable to extract questions from this file. "
                "Please check the file format and try again."
            )
        )


def clean_text(value):
    if value is None:
        return ""

    text = str(value)

    text = text.replace("\r", " ")
    text = text.replace("\n", " ")

    return re.sub(r"\s+", " ", text).strip()


def normalize_column_name(value):
    text = clean_text(value).lower()

    text = text.replace("_", " ")
    text = text.replace("-", " ")

    return re.sub(r"\s+", " ", text).strip()


def find_column(row, possible_names):
    normalized = {
        normalize_column_name(key): key
        for key in row.keys()
    }

    for name in possible_names:
        normalized_name = normalize_column_name(name)

        if normalized_name in normalized:
            return normalized[normalized_name]

    # Partial matching
    for column in row.keys():
        normalized_column = normalize_column_name(column)

        for name in possible_names:
            normalized_name = normalize_column_name(name)

            if normalized_name in normalized_column:
                return column

    return None


def get_value(row, possible_names):
    column = find_column(
        row,
        possible_names
    )

    if column is None:
        return ""

    return clean_text(row.get(column))


def normalize_question_type(value):
    value = clean_text(value).lower()

    if value in ["mcq", "multiple choice", "multiple choice question"]:
        return "MCQ"

    if value in [
        "true false",
        "true/false",
        "true or false",
        "boolean"
    ]:
        return "True/False"

    if value in [
        "short answer",
        "short response"
    ]:
        return "Short Answer"

    if value in [
        "essay",
        "long answer",
        "long response"
    ]:
        return "Long Answer"

    return "MCQ"


def normalize_difficulty(value):
    value = clean_text(value).lower()

    if value == "easy":
        return "Easy"

    if value == "hard":
        return "Hard"

    return "Medium"


def normalize_marks(value):
    try:
        number = int(float(value))
        return max(number, 1)
    except:
        return 1


def build_question_from_row(row):
    question_text = get_value(
        row,
        [
            "question",
            "question text",
            "question_text",
            "question title",
            "title",
            "text"
        ]
    )

    if not question_text:
        return None

    option_a = get_value(
        row,
        [
            "option a",
            "option_a",
            "choice a",
            "answer a",
            "a"
        ]
    )

    option_b = get_value(
        row,
        [
            "option b",
            "option_b",
            "choice b",
            "answer b",
            "b"
        ]
    )

    option_c = get_value(
        row,
        [
            "option c",
            "option_c",
            "choice c",
            "answer c",
            "c"
        ]
    )

    option_d = get_value(
        row,
        [
            "option d",
            "option_d",
            "choice d",
            "answer d",
            "d"
        ]
    )

    correct_answer = get_value(
        row,
        [
            "correct answer",
            "correct_answer",
            "correct option",
            "answer",
            "correct",
            "right answer"
        ]
    )

    subject = get_value(
        row,
        [
            "subject",
            "course",
            "topic",
            "category"
        ]
    )

    question_type = get_value(
        row,
        [
            "question type",
            "question_type",
            "type"
        ]
    )

    difficulty = get_value(
        row,
        [
            "difficulty",
            "level"
        ]
    )

    marks = get_value(
        row,
        [
            "marks",
            "mark",
            "points",
            "score"
        ]
    )

    return {
        "subject": subject or "General",
        "question_text": question_text,
        "question_type": normalize_question_type(
            question_type
        ),
        "difficulty": normalize_difficulty(
            difficulty
        ),
        "option_a": option_a or None,
        "option_b": option_b or None,
        "option_c": option_c or None,
        "option_d": option_d or None,
        "correct_answer": correct_answer or "",
        "marks": normalize_marks(marks)
    }


def extract_from_csv(file_bytes):
    text = file_bytes.decode(
        "utf-8-sig",
        errors="replace"
    )

    sample = text[:5000]

    try:
        dialect = csv.Sniffer().sniff(sample)
    except:
        dialect = csv.excel

    reader = csv.DictReader(
        io.StringIO(text),
        dialect=dialect
    )

    questions = []

    for row in reader:
        question = build_question_from_row(row)

        if question:
            questions.append(question)

    return questions


def extract_from_excel(file_bytes):
    dataframe = pd.read_excel(
        io.BytesIO(file_bytes)
    )

    dataframe = dataframe.fillna("")

    questions = []

    for _, row in dataframe.iterrows():
        row_data = row.to_dict()

        question = build_question_from_row(
            row_data
        )

        if question:
            questions.append(question)

    return questions


def extract_from_docx(file_bytes):
    document = Document(
        io.BytesIO(file_bytes)
    )

    questions = []

    # First try tables.
    for table in document.tables:

        headers = []

        if table.rows:
            headers = [
                clean_text(cell.text)
                for cell in table.rows[0].cells
            ]

        if len(headers) >= 2:

            for table_row in table.rows[1:]:

                values = [
                    clean_text(cell.text)
                    for cell in table_row.cells
                ]

                if not any(values):
                    continue

                row = {}

                for index, header in enumerate(headers):
                    if index < len(values):
                        row[header] = values[index]

                question = build_question_from_row(row)

                if question:
                    questions.append(question)

    # If no table questions were found,
    # try normal paragraph format.
    if not questions:

        paragraphs = [
            clean_text(paragraph.text)
            for paragraph in document.paragraphs
            if clean_text(paragraph.text)
        ]

        questions = extract_questions_from_text(
            paragraphs
        )

    return questions


def extract_from_pdf(file_bytes):
    reader = PdfReader(
        io.BytesIO(file_bytes)
    )

    text_parts = []

    for page in reader.pages:

        page_text = page.extract_text()

        if page_text:
            text_parts.append(page_text)

    full_text = "\n".join(text_parts)

    if not full_text.strip():
        raise HTTPException(
            status_code=400,
            detail=(
                "No readable text was found in the PDF. "
                "Scanned image PDFs are not supported yet."
            )
        )

    paragraphs = [
        clean_text(line)
        for line in full_text.splitlines()
        if clean_text(line)
    ]

    return extract_questions_from_text(
        paragraphs
    )


def extract_questions_from_text(lines):
    questions = []

    current = None

    question_pattern = re.compile(
        r"^(?:question\s*)?(\d+)[\.\):\-]\s*(.*)$",
        re.IGNORECASE
    )

    option_pattern = re.compile(
        r"^([A-Da-d])[\.\):\-]\s*(.*)$"
    )

    for line in lines:

        question_match = question_pattern.match(
            line
        )

        if question_match:

            if current and current.get(
                "question_text"
            ):
                questions.append(current)

            current = {
                "subject": "General",
                "question_text":
                    question_match.group(2),
                "question_type": "MCQ",
                "difficulty": "Medium",
                "option_a": None,
                "option_b": None,
                "option_c": None,
                "option_d": None,
                "correct_answer": "",
                "marks": 1
            }

            continue

        option_match = option_pattern.match(
            line
        )

        if option_match and current:

            letter = option_match.group(1).upper()
            value = option_match.group(2).strip()

            if letter == "A":
                current["option_a"] = value

            elif letter == "B":
                current["option_b"] = value

            elif letter == "C":
                current["option_c"] = value

            elif letter == "D":
                current["option_d"] = value

            continue

        if current:

            # Look for answer information.
            answer_match = re.match(
                r"^(?:correct answer|answer|correct)\s*[:\-]\s*(.*)$",
                line,
                re.IGNORECASE
            )

            if answer_match:
                current["correct_answer"] = (
                    answer_match.group(1).strip()
                )
                continue

            # Continue question text if it is not
            # an option or answer line.
            current["question_text"] += (
                " " + line
            )

    if current and current.get("question_text"):
        questions.append(current)

    return questions


@router.post(
    "/questions",
    response_model=QuestionResponse
)
def create_question(
    question_data: QuestionCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    # Only examiner can create questions
    if current_user.role != "examiner":
        raise HTTPException(
            status_code=403,
            detail="Only examiners can create questions"
        )

    # Validate marks
    if question_data.marks <= 0:
        raise HTTPException(
            status_code=400,
            detail="Marks must be greater than 0"
        )

    # Validate question text
    if not question_data.question_text.strip():
        raise HTTPException(
            status_code=400,
            detail="Question text is required"
        )

    # Validate subject
    if not question_data.subject.strip():
        raise HTTPException(
            status_code=400,
            detail="Subject is required"
        )

    # MCQ validation
    if question_data.question_type == "MCQ":

        if not all([
            question_data.option_a,
            question_data.option_b,
            question_data.option_c,
            question_data.option_d
        ]):
            raise HTTPException(
                status_code=400,
                detail="All four options are required for MCQ"
            )

    new_question = Question(
        examiner_id=current_user.id,
        subject=question_data.subject,
        question_text=question_data.question_text,
        question_type=question_data.question_type,
        difficulty=question_data.difficulty,
        option_a=question_data.option_a,
        option_b=question_data.option_b,
        option_c=question_data.option_c,
        option_d=question_data.option_d,
        correct_answer=question_data.correct_answer,
        marks=question_data.marks
    )

    db.add(new_question)
    db.commit()
    db.refresh(new_question)

    return new_question


@router.get(
    "/questions/my-questions",
    response_model=list[QuestionResponse]
)
def get_my_questions(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    if current_user.role != "examiner":
        raise HTTPException(
            status_code=403,
            detail="Only examiners can view questions"
        )

    questions = (
        db.query(Question)
        .filter(
            Question.examiner_id == current_user.id
        )
        .order_by(
            Question.created_at.desc()
        )
        .all()
    )

    return questions


@router.post(
    "/{exam_id}/questions",
    response_model=list[ExamQuestionResponse]
)
def add_questions_to_exam(
    exam_id: int,
    question_data: ExamQuestionCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    if current_user.role != "examiner":
        raise HTTPException(
            status_code=403,
            detail="Only examiners can add questions"
        )

    exam = (
        db.query(Exam)
        .filter(
            Exam.id == exam_id,
            Exam.examiner_id == current_user.id
        )
        .first()
    )

    if not exam:
        raise HTTPException(
            status_code=404,
            detail="Examination not found"
        )

    if not question_data.question_ids:
        raise HTTPException(
            status_code=400,
            detail="Please select at least one question"
        )

    unique_question_ids = list(dict.fromkeys(question_data.question_ids))

    questions = (
        db.query(Question)
        .filter(
            Question.id.in_(unique_question_ids),
            Question.examiner_id == current_user.id
        )
        .all()
    )

    if len(questions) != len(unique_question_ids):
        raise HTTPException(
            status_code=400,
            detail="One or more questions are invalid"
        )

    # Questions already assigned to this examination are kept.
    # This allows the examiner to add questions in multiple batches.
    existing_rows = (
        db.query(ExamQuestion)
        .filter(ExamQuestion.exam_id == exam_id)
        .order_by(ExamQuestion.question_order.asc())
        .all()
    )

    existing_ids = {row.question_id for row in existing_rows}
    new_question_ids = [
        question_id
        for question_id in unique_question_ids
        if question_id not in existing_ids
    ]

    if not new_question_ids:
        raise HTTPException(
            status_code=400,
            detail="All selected questions are already added to this examination"
        )

    existing_questions = []
    if existing_ids:
        existing_questions = (
            db.query(Question)
            .filter(
                Question.id.in_(list(existing_ids)),
                Question.examiner_id == current_user.id
            )
            .all()
        )

    def normalized_type(value):
        text = (value or "").strip().lower()
        if text in {"mcq", "multiple choice", "multiple choice question"}:
            return "MCQ"
        if text in {"true/false", "true false", "true or false", "boolean"}:
            return "True/False"
        if text in {"short answer", "short response", "short"}:
            return "Short Answer"
        if text in {"long answer", "long response", "essay", "long"}:
            return "Long Answer"
        return value

    required = {
        "MCQ": exam.mcq_questions,
        "True/False": exam.true_false_questions,
        "Short Answer": exam.short_answer_questions,
        "Long Answer": exam.long_answer_questions,
    }

    all_questions = existing_questions + questions
    counts = {key: 0 for key in required}
    for question in all_questions:
        question_type = normalized_type(question.question_type)
        if question_type not in counts:
            raise HTTPException(
                status_code=400,
                detail=(
                    f'Question "{question.question_text[:60]}" has unsupported '
                    f'type "{question.question_type}".'
                )
            )
        counts[question_type] += 1

    total_after = len(existing_rows) + len(new_question_ids)

    if total_after > exam.total_questions:
        raise HTTPException(
            status_code=400,
            detail=(
                f"This examination allows only {exam.total_questions} questions. "
                f"You already have {len(existing_rows)} and are trying to add "
                f"{len(new_question_ids)} more."
            )
        )

    for question_type, required_count in required.items():
        if counts[question_type] > required_count:
            raise HTTPException(
                status_code=400,
                detail=(
                    f"Question limit reached for {question_type}. "
                    f"Required: {required_count}, selected/assigned: "
                    f"{counts[question_type]}."
                )
            )

    # Randomize only the newly added questions, while keeping existing order.
    import random
    randomized_ids = new_question_ids.copy()
    random.shuffle(randomized_ids)

    next_order = len(existing_rows) + 1
    for offset, question_id in enumerate(randomized_ids):
        db.add(
            ExamQuestion(
                exam_id=exam_id,
                question_id=question_id,
                question_order=next_order + offset
            )
        )

    db.commit()

    updated_rows = (
        db.query(ExamQuestion)
        .filter(ExamQuestion.exam_id == exam_id)
        .order_by(ExamQuestion.question_order.asc())
        .all()
    )

    for item in updated_rows:
        db.refresh(item)

    return updated_rows


@router.get("/{exam_id}/questions")
def get_exam_questions(
    exam_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    # ------------------------------------------------------------
    # Examiner authentication
    # ------------------------------------------------------------

    if current_user.role != "examiner":
        raise HTTPException(
            status_code=403,
            detail="Only examiners can view examination questions.",
        )

    # ------------------------------------------------------------
    # Check examination ownership
    # ------------------------------------------------------------

    exam = (
        db.query(Exam)
        .filter(
            Exam.id == exam_id,
            Exam.examiner_id == current_user.id,
        )
        .first()
    )

    if not exam:
        raise HTTPException(
            status_code=404,
            detail="Examination not found.",
        )

    # ------------------------------------------------------------
    # Get assigned questions in final order
    # ------------------------------------------------------------

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

    result = []

    for exam_question in exam_questions:

        question = (
            db.query(Question)
            .filter(
                Question.id ==
                exam_question.question_id
            )
            .first()
        )

        if not question:
            continue

        result.append({
            "id": exam_question.id,

            "exam_id": exam_question.exam_id,

            "question_id":
                exam_question.question_id,

            "question_order":
                exam_question.question_order,

            "question": {
                "id": question.id,

                "examiner_id":
                    question.examiner_id,

                "subject":
                    question.subject,

                "question_text":
                    question.question_text,

                "question_type":
                    question.question_type,

                "difficulty":
                    question.difficulty,

                "option_a":
                    question.option_a,

                "option_b":
                    question.option_b,

                "option_c":
                    question.option_c,

                "option_d":
                    question.option_d,

                "correct_answer":
                    question.correct_answer,

                "marks":
                    question.marks,

                "created_at":
                    question.created_at,
            },
        })

    return result
    
@router.get(
    "/{exam_id}/submissions"
)
def get_exam_submissions(
    exam_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    if current_user.role != "examiner":
        raise HTTPException(
            status_code=403,
            detail="Only examiners can view submissions"
        )

    # --------------------------------------------------------
    # Find examiner's examination
    # --------------------------------------------------------

    exam = (
        db.query(Exam)
        .filter(
            Exam.id == exam_id,
            Exam.examiner_id == current_user.id
        )
        .first()
    )

    if not exam:
        raise HTTPException(
            status_code=404,
            detail="Examination not found"
        )

    # --------------------------------------------------------
    # Find submitted attempts
    # --------------------------------------------------------

    attempts = (
        db.query(ExamAttempt)
        .filter(
            ExamAttempt.exam_id == exam_id,
            ExamAttempt.status == "submitted"
        )
        .order_by(
            ExamAttempt.submitted_at.desc()
        )
        .all()
    )

    submissions = []

    for attempt in attempts:

        student = (
            db.query(User)
            .filter(
                User.id == attempt.student_id
            )
            .first()
        )

        submissions.append({
            "attempt_id": attempt.id,
            "student_id": attempt.student_id,
            "student_name": student.name if student else "Unknown Student",
            "student_email": student.email if student else "",
            "submitted_at": attempt.submitted_at,
            "score": attempt.score or 0,
            "maximum_marks": exam.maximum_marks,
            "status": attempt.status,
        })

    return {
        "exam_id": exam.id,
        "exam_name": exam.exam_name,
        "subject": exam.subject,
        "maximum_marks": exam.maximum_marks,
        "result_published": exam.result_published,
        "submissions": submissions,
    }


@router.get(
    "/{exam_id}/submissions/{attempt_id}"
)
def get_submission_details(
    exam_id: int,
    attempt_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    if current_user.role != "examiner":
        raise HTTPException(
            status_code=403,
            detail="Only examiners can view submissions"
        )

    # --------------------------------------------------------
    # Find examiner's examination
    # --------------------------------------------------------

    exam = (
        db.query(Exam)
        .filter(
            Exam.id == exam_id,
            Exam.examiner_id == current_user.id
        )
        .first()
    )

    if not exam:
        raise HTTPException(
            status_code=404,
            detail="Examination not found"
        )

    # --------------------------------------------------------
    # Find submitted attempt
    # --------------------------------------------------------

    attempt = (
        db.query(ExamAttempt)
        .filter(
            ExamAttempt.id == attempt_id,
            ExamAttempt.exam_id == exam_id,
            ExamAttempt.status == "submitted"
        )
        .first()
    )

    if not attempt:
        raise HTTPException(
            status_code=404,
            detail="Submitted examination not found"
        )

    # --------------------------------------------------------
    # Find student
    # --------------------------------------------------------

    student = (
        db.query(User)
        .filter(
            User.id == attempt.student_id
        )
        .first()
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

    # --------------------------------------------------------
    # Get student's answers
    # --------------------------------------------------------

    student_answers = (
        db.query(StudentAnswer)
        .filter(
            StudentAnswer.attempt_id == attempt.id
        )
        .all()
    )

    answer_map = {
        answer.question_id: answer
        for answer in student_answers
    }

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

        answer = answer_map.get(
            question.id
        )

        questions.append({
            "question_id": question.id,
            "question_order": exam_question.question_order,
            "question_text": question.question_text,
            "question_type": question.question_type,

            "option_a": question.option_a,
            "option_b": question.option_b,
            "option_c": question.option_c,
            "option_d": question.option_d,

            "correct_answer": question.correct_answer,

            "maximum_marks": question.marks,

            "student_answer": (
                answer.selected_answer
                if answer
                else None
            ),

            "is_correct": (
                answer.is_correct
                if answer
                else None
            ),

            "marks_awarded": (
                answer.marks_awarded
                if answer
                else 0
            ),

            "needs_manual_check": (
                question.question_type
                in [
                    "Short Answer",
                    "Long Answer",
                    "short answer",
                    "long answer",
                    "Short",
                    "Long",
                    "Essay",
                    "essay",
                ]
            ),
        })

    return {
        "exam_id": exam.id,
        "exam_name": exam.exam_name,
        "subject": exam.subject,

        "attempt_id": attempt.id,

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

        "submitted_at": attempt.submitted_at,

        "score": attempt.score or 0,
        "maximum_marks": exam.maximum_marks,

        "result_published": exam.result_published,

        "questions": questions,
    }

@router.patch(
    "/{exam_id}/publish",
    response_model=ExamResponse
)
def publish_exam(
    exam_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    if current_user.role != "examiner":
        raise HTTPException(
            status_code=403,
            detail="Only examiners can publish examinations"
        )

    exam = (
        db.query(Exam)
        .filter(
            Exam.id == exam_id,
            Exam.examiner_id == current_user.id
        )
        .first()
    )

    if not exam:
        raise HTTPException(
            status_code=404,
            detail="Examination not found"
        )

    assigned_rows = (
        db.query(ExamQuestion)
        .filter(ExamQuestion.exam_id == exam_id)
        .all()
    )

    if len(assigned_rows) != exam.total_questions:
        raise HTTPException(
            status_code=400,
            detail=(
                f"Cannot publish this examination yet. "
                f"Add all {exam.total_questions} required questions first. "
                f"Currently assigned: {len(assigned_rows)}."
            )
        )

    assigned_ids = [row.question_id for row in assigned_rows]
    assigned_questions = (
        db.query(Question)
        .filter(Question.id.in_(assigned_ids))
        .all()
    )

    def normalized_type(value):
        text = (value or "").strip().lower()
        if text in {"mcq", "multiple choice", "multiple choice question"}:
            return "MCQ"
        if text in {"true/false", "true false", "true or false", "boolean"}:
            return "True/False"
        if text in {"short answer", "short response", "short"}:
            return "Short Answer"
        if text in {"long answer", "long response", "essay", "long"}:
            return "Long Answer"
        return value

    actual_counts = {
        "MCQ": 0,
        "True/False": 0,
        "Short Answer": 0,
        "Long Answer": 0,
    }
    for question in assigned_questions:
        question_type = normalized_type(question.question_type)
        if question_type in actual_counts:
            actual_counts[question_type] += 1

    required_counts = {
        "MCQ": exam.mcq_questions,
        "True/False": exam.true_false_questions,
        "Short Answer": exam.short_answer_questions,
        "Long Answer": exam.long_answer_questions,
    }

    if actual_counts != required_counts:
        raise HTTPException(
            status_code=400,
            detail=(
                "Cannot publish yet. Required question mix is "
                f"MCQ {exam.mcq_questions}, True/False {exam.true_false_questions}, "
                f"Short Answer {exam.short_answer_questions}, "
                f"Long Answer {exam.long_answer_questions}. "
                "Please complete the required question mix."
            )
        )

    exam.is_published = True

    db.commit()
    db.refresh(exam)

    return exam


@router.patch(
    "/{exam_id}/unpublish",
    response_model=ExamResponse
)
def unpublish_exam(
    exam_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    if current_user.role != "examiner":
        raise HTTPException(
            status_code=403,
            detail="Only examiners can unpublish examinations"
        )

    exam = (
        db.query(Exam)
        .filter(
            Exam.id == exam_id,
            Exam.examiner_id == current_user.id
        )
        .first()
    )

    if not exam:
        raise HTTPException(
            status_code=404,
            detail="Examination not found"
        )

    exam.is_published = False

    db.commit()
    db.refresh(exam)

    return exam


@router.patch(
    "/{exam_id}/submissions/{attempt_id}/answers/{question_id}"
)
def update_student_answer_marks(
    exam_id: int,
    attempt_id: int,
    question_id: int,
    marks_awarded: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    if current_user.role != "examiner":
        raise HTTPException(
            status_code=403,
            detail="Only examiners can check answers"
        )

    # --------------------------------------------------------
    # Find examiner's exam
    # --------------------------------------------------------

    exam = (
        db.query(Exam)
        .filter(
            Exam.id == exam_id,
            Exam.examiner_id == current_user.id
        )
        .first()
    )

    if not exam:
        raise HTTPException(
            status_code=404,
            detail="Examination not found"
        )

    # --------------------------------------------------------
    # Find attempt
    # --------------------------------------------------------

    attempt = (
        db.query(ExamAttempt)
        .filter(
            ExamAttempt.id == attempt_id,
            ExamAttempt.exam_id == exam_id,
            ExamAttempt.status == "submitted"
        )
        .first()
    )

    if not attempt:
        raise HTTPException(
            status_code=404,
            detail="Submitted examination not found"
        )

    # --------------------------------------------------------
    # Find question
    # --------------------------------------------------------

    question = (
        db.query(Question)
        .join(
            ExamQuestion,
            ExamQuestion.question_id == Question.id
        )
        .filter(
            ExamQuestion.exam_id == exam_id,
            Question.id == question_id
        )
        .first()
    )

    if not question:
        raise HTTPException(
            status_code=404,
            detail="Question not found in this examination"
        )

    # --------------------------------------------------------
    # Validate marks
    # --------------------------------------------------------

    if marks_awarded < 0:
        raise HTTPException(
            status_code=400,
            detail="Marks cannot be negative"
        )

    if marks_awarded > question.marks:
        raise HTTPException(
            status_code=400,
            detail=(
                f"Marks cannot be greater than "
                f"{question.marks}"
            )
        )

    # --------------------------------------------------------
    # Find student's answer
    # --------------------------------------------------------

    answer = (
        db.query(StudentAnswer)
        .filter(
            StudentAnswer.attempt_id == attempt_id,
            StudentAnswer.question_id == question_id
        )
        .first()
    )

    # --------------------------------------------------------
    # Student did not answer this question
    # --------------------------------------------------------

    if not answer:

        if marks_awarded != 0:
            raise HTTPException(
                status_code=400,
                detail="An unanswered question cannot receive marks."
            )

        answer = StudentAnswer(
            attempt_id=attempt_id,
            question_id=question_id,
            selected_answer=None,
            marks_awarded=0,
            is_correct=False
        )

        db.add(answer)

    else:

        answer.marks_awarded = marks_awarded

        # For manual questions, marks determine whether
        # the answer receives credit.
        answer.is_correct = (
            marks_awarded > 0
        )

    db.commit()

    # --------------------------------------------------------
    # Recalculate total score
    # --------------------------------------------------------

    all_answers = (
        db.query(StudentAnswer)
        .filter(
            StudentAnswer.attempt_id == attempt_id
        )
        .all()
    )

    total_score = sum(
        answer.marks_awarded or 0
        for answer in all_answers
    )

    attempt.score = total_score

    db.commit()

    return {
        "message": "Marks updated successfully.",
        "attempt_id": attempt.id,
        "question_id": question_id,
        "marks_awarded": marks_awarded,
        "total_score": total_score,
        "maximum_marks": exam.maximum_marks,
    }

@router.patch(
    "/{exam_id}/publish-result",
    response_model=ExamResponse
)
def publish_result(
    exam_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    if current_user.role != "examiner":
        raise HTTPException(
            status_code=403,
            detail="Only examiners can publish results"
        )

    # --------------------------------------------------------
    # Find examiner's exam
    # --------------------------------------------------------

    exam = (
        db.query(Exam)
        .filter(
            Exam.id == exam_id,
            Exam.examiner_id == current_user.id
        )
        .first()
    )

    if not exam:
        raise HTTPException(
            status_code=404,
            detail="Examination not found"
        )

    # --------------------------------------------------------
    # Find submitted attempts
    # --------------------------------------------------------

    attempts = (
        db.query(ExamAttempt)
        .filter(
            ExamAttempt.exam_id == exam_id,
            ExamAttempt.status == "submitted"
        )
        .all()
    )

    # --------------------------------------------------------
    # Check manually graded answers
    # --------------------------------------------------------

    for attempt in attempts:

        answers = (
            db.query(StudentAnswer)
            .filter(
                StudentAnswer.attempt_id == attempt.id
            )
            .all()
        )

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

            question_type = (
                question.question_type or ""
            ).strip().lower()

            is_manual_question = (
                question_type in {
                    "short answer",
                    "short response",
                    "short",
                    "long answer",
                    "long response",
                    "essay",
                    "long",
                }
            )

            if is_manual_question:

                # If student answered, examiner must
                # explicitly check it.
                if (
                    answer.selected_answer
                    and
                    answer.is_correct is None
                ):
                    raise HTTPException(
                        status_code=400,
                        detail=(
                            f"All descriptive answers must be "
                            f"checked before publishing results. "
                            f"Attempt {attempt.id}, "
                            f"Question {question.id} "
                            f"is still pending."
                        )
                    )

    # --------------------------------------------------------
    # Recalculate every submitted student's score
    # --------------------------------------------------------

    for attempt in attempts:

        answers = (
            db.query(StudentAnswer)
            .filter(
                StudentAnswer.attempt_id == attempt.id
            )
            .all()
        )

        attempt.score = sum(
            answer.marks_awarded or 0
            for answer in answers
        )

    # --------------------------------------------------------
    # Publish result
    # --------------------------------------------------------

    exam.result_published = True

    db.commit()
    db.refresh(exam)

    return exam