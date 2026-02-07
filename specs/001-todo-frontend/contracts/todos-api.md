# Todos API Contract

## Base URL
`/api/todos`

## Authentication
All endpoints require valid JWT token in Authorization header:
```
Authorization: Bearer {jwt_token}
```

## Todos Endpoints

### GET /api/todos
**Description**: Retrieve all todos for the authenticated user

**Headers**:
```
Authorization: Bearer {jwt_token}
```

**Response (Success - 200)**:
```json
{
  "todos": [
    {
      "id": "string",
      "title": "string",
      "completed": "boolean",
      "createdAt": "ISO 8601 date string",
      "userId": "string"
    }
  ]
}
```

**Response (Unauthorized - 401)**:
```json
{
  "error": "Unauthorized"
}
```

### POST /api/todos
**Description**: Create a new todo for the authenticated user

**Headers**:
```
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

**Request Body**:
```json
{
  "title": "string (required, min 1 char, max 500 chars)"
}
```

**Response (Success - 201)**:
```json
{
  "todo": {
    "id": "string",
    "title": "string",
    "completed": "boolean (false by default)",
    "createdAt": "ISO 8601 date string",
    "userId": "string (extracted from token)"
  }
}
```

**Response (Bad Request - 400)**:
```json
{
  "error": "string (validation error message)"
}
```

**Response (Unauthorized - 401)**:
```json
{
  "error": "Unauthorized"
}
```

### PUT /api/todos/{id}
**Description**: Update an existing todo

**Headers**:
```
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

**Path Parameter**:
- `id`: string (todo ID)

**Request Body**:
```json
{
  "title": "string (optional)",
  "completed": "boolean (optional)"
}
```

**Response (Success - 200)**:
```json
{
  "todo": {
    "id": "string",
    "title": "string",
    "completed": "boolean",
    "createdAt": "ISO 8601 date string",
    "userId": "string"
  }
}
```

**Response (Bad Request - 400)**:
```json
{
  "error": "string (validation error message)"
}
```

**Response (Unauthorized - 401)**:
```json
{
  "error": "Unauthorized"
}
```

**Response (Not Found - 404)**:
```json
{
  "error": "Todo not found"
}
```

### DELETE /api/todos/{id}
**Description**: Delete a todo

**Headers**:
```
Authorization: Bearer {jwt_token}
```

**Path Parameter**:
- `id`: string (todo ID)

**Response (Success - 200)**:
```json
{
  "success": true
}
```

**Response (Unauthorized - 401)**:
```json
{
  "error": "Unauthorized"
}
```

**Response (Not Found - 404)**:
```json
{
  "error": "Todo not found"
}
```

## Error Handling

### Common Error Responses
All endpoints may return:
- **401 Unauthorized**: Invalid or missing JWT token
- **500 Internal Server Error**: Unexpected server error

### Validation Error Format
```json
{
  "error": "Descriptive error message"
}
```

## Rate Limiting
- 100 requests per hour per IP address
- Exempt for authenticated users