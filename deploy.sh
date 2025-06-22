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
    
    # Check if Vercel CLI is installed
    if command -v vercel &> /dev/null; then
        echo "🚀 Deploying to Vercel..."
        vercel --prod
        echo "✅ Deployment complete!"
        echo "🌐 Your dashboard should be available at the URL provided by Vercel."
    else
        echo "⚠️ Vercel CLI not found. Installing..."
        npm install -g vercel
        echo "🚀 Deploying to Vercel..."
        vercel --prod
        echo "✅ Deployment complete!"
    fi
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi

echo ""
echo "🎉 Deployment process completed!"
echo "📊 Your TCGA Cancer Analysis Dashboard is now live!"
