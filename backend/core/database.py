"""
Database connection and session management.
"""
from sqlmodel import SQLModel, create_engine, Session
from typing import Generator
from config.settings import settings

# Import models to ensure they are registered with SQLModel
from models.task import Task
from models.user import User

# Create database engine with connection pooling
engine = create_engine(
    settings.NEON_DB_URL,
    echo=settings.DEBUG,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20
)


def create_db_and_tables():
    """Create database tables on startup."""
    SQLModel.metadata.create_all(engine)


def get_session() -> Generator[Session, None, None]:
    """
    Dependency for getting database sessions.
    Yields a database session and ensures proper cleanup.
    """
    with Session(engine) as session:
        yield session
