# database.py - Configuration SQLModel pour OnlyJobs
import os
from sqlmodel import create_engine, Session

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "mysql+pymysql://root@localhost/onlyjobs",
)
engine = create_engine(DATABASE_URL, echo=True)

def get_session():
    with Session(engine) as session:
        yield session
