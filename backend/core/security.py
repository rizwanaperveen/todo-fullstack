"""
JWT authentication and security utilities.
"""
import jwt
import logging
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from fastapi import HTTPException, status
from config.settings import settings

logger = logging.getLogger(__name__)


def create_jwt_token(user_id: str, email: str, name: Optional[str] = None) -> str:
    """
    Create a JWT token for a user.

    Args:
        user_id: User ID
        email: User email
        name: User name (optional)

    Returns:
        JWT token string
    """
    payload = {
        "sub": user_id,
        "userId": user_id,
        "email": email,
        "name": name or email,
        "iat": datetime.utcnow(),
        "exp": datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    }

    token = jwt.encode(
        payload,
        settings.BETTER_AUTH_SECRET,
        algorithm=settings.ALGORITHM
    )

    return token


def decode_jwt_token(token: str) -> Dict[str, Any]:
    """
    Decode and validate a JWT token.

    Args:
        token: JWT token string

    Returns:
        Decoded token payload

    Raises:
        HTTPException: If token is invalid or expired
    """
    try:
        payload = jwt.decode(
            token,
            settings.BETTER_AUTH_SECRET,
            algorithms=[settings.ALGORITHM]
        )
        return payload
    except jwt.ExpiredSignatureError:
        logger.warning("JWT token has expired")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired"
        )
    except jwt.InvalidTokenError as e:
        logger.warning(f"Invalid JWT token: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token"
        )


def verify_jwt_token(token: str) -> Dict[str, Any]:
    """
    Verify JWT token signature and expiration.

    Args:
        token: JWT token string

    Returns:
        Decoded and verified token payload

    Raises:
        HTTPException: If token verification fails
    """
    try:
        payload = jwt.decode(
            token,
            settings.BETTER_AUTH_SECRET,
            algorithms=[settings.ALGORITHM]
        )

        # Check if token has expired
        exp = payload.get("exp")
        if exp and datetime.fromtimestamp(exp) < datetime.utcnow():
            logger.warning("Token has expired")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token has expired"
            )

        return payload

    except jwt.InvalidSignatureError:
        logger.error("Invalid JWT signature")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token signature"
        )
    except jwt.DecodeError:
        logger.error("JWT decode error")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not decode token"
        )
    except Exception as e:
        logger.error(f"JWT verification failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication failed"
        )


def extract_user_id(token_payload: Dict[str, Any]) -> str:
    """
    Extract user ID from JWT token payload.

    Args:
        token_payload: Decoded JWT token payload

    Returns:
        User ID string

    Raises:
        HTTPException: If user ID is not found in token
    """
    user_id = token_payload.get("sub") or token_payload.get("userId") or token_payload.get("user_id")

    if not user_id:
        logger.error("User ID not found in token payload")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token: user ID not found"
        )

    return str(user_id)


def log_authentication_failure(reason: str, details: Optional[str] = None):
    """
    Log authentication failures for security monitoring.

    Args:
        reason: Reason for authentication failure
        details: Additional details about the failure
    """
    log_message = f"Authentication failure: {reason}"
    if details:
        log_message += f" - {details}"
    logger.warning(log_message)
