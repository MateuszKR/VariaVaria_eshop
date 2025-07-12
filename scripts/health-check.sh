#!/bin/bash

# Four Leaf Clover E-Shop Health Check Script
# This script verifies that all services are running and healthy

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🍀 Four Leaf Clover E-Shop Health Check${NC}"
echo "========================================"

# Function to check service health
check_service() {
    local service_name=$1
    local url=$2
    local expected_status=${3:-200}
    
    echo -n "Checking $service_name..."
    
    if response=$(curl -s -w "%{http_code}" "$url" -o /dev/null); then
        if [ "$response" = "$expected_status" ]; then
            echo -e " ${GREEN}✓ Healthy${NC}"
            return 0
        else
            echo -e " ${RED}✗ Unhealthy (HTTP $response)${NC}"
            return 1
        fi
    else
        echo -e " ${RED}✗ Unreachable${NC}"
        return 1
    fi
}

# Function to check database
check_database() {
    echo -n "Checking database..."
    
    if docker exec clover-database pg_isready -U postgres -d four_leaf_clover_shop > /dev/null 2>&1; then
        echo -e " ${GREEN}✓ Ready${NC}"
        return 0
    else
        echo -e " ${RED}✗ Not ready${NC}"
        return 1
    fi
}

# Function to check container status
check_container() {
    local container_name=$1
    
    if docker ps --filter "name=$container_name" --filter "status=running" --format "{{.Names}}" | grep -q "$container_name"; then
        echo -e "$container_name: ${GREEN}✓ Running${NC}"
        return 0
    else
        echo -e "$container_name: ${RED}✗ Not running${NC}"
        return 1
    fi
}

# Function to test admin login
test_admin_login() {
    echo -n "Testing admin login..."
    
    local login_response=$(curl -s -X POST http://localhost:3001/login \
        -H "Content-Type: application/json" \
        -d '{"email": "admin@fourleafclover.com", "password": "admin123456"}')
    
    if echo "$login_response" | grep -q "token"; then
        echo -e " ${GREEN}✓ Login successful${NC}"
        return 0
    else
        echo -e " ${RED}✗ Login failed${NC}"
        echo "Response: $login_response"
        return 1
    fi
}

# Main health check
echo "🐳 Container Status:"
check_container "clover-database"
check_container "clover-auth-service"
check_container "clover-products-service"
check_container "clover-orders-service"
check_container "clover-frontend"
check_container "clover-nginx"

echo ""
echo "🗄️  Database Status:"
check_database

echo ""
echo "🔗 Service Health Endpoints:"
check_service "Auth Service" "http://localhost:3001/health"
check_service "Products Service" "http://localhost:3002/health"
check_service "Orders Service" "http://localhost:3003/health"
check_service "Frontend" "http://localhost:3000" 200

echo ""
echo "🔐 Authentication Test:"
test_admin_login

echo ""
echo "🌍 Access URLs:"
echo "   🏪 Main Store: http://localhost:3000"
echo "   🔧 Admin Panel: http://localhost:3000/admin"
echo "   🔐 Auth API: http://localhost:3001"
echo "   📦 Products API: http://localhost:3002"
echo "   📋 Orders API: http://localhost:3003"
echo "   🌐 Nginx Proxy: http://localhost:80"

echo ""
echo -e "${GREEN}🎉 Health check complete!${NC}" 