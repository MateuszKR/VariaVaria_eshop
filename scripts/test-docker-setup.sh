#!/bin/bash

# 🐳 Four Leaf Clover Jewelry Shop - Docker Setup Test Script
# This script tests all services to ensure they're running correctly

set -e

echo "🍀 Testing Four Leaf Clover Jewelry Shop Docker Setup..."
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test configuration
TIMEOUT=30
RETRY_DELAY=5
MAX_RETRIES=6

# Function to print colored output
print_status() {
    local status=$1
    local message=$2
    case $status in
        "SUCCESS") echo -e "${GREEN}✅ $message${NC}" ;;
        "ERROR") echo -e "${RED}❌ $message${NC}" ;;
        "WARNING") echo -e "${YELLOW}⚠️  $message${NC}" ;;
        "INFO") echo -e "${BLUE}ℹ️  $message${NC}" ;;
    esac
}

# Function to wait for service
wait_for_service() {
    local url=$1
    local service_name=$2
    local retries=0
    
    print_status "INFO" "Waiting for $service_name to be ready..."
    
    while [ $retries -lt $MAX_RETRIES ]; do
        if curl -f -s "$url" > /dev/null 2>&1; then
            print_status "SUCCESS" "$service_name is ready!"
            return 0
        fi
        
        retries=$((retries + 1))
        print_status "WARNING" "$service_name not ready yet (attempt $retries/$MAX_RETRIES)"
        sleep $RETRY_DELAY
    done
    
    print_status "ERROR" "$service_name failed to start within timeout"
    return 1
}

# Function to test API endpoint
test_api() {
    local url=$1
    local service_name=$2
    local expected_status=${3:-200}
    
    print_status "INFO" "Testing $service_name API..."
    
    response=$(curl -s -w "%{http_code}" "$url" 2>/dev/null || echo "000")
    http_code="${response: -3}"
    
    if [ "$http_code" = "$expected_status" ]; then
        print_status "SUCCESS" "$service_name API test passed (HTTP $http_code)"
        return 0
    else
        print_status "ERROR" "$service_name API test failed (HTTP $http_code)"
        return 1
    fi
}

# Function to test database
test_database() {
    print_status "INFO" "Testing database connection..."
    
    if docker-compose exec -T database psql -U postgres -d four_leaf_clover_shop -c "SELECT COUNT(*) FROM products;" > /dev/null 2>&1; then
        product_count=$(docker-compose exec -T database psql -U postgres -d four_leaf_clover_shop -t -c "SELECT COUNT(*) FROM products;" 2>/dev/null | tr -d ' ')
        print_status "SUCCESS" "Database test passed - Found $product_count products"
        return 0
    else
        print_status "ERROR" "Database test failed"
        return 1
    fi
}

# Function to test admin login
test_admin_login() {
    print_status "INFO" "Testing admin login..."
    
    login_response=$(curl -s -X POST "http://localhost:3001/login" \
        -H "Content-Type: application/json" \
        -d '{"email":"admin@fourleafclover.com","password":"admin123456"}' 2>/dev/null || echo '{"error":"failed"}')
    
    if echo "$login_response" | grep -q '"token"'; then
        print_status "SUCCESS" "Admin login test passed"
        return 0
    else
        print_status "ERROR" "Admin login test failed"
        print_status "ERROR" "Response: $login_response"
        return 1
    fi
}

# Function to test product API
test_products_api() {
    print_status "INFO" "Testing products API..."
    
    products_response=$(curl -s "http://localhost:3002/products" 2>/dev/null || echo '{"error":"failed"}')
    
    if echo "$products_response" | grep -q '"products"'; then
        product_count=$(echo "$products_response" | grep -o '"products":\[.*\]' | grep -o '{"id":' | wc -l)
        print_status "SUCCESS" "Products API test passed - Found $product_count products"
        return 0
    else
        print_status "ERROR" "Products API test failed"
        return 1
    fi
}

# Main test execution
main() {
    echo ""
    print_status "INFO" "Starting Docker setup tests..."
    echo ""
    
    # Check if Docker Compose is running
    if ! docker-compose ps | grep -q "Up"; then
        print_status "ERROR" "Docker Compose services are not running!"
        print_status "INFO" "Please run: docker-compose up -d"
        exit 1
    fi
    
    # Test 1: Check container status
    print_status "INFO" "Checking container status..."
    docker-compose ps
    echo ""
    
    # Test 2: Wait for all services to be ready
    print_status "INFO" "Testing service health endpoints..."
    wait_for_service "http://localhost:3001/health" "Auth Service" || exit 1
    wait_for_service "http://localhost:3002/health" "Products Service" || exit 1
    wait_for_service "http://localhost:3003/health" "Orders Service" || exit 1
    wait_for_service "http://localhost:3000" "Frontend" || exit 1
    echo ""
    
    # Test 3: API endpoint tests
    print_status "INFO" "Testing API endpoints..."
    test_api "http://localhost:3001/health" "Auth Service Health" || exit 1
    test_api "http://localhost:3002/health" "Products Service Health" || exit 1
    test_api "http://localhost:3003/health" "Orders Service Health" || exit 1
    test_api "http://localhost:3000" "Frontend" || exit 1
    echo ""
    
    # Test 4: Database tests
    test_database || exit 1
    echo ""
    
    # Test 5: Functional tests
    print_status "INFO" "Running functional tests..."
    test_admin_login || exit 1
    test_products_api || exit 1
    echo ""
    
    # Test 6: Categories API
    print_status "INFO" "Testing categories API..."
    test_api "http://localhost:3002/categories" "Categories API" || exit 1
    echo ""
    
    # Test 7: Admin dashboard access
    print_status "INFO" "Testing admin dashboard access..."
    test_api "http://localhost:3000/admin" "Admin Dashboard" || exit 1
    echo ""
    
    # Success summary
    print_status "SUCCESS" "All tests passed! 🎉"
    echo ""
    echo "🍀 Four Leaf Clover Jewelry Shop is running successfully!"
    echo ""
    echo "📍 Access Points:"
    echo "   🌐 Frontend:        http://localhost:3000"
    echo "   🔧 Admin Dashboard: http://localhost:3000/admin"
    echo "   🔐 Auth Service:    http://localhost:3001"
    echo "   🛍️  Products API:    http://localhost:3002"
    echo "   🛒 Orders API:      http://localhost:3003"
    echo ""
    echo "👤 Admin Login:"
    echo "   📧 Email:    admin@fourleafclover.com"
    echo "   🔑 Password: admin123456"
    echo ""
    echo "🗄️  Database:"
    echo "   🔗 Connection: localhost:5432"
    echo "   📊 Database:   four_leaf_clover_shop"
    echo ""
    
    return 0
}

# Run main function
main "$@" 