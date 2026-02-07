# Todo Application - Quick Start

## Fixed Issues

The following authentication and API issues have been resolved:

1. **Auth endpoint mismatch**: Backend uses `/api/auth/*` - frontend now matches
2. **Port configuration**: Frontend now correctly points to backend on port 8002
3. **Data structure**: Frontend now uses snake_case (`created_at`, `user_id`) to match backend
4. **Response handling**: Frontend correctly handles backend response format

## Quick Start (Windows)

### Start Backend
```bash
start-backend.bat
```

### Start Frontend (in a new terminal)
```bash
start-frontend.bat
```

## Quick Start (Linux/Mac)

### Make scripts executable
```bash
chmod +x start-backend.sh start-frontend.sh
```

### Start Backend
```bash
./start-backend.sh
```

### Start Frontend (in a new terminal)
```bash
./start-frontend.sh
```

## Access the Application

1. Open your browser to `http://localhost:3000`
2. Sign up with a new account
3. Start creating todos!

## Test Backend API

Run the test script to verify all endpoints:
```bash
python test-api.py
```

## Troubleshooting

If you encounter issues:

1. **Backend not starting**:
   - Ensure virtual environment is activated
   - Check `.env` file exists with correct database URL
   - Verify port 8002 is not in use

2. **Frontend not connecting**:
   - Verify backend is running on port 8002
   - Check `.env.local` has `NEXT_PUBLIC_API_URL=http://localhost:8002`
   - Clear browser localStorage and try again

3. **Authentication errors**:
   - Clear browser localStorage
   - Sign up with a new account
   - Check browser console for detailed errors

For detailed setup instructions, see [SETUP.md](SETUP.md)
