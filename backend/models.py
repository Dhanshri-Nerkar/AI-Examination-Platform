from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    name = Column(
        String(100),
        nullable=False
    )

    email = Column(
        String(150),
        unique=True,
        index=True,
        nullable=False
    )

    password_hash = Column(
        String(255),
        nullable=False
    )

    role = Column(
        String(20),
        nullable=False,
        default="student"
    )

    status = Column(
        String(20),
        nullable=False,
        default="active"
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

class Exam(Base):
    __tablename__ = "exams"

    id = Column(Integer, primary_key=True, index=True)

    examiner_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False
    )

    exam_name = Column(String(150), nullable=False)

    subject = Column(String(100), nullable=False)

    duration_minutes = Column(Integer, nullable=False)

    start_time = Column(DateTime, nullable=False)

    end_time = Column(DateTime, nullable=False)

    total_questions = Column(Integer, nullable=False)

    maximum_marks = Column(Integer, nullable=False)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

class Question(Base):
    __tablename__ = "questions"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    examiner_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False
    )

    subject = Column(
        String(100),
        nullable=False
    )

    question_text = Column(
        String(1000),
        nullable=False
    )

    question_type = Column(
        String(30),
        nullable=False
    )

    difficulty = Column(
        String(20),
        nullable=False
    )

    option_a = Column(
        String(500),
        nullable=True
    )

    option_b = Column(
        String(500),
        nullable=True
    )

    option_c = Column(
        String(500),
        nullable=True
    )

    option_d = Column(
        String(500),
        nullable=True
    )

    correct_answer = Column(
        String(500),
        nullable=False
    )

    marks = Column(
        Integer,
        nullable=False
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )


class ExamQuestion(Base):
    __tablename__ = "exam_questions"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    exam_id = Column(
        Integer,
        ForeignKey("exams.id", ondelete="CASCADE"),
        nullable=False
    )

    question_id = Column(
        Integer,
        ForeignKey("questions.id", ondelete="CASCADE"),
        nullable=False
    )

    question_order = Column(
        Integer,
        nullable=False
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )