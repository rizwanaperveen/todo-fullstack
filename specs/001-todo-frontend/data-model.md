# Data Model: Todo Frontend Application

## Entity Definitions

### User Entity
**Fields**:
- id: string (unique identifier)
- name: string (user's display name)
- email: string (user's email address, unique)
- createdAt: Date (timestamp of account creation)
- updatedAt: Date (timestamp of last update)

**Validation Rules**:
- name: Required, minimum 1 character, maximum 100 characters
- email: Required, valid email format, maximum 255 characters
- createdAt: Auto-generated on creation
- updatedAt: Auto-generated on update

**Relationships**:
- One-to-many: A user can have many todos

### Todo Entity
**Fields**:
- id: string (unique identifier)
- title: string (todo item title)
- completed: boolean (completion status)
- createdAt: Date (timestamp of creation)
- userId: string (foreign key to user)

**Validation Rules**:
- title: Required, minimum 1 character, maximum 500 characters
- completed: Boolean value, default false
- createdAt: Auto-generated on creation
- userId: Required, must reference an existing user

**State Transitions**:
- Pending (completed: false) ↔ Completed (completed: true)

**Relationships**:
- Many-to-one: Todos belong to a user

## API Response Structures

### Authentication Responses
**Login Success**:
```typescript
{
  success: boolean,
  token: string,
  user: {
    id: string,
    name: string,
    email: string
  }
}
```

**Login Error**:
```typescript
{
  success: boolean,
  error: string
}
```

### Todo API Responses
**Get Todos Success**:
```typescript
{
  todos: Array<{
    id: string,
    title: string,
    completed: boolean,
    createdAt: string,
    userId: string
  }>
}
```

**Create Todo Success**:
```typescript
{
  todo: {
    id: string,
    title: string,
    completed: boolean,
    createdAt: string,
    userId: string
  }
}
```

**Update/Delete Todo Success**:
```typescript
{
  success: boolean
}
```

## Client-Side State Structures

### Session State
```typescript
{
  user: {
    id: string,
    name: string,
    email: string
  } | null,
  isAuthenticated: boolean,
  isLoading: boolean
}
```

### Todo State
```typescript
{
  todos: Array<{
    id: string,
    title: string,
    completed: boolean,
    createdAt: string
  }>,
  loading: boolean,
  error: string | null
}
```

## Form Validation Schemas

### Signup Form
- name: Required, min length 1, max length 100, alphabetic characters and spaces
- email: Required, valid email format
- password: Required, min length 8, contains uppercase, lowercase, number

### Login Form
- email: Required, valid email format
- password: Required, min length 1

### Todo Form
- title: Required, min length 1, max length 500