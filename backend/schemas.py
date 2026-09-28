from datetime import datetime
from pydantic import BaseModel


# =========================================================
# AUTH
# =========================================================

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    role: str = "student"


class LoginRequest(BaseModel):
    email: str
    password: str


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str
    status: str

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    role: str


# =========================================================
# EXAM
# =========================================================

class ExamCreate(BaseModel):
    exam_name: str
    subject: str

    duration_minutes: int

    start_time: datetime
    end_time: datetime

    total_questions: int

    mcq_questions: int = 0
    true_false_questions: int = 0
    short_answer_questions: int = 0
    long_answer_questions: int = 0

    maximum_marks: int


class ExamResponse(BaseModel):
    id: int
    examiner_id: int

    exam_name: str
    subject: str

    duration_minutes: int

    start_time: datetime
    end_time: datetime

    total_questions: int

    mcq_questions: int
    true_false_questions: int
    short_answer_questions: int
    long_answer_questions: int

    maximum_marks: int

    is_published: bool
    result_published: bool

    class Config:
        from_attributes = True


# =========================================================
# STUDENT EXAM
# =========================================================

class StudentExamResponse(BaseModel):
    id: int
    examiner_id: int

    exam_name: str
    subject: str

    duration_minutes: int

    start_time: datetime
    end_time: datetime

    total_questions: int

    mcq_questions: int
    true_false_questions: int
    short_answer_questions: int
    long_answer_questions: int

    maximum_marks: int

    is_published: bool

    class Config:
        from_attributes = True


class StudentExamListResponse(BaseModel):
    available: list[StudentExamResponse]
    completed: list[StudentExamResponse]


# =========================================================
# QUESTIONS
# =========================================================

class QuestionCreate(BaseModel):
    subject: str
    question_text: str
    question_type: str
    difficulty: str

    option_a: str | None = None
    option_b: str | None = None
    option_c: str | None = None
    option_d: str | None = None

    correct_answer: str

    marks: int


class QuestionResponse(BaseModel):
    id: int
    examiner_id: int

    subject: str
    question_text: str
    question_type: str
    difficulty: str

    option_a: str | None = None
    option_b: str | None = None
    option_c: str | None = None
    option_d: str | None = None

    correct_answer: str

    marks: int

    class Config:
        from_attributes = True


# =========================================================
# EXAM QUESTIONS
# =========================================================

class ExamQuestionCreate(BaseModel):
    exam_id: int
    question_ids: list[int]


class ExamQuestionResponse(BaseModel):
    id: int
    exam_id: int
    question_id: int
    question_order: int

    class Config:
        from_attributes = True


# =========================================================
# STUDENT EXAM SESSION
# =========================================================

class ExamStartResponse(BaseModel):
    attempt_id: int
    exam_id: int
    started_at: datetime


class StudentQuestionResponse(BaseModel):
    id: int
    question_text: str
    question_type: str

    option_a: str | None = None
    option_b: str | None = None
    option_c: str | None = None
    option_d: str | None = None

    marks: int
    question_order: int


class StudentExamPaperResponse(BaseModel):
    attempt_id: int

    exam_id: int
    exam_name: str
    subject: str

    duration_minutes: int
    maximum_marks: int

    started_at: datetime

    questions: list[StudentQuestionResponse]


class StudentAnswerCreate(BaseModel):
    attempt_id: int
    question_id: int
    selected_answer: str | None = None

class ExamSubmitResponse(BaseModel):
    attempt_id: int
    exam_id: int
    score: int
    maximum_marks: int
    correct_answers: int
    wrong_answers: int
    unanswered: int
    submitted_at: datetime
    status: str