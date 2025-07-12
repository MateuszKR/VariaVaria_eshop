#!/bin/bash

# Four Leaf Clover E-Shop Startup Script
# This script ensures proper initialization sequence for all services

set -e

echo "🍀 Starting Four Leaf Clover E-Shop..."
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if a service is healthy
check_service_health() {
    local service_name=$1
    local port=$2
    local max_attempts=30
    local attempt=1
    
    echo -n "Checking $service_name health..."
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s -f "http://localhost:${port}/health" > /dev/null 2>&1; then
            echo -e " ${GREEN}✓ Healthy${NC}"
            return 0
        fi
        echo -n "."
        sleep 2
        attempt=$((attempt + 1))
    done
    
    echo -e " ${RED}✗ Failed${NC}"
    return 1
}

# Function to check database connectivity
check_database() {
    local max_attempts=30
    local attempt=1
    
    echo -n "Checking database connectivity..."
    
    while [ $attempt -le $max_attempts ]; do
        if docker exec clover-database pg_isready -U postgres -d four_leaf_clover_shop > /dev/null 2>&1; then
            echo -e " ${GREEN}✓ Ready${NC}"
            return 0
        fi
        echo -n "."
        sleep 2
        attempt=$((attempt + 1))
    done
    
    echo -e " ${RED}✗ Failed${NC}"
    return 1
}

# Step 1: Clean up any existing containers
echo "🧹 Cleaning up existing containers..."
docker-compose down --remove-orphans > /dev/null 2>&1 || true

# Step 2: Start database first
echo "🗄️  Starting database..."
docker-compose up -d database

# Step 3: Wait for database to be healthy
if ! check_database; then
    echo -e "${RED}❌ Database failed to start properly${NC}"
    exit 1
fi

# Step 4: Start backend services
echo "🔧 Starting backend services..."
docker-compose up -d auth-service products-service orders-service

# Step 5: Wait for backend services to be healthy
echo "⏳ Waiting for backend services to be ready..."
if ! check_service_health "Auth Service" 3001; then
    echo -e "${RED}❌ Auth service failed to start${NC}"
    exit 1
fi

if ! check_service_health "Products Service" 3002; then
    echo -e "${RED}❌ Products service failed to start${NC}"
    exit 1
fi

if ! check_service_health "Orders Service" 3003; then
    echo -e "${RED}❌ Orders service failed to start${NC}"
    exit 1
fi

# Step 6: Start frontend
echo "🌐 Starting frontend..."
docker-compose up -d frontend

# Step 7: Wait for frontend to be ready
echo "⏳ Waiting for frontend to be ready..."
sleep 10  # Give frontend time to start

# Step 8: Start nginx (optional)
echo "🌍 Starting nginx proxy..."
docker-compose up -d nginx

# Step 9: Final health check
echo "🏥 Performing final health checks..."
sleep 5

echo ""
echo "🎉 E-Shop startup complete!"
echo "================================"
echo "✅ Services Status:"
echo "   🗄️  Database: Running"
echo "   🔐 Auth Service: http://localhost:3001"
echo "   📦 Products Service: http://localhost:3002"
echo "   📋 Orders Service: http://localhost:3003"
echo "   🌐 Frontend: http://localhost:3000"
echo "   🌍 Nginx Proxy: http://localhost:80"
echo ""
echo "🔑 Admin Login:"
echo "   URL: http://localhost:3000/admin/login"
echo "   Email: admin@fourleafclover.com"
echo "   Password: admin123456"
echo ""
echo "✨ Happy shopping! 🛍️" 