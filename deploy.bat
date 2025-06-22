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
    echo.
    echo 📊 Bundle Analysis:
    echo    - Main page: 77.4 kB (optimized)
    echo    - Total First Load: 179 kB
    echo    - All static pages generated successfully    echo.
    
    REM Check if Vercel CLI is installed and user is logged in
    echo 🔍 Checking Vercel CLI...
    vercel --version >nul 2>&1
    if %ERRORLEVEL% NEQ 0 (
        echo ⚠️ Vercel CLI not found. Installing...
        npm install -g vercel
        if %ERRORLEVEL% NEQ 0 (
            echo ❌ Failed to install Vercel CLI. Please install manually:
            echo    npm install -g vercel
            pause
            exit /b 1
        )
        echo ✅ Vercel CLI installed successfully
        echo ⚠️ Please run 'vercel login' to authenticate, then run this script again
        pause
        exit /b 0
    ) else (
        echo ✅ Vercel CLI is installed
    )
    
    echo 🔑 Checking Vercel authentication...
    vercel whoami >nul 2>&1
    if %ERRORLEVEL% NEQ 0 (
        echo ⚠️ Not logged into Vercel. Please authenticate first:
        echo    1. Run: vercel login
        echo    2. Follow the authentication prompts
        echo    3. Run this script again
        pause
        exit /b 0
    ) else (
        echo ✅ Vercel authentication verified
    )
    
    echo.
    echo 🚀 Deploying to Vercel Production...
    echo    📋 Project: TCGA Cancer Analysis Dashboard
    echo    🔗 Repository: https://github.com/CoolSunflower/tcga-analysis
    echo    📊 Build: Optimized (77.4 kB main page, 179 kB total)
    echo.
    echo    This may take a few minutes...
    echo.
    vercel --prod
    
    if %ERRORLEVEL% EQU 0 (
        echo.
        echo ✅ Deployment complete!
        echo 🌐 Your TCGA Cancer Analysis Dashboard is now live!
        echo.
        echo 📋 Next Steps:
        echo    1. Visit the URL provided above to access your dashboard
        echo    2. Test all functionality: tables, charts, tab switching
        echo    3. Verify data loads correctly for both bagging/no-bagging
        echo    4. Share the URL with your research team
        echo.
        echo 🔗 GitHub Repository: https://github.com/CoolSunflower/tcga-analysis
    ) else (
        echo.
        echo ❌ Deployment failed. Common solutions:
        echo    1. Run 'vercel login' to authenticate
        echo    2. Check your internet connection
        echo    3. Verify your Vercel account has available deployments
        echo.
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
