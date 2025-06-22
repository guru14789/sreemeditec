#!/bin/bash

# Production Setup Script for Node.js E-commerce Application
# This script sets up the production environment with MongoDB

echo "🚀 Starting production setup..."

# Check if MongoDB URI is provided
if [ -z "$MONGODB_URI" ]; then
    echo "❌ MONGODB_URI environment variable is required for production"
    echo "Please set MONGODB_URI to your MongoDB connection string"
    exit 1
fi

# Check if JWT_SECRET is provided
if [ -z "$JWT_SECRET" ]; then
    echo "❌ JWT_SECRET environment variable is required for production"
    echo "Please set a secure JWT_SECRET"
    exit 1
fi

# Install production dependencies
echo "📦 Installing production dependencies..."
npm ci --only=production

# Build the application
echo "🔨 Building application..."
npm run build

# Set production environment
export NODE_ENV=production

# Create logs directory
mkdir -p logs

# Create uploads directory
mkdir -p uploads

# Set proper permissions
chmod 755 uploads
chmod 755 logs

# Test database connection
echo "🔧 Testing database connection..."
node -e "
const mongoose = require('mongoose');
mongoose.connect('$MONGODB_URI')
  .then(() => {
    console.log('✅ Database connection successful');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  });
"

if [ $? -ne 0 ]; then
    echo "❌ Database connection failed. Please check your MONGODB_URI"
    exit 1
fi

# Seed database with initial data
echo "🌱 Seeding database with initial data..."
npx tsx server/scripts/seedDatabase.ts

echo "✅ Production setup completed successfully!"
echo ""
echo "🔧 Next steps:"
echo "1. Set your production environment variables"
echo "2. Configure your reverse proxy (nginx, apache, etc.)"
echo "3. Set up SSL certificates"
echo "4. Configure process manager (PM2, systemd, etc.)"
echo ""
echo "📋 Required environment variables:"
echo "- MONGODB_URI: Your MongoDB connection string"
echo "- JWT_SECRET: Secure JWT signing key"
echo "- ALLOWED_ORIGINS: Comma-separated list of allowed origins"
echo "- NODE_ENV=production"
echo ""
echo "🚀 To start the application:"
echo "npm start"