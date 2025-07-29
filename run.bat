@echo off
pushd "%~dp0"

echo ======== Applying Django Migrations ========
if not exist "price-optimiser-backend\manage.py" (
  echo ERROR: price-optimiser-backend folder not found.
  pause & exit /b 1
)
pushd "price-optimiser-backend"
call venv\Scripts\activate.bat
echo Migrating database...
python manage.py migrate
popd

echo.
echo ======== Importing Sample Data ========
pushd "price-optimiser-backend"
call venv\Scripts\activate.bat
if exist product_data_fixed.csv (
  echo Importing product_data_fixed.csv...
  python manage.py import_products product_data_fixed.csv
) else (
  echo No product_data_fixed.csv found; skipping import.
)
call venv\Scripts\deactivate.bat
popd

echo.
echo ======== Launching Backend Server ========
start "Backend Server" /D "%~dp0price-optimiser-backend" cmd /k ^
  "call venv\Scripts\activate.bat && python manage.py runserver"

echo.
echo ======== Launching Frontend Server ========
if not exist "price-optimiser-frontend\package.json" (
  echo ERROR: price-optimiser-frontend folder not found.
  pause & exit /b 1
)
start "Frontend Server" /D "%~dp0price-optimiser-frontend" cmd /k ^
  "npm start"

echo.
echo ======== All Done! Two servers are running. ========
pause

popd
