@echo off
echo ============================================================
echo Restarting Frontend with Clean Cache
echo ============================================================
echo.

cd frontend

echo [1/3] Stopping any running Next.js processes...
taskkill /F /IM node.exe /FI "WINDOWTITLE eq npm*" 2>nul
timeout /t 2 /nobreak >nul

echo [2/3] Clearing Next.js cache...
if exist .next rmdir /s /q .next
echo       Cache cleared!

echo [3/3] Starting frontend...
echo.
echo Frontend will start on: http://localhost:3000
echo Backend is running on: http://localhost:8002
echo.
echo ============================================================
echo IMPORTANT: After frontend starts, do this in your browser:
echo ============================================================
echo 1. Press F12 to open DevTools
echo 2. Right-click the refresh button
echo 3. Select "Empty Cache and Hard Reload"
echo 4. OR: Press Ctrl+Shift+Delete and clear cache
echo 5. Close and reopen the browser tab
echo ============================================================
echo.

npm run dev
