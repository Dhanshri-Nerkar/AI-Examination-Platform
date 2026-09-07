from pydantic import BaseModel, EmailStr, Field
from datetime import datetime


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

    class Config:
        from_attributes = True