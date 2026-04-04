@echo off
REM This batch file creates the folder structure for the Cafe Management Frontend (JavaScript version)

echo Creating Frontend-JS folder structure...

REM Create main directories
mkdir src
cd src

mkdir components
cd components
mkdir ui
cd ..

mkdir pages
mkdir services
mkdir store
mkdir hooks
mkdir lib

cd ..

mkdir public

echo.
echo Folder structure created successfully!
echo.
echo Your structure should look like this:
echo Frontend-JS/
echo   ├── public/
echo   ├── src/
echo   │   ├── components/
echo   │   │   └── ui/
echo   │   ├── pages/
echo   │   ├── services/
echo   │   ├── store/
echo   │   ├── hooks/
echo   │   └── lib/
echo   ├── index.html
echo   ├── package.json
echo   └── ...
echo.
pause
