# Data Model: Todo Backend API

## Entity Definitions

### Task Entity
**Fields**:
- id: string (UUID, unique identifier)
- title: string (task title, required)
- description: string | null (optional task description)
- completed: boolean (completion status, default: false)
- created_at: datetime (timestamp of creation, auto-generated)
- updated_at: datetime (timestamp of last update, auto-generated)
- user_id: string (foreign key to user, required for data isolation)

**Validation Rules**:
- title: Required, minimum 1 character, maximum 500 characters
- description: Optional, maximum 2000 characters if provided
- completed: Boolean value, default false
- created_at: Auto-generated on creation
- updated_at: Auto-generated on update
- user_id: Required, must reference an authenticated user

**Relationships**:
- Many-to-one: Tasks belong to a user (via user_id foreign key)

### User Reference
**Fields**:
- id: string (user identifier extracted from JWT token, not stored in database)
- email: string (user email from JWT claims, not stored in database)

**Note**: User information is not stored in the backend database but is extracted from JWT tokens for data isolation and authentication purposes.

## API Request/Response Structures

### Task Creation Request
```json
{
  "title": "string (required, 1-500 chars)",
  "description": "string (optional, 0-2000 chars)"
}
```

### Task Response Object
```json
{
  "id": "string (UUID)",
  "title": "string",
  "description": "string | null",
  "completed": "boolean",
  "created_at": "ISO 8601 datetime string",
  "updated_at": "ISO 8601 datetime string",
  "user_id": "string (extracted from JWT)"
}
```

### Task Update Request
```json
{
  "title": "string (optional, 1-500 chars)",
  "description": "string | null (optional)",
  "completed": "boolean (optional)"
}
```

### Task List Response
```json
{
  "tasks": [
    {
      "id": "string (UUID)",
      "title": "string",
      "description": "string | null",
      "completed": "boolean",
      "created_at": "ISO 8601 datetime string",
      "updated_at": "ISO 8601 datetime string",
      "user_id": "string (extracted from JWT)"
    }
  ],
  "total": "integer"
}
```

### Error Response Structure
```json
{
  "detail": "string (error message)",
  "status_code": "integer (HTTP status code)"
}
```

## Database Schema

### tasks Table
```
Column       | Type         | Constraints
-------------|--------------|-------------------
id           | UUID         | PRIMARY KEY, NOT NULL, DEFAULT gen_random_uuid()
title        | VARCHAR(500) | NOT NULL
description  | TEXT         | NULL
completed    | BOOLEAN      | NOT NULL, DEFAULT FALSE
created_at   | TIMESTAMP    | NOT NULL, DEFAULT NOW()
updated_at   | TIMESTAMP    | NOT NULL, DEFAULT NOW(), ON UPDATE NOW()
user_id      | VARCHAR      | NOT NULL
```

**Indexes**:
- Primary key: id
- Foreign key: user_id (for efficient user-based filtering)
- Composite index: (user_id, created_at) for efficient chronological retrieval of user tasks

## State Transitions

### Task Completion States
- Pending (completed: false) ↔ Completed (completed: true)

### Task Lifecycle
- Created with completed: false
- Updated (title, description, completion status)
- Retrieved by authenticated user
- Deleted by authenticated user

## Data Isolation Strategy

### User-Based Filtering
All database queries must include a WHERE clause filtering by the authenticated user's ID extracted from the JWT token:
```
SELECT * FROM tasks WHERE user_id = '{user_id_from_jwt}'
```

This ensures that users can only access their own tasks, meeting the specification requirement for data isolation.