@echo off
pushd "%~dp0"

echo ======== 1. BACKEND SETUP ========
if not exist "price-optimiser-backend" (
  echo ERROR: price-optimiser-backend folder not found.
  pause & exit /b 1
)
pushd "price-optimiser-backend"

if not exist "venv" (
  echo Creating virtual environment...
  python -m venv venv
) else (
  echo Virtual environment already exists.
)

call "venv\Scripts\activate.bat"
echo Upgrading pip...
python -m pip install --upgrade pip
echo Installing requirements...
pip install -r requirements.txt
call "venv\Scripts\deactivate.bat"
popd

echo.
echo ======== BACKEND - DONE ========
echo.

echo ======== 2. FRONTEND SETUP ========
if not exist "price-optimiser-frontend" (
  echo ERROR: price-optimiser-frontend folder not found.
  pause & exit /b 1
)
pushd "price-optimiser-frontend"

if exist "package.json" (
  echo Running npm install...
  npm install
) else (
  echo WARNING: package.json not found; skipping npm install.
)
popd

echo.
echo ======== ALL DEPENDENCIES INSTALLED ========
pause

popd
