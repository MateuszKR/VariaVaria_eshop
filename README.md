# Four Leaf Clover Jewelry Shop

A professional e-commerce platform for handcrafted four-leaf clover jewelry, built with modern web technologies and microservices architecture.

## 🍀 Features

### Customer Features
- **Beautiful Product Catalog** - Browse handcrafted four-leaf clover jewelry
- **Advanced Search & Filtering** - Find products by category, price, material, etc.
- **Shopping Cart & Checkout** - Secure ordering process with multiple payment options
- **User Accounts** - Registration, login, order history, and profile management
- **Product Reviews & Ratings** - Customer feedback and testimonials
- **Wishlist** - Save favorite items for later
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **PWA Support** - Install as a mobile app with offline capabilities

### Admin Features
- **Product Management** - Add, edit, delete products with rich media support
- **Inventory Control** - Real-time stock tracking with low stock alerts
- **Order Management** - View, process, and update order statuses
- **Customer Management** - View customer details and order history
- **Analytics Dashboard** - Sales metrics, popular products, and insights
- **Category Management** - Organize products into categories

## 🏗️ Architecture

### Technology Stack
- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Node.js microservices with Express.js
- **Database**: PostgreSQL with optimized schema
- **Authentication**: JWT tokens with secure password hashing
- **PWA**: Service workers, offline support, installable app
- **State Management**: Zustand for client-side state
- **API Integration**: Axios with SWR for data fetching
- **UI Components**: Headless UI, Heroicons, Framer Motion

### Microservices
1. **Authentication Service** (Port 3001) - User management and JWT authentication
2. **Products Service** (Port 3002) - Product catalog and inventory management
3. **Orders Service** (Port 3003) - Shopping cart, orders, and checkout

## 🚀 Quick Start

### Option 1: Docker Setup (Recommended) 🐳

**Prerequisites:**
- Docker Desktop (20.10+)
- 4GB+ RAM, 2GB disk space

**One Command Setup:**
```bash
git clone https://github.com/your-username/four-leaf-clover-jewelry-shop.git
cd four-leaf-clover-jewelry-shop
docker-compose up --build
```

**Access your shop:**
- 🌐 Frontend: http://localhost:3000
- 🔧 Admin: http://localhost:3000/admin (admin@fourleafclover.com / admin123456)

**Easy Management:**
```bash
# Make scripts executable
chmod +x scripts/*.sh

# Use the manager script
./scripts/docker-manager.sh start    # Start all services
./scripts/docker-manager.sh test     # Test everything is working
./scripts/docker-manager.sh stop     # Stop services
./scripts/docker-manager.sh help     # See all options
```

📖 **Detailed Docker Guide:** See [DOCKER_SETUP.md](DOCKER_SETUP.md)

---

### Option 2: Local Development Setup

**Prerequisites:**
- Node.js 18+ and npm
- PostgreSQL 12+
- Git

**1. Clone the Repository**
```bash
git clone https://github.com/your-username/four-leaf-clover-jewelry-shop.git
cd four-leaf-clover-jewelry-shop
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend && npm install && cd ..

# Install backend dependencies
cd backend/auth-service && npm install && cd ../..
cd backend/products-service && npm install && cd ../..
cd backend/orders-service && npm install && cd ../..
```

### 3. Database Setup
```bash
# Create PostgreSQL database
createdb four_leaf_clover_shop

# Import the schema
psql four_leaf_clover_shop < database/schema.sql
```

### 4. Environment Configuration
Create `.env` files in each service directory:

**backend/auth-service/.env**
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=four_leaf_clover_shop
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your-super-secret-jwt-key-change-in-production
PORT=3001
```

**backend/products-service/.env**
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=four_leaf_clover_shop
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your-super-secret-jwt-key-change-in-production
PORT=3002
```

**backend/orders-service/.env**
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=four_leaf_clover_shop
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your-super-secret-jwt-key-change-in-production
PORT=3003
```

**frontend/.env.local**
```env
NEXT_PUBLIC_AUTH_SERVICE_URL=http://localhost:3001
NEXT_PUBLIC_PRODUCTS_SERVICE_URL=http://localhost:3002
NEXT_PUBLIC_ORDERS_SERVICE_URL=http://localhost:3003
```

### 5. Start the Development Environment
```bash
# Start all services (frontend + all microservices)
npm run dev

# Or start services individually:
npm run dev:frontend    # Next.js frontend on http://localhost:3000
npm run dev:auth       # Auth service on http://localhost:3001
npm run dev:products   # Products service on http://localhost:3002
npm run dev:orders     # Orders service on http://localhost:3003
```

### 6. Create Admin User
Use the auth service to create an admin user:
```bash
curl -X POST http://localhost:3001/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@fourleafclover.com",
    "password": "admin123",
    "firstName": "Admin",
    "lastName": "User"
  }'

# Then manually update the user role in the database:
# UPDATE users SET role = 'admin' WHERE email = 'admin@fourleafclover.com';
```

## 📱 PWA Features

The application includes Progressive Web App capabilities:

- **Installable**: Users can install the app on their devices
- **Offline Support**: Basic functionality works without internet
- **Push Notifications**: Order updates and promotional messages
- **App-like Experience**: Native mobile app feel

To test PWA features:
1. Open the app in Chrome/Edge
2. Look for the "Install" prompt in the address bar
3. Install the app to your device
4. Test offline functionality by disconnecting from internet

## 🔧 API Documentation

### Authentication Service (Port 3001)
- `POST /register` - Register new user
- `POST /login` - User login
- `GET /verify` - Verify JWT token
- `PUT /profile` - Update user profile
- `PUT /change-password` - Change password
- `GET /admin/users` - Get all users (admin only)

### Products Service (Port 3002)
- `GET /products` - Get products with filtering and pagination
- `GET /products/:id` - Get single product details
- `GET /categories` - Get all categories
- `GET /categories/:slug` - Get category by slug
- `POST /admin/products` - Create product (admin only)
- `PUT /admin/products/:id` - Update product (admin only)
- `DELETE /admin/products/:id` - Delete product (admin only)
- `PUT /admin/inventory/:productId` - Update inventory (admin only)

### Orders Service (Port 3003)
- `GET /cart` - Get user's cart
- `POST /cart/items` - Add item to cart
- `PUT /cart/items/:itemId` - Update cart item
- `DELETE /cart/items/:itemId` - Remove item from cart
- `DELETE /cart` - Clear cart
- `POST /orders` - Create order from cart
- `GET /orders` - Get user's orders
- `GET /orders/:orderId` - Get order details
- `GET /admin/orders` - Get all orders (admin only)
- `PUT /admin/orders/:orderId/status` - Update order status (admin only)

## 🎨 Design System

### Color Palette
- **Primary Green**: #22c55e (Four-leaf clover theme)
- **Accent Gold**: #f59e0b (Jewelry accent)
- **Neutral Grays**: #f5f5f5 to #171717

### Typography
- **Headings**: Playfair Display (serif)
- **Body Text**: Inter (sans-serif)

### Components
- Consistent button styles with hover states
- Card-based layouts with soft shadows
- Responsive grid systems
- Form components with validation
- Loading states and animations

## 🚢 Deployment

### Production Build
```bash
# Build all services
npm run build

# Start production servers
npm run start
```

### Docker Deployment
```dockerfile
# Example Dockerfile for frontend
FROM node:18-alpine
WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci --only=production
COPY frontend/ .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Variables for Production
- Update all JWT secrets
- Configure production database credentials
- Set proper CORS origins
- Enable SSL/HTTPS
- Configure CDN for static assets

## 🔒 Security Features

- **Password Hashing**: Bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Rate Limiting**: Prevents brute force attacks
- **Input Validation**: Server-side validation for all inputs
- **SQL Injection Prevention**: Parameterized queries
- **CORS Configuration**: Proper cross-origin resource sharing
- **Helmet.js**: Security headers for Express apps

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run frontend tests
cd frontend && npm test

# Run backend tests
cd backend/auth-service && npm test
```

## 📈 Performance Optimization

- **Next.js Optimizations**: Image optimization, code splitting, SSR
- **Database Indexing**: Optimized queries with proper indexes
- **Caching**: API response caching with SWR
- **Bundle Optimization**: Tree shaking and minimal bundles
- **Image Optimization**: Next.js Image component with lazy loading

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Email: support@fourleafcloverjewelry.com
- Documentation: See `/docs` folder for detailed guides
- Issues: Use GitHub Issues for bug reports

## 🔮 Roadmap

- [ ] Payment gateway integration (Stripe, PayPal)
- [ ] Email notifications and newsletters
- [ ] Advanced analytics and reporting
- [ ] Multi-language support
- [ ] Social media integration
- [ ] Advanced product customization
- [ ] Loyalty program and rewards
- [ ] Mobile app (React Native)

---

**Built with 🍀 for Four Leaf Clover Jewelry** 