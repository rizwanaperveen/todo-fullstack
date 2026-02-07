# Authentication API Contract

## Base URL
`/api/auth`

## Authentication Endpoints

### POST /api/auth/signup
**Description**: Register a new user account

**Request**:
```json
{
  "name": "string (required)",
  "email": "string (required, valid email format)",
  "password": "string (required, min 8 characters)"
}
```

**Response (Success - 201)**:
```json
{
  "success": true,
  "token": "string (JWT token)",
  "user": {
    "id": "string",
    "name": "string",
    "email": "string"
  }
}
```

**Response (Error - 400)**:
```json
{
  "success": false,
  "error": "string (validation error message)"
}
```

**Response (Conflict - 409)**:
```json
{
  "success": false,
  "error": "Email already exists"
}
```

### POST /api/auth/login
**Description**: Authenticate user and return JWT token

**Request**:
```json
{
  "email": "string (required, valid email format)",
  "password": "string (required)"
}
```

**Response (Success - 200)**:
```json
{
  "success": true,
  "token": "string (JWT token)",
  "user": {
    "id": "string",
    "name": "string",
    "email": "string"
  }
}
```

**Response (Unauthorized - 401)**:
```json
{
  "success": false,
  "error": "Invalid email or password"
}
```

### POST /api/auth/logout
**Description**: Invalidate user session

**Headers**:
```
Authorization: Bearer {jwt_token}
```

**Response (Success - 200)**:
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

## Authentication Requirements

- All protected endpoints require `Authorization: Bearer {jwt_token}` header
- Invalid/expired tokens return 401 Unauthorized
- Token expiration time: 24 hours
- Refresh token mechanism: Not implemented (user must re-login)