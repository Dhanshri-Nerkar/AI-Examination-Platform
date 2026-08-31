from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

DATABASE_URL = "postgresql://postgres:PostgreDhanu%402005@localhost:5432/examination_platform"

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


if __name__ == "__main__":
    try:
        connection = engine.connect()
        print("PostgreSQL connection successful!")
        connection.close()
    except Exception as e:
        print("PostgreSQL connection failed!")
        print(e)