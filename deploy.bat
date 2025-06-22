@echo off
REM TCGA Cancer Analysis Dashboard - Windows Deployment Script
REM This script builds and deploys the dashboard to Vercel

echo 🚀 Starting deployment of TCGA Cancer Analysis Dashboard...

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: package.json not found. Please run this script from the project root.
    pause
    exit /b 1
)

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
)

REM Build the project
echo 🏗️ Building the project...
npm run build

if %ERRORLEVEL% EQU 0 (
    echo ✅ Build successful!
    
    REM Check if Vercel CLI is installed
    vercel --version >nul 2>&1
    if %ERRORLEVEL% NEQ 0 (
        echo ⚠️ Vercel CLI not found. Installing...
        npm install -g vercel
    )
    
    echo 🚀 Deploying to Vercel...
    vercel --prod
    
    if %ERRORLEVEL% EQU 0 (
        echo ✅ Deployment complete!
        echo 🌐 Your dashboard should be available at the URL provided by Vercel.
    ) else (
        echo ❌ Deployment failed. Please check the errors above.
        pause
        exit /b 1
    )
) else (
    echo ❌ Build failed. Please check the errors above.
    pause
    exit /b 1
)

echo.
echo 🎉 Deployment process completed!
echo 📊 Your TCGA Cancer Analysis Dashboard is now live!
pause
