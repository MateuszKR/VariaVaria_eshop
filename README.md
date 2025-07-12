# 🍀 Four Leaf Clover Jewelry Shop - E-Commerce Platform

A complete e-commerce platform built with microservices architecture, featuring a Next.js frontend and Node.js backend services.

## 🚀 Quick Start

### Option 1: Automated Startup (Recommended)

For Windows users:
```powershell
.\scripts\start-eshop.ps1
```

For Linux/macOS users:
```bash
./scripts/start-eshop.sh
```

### Option 2: Manual Startup

1. **Start Database First**
   ```bash
   docker-compose up -d database
   ```

2. **Start Backend Services**
   ```bash
   docker-compose up -d auth-service products-service orders-service
   ```

3. **Start Frontend**
   ```bash
   docker-compose up -d frontend
   ```

4. **Start Nginx (Optional)**
   ```bash
   docker-compose up -d nginx
   ```

## 🏥 Health Check

To verify all services are running properly:

```bash
# Linux/macOS
./scripts/health-check.sh

# Windows PowerShell
# Check services manually or use the startup script
```

## 🌐 Access URLs

- **Main Store**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin
- **Auth API**: http://localhost:3001
- **Products API**: http://localhost:3002
- **Orders API**: http://localhost:3003
- **Nginx Proxy**: http://localhost:80

## 🔑 Default Admin Credentials

- **Email**: admin@fourleafclover.com
- **Password**: admin123456

## 🏗️ Architecture

### Services Overview
- **Database**: PostgreSQL with pre-populated sample data
- **Auth Service**: User authentication and authorization
- **Products Service**: Product catalog management
- **Orders Service**: Order processing and management
- **Frontend**: Next.js React application
- **Nginx**: Reverse proxy and load balancer

### Service Dependencies
```
Database → Backend Services → Frontend → Nginx
```

## 📋 Prerequisites

- Docker (20.10+)
- Docker Compose (2.0+)
- 4GB+ RAM
- 2GB+ free disk space

## 🔧 Development

### Environment Variables
All services are pre-configured with production-ready environment variables in `docker-compose.yml`.

### Database Access
```bash
# Connect to database
docker exec -it clover-database psql -U postgres -d four_leaf_clover_shop

# View tables
\dt

# Exit
\q
```

### Service Logs
```bash
# View logs for all services
docker-compose logs -f

# View logs for specific service
docker-compose logs -f auth-service
docker-compose logs -f products-service
docker-compose logs -f orders-service
docker-compose logs -f frontend
```

## 🛠️ Troubleshooting

### Common Issues

1. **Port Conflicts**
   - Ensure ports 3000-3003, 5432, and 80 are available
   - Stop conflicting services: `docker-compose down`

2. **Database Connection Issues**
   - Always start database first
   - Wait for database to be healthy before starting backend services
   - Use the automated startup scripts to ensure proper initialization

3. **Login Issues**
   - Verify database is running and healthy
   - Check that all backend services are on the same network
   - Restart services if needed: `docker-compose restart`

### Clean Restart
```bash
# Stop all services and remove containers
docker-compose down --remove-orphans

# Remove volumes (will delete database data)
docker-compose down -v

# Start fresh
./scripts/start-eshop.sh  # or start-eshop.ps1 on Windows
```

## 📦 Sample Data

The database is automatically populated with:
- 10 sample jewelry products
- 6 product categories
- Admin and customer test accounts
- Sample orders and reviews

## 🔐 Security Features

- JWT token authentication
- Rate limiting on API endpoints
- Input validation and sanitization
- CORS protection
- Helmet security headers

## 🎯 Features

- **User Management**: Registration, login, profile management
- **Product Catalog**: Browse, search, filter products
- **Shopping Cart**: Add, remove, update quantities
- **Order Processing**: Checkout, order tracking
- **Admin Panel**: Product management, order management
- **Responsive Design**: Mobile-friendly interface

## 📝 API Documentation

### Authentication Endpoints
- `POST /login` - User login
- `POST /register` - User registration
- `GET /verify` - Token verification
- `PUT /profile` - Update user profile

### Products Endpoints
- `GET /products` - List all products
- `GET /products/:id` - Get single product
- `POST /products` - Create product (admin)
- `PUT /products/:id` - Update product (admin)
- `DELETE /products/:id` - Delete product (admin)

### Orders Endpoints
- `GET /orders` - List user orders
- `POST /orders` - Create new order
- `GET /orders/:id` - Get single order
- `PUT /orders/:id/status` - Update order status (admin)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🎉 Acknowledgments

Built with modern web technologies:
- Next.js 13+ with App Router
- Node.js and Express
- PostgreSQL
- Docker and Docker Compose
- Tailwind CSS
- JWT Authentication 