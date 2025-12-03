@echo off
echo ====================================
echo BM Bank - Database Initialization
echo ====================================
echo.

REM Check if Oracle container is running
echo Checking Oracle container status...
docker ps | findstr bm-bank-oracle-db >nul
if errorlevel 1 (
    echo Oracle container is not running!
    echo Starting Oracle container...
    docker-compose up -d oracle-db
    echo Waiting for Oracle to be ready (this may take 2-3 minutes)...
    timeout /t 120 /nobreak >nul
)

REM Wait for Oracle to be healthy
echo Waiting for Oracle to be healthy...
:wait_loop
docker exec bm-bank-oracle-db bash -c "echo 'SELECT 1 FROM DUAL;' | sqlplus -s system/Oracle123@localhost:1521/XE" >nul 2>&1
if errorlevel 1 (
    echo Oracle is not ready yet. Waiting...
    timeout /t 10 /nobreak >nul
    goto wait_loop
)

echo Oracle is ready!
echo.

REM Run initialization scripts
echo Running schema.sql...
docker exec -i bm-bank-oracle-db bash -c "sqlplus -s system/Oracle123@localhost:1521/XE" < oracle-banking-db\sql\schema.sql
if errorlevel 1 (
    echo Schema creation failed!
    exit /b 1
)
echo Schema created successfully!

echo.
echo Running vpd-policies.sql...
docker exec -i bm-bank-oracle-db bash -c "sqlplus -s system/Oracle123@localhost:1521/XE" < oracle-banking-db\sql\vpd-policies.sql
if errorlevel 1 (
    echo VPD policies creation failed!
    exit /b 1
)
echo VPD policies created successfully!

echo.
echo Running audit-setup.sql...
docker exec -i bm-bank-oracle-db bash -c "sqlplus -s system/Oracle123@localhost:1521/XE" < oracle-banking-db\sql\audit-setup.sql
if errorlevel 1 (
    echo Audit setup failed!
    exit /b 1
)
echo Audit setup completed successfully!

echo.
echo Running seed-data.sql...
docker exec -i bm-bank-oracle-db bash -c "sqlplus -s system/Oracle123@localhost:1521/XE" < oracle-banking-db\sql\seed-data.sql
if errorlevel 1 (
    echo Seed data loading failed!
    exit /b 1
)
echo Seed data loaded successfully!

echo.
echo ====================================
echo Database initialization completed!
echo ====================================
echo.
echo Demo accounts:
echo   - Customer: kh1 / 123456 or kh2 / 123456
echo   - Staff: nv1 / 123456
echo   - Director: gd1 / 123456
echo.
echo You can now access:
echo   - Frontend: http://localhost:5003
echo   - Backend API: http://localhost:5000
echo   - Oracle EM: https://localhost:5500/em
echo.
pause
