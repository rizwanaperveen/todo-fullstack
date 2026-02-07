@echo off
echo ========================================
echo Starting Todo Application Backend
echo ========================================
echo.

cd backend

echo Activating virtual environment...
call venv\Scripts\activate

echo.
echo Starting FastAPI server on http://localhost:8002
echo Press Ctrl+C to stop the server
echo.

python main.py
