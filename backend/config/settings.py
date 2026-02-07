"""
Application settings and configuration management.
"""
from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # Database configuration
    NEON_DB_URL: str

    # Authentication configuration
    BETTER_AUTH_SECRET: str
    BETTER_AUTH_URL: Optional[str] = None

    # JWT configuration
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 43200  # 30 days

    # Application configuration
    APP_NAME: str = "Todo Backend API"
    DEBUG: bool = False

    # CORS configuration
    CORS_ORIGINS: list[str] = ["http://localhost:3000"]

    class Config:
        env_file = ".env"
        case_sensitive = True


# Global settings instance
settings = Settings()
