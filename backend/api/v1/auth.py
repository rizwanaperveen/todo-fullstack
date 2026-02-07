"""
Authentication API endpoints.
"""
import uuid
import bcrypt
import logging
from datetime import datetime
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from core.database import get_session
from core.security import create_jwt_token, log_authentication_failure
from models.user import User
from schemas.auth import SignupRequest, LoginRequest, AuthResponse, UserResponse

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/auth", tags=["auth"])


def hash_password(password: str) -> str:
    """Hash a password using bcrypt."""
    password_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode('utf-8')


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash."""
    password_bytes = plain_password.encode('utf-8')
    hashed_bytes = hashed_password.encode('utf-8')
    return bcrypt.checkpw(password_bytes, hashed_bytes)


@router.post("/signup", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def signup(
    request: SignupRequest,
    session: Annotated[Session, Depends(get_session)]
):
    """
    Register a new user.

    Args:
        request: Signup request with email, password, and optional name
        session: Database session

    Returns:
        AuthResponse with JWT token and user information

    Raises:
        HTTPException: If email already exists
    """
    # Check if user already exists
    statement = select(User).where(User.email == request.email)
    existing_user = session.exec(statement).first()

    if existing_user:
        log_authentication_failure("Signup failed", f"Email already exists: {request.email}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Create new user
    user_id = f"user_{uuid.uuid4()}"
    hashed_password = hash_password(request.password)

    new_user = User(
        id=user_id,
        email=request.email,
        name=request.name or request.email.split("@")[0],
        hashed_password=hashed_password,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

    session.add(new_user)
    session.commit()
    session.refresh(new_user)

    # Generate JWT token
    token = create_jwt_token(
        user_id=new_user.id,
        email=new_user.email,
        name=new_user.name
    )

    logger.info(f"New user registered: {new_user.email}")

    return AuthResponse(
        token=token,
        user=UserResponse(
            id=new_user.id,
            email=new_user.email,
            name=new_user.name
        )
    )


@router.post("/login", response_model=AuthResponse)
async def login(
    request: LoginRequest,
    session: Annotated[Session, Depends(get_session)]
):
    """
    Authenticate a user and return JWT token.

    Args:
        request: Login request with email and password
        session: Database session

    Returns:
        AuthResponse with JWT token and user information

    Raises:
        HTTPException: If credentials are invalid
    """
    # Find user by email
    statement = select(User).where(User.email == request.email)
    user = session.exec(statement).first()

    if not user:
        log_authentication_failure("Login failed", f"User not found: {request.email}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # Verify password
    if not verify_password(request.password, user.hashed_password):
        log_authentication_failure("Login failed", f"Invalid password for: {request.email}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # Generate JWT token
    token = create_jwt_token(
        user_id=user.id,
        email=user.email,
        name=user.name
    )

    logger.info(f"User logged in: {user.email}")

    return AuthResponse(
        token=token,
        user=UserResponse(
            id=user.id,
            email=user.email,
            name=user.name
        )
    )


@router.post("/logout")
async def logout():
    """
    Logout endpoint (stateless - client should discard token).

    Returns:
        Success message
    """
    return {"message": "Logged out successfully"}
