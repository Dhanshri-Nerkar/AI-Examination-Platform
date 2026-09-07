from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.admin import router as admin_router

from database import Base, engine
import models

from routers.auth import router as auth_router

from routers.exams import router as exams_router

# Create tables
Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="AI Examination Platform API",
    version="1.0.0"
)


# CORS - allows Next.js to communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Authentication routes
app.include_router(auth_router)
app.include_router(admin_router)
app.include_router(exams_router)


@app.get("/")
def root():
    return {
        "message": "AI Examination Platform API is running"
    }