"""
Pydantic schemas for authentication.
"""
from typing import Optional
from pydantic import BaseModel, EmailStr


class TokenPayload(BaseModel):
    """JWT token payload schema."""
    sub: str | None = None
    userId: str | None = None
    user_id: str | None = None
    exp: int | None = None


class UserInfo(BaseModel):
    """User information extracted from JWT token."""
    user_id: str


class SignupRequest(BaseModel):
    """Request schema for user signup."""
    email: EmailStr
    password: str
    name: Optional[str] = None


class LoginRequest(BaseModel):
    """Request schema for user login."""
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    """User information response."""
    id: str
    email: str
    name: Optional[str] = None

    class Config:
        from_attributes = True


class AuthResponse(BaseModel):
    """Response schema for authentication."""
    token: str
    user: UserResponse
