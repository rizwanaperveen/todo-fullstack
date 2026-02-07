"""
SQLModel database models for tasks.
"""
from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional
import uuid


class Task(SQLModel, table=True):
    """
    Task model representing a user's todo item.

    Attributes:
        id: Unique identifier (UUID)
        title: Task title (required, max 500 chars)
        description: Optional task description (max 2000 chars)
        completed: Completion status (default: False)
        created_at: Timestamp when task was created
        updated_at: Timestamp when task was last updated
        user_id: ID of the user who owns this task
    """
    __tablename__ = "tasks"

    id: str = Field(
        default_factory=lambda: str(uuid.uuid4()),
        primary_key=True,
        index=True
    )
    title: str = Field(max_length=500)
    description: Optional[str] = Field(default=None, max_length=2000)
    completed: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    user_id: str = Field(index=True)

    class Config:
        json_schema_extra = {
            "example": {
                "id": "123e4567-e89b-12d3-a456-426614174000",
                "title": "Complete project documentation",
                "description": "Write comprehensive docs for the API",
                "completed": False,
                "created_at": "2026-02-01T10:00:00Z",
                "updated_at": "2026-02-01T10:00:00Z",
                "user_id": "user123"
            }
        }
