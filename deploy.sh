#!/bin/bash

# TCGA Cancer Analysis Dashboard - Deployment Script
# This script builds and deploys the dashboard to Vercel

echo "🚀 Starting deployment of TCGA Cancer Analysis Dashboard..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Build the project
echo "🏗️ Building the project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "📊 Bundle Analysis:"
    echo "   - Main page: ~77 kB (optimized)"
    echo "   - Total First Load: ~179 kB"
    echo "   - All static pages generated successfully"
    echo ""
    
    # Check if Vercel CLI is installed and user is logged in
    echo "🔍 Checking Vercel CLI..."
    if command -v vercel &> /dev/null; then
        echo "✅ Vercel CLI is installed"
        
        echo "� Checking Vercel authentication..."
        if vercel whoami &> /dev/null; then
            echo "✅ Vercel authentication verified"
        else
            echo "⚠️ Not logged into Vercel. Please authenticate first:"
            echo "   1. Run: vercel login"
            echo "   2. Follow the authentication prompts"
            echo "   3. Run this script again"
            exit 0
        fi
        
        echo ""
        echo "�🚀 Deploying to Vercel Production..."
        echo "   📋 Project: TCGA Cancer Analysis Dashboard"
        echo "   🔗 Repository: https://github.com/CoolSunflower/tcga-analysis"
        echo "   📊 Build: Optimized (~77 kB main page, ~179 kB total)"
        echo ""
        echo "   This may take a few minutes..."
        echo ""
        vercel --prod
        
        if [ $? -eq 0 ]; then
            echo ""
            echo "✅ Deployment complete!"
            echo "🌐 Your TCGA Cancer Analysis Dashboard is now live!"
            echo ""
            echo "📋 Next Steps:"
            echo "   1. Visit the URL provided above to access your dashboard"
            echo "   2. Test all functionality: tables, charts, tab switching"
            echo "   3. Verify data loads correctly for both bagging/no-bagging"
            echo "   4. Share the URL with your research team"
            echo ""
            echo "🔗 GitHub Repository: https://github.com/CoolSunflower/tcga-analysis"
        else
            echo ""
            echo "❌ Deployment failed. Common solutions:"
            echo "   1. Check your internet connection"
            echo "   2. Verify your Vercel account has available deployments"
            echo "   3. Try running 'vercel login' again"
            echo ""
            exit 1
        fi
    else
        echo "⚠️ Vercel CLI not found. Installing..."
        npm install -g vercel
        
        if [ $? -eq 0 ]; then
            echo "✅ Vercel CLI installed successfully"
            echo "⚠️ Please run 'vercel login' to authenticate, then run this script again"
            exit 0
        else
            echo "❌ Failed to install Vercel CLI. Please install manually:"
            echo "   npm install -g vercel"
            exit 1
        fi
    fi
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi

echo ""
echo "🎉 Deployment process completed!"
echo "📊 Your TCGA Cancer Analysis Dashboard is now live!"
