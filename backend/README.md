# Todo Backend API

FastAPI backend for the Todo Full-Stack Web Application with JWT authentication and PostgreSQL data persistence.

## Features

- ✅ RESTful API with FastAPI
- ✅ JWT authentication verification
- ✅ SQLModel ORM with Neon Serverless PostgreSQL
- ✅ Strict user data isolation
- ✅ CORS configuration for frontend integration
- ✅ Comprehensive error handling
- ✅ Request validation with Pydantic
- ✅ Database connection pooling
- ✅ Security logging

## Prerequisites

- Python 3.11+
- Neon Serverless PostgreSQL database
- Better Auth JWT secret (shared with frontend)

## Quick Start

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Environment

Copy `.env.example` to `.env` and update with your values:

```bash
cp .env.example .env
```

Required environment variables:
- `NEON_DB_URL`: Your Neon PostgreSQL connection string
- `BETTER_AUTH_SECRET`: JWT signing secret (must match frontend)
- `BETTER_AUTH_URL`: Better Auth service URL (optional)

### 3. Run the Application

```bash
# Development mode with auto-reload
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Production mode
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

The API will be available at `http://localhost:8000`

### 4. View API Documentation

- Interactive API docs: `http://localhost:8000/docs`
- OpenAPI schema: `http://localhost:8000/openapi.json`

## API Endpoints

### Health Check
- `GET /` - Health check endpoint

### Task Management (All require authentication)
- `GET /tasks` - List all tasks for authenticated user
- `POST /tasks` - Create a new task
- `GET /tasks/{id}` - Get a specific task
- `PUT /tasks/{id}` - Update a task
- `DELETE /tasks/{id}` - Delete a task

## Authentication

All task endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

The backend validates the token signature using `BETTER_AUTH_SECRET` and extracts the user ID for data isolation.

## Project Structure

```
backend/
├── main.py                 # FastAPI application entry point
├── config/
│   └── settings.py        # Application settings
├── models/
│   └── task.py           # SQLModel database models
├── schemas/
│   ├── auth.py           # Authentication schemas
│   └── task.py           # Task request/response schemas
├── api/
│   ├── deps.py           # Dependency injection
│   └── v1/
│       └── tasks.py      # Task API endpoints
├── core/
│   ├── database.py       # Database connection
│   └── security.py       # JWT authentication
├── utils/
│   └── validators.py     # Validation utilities
└── tests/
    ├── conftest.py       # Pytest configuration
    └── integration/      # Integration tests
```

## Testing

Run tests with pytest:

```bash
pytest
pytest --cov=.  # With coverage report
```

## Security Features

- JWT token verification on all protected endpoints
- User data isolation (users can only access their own tasks)
- SQL injection prevention via SQLModel ORM
- Request validation with Pydantic
- Authentication failure logging
- CORS configuration for controlled access

## Error Handling

The API returns appropriate HTTP status codes:
- `200 OK` - Successful GET/PUT requests
- `201 Created` - Successful POST requests
- `204 No Content` - Successful DELETE requests
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Missing or invalid authentication
- `403 Forbidden` - Access denied
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server errors

## Database Schema

### tasks Table
- `id` (UUID, Primary Key)
- `title` (VARCHAR(500), NOT NULL)
- `description` (TEXT, NULL)
- `completed` (BOOLEAN, DEFAULT FALSE)
- `created_at` (TIMESTAMP, DEFAULT NOW())
- `updated_at` (TIMESTAMP, DEFAULT NOW())
- `user_id` (VARCHAR, NOT NULL, INDEXED)

Indexes:
- Primary key on `id`
- Index on `user_id` for efficient filtering
- Composite index on `(user_id, created_at)` for chronological queries

## Development

### Code Style
- Follow PEP 8 guidelines
- Use type hints for all functions
- Document all public APIs with docstrings

### Adding New Endpoints
1. Define Pydantic schemas in `schemas/`
2. Create SQLModel models in `models/`
3. Implement endpoints in `api/v1/`
4. Register router in `main.py`
5. Add tests in `tests/`

## Troubleshooting

### Database Connection Issues
- Verify `NEON_DB_URL` is correct
- Check network connectivity to Neon
- Ensure database exists and is accessible

### Authentication Failures
- Verify `BETTER_AUTH_SECRET` matches frontend
- Check JWT token format (Bearer <token>)
- Ensure token hasn't expired

### CORS Errors
- Update `CORS_ORIGINS` in settings
- Verify frontend origin is allowed

## License

See project root for license information.
