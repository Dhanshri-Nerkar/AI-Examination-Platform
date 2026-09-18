from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional

class RegisterRequest(BaseModel):
    name: str = Field(
        min_length=2,
        max_length=100
    )

    email: EmailStr

    password: str = Field(
        min_length=8,
        max_length=100
    )

    role: str = "student"


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: str
    status: str

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    role: str

class ExamCreate(BaseModel):
    exam_name: str
    subject: str
    duration_minutes: int
    start_time: datetime
    end_time: datetime
    total_questions: int
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
    maximum_marks: int
    is_published: bool

    class Config:
        from_attributes = True

class StudentExamResponse(BaseModel):
    id: int
    examiner_id: int
    exam_name: str
    subject: str
    duration_minutes: int
    start_time: datetime
    end_time: datetime
    total_questions: int
    maximum_marks: int
    is_published: bool

    attempt_id: Optional[int] = None
    attempt_status: Optional[str] = None

    class Config:
        from_attributes = True


class StudentExamListResponse(BaseModel):
    available: list[StudentExamResponse]
    completed: list[StudentExamResponse]


class QuestionCreate(BaseModel):
    subject: str
    question_text: str
    question_type: str
    difficulty: str
    option_a: Optional[str] = None
    option_b: Optional[str] = None
    option_c: Optional[str] = None
    option_d: Optional[str] = None
    correct_answer: str
    marks: int


class QuestionResponse(BaseModel):
    id: int
    examiner_id: int
    subject: str
    question_text: str
    question_type: str
    difficulty: str
    option_a: Optional[str] = None
    option_b: Optional[str] = None
    option_c: Optional[str] = None
    option_d: Optional[str] = None
    correct_answer: str
    marks: int

    class Config:
        from_attributes = True


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


from datetime import datetime
from pydantic import BaseModel
from typing import Optional


class ExamStartResponse(BaseModel):
    attempt_id: int
    exam_id: int
    started_at: datetime
    status: str


class StudentQuestionResponse(BaseModel):
    id: int
    question_text: str
    question_type: str
    difficulty: str
    option_a: Optional[str] = None
    option_b: Optional[str] = None
    option_c: Optional[str] = None
    option_d: Optional[str] = None
    marks: int


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
    selected_answer: Optional[str] = None


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