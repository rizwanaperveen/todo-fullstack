# Quickstart Guide: Todo Backend API

## Development Setup

### Prerequisites
- Python 3.11+ installed
- pip package manager
- PostgreSQL client libraries
- Git for version control

### Initial Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   # or if requirements.txt doesn't exist yet:
   pip install fastapi uvicorn sqlmodel pyjwt python-multipart python-dotenv psycopg[binary]
   ```

4. Create environment file:
   ```bash
   cp .env.example .env
   ```

5. Update environment variables in `.env`:
   - `NEON_DB_URL`: Neon Serverless PostgreSQL connection string (e.g., postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/dbname?sslmode=require)
   - `BETTER_AUTH_SECRET`: Shared JWT signing secret (same as frontend)
   - `BETTER_AUTH_URL`: Better Auth service URL (e.g., http://localhost:8001)

### Running the Application
1. Start the development server:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

2. Open your browser to `http://localhost:8000/docs` to view the API documentation

## Key Commands

### Development
- `uvicorn main:app --reload` - Start development server with hot reload
- `uvicorn main:app --reload --host 0.0.0.0 --port 8000` - Start server accessible externally
- `python -m pytest` - Run all tests
- `python -m pytest tests/test_tasks.py` - Run specific test file

### Testing
- `python -m pytest` - Run unit and integration tests
- `python -m pytest --cov=.` - Run tests with coverage report
- `python -m pytest -x` - Run tests and stop on first failure

## Project Structure Overview

```
backend/
├── main.py                 # FastAPI application entry point
├── config/
│   └── settings.py         # Application settings and environment variables
├── models/
│   ├── __init__.py
│   └── task.py            # SQLModel database models
├── schemas/
│   ├── __init__.py
│   ├── task.py            # Pydantic schemas for requests/responses
│   └── auth.py            # Authentication-related schemas
├── api/
│   ├── __init__.py
│   ├── deps.py            # Dependency injection utilities
│   └── v1/
│       ├── __init__.py
│       ├── auth.py        # Authentication endpoints
│       └── tasks.py       # Task management endpoints
├── core/
│   ├── __init__.py
│   ├── security.py        # JWT handling and authentication utilities
│   └── database.py        # Database connection and session management
├── utils/
│   ├── __init__.py
│   └── validators.py      # Validation utilities
└── tests/
    ├── __init__.py
    ├── conftest.py        # Pytest configuration
    ├── test_tasks.py      # Task-related API tests
    ├── test_auth.py       # Authentication tests
    └── integration/
        ├── __init__.py
        └── test_end_to_end.py  # End-to-end integration tests
```

## Key Features Walkthrough

### 1. Authentication Flow
1. Frontend sends JWT token in Authorization header: `Authorization: Bearer <token>`
2. Backend verifies token signature using `BETTER_AUTH_SECRET`
3. User ID is extracted from token payload for data isolation
4. All subsequent operations are scoped to the authenticated user

### 2. Task Management API
1. **GET /tasks** - Retrieve all tasks for authenticated user
2. **POST /tasks** - Create new task for authenticated user
3. **GET /tasks/{id}** - Retrieve specific task (must belong to user)
4. **PUT /tasks/{id}** - Update specific task (must belong to user)
5. **DELETE /tasks/{id}** - Delete specific task (must belong to user)

### 3. Data Isolation
- All database queries filter by `user_id` extracted from JWT token
- Users cannot access tasks belonging to other users
- 404 errors returned for tasks that don't belong to the authenticated user

### 4. Error Handling
- Standardized error responses with appropriate HTTP status codes
- Detailed error messages for debugging
- Proper authentication/authorization responses (401/403)

## Environment Variables

- `NEON_DB_URL` - Neon Serverless PostgreSQL connection string
- `BETTER_AUTH_SECRET` - Shared JWT signing secret (must match frontend)
- `BETTER_AUTH_URL` - Better Auth service URL
- `SECRET_KEY` - Additional secret for backend-specific operations
- `ALGORITHM` - JWT algorithm (default: HS256)
- `ACCESS_TOKEN_EXPIRE_MINUTES` - Token expiration time (default: 30 days)

## API Testing

### Using curl
```bash
# Get user's tasks (replace TOKEN with actual JWT)
curl -H "Authorization: Bearer TOKEN" http://localhost:8000/api/tasks

# Create a new task
curl -X POST -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "Test task", "description": "Test description"}' \
  http://localhost:8000/api/tasks
```

### API Documentation
- Interactive API docs available at: `http://localhost:8000/docs`
- OpenAPI schema available at: `http://localhost:8000/openapi.json`

## Troubleshooting

### Common Issues
- **Database connection failing**: Verify `NEON_DB_URL` is correct and database is accessible
- **JWT validation failing**: Ensure `BETTER_AUTH_SECRET` matches the one used by Better Auth
- **Cross-user access not prevented**: Check that all endpoints properly filter by user_id
- **Environment variables not loading**: Verify .env file is properly formatted

### Development Tips
- Use FastAPI's automatic validation and documentation features
- Implement proper error handling with HTTPException
- Use dependency injection for authentication and database sessions
- Follow the separation of concerns pattern (models, schemas, api routes)