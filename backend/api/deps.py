"""
Dependency injection utilities for FastAPI endpoints.
"""
from typing import Annotated
from fastapi import Depends, HTTPException, status, Header
from sqlmodel import Session
from core.database import get_session
from core.security import verify_jwt_token, extract_user_id, log_authentication_failure


async def get_current_user(
    authorization: Annotated[str | None, Header()] = None
) -> str:
    """
    Dependency to get the current authenticated user from JWT token.

    Args:
        authorization: Authorization header containing Bearer token

    Returns:
        User ID extracted from the validated JWT token

    Raises:
        HTTPException: If authentication fails
    """
    if not authorization:
        log_authentication_failure("Missing authorization header")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing authentication token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Extract token from "Bearer <token>" format
    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        log_authentication_failure("Invalid authorization header format")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication header format",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = parts[1]

    # Verify token and extract user ID
    try:
        payload = verify_jwt_token(token)
        user_id = extract_user_id(payload)
        return user_id
    except HTTPException:
        raise
    except Exception as e:
        log_authentication_failure("Unexpected error", str(e))
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication failed"
        )


# Type aliases for dependency injection
SessionDep = Annotated[Session, Depends(get_session)]
CurrentUser = Annotated[str, Depends(get_current_user)]
