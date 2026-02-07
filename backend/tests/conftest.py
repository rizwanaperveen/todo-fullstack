"""
Pytest configuration and fixtures for testing.
"""
import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, create_engine, SQLModel
from sqlmodel.pool import StaticPool
from typing import Generator

from main import app
from core.database import get_session
from config.settings import settings


# Create in-memory SQLite database for testing
@pytest.fixture(name="session")
def session_fixture() -> Generator[Session, None, None]:
    """Create a test database session."""
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session


@pytest.fixture(name="client")
def client_fixture(session: Session) -> Generator[TestClient, None, None]:
    """Create a test client with database session override."""
    def get_session_override():
        return session

    app.dependency_overrides[get_session] = get_session_override
    client = TestClient(app)
    yield client
    app.dependency_overrides.clear()


@pytest.fixture
def mock_jwt_token() -> str:
    """Generate a mock JWT token for testing."""
    import jwt
    from datetime import datetime, timedelta

    payload = {
        "sub": "test-user-123",
        "exp": datetime.utcnow() + timedelta(days=1)
    }
    token = jwt.encode(payload, settings.BETTER_AUTH_SECRET, algorithm=settings.ALGORITHM)
    return token


@pytest.fixture
def auth_headers(mock_jwt_token: str) -> dict:
    """Generate authorization headers with mock JWT token."""
    return {"Authorization": f"Bearer {mock_jwt_token}"}
