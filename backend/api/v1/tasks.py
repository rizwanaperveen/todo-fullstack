"""
Task management API endpoints.
"""
from fastapi import APIRouter, HTTPException, status
from sqlmodel import select
from datetime import datetime
from models.task import Task
from schemas.task import TaskCreate, TaskUpdate, TaskResponse, TaskListResponse
from api.deps import SessionDep, CurrentUser

router = APIRouter(prefix="/tasks", tags=["tasks"])


@router.get("", response_model=TaskListResponse)
async def list_tasks(
    session: SessionDep,
    current_user: CurrentUser
) -> TaskListResponse:
    """
    List all tasks for the authenticated user.

    Returns:
        TaskListResponse with list of tasks and total count
    """
    # Query tasks filtered by user_id
    statement = select(Task).where(Task.user_id == current_user)
    tasks = session.exec(statement).all()

    return TaskListResponse(
        tasks=[TaskResponse.model_validate(task) for task in tasks],
        total=len(tasks)
    )


@router.post("", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_task(
    task_data: TaskCreate,
    session: SessionDep,
    current_user: CurrentUser
) -> TaskResponse:
    """
    Create a new task for the authenticated user.

    Args:
        task_data: Task creation data
        session: Database session
        current_user: Authenticated user ID

    Returns:
        Created task
    """
    # Create new task with user_id from authenticated user
    task = Task(
        title=task_data.title,
        description=task_data.description,
        user_id=current_user,
        completed=False
    )

    session.add(task)
    session.commit()
    session.refresh(task)

    return TaskResponse.model_validate(task)


@router.get("/{task_id}", response_model=TaskResponse)
async def get_task(
    task_id: str,
    session: SessionDep,
    current_user: CurrentUser
) -> TaskResponse:
    """
    Retrieve a specific task by ID.

    Args:
        task_id: Task ID
        session: Database session
        current_user: Authenticated user ID

    Returns:
        Task details

    Raises:
        HTTPException: 404 if task not found or doesn't belong to user
    """
    # Query task with user_id filter for data isolation
    statement = select(Task).where(
        Task.id == task_id,
        Task.user_id == current_user
    )
    task = session.exec(statement).first()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    return TaskResponse.model_validate(task)


@router.put("/{task_id}", response_model=TaskResponse)
async def update_task(
    task_id: str,
    task_data: TaskUpdate,
    session: SessionDep,
    current_user: CurrentUser
) -> TaskResponse:
    """
    Update an existing task.

    Args:
        task_id: Task ID
        task_data: Task update data
        session: Database session
        current_user: Authenticated user ID

    Returns:
        Updated task

    Raises:
        HTTPException: 404 if task not found or doesn't belong to user
    """
    # Query task with user_id filter for ownership validation
    statement = select(Task).where(
        Task.id == task_id,
        Task.user_id == current_user
    )
    task = session.exec(statement).first()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Update task fields if provided
    if task_data.title is not None:
        task.title = task_data.title
    if task_data.description is not None:
        task.description = task_data.description
    if task_data.completed is not None:
        task.completed = task_data.completed

    # Update timestamp
    task.updated_at = datetime.utcnow()

    session.add(task)
    session.commit()
    session.refresh(task)

    return TaskResponse.model_validate(task)


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    task_id: str,
    session: SessionDep,
    current_user: CurrentUser
) -> None:
    """
    Delete a specific task.

    Args:
        task_id: Task ID
        session: Database session
        current_user: Authenticated user ID

    Raises:
        HTTPException: 404 if task not found or doesn't belong to user
    """
    # Query task with user_id filter for ownership validation
    statement = select(Task).where(
        Task.id == task_id,
        Task.user_id == current_user
    )
    task = session.exec(statement).first()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    session.delete(task)
    session.commit()
