# Four Leaf Clover E-Shop Startup Script (PowerShell)
# This script ensures proper initialization sequence for all services

$ErrorActionPreference = "Stop"

Write-Host "Starting Four Leaf Clover E-Shop..." -ForegroundColor Green
Write-Host "========================================"

# Function to check if a service is healthy
function Test-ServiceHealth {
    param(
        [string]$ServiceName,
        [int]$Port,
        [int]$MaxAttempts = 30
    )
    
    Write-Host "Checking $ServiceName health..." -NoNewline
    
    for ($attempt = 1; $attempt -le $MaxAttempts; $attempt++) {
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:$Port/health" -UseBasicParsing -TimeoutSec 5
            if ($response.StatusCode -eq 200) {
                Write-Host " ✓ Healthy" -ForegroundColor Green
                return $true
            }
        }
        catch {
            # Service not ready yet
        }
        Write-Host "." -NoNewline
        Start-Sleep -Seconds 2
    }
    
    Write-Host " ✗ Failed" -ForegroundColor Red
    return $false
}

# Function to check database connectivity
function Test-DatabaseConnection {
    param([int]$MaxAttempts = 30)
    
    Write-Host "Checking database connectivity..." -NoNewline
    
    for ($attempt = 1; $attempt -le $MaxAttempts; $attempt++) {
        try {
            $result = docker exec clover-database pg_isready -U postgres -d four_leaf_clover_shop 2>$null
            if ($LASTEXITCODE -eq 0) {
                Write-Host " ✓ Ready" -ForegroundColor Green
                return $true
            }
        }
        catch {
            # Database not ready yet
        }
        Write-Host "." -NoNewline
        Start-Sleep -Seconds 2
    }
    
    Write-Host " ✗ Failed" -ForegroundColor Red
    return $false
}

try {
    # Step 1: Clean up any existing containers
    Write-Host "Cleaning up existing containers..."
    docker-compose down --remove-orphans 2>$null | Out-Null

    # Step 2: Start database first
    Write-Host "Starting database..."
    docker-compose up -d database

    # Step 3: Wait for database to be healthy
    if (-not (Test-DatabaseConnection)) {
        Write-Host "❌ Database failed to start properly" -ForegroundColor Red
        exit 1
    }

    # Step 4: Start backend services
    Write-Host "Starting backend services..."
    docker-compose up -d auth-service products-service orders-service

    # Step 5: Wait for backend services to be healthy
    Write-Host "Waiting for backend services to be ready..."
    
    if (-not (Test-ServiceHealth "Auth Service" 3001)) {
        Write-Host "❌ Auth service failed to start" -ForegroundColor Red
        exit 1
    }

    if (-not (Test-ServiceHealth "Products Service" 3002)) {
        Write-Host "❌ Products service failed to start" -ForegroundColor Red
        exit 1
    }

    if (-not (Test-ServiceHealth "Orders Service" 3003)) {
        Write-Host "❌ Orders service failed to start" -ForegroundColor Red
        exit 1
    }

    # Step 6: Start frontend
    Write-Host "Starting frontend..."
    docker-compose up -d frontend

    # Step 7: Wait for frontend to be ready
    Write-Host "Waiting for frontend to be ready..."
    Start-Sleep -Seconds 10

    # Step 8: Start nginx (optional)
    Write-Host "Starting nginx proxy..."
    docker-compose up -d nginx

    # Step 9: Final health check
    Write-Host "Performing final health checks..."
    Start-Sleep -Seconds 5

    Write-Host ""
    Write-Host "E-Shop startup complete!" -ForegroundColor Green
    Write-Host "================================"
    Write-Host "Services Status:"
    Write-Host "   Database: Running"
    Write-Host "   Auth Service: http://localhost:3001"
    Write-Host "   Products Service: http://localhost:3002"
    Write-Host "   Orders Service: http://localhost:3003"
    Write-Host "   Frontend: http://localhost:3000"
    Write-Host "   Nginx Proxy: http://localhost:80"
    Write-Host ""
    Write-Host "Admin Login:"
    Write-Host "   URL: http://localhost:3000/admin/login"
    Write-Host "   Email: admin@fourleafclover.com"
    Write-Host "   Password: admin123456"
    Write-Host ""
    Write-Host "Happy shopping!" -ForegroundColor Yellow
    
    # Optionally open the browser
    Write-Host "Opening e-shop in your browser..." -ForegroundColor Cyan
    Start-Process "http://localhost:3000"
}
catch {
    Write-Host "❌ Error during startup: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
} 