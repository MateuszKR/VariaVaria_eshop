#!/bin/bash

# 🐳 Four Leaf Clover Jewelry Shop - Docker Manager
# Easy management script for Docker operations

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    local status=$1
    local message=$2
    case $status in
        "SUCCESS") echo -e "${GREEN}✅ $message${NC}" ;;
        "ERROR") echo -e "${RED}❌ $message${NC}" ;;
        "WARNING") echo -e "${YELLOW}⚠️  $message${NC}" ;;
        "INFO") echo -e "${BLUE}ℹ️  $message${NC}" ;;
        "HEADER") echo -e "${PURPLE}🍀 $message${NC}" ;;
    esac
}

# Function to show help
show_help() {
    echo ""
    print_status "HEADER" "Four Leaf Clover Jewelry Shop - Docker Manager"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  start       Start all services"
    echo "  stop        Stop all services"
    echo "  restart     Restart all services"
    echo "  build       Build all Docker images"
    echo "  rebuild     Clean rebuild (no cache)"
    echo "  logs        Show logs from all services"
    echo "  status      Show status of all containers"
    echo "  test        Run comprehensive tests"
    echo "  clean       Remove containers and images"
    echo "  reset       Complete reset (removes data!)"
    echo "  backup      Backup database"
    echo "  restore     Restore database from backup"
    echo "  shell       Access container shell"
    echo "  help        Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 start              # Start the jewelry shop"
    echo "  $0 logs frontend      # Show frontend logs"
    echo "  $0 shell database     # Access database shell"
    echo ""
}

# Function to start services
start_services() {
    print_status "INFO" "Starting Four Leaf Clover Jewelry Shop..."
    
    if docker-compose ps | grep -q "Up"; then
        print_status "WARNING" "Services are already running"
        docker-compose ps
        return 0
    fi
    
    print_status "INFO" "Building and starting services..."
    docker-compose up -d --build
    
    print_status "INFO" "Waiting for services to be ready..."
    sleep 10
    
    print_status "SUCCESS" "Services started successfully!"
    print_status "INFO" "Running quick health check..."
    
    # Quick health check
    if curl -f -s http://localhost:3000 > /dev/null && \
       curl -f -s http://localhost:3001/health > /dev/null && \
       curl -f -s http://localhost:3002/health > /dev/null && \
       curl -f -s http://localhost:3003/health > /dev/null; then
        print_status "SUCCESS" "All services are healthy!"
        echo ""
        echo "🌐 Frontend:        http://localhost:3000"
        echo "🔧 Admin Dashboard: http://localhost:3000/admin"
        echo "👤 Admin Login:     admin@fourleafclover.com / admin123456"
    else
        print_status "WARNING" "Some services may still be starting up"
        print_status "INFO" "Run '$0 test' to check service health"
    fi
}

# Function to stop services
stop_services() {
    print_status "INFO" "Stopping services..."
    docker-compose stop
    print_status "SUCCESS" "Services stopped"
}

# Function to restart services
restart_services() {
    print_status "INFO" "Restarting services..."
    docker-compose restart
    print_status "SUCCESS" "Services restarted"
}

# Function to build images
build_images() {
    print_status "INFO" "Building Docker images..."
    docker-compose build
    print_status "SUCCESS" "Images built successfully"
}

# Function to rebuild images
rebuild_images() {
    print_status "INFO" "Rebuilding Docker images (no cache)..."
    docker-compose build --no-cache
    print_status "SUCCESS" "Images rebuilt successfully"
}

# Function to show logs
show_logs() {
    local service=$1
    if [ -n "$service" ]; then
        print_status "INFO" "Showing logs for $service..."
        docker-compose logs -f "$service"
    else
        print_status "INFO" "Showing logs for all services..."
        docker-compose logs -f
    fi
}

# Function to show status
show_status() {
    print_status "INFO" "Container status:"
    docker-compose ps
    echo ""
    print_status "INFO" "Resource usage:"
    docker stats --no-stream
}

# Function to run tests
run_tests() {
    print_status "INFO" "Running comprehensive tests..."
    if [ -f "./scripts/test-docker-setup.sh" ]; then
        chmod +x ./scripts/test-docker-setup.sh
        ./scripts/test-docker-setup.sh
    else
        print_status "ERROR" "Test script not found at ./scripts/test-docker-setup.sh"
    fi
}

# Function to clean up
clean_up() {
    print_status "WARNING" "This will remove containers and images"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "INFO" "Cleaning up..."
        docker-compose down --rmi all
        docker system prune -f
        print_status "SUCCESS" "Cleanup completed"
    else
        print_status "INFO" "Cleanup cancelled"
    fi
}

# Function to reset everything
reset_all() {
    print_status "ERROR" "This will remove ALL data including the database!"
    print_status "WARNING" "This action cannot be undone!"
    read -p "Are you absolutely sure? Type 'yes' to confirm: " confirm
    
    if [ "$confirm" = "yes" ]; then
        print_status "INFO" "Resetting everything..."
        docker-compose down -v --rmi all --remove-orphans
        docker system prune -af
        print_status "SUCCESS" "Complete reset finished"
        print_status "INFO" "Run '$0 start' to start fresh"
    else
        print_status "INFO" "Reset cancelled"
    fi
}

# Function to backup database
backup_database() {
    local backup_file="backup_$(date +%Y%m%d_%H%M%S).sql"
    print_status "INFO" "Creating database backup..."
    
    if docker-compose exec -T database pg_dump -U postgres four_leaf_clover_shop > "$backup_file"; then
        print_status "SUCCESS" "Database backed up to $backup_file"
    else
        print_status "ERROR" "Backup failed"
        return 1
    fi
}

# Function to restore database
restore_database() {
    local backup_file=$1
    
    if [ -z "$backup_file" ]; then
        print_status "ERROR" "Please specify backup file"
        echo "Usage: $0 restore <backup_file.sql>"
        return 1
    fi
    
    if [ ! -f "$backup_file" ]; then
        print_status "ERROR" "Backup file not found: $backup_file"
        return 1
    fi
    
    print_status "WARNING" "This will overwrite the current database!"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "INFO" "Restoring database from $backup_file..."
        if docker-compose exec -T database psql -U postgres -d four_leaf_clover_shop < "$backup_file"; then
            print_status "SUCCESS" "Database restored successfully"
        else
            print_status "ERROR" "Restore failed"
            return 1
        fi
    else
        print_status "INFO" "Restore cancelled"
    fi
}

# Function to access container shell
access_shell() {
    local service=$1
    
    if [ -z "$service" ]; then
        print_status "ERROR" "Please specify service name"
        echo "Available services: frontend, auth-service, products-service, orders-service, database, nginx"
        return 1
    fi
    
    case $service in
        "database")
            print_status "INFO" "Accessing PostgreSQL shell..."
            docker-compose exec database psql -U postgres -d four_leaf_clover_shop
            ;;
        "frontend"|"auth-service"|"products-service"|"orders-service")
            print_status "INFO" "Accessing $service shell..."
            docker-compose exec "$service" /bin/sh
            ;;
        "nginx")
            print_status "INFO" "Accessing nginx shell..."
            docker-compose exec nginx /bin/sh
            ;;
        *)
            print_status "ERROR" "Unknown service: $service"
            echo "Available services: frontend, auth-service, products-service, orders-service, database, nginx"
            return 1
            ;;
    esac
}

# Main command handler
main() {
    local command=$1
    shift
    
    case $command in
        "start")
            start_services
            ;;
        "stop")
            stop_services
            ;;
        "restart")
            restart_services
            ;;
        "build")
            build_images
            ;;
        "rebuild")
            rebuild_images
            ;;
        "logs")
            show_logs "$1"
            ;;
        "status")
            show_status
            ;;
        "test")
            run_tests
            ;;
        "clean")
            clean_up
            ;;
        "reset")
            reset_all
            ;;
        "backup")
            backup_database
            ;;
        "restore")
            restore_database "$1"
            ;;
        "shell")
            access_shell "$1"
            ;;
        "help"|"--help"|"-h"|"")
            show_help
            ;;
        *)
            print_status "ERROR" "Unknown command: $command"
            show_help
            exit 1
            ;;
    esac
}

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    print_status "ERROR" "docker-compose is not installed or not in PATH"
    exit 1
fi

# Run main function with all arguments
main "$@" 