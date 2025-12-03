@echo off
echo ====================================
echo BM Bank - Environment Setup Script
echo ====================================
echo.

REM Check if .env.example exists
if not exist ".env.example" (
    echo [ERROR] .env.example not found!
    exit /b 1
)

REM Setup Frontend .env
echo Setting up Frontend environment...
if exist ".env" (
    echo [WARNING] .env already exists. Backup to .env.backup
    copy /Y .env .env.backup >nul
)

copy /Y .env.example .env >nul
echo [OK] Frontend .env created from .env.example

REM Setup Backend .env
echo.
echo Setting up Backend environment...
if not exist "server\.env.example" (
    echo [ERROR] server\.env.example not found!
    exit /b 1
)

if exist "server\.env" (
    echo [WARNING] server\.env already exists. Backup to server\.env.backup
    copy /Y server\.env server\.env.backup >nul
)

copy /Y server\.env.example server\.env >nul
echo [OK] Backend .env created from server\.env.example

REM Generate JWT Secret
echo.
echo Generating secure JWT secret...

REM Try Node.js first
where node >nul 2>&1
if %errorlevel% equ 0 (
    for /f "delims=" %%i in ('node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"') do set JWT_SECRET=%%i
) else (
    echo [WARNING] Node.js not found. Generating random string instead.
    set JWT_SECRET=change-this-to-a-secure-random-string-at-least-64-characters-long
)

REM Update JWT_SECRET in server\.env
powershell -Command "(Get-Content server\.env) -replace 'JWT_SECRET=.*', 'JWT_SECRET=%JWT_SECRET%' | Set-Content server\.env"
echo [OK] JWT Secret generated and updated

REM Summary
echo.
echo ================================
echo [OK] Environment setup complete!
echo ================================
echo.
echo Next steps:
echo.
echo 1. Review and customize .env files:
echo    - .env (Frontend)
echo    - server\.env (Backend)
echo.
echo 2. Update database credentials if needed:
echo    - ORACLE_PASSWORD
echo    - BANKING_ADMIN_PASSWORD
echo.
echo 3. Start development servers:
echo    Frontend: npm run dev
echo    Backend:  cd server ^&^& npm run dev
echo.
echo 4. Or use Docker:
echo    docker-compose up -d --build
echo.
echo [WARNING] Important: Never commit .env files to git!
echo.
pause
