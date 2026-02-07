# Todo Application - Setup Guide

A fullstack todo application with React/Next.js frontend and FastAPI backend.

## Architecture

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS
- **Backend**: FastAPI, SQLModel, PostgreSQL (Neon), JWT Authentication
- **Database**: Neon Serverless PostgreSQL

## Prerequisites

- Node.js 18+ and npm
- Python 3.11+
- Git

## Backend Setup

### 1. Navigate to backend directory
```bash
cd backend
```

### 2. Create virtual environment
```bash
python -m venv venv
```

### 3. Activate virtual environment

**Windows:**
```bash
venv\Scripts\activate
```

**Linux/Mac:**
```bash
source venv/bin/activate
```

### 4. Install dependencies
```bash
pip install fastapi uvicorn sqlmodel psycopg2-binary pyjwt bcrypt python-dotenv pydantic-settings
```

### 5. Configure environment variables

Create a `.env` file in the `backend` directory:

```env
NEON_DB_URL=postgresql://your_user:your_password@your_host/your_database?sslmode=require
BETTER_AUTH_SECRET=your_secret_key_here_min_32_chars
BETTER_AUTH_URL=http://localhost:3000
```

**Important:** Replace the database URL with your actual Neon PostgreSQL connection string.

### 6. Run the backend server
```bash
python main.py
```

The backend will start on `http://localhost:8002`

### 7. Test the backend
```bash
# From the root directory
python test-api.py
```

You should see all tests passing.

## Frontend Setup

### 1. Navigate to frontend directory
```bash
cd frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the `frontend` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8002
```

### 4. Run the frontend development server
```bash
npm run dev
```

The frontend will start on `http://localhost:3000`

## Running the Full Application

### Option 1: Two Terminal Windows

**Terminal 1 - Backend:**
```bash
cd backend
venv\Scripts\activate  # or source venv/bin/activate on Linux/Mac
python main.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Option 2: Background Processes (Linux/Mac)

```bash
# Start backend in background
cd backend && source venv/bin/activate && python main.py &

# Start frontend in background
cd frontend && npm run dev &
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Tasks
- `GET /tasks` - Get all tasks for authenticated user
- `POST /tasks` - Create new task
- `GET /tasks/{id}` - Get specific task
- `PUT /tasks/{id}` - Update task
- `DELETE /tasks/{id}` - Delete task

## Testing the Application

### 1. Open browser
Navigate to `http://localhost:3000`

### 2. Sign up
- Click "Sign Up"
- Enter name, email, and password (min 8 characters)
- Submit form

### 3. Create todos
- You'll be redirected to the dashboard
- Enter a task title and click "Add Task"
- Your tasks will appear below

### 4. Manage todos
- Click checkbox to mark as complete/incomplete
- Click "Edit" to modify task title
- Click "Delete" to remove task

## Troubleshooting

### Backend Issues

**Error: "Missing authorization header"**
- Make sure you're logged in on the frontend
- Check that the token is being stored in localStorage
- Verify CORS settings in backend allow your frontend origin

**Database connection errors**
- Verify your `NEON_DB_URL` is correct
- Check that your Neon database is active
- Ensure SSL mode is set to `require`

**Port already in use**
- Change the port in `backend/main.py` (line 48)
- Update `NEXT_PUBLIC_API_URL` in frontend `.env.local`

### Frontend Issues

**API connection errors**
- Verify backend is running on port 8002
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Ensure no firewall is blocking the connection

**Authentication not working**
- Clear browser localStorage
- Check browser console for errors
- Verify backend auth endpoints are responding

**Tasks not loading**
- Check browser console for errors
- Verify you're logged in (check localStorage for `auth_token`)
- Test backend endpoints directly using the test script

## Project Structure

```
todo-part2/
├── backend/
│   ├── api/
│   │   ├── deps.py          # Dependency injection
│   │   └── v1/
│   │       ├── auth.py      # Auth endpoints
│   │       └── tasks.py     # Task endpoints
│   ├── config/
│   │   └── settings.py      # Configuration
│   ├── core/
│   │   ├── database.py      # Database setup
│   │   └── security.py      # JWT utilities
│   ├── models/
│   │   ├── user.py          # User model
│   │   └── task.py          # Task model
│   ├── schemas/
│   │   ├── auth.py          # Auth schemas
│   │   └── task.py          # Task schemas
│   ├── main.py              # FastAPI app
│   └── .env                 # Environment variables
├── frontend/
│   ├── app/                 # Next.js pages
│   ├── components/          # React components
│   ├── hooks/               # Custom hooks
│   ├── lib/                 # Utilities
│   ├── types/               # TypeScript types
│   └── .env.local           # Environment variables
└── test-api.py              # Backend test script
```

## Security Notes

- Never commit `.env` files to version control
- Use strong, unique secrets for `BETTER_AUTH_SECRET`
- In production, use HTTPS for all connections
- Implement rate limiting for authentication endpoints
- Regularly update dependencies for security patches

## Development Tips

- Use the browser DevTools Network tab to debug API calls
- Check backend logs for detailed error messages
- Use the test script to verify backend functionality
- Clear localStorage if authentication seems stuck

## Next Steps

- Add task descriptions and due dates
- Implement task filtering and sorting
- Add user profile management
- Implement password reset functionality
- Add task categories/tags
- Deploy to production (Vercel for frontend, Railway/Render for backend)
