const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult, query } = require('express-validator');
const { Pool } = require('pg');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3003;

// Database connection
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'four_leaf_clover_shop',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'four-leaf-clover-secret-key-change-in-production';

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token.' });
  }
};

// Middleware to verify admin role
const verifyAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admin role required.' });
  }
  next();
};

// Validation middleware
const validateCartItem = [
  body('productId').isInt({ min: 1 }).withMessage('Product ID is required'),
  body('quantity').isInt({ min: 1, max: 99 }).withMessage('Quantity must be between 1 and 99')
];

const validateOrder = [
  body('shippingAddress').isObject().withMessage('Shipping address is required'),
  body('shippingAddress.streetAddress').trim().isLength({ min: 1 }).withMessage('Street address is required'),
  body('shippingAddress.city').trim().isLength({ min: 1 }).withMessage('City is required'),
  body('shippingAddress.postalCode').trim().isLength({ min: 1 }).withMessage('Postal code is required'),
  body('shippingAddress.country').trim().isLength({ min: 1 }).withMessage('Country is required'),
  body('billingAddress').optional().isObject(),
  body('paymentMethod').isIn(['credit_card', 'paypal', 'bank_transfer']).withMessage('Invalid payment method'),
  body('notes').optional().trim()
];

// Helper function to generate order number
const generateOrderNumber = () => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `CLV-${timestamp}-${randomStr}`.toUpperCase();
};

// Helper function to calculate totals
const calculateTotals = (items, taxRate = 0.08, shippingRate = 9.99) => {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const taxAmount = subtotal * taxRate;
  const shippingAmount = subtotal > 100 ? 0 : shippingRate; // Free shipping over $100
  const totalAmount = subtotal + taxAmount + shippingAmount;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    taxAmount: Math.round(taxAmount * 100) / 100,
    shippingAmount: Math.round(shippingAmount * 100) / 100,
    totalAmount: Math.round(totalAmount * 100) / 100
  };
};

// Routes

// API Documentation root route
app.get('/', (req, res) => {
  res.json({
    service: 'Four Leaf Clover - Orders Service',
    version: '1.0.0',
    description: 'API service for managing shopping cart, orders, and customer transactions',
    endpoints: {
      cart: {
        'GET /cart': 'Get user cart (auth required)',
        'POST /cart/items': 'Add item to cart (auth required)',
        'PUT /cart/items/:itemId': 'Update cart item quantity (auth required)',
        'DELETE /cart/items/:itemId': 'Remove item from cart (auth required)',
        'DELETE /cart': 'Clear entire cart (auth required)'
      },
      orders: {
        'GET /orders': 'Get user orders (auth required)',
        'GET /orders/:id': 'Get specific order (auth required)',
        'POST /orders': 'Create new order/checkout (auth required)',
        'PUT /orders/:id/status': 'Update order status (admin only)',
        'GET /orders/:id/receipt': 'Get order receipt (auth required)'
      },
      admin: {
        'GET /admin/orders': 'Get all orders (admin only)',
        'GET /admin/orders/stats': 'Get order statistics (admin only)'
      }
    },
    examples: {
      addToCart: 'POST /cart/items { "productId": 1, "quantity": 2 }',
      viewCart: '/cart',
      checkout: 'POST /orders { "shippingAddress": {...}, "paymentMethod": "card" }',
      viewOrders: '/orders'
    },
    timestamp: new Date().toISOString()
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'orders-service', timestamp: new Date().toISOString() });
});

// Get user's cart
app.get('/cart', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        ci.id, ci.quantity, ci.created_at, ci.updated_at,
        p.id as product_id, p.name, p.price, p.sku,
        pi.image_url as primary_image_url, pi.alt_text as primary_image_alt,
        i.quantity_available
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = true
      LEFT JOIN inventory i ON p.id = i.product_id
      WHERE ci.user_id = $1 AND p.is_active = true
      ORDER BY ci.created_at DESC
    `, [req.user.userId]);

    const cartItems = result.rows.map(item => ({
      id: item.id,
      product: {
        id: item.product_id,
        name: item.name,
        price: parseFloat(item.price),
        sku: item.sku,
        primaryImage: item.primary_image_url ? {
          url: item.primary_image_url,
          alt: item.primary_image_alt
        } : null,
        quantityAvailable: item.quantity_available || 0
      },
      quantity: item.quantity,
      lineTotal: parseFloat(item.price) * item.quantity,
      createdAt: item.created_at,
      updatedAt: item.updated_at
    }));

    const totals = calculateTotals(cartItems.map(item => ({
      price: item.product.price,
      quantity: item.quantity
    })));

    res.json({
      cartItems,
      summary: {
        itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
        ...totals
      }
    });

  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add item to cart
app.post('/cart/items', verifyToken, validateCartItem, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { productId, quantity } = req.body;

    // Check if product exists and is active
    const productResult = await pool.query(
      'SELECT id, name, price, is_active FROM products WHERE id = $1',
      [productId]
    );

    if (productResult.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const product = productResult.rows[0];
    if (!product.is_active) {
      return res.status(400).json({ error: 'Product is not available' });
    }

    // Check inventory
    const inventoryResult = await pool.query(
      'SELECT quantity_available FROM inventory WHERE product_id = $1',
      [productId]
    );

    if (inventoryResult.rows.length === 0 || inventoryResult.rows[0].quantity_available < quantity) {
      return res.status(400).json({ error: 'Insufficient inventory' });
    }

    // Check if item already exists in cart
    const existingItem = await pool.query(
      'SELECT id, quantity FROM cart_items WHERE user_id = $1 AND product_id = $2',
      [req.user.userId, productId]
    );

    let result;
    if (existingItem.rows.length > 0) {
      // Update existing item
      const newQuantity = existingItem.rows[0].quantity + quantity;
      if (inventoryResult.rows[0].quantity_available < newQuantity) {
        return res.status(400).json({ error: 'Insufficient inventory for requested quantity' });
      }

      result = await pool.query(
        'UPDATE cart_items SET quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2 AND product_id = $3 RETURNING *',
        [newQuantity, req.user.userId, productId]
      );
    } else {
      // Add new item
      result = await pool.query(
        'INSERT INTO cart_items (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *',
        [req.user.userId, productId, quantity]
      );
    }

    const cartItem = result.rows[0];
    res.status(201).json({
      message: 'Item added to cart successfully',
      cartItem: {
        id: cartItem.id,
        productId: cartItem.product_id,
        quantity: cartItem.quantity,
        createdAt: cartItem.created_at,
        updatedAt: cartItem.updated_at
      }
    });

  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update cart item quantity
app.put('/cart/items/:itemId', verifyToken, [
  body('quantity').isInt({ min: 1, max: 99 }).withMessage('Quantity must be between 1 and 99')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { itemId } = req.params;
    const { quantity } = req.body;

    // Get cart item with product info
    const itemResult = await pool.query(`
      SELECT ci.id, ci.product_id, ci.quantity, p.name, i.quantity_available
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      LEFT JOIN inventory i ON p.id = i.product_id
      WHERE ci.id = $1 AND ci.user_id = $2
    `, [itemId, req.user.userId]);

    if (itemResult.rows.length === 0) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    const item = itemResult.rows[0];
    if (item.quantity_available < quantity) {
      return res.status(400).json({ error: 'Insufficient inventory' });
    }

    const result = await pool.query(
      'UPDATE cart_items SET quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [quantity, itemId]
    );

    const updatedItem = result.rows[0];
    res.json({
      message: 'Cart item updated successfully',
      cartItem: {
        id: updatedItem.id,
        productId: updatedItem.product_id,
        quantity: updatedItem.quantity,
        updatedAt: updatedItem.updated_at
      }
    });

  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Remove item from cart
app.delete('/cart/items/:itemId', verifyToken, async (req, res) => {
  try {
    const { itemId } = req.params;

    const result = await pool.query(
      'DELETE FROM cart_items WHERE id = $1 AND user_id = $2 RETURNING id',
      [itemId, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    res.json({ message: 'Item removed from cart successfully' });

  } catch (error) {
    console.error('Remove cart item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Clear cart
app.delete('/cart', verifyToken, async (req, res) => {
  try {
    await pool.query('DELETE FROM cart_items WHERE user_id = $1', [req.user.userId]);
    res.json({ message: 'Cart cleared successfully' });

  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create order from cart
app.post('/orders', verifyToken, validateOrder, async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      await client.query('ROLLBACK');
      return res.status(400).json({ errors: errors.array() });
    }

    const { shippingAddress, billingAddress, paymentMethod, notes } = req.body;

    // Get cart items
    const cartResult = await client.query(`
      SELECT 
        ci.id, ci.product_id, ci.quantity,
        p.name, p.price, p.sku,
        i.quantity_available
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      LEFT JOIN inventory i ON p.id = i.product_id
      WHERE ci.user_id = $1 AND p.is_active = true
    `, [req.user.userId]);

    if (cartResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const cartItems = cartResult.rows;

    // Verify inventory for all items
    for (const item of cartItems) {
      if (item.quantity_available < item.quantity) {
        await client.query('ROLLBACK');
        return res.status(400).json({ 
          error: `Insufficient inventory for ${item.name}. Available: ${item.quantity_available}, Requested: ${item.quantity}` 
        });
      }
    }

    // Calculate totals
    const totals = calculateTotals(cartItems.map(item => ({
      price: parseFloat(item.price),
      quantity: item.quantity
    })));

    // Create shipping address
    const shippingAddressResult = await client.query(`
      INSERT INTO addresses (user_id, type, street_address, city, state_province, postal_code, country)
      VALUES ($1, 'shipping', $2, $3, $4, $5, $6)
      RETURNING id
    `, [
      req.user.userId, 
      shippingAddress.streetAddress, 
      shippingAddress.city, 
      shippingAddress.stateProvince || null, 
      shippingAddress.postalCode, 
      shippingAddress.country
    ]);

    const shippingAddressId = shippingAddressResult.rows[0].id;
    let billingAddressId = shippingAddressId;

    // Create billing address if different
    if (billingAddress && billingAddress !== shippingAddress) {
      const billingAddressResult = await client.query(`
        INSERT INTO addresses (user_id, type, street_address, city, state_province, postal_code, country)
        VALUES ($1, 'billing', $2, $3, $4, $5, $6)
        RETURNING id
      `, [
        req.user.userId, 
        billingAddress.streetAddress, 
        billingAddress.city, 
        billingAddress.stateProvince || null, 
        billingAddress.postalCode, 
        billingAddress.country
      ]);
      billingAddressId = billingAddressResult.rows[0].id;
    }

    // Create order
    const orderNumber = generateOrderNumber();
    const orderResult = await client.query(`
      INSERT INTO orders (
        user_id, order_number, subtotal, tax_amount, shipping_amount, total_amount,
        shipping_address_id, billing_address_id, payment_method, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `, [
      req.user.userId,
      orderNumber,
      totals.subtotal,
      totals.taxAmount,
      totals.shippingAmount,
      totals.totalAmount,
      shippingAddressId,
      billingAddressId,
      paymentMethod,
      notes
    ]);

    const order = orderResult.rows[0];

    // Create order items and update inventory
    for (const item of cartItems) {
      // Create order item
      await client.query(`
        INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price)
        VALUES ($1, $2, $3, $4, $5)
      `, [
        order.id,
        item.product_id,
        item.quantity,
        item.price,
        parseFloat(item.price) * item.quantity
      ]);

      // Reserve inventory
      await client.query(`
        UPDATE inventory 
        SET quantity_reserved = quantity_reserved + $1
        WHERE product_id = $2
      `, [item.quantity, item.product_id]);
    }

    // Clear cart
    await client.query('DELETE FROM cart_items WHERE user_id = $1', [req.user.userId]);

    await client.query('COMMIT');

    res.status(201).json({
      message: 'Order created successfully',
      order: {
        id: order.id,
        orderNumber: order.order_number,
        status: order.status,
        subtotal: parseFloat(order.subtotal),
        taxAmount: parseFloat(order.tax_amount),
        shippingAmount: parseFloat(order.shipping_amount),
        totalAmount: parseFloat(order.total_amount),
        paymentMethod: order.payment_method,
        paymentStatus: order.payment_status,
        createdAt: order.created_at
      }
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
});

// Get user's orders
app.get('/orders', verifyToken, [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 })
], async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const result = await pool.query(`
      SELECT 
        o.id, o.order_number, o.status, o.subtotal, o.tax_amount, 
        o.shipping_amount, o.total_amount, o.payment_method, o.payment_status,
        o.created_at, o.updated_at,
        COUNT(oi.id) as item_count
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.user_id = $1
      GROUP BY o.id
      ORDER BY o.created_at DESC
      LIMIT $2 OFFSET $3
    `, [req.user.userId, limit, offset]);

    const countResult = await pool.query('SELECT COUNT(*) FROM orders WHERE user_id = $1', [req.user.userId]);
    const totalOrders = parseInt(countResult.rows[0].count);

    res.json({
      orders: result.rows.map(order => ({
        id: order.id,
        orderNumber: order.order_number,
        status: order.status,
        subtotal: parseFloat(order.subtotal),
        taxAmount: parseFloat(order.tax_amount),
        shippingAmount: parseFloat(order.shipping_amount),
        totalAmount: parseFloat(order.total_amount),
        paymentMethod: order.payment_method,
        paymentStatus: order.payment_status,
        itemCount: parseInt(order.item_count),
        createdAt: order.created_at,
        updatedAt: order.updated_at
      })),
      pagination: {
        page,
        limit,
        total: totalOrders,
        pages: Math.ceil(totalOrders / limit)
      }
    });

  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get order details
app.get('/orders/:orderId', verifyToken, async (req, res) => {
  try {
    const { orderId } = req.params;

    // Get order with addresses
    const orderResult = await pool.query(`
      SELECT 
        o.*,
        sa.street_address as shipping_street, sa.city as shipping_city, 
        sa.state_province as shipping_state, sa.postal_code as shipping_postal, 
        sa.country as shipping_country,
        ba.street_address as billing_street, ba.city as billing_city,
        ba.state_province as billing_state, ba.postal_code as billing_postal,
        ba.country as billing_country
      FROM orders o
      LEFT JOIN addresses sa ON o.shipping_address_id = sa.id
      LEFT JOIN addresses ba ON o.billing_address_id = ba.id
      WHERE o.id = $1 AND o.user_id = $2
    `, [orderId, req.user.userId]);

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = orderResult.rows[0];

    // Get order items
    const itemsResult = await pool.query(`
      SELECT 
        oi.id, oi.quantity, oi.unit_price, oi.total_price,
        p.id as product_id, p.name, p.sku,
        pi.image_url as primary_image_url, pi.alt_text as primary_image_alt
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = true
      WHERE oi.order_id = $1
      ORDER BY oi.id
    `, [orderId]);

    res.json({
      order: {
        id: order.id,
        orderNumber: order.order_number,
        status: order.status,
        subtotal: parseFloat(order.subtotal),
        taxAmount: parseFloat(order.tax_amount),
        shippingAmount: parseFloat(order.shipping_amount),
        totalAmount: parseFloat(order.total_amount),
        paymentMethod: order.payment_method,
        paymentStatus: order.payment_status,
        notes: order.notes,
        shippingAddress: {
          streetAddress: order.shipping_street,
          city: order.shipping_city,
          stateProvince: order.shipping_state,
          postalCode: order.shipping_postal,
          country: order.shipping_country
        },
        billingAddress: {
          streetAddress: order.billing_street,
          city: order.billing_city,
          stateProvince: order.billing_state,
          postalCode: order.billing_postal,
          country: order.billing_country
        },
        items: itemsResult.rows.map(item => ({
          id: item.id,
          product: {
            id: item.product_id,
            name: item.name,
            sku: item.sku,
            primaryImage: item.primary_image_url ? {
              url: item.primary_image_url,
              alt: item.primary_image_alt
            } : null
          },
          quantity: item.quantity,
          unitPrice: parseFloat(item.unit_price),
          totalPrice: parseFloat(item.total_price)
        })),
        createdAt: order.created_at,
        updatedAt: order.updated_at
      }
    });

  } catch (error) {
    console.error('Get order details error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin: Get all orders
app.get('/admin/orders', verifyToken, verifyAdmin, [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('status').optional().isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'])
], async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const status = req.query.status;

    let whereClause = '';
    let params = [limit, offset];
    let paramCount = 3;

    if (status) {
      whereClause = 'WHERE o.status = $3';
      params = [limit, offset, status];
      paramCount = 4;
    }

    const result = await pool.query(`
      SELECT 
        o.id, o.order_number, o.status, o.total_amount, o.payment_status,
        o.created_at, o.updated_at,
        u.first_name, u.last_name, u.email,
        COUNT(oi.id) as item_count
      FROM orders o
      JOIN users u ON o.user_id = u.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      ${whereClause}
      GROUP BY o.id, u.first_name, u.last_name, u.email
      ORDER BY o.created_at DESC
      LIMIT $1 OFFSET $2
    `, params);

    const countQuery = `SELECT COUNT(*) FROM orders o ${whereClause}`;
    const countParams = status ? [status] : [];
    const countResult = await pool.query(countQuery, countParams);
    const totalOrders = parseInt(countResult.rows[0].count);

    res.json({
      orders: result.rows.map(order => ({
        id: order.id,
        orderNumber: order.order_number,
        status: order.status,
        totalAmount: parseFloat(order.total_amount),
        paymentStatus: order.payment_status,
        customer: {
          name: `${order.first_name} ${order.last_name}`,
          email: order.email
        },
        itemCount: parseInt(order.item_count),
        createdAt: order.created_at,
        updatedAt: order.updated_at
      })),
      pagination: {
        page,
        limit,
        total: totalOrders,
        pages: Math.ceil(totalOrders / limit)
      }
    });

  } catch (error) {
    console.error('Get admin orders error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin: Update order status
app.put('/admin/orders/:orderId/status', verifyToken, verifyAdmin, [
  body('status').isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { orderId } = req.params;
    const { status } = req.body;

    const result = await pool.query(
      'UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [status, orderId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = result.rows[0];
    res.json({
      message: 'Order status updated successfully',
      order: {
        id: order.id,
        orderNumber: order.order_number,
        status: order.status,
        updatedAt: order.updated_at
      }
    });

  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🛒 Orders service running on port ${PORT}`);
});

module.exports = app; 