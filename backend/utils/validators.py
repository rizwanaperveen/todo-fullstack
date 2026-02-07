"""
Validation utility functions.
"""
from typing import Optional


def validate_task_title(title: str) -> bool:
    """
    Validate task title meets requirements.

    Args:
        title: Task title to validate

    Returns:
        True if valid, False otherwise
    """
    if not title or len(title.strip()) == 0:
        return False
    if len(title) > 500:
        return False
    return True


def validate_task_description(description: Optional[str]) -> bool:
    """
    Validate task description meets requirements.

    Args:
        description: Task description to validate

    Returns:
        True if valid, False otherwise
    """
    if description is None:
        return True
    if len(description) > 2000:
        return False
    return True
