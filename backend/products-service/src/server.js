const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult, query } = require('express-validator');
const { Pool } = require('pg');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3002;

// Database connection
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'four_leaf_clover_shop',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, `product-${uniqueSuffix}${extension}`);
  }
});

const fileFilter = (req, file, cb) => {
  // Accept only image files
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));

// Serve uploaded images statically
app.use('/uploads', express.static(uploadsDir));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'four-leaf-clover-secret-key-change-in-production';

// Middleware to verify JWT token (optional for public routes)
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
    } catch (error) {
      // Token invalid, but continue for public routes
    }
  }
  next();
};

// Middleware to require authentication
const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};

// Middleware to verify admin role
const verifyAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admin role required.' });
  }
  next();
};

// Validation middleware
const validateProduct = [
  body('name').trim().isLength({ min: 1 }).withMessage('Product name is required'),
  body('description').optional().trim(),
  body('shortDescription').optional().trim().isLength({ max: 500 }),
  body('sku').trim().isLength({ min: 1 }).withMessage('SKU is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('categoryId').optional().isInt({ min: 1 }),
  body('material').optional().trim(),
  body('weightGrams').optional().isFloat({ min: 0 }),
  body('dimensions').optional().trim(),
  body('careInstructions').optional().trim(),
  body('isActive').optional().isBoolean(),
  body('isFeatured').optional().isBoolean()
];

const validateCategory = [
  body('name').trim().isLength({ min: 1 }).withMessage('Category name is required'),
  body('description').optional().trim(),
  body('slug').trim().isLength({ min: 1 }).withMessage('Slug is required'),
  body('imageUrl').optional().isURL()
];

// Routes

// API Documentation root route
app.get('/', (req, res) => {
  res.json({
    service: 'Four Leaf Clover - Products Service',
    version: '1.0.0',
    description: 'API service for managing jewelry products and categories',
    endpoints: {
      public: {
        'GET /': 'API documentation',
        'GET /health': 'Health check',
        'GET /products': 'Get all products (with filtering, pagination)',
        'GET /products/:id': 'Get specific product',
        'GET /categories': 'Get all categories',
        'GET /categories/:slug': 'Get category by slug'
      },
      admin: {
        'GET /admin/products': 'Get all products including inactive ones (admin only)',
        'POST /admin/products': 'Create new product (admin only)',
        'PUT /admin/products/:id': 'Update product (admin only)',
        'DELETE /admin/products/:id': 'Delete product (admin only)',
        'POST /admin/products/:id/images': 'Upload product image file (admin only)',
        'POST /admin/products/:id/images/url': 'Add product image by URL (admin only)',
        'POST /admin/categories': 'Create new category (admin only)',
        'PUT /admin/categories/:id': 'Update category (admin only)',
        'DELETE /admin/categories/:id': 'Delete category (admin only)',
        'PUT /admin/inventory/:productId': 'Update product inventory (admin only)'
      }
    },
    examples: {
      getAllProducts: '/products?page=1&limit=12',
      searchProducts: '/products?search=clover&category=necklaces',
      getProduct: '/products/1'
    },
    timestamp: new Date().toISOString()
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'products-service', timestamp: new Date().toISOString() });
});

// Get all categories
app.get('/categories', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, description, slug, image_url, created_at FROM categories ORDER BY name'
    );

    res.json({
      categories: result.rows.map(category => ({
        id: category.id,
        name: category.name,
        description: category.description,
        slug: category.slug,
        imageUrl: category.image_url,
        createdAt: category.created_at
      }))
    });

  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get category by slug
app.get('/categories/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
    const result = await pool.query(
      'SELECT id, name, description, slug, image_url, created_at FROM categories WHERE slug = $1',
      [slug]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const category = result.rows[0];
    res.json({
      category: {
        id: category.id,
        name: category.name,
        description: category.description,
        slug: category.slug,
        imageUrl: category.image_url,
        createdAt: category.created_at
      }
    });

  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all products with filtering and pagination
app.get('/products', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('category').optional().trim(),
  query('search').optional().trim(),
  query('minPrice').optional().isFloat({ min: 0 }),
  query('maxPrice').optional().isFloat({ min: 0 }),
  query('featured').optional().isBoolean(),
  query('sortBy').optional().isIn(['name', 'price', 'created_at']),
  query('sortOrder').optional().isIn(['asc', 'desc'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const offset = (page - 1) * limit;
    const search = req.query.search;
    const category = req.query.category;
    const minPrice = req.query.minPrice;
    const maxPrice = req.query.maxPrice;
    const featured = req.query.featured;
    const sortBy = req.query.sortBy || 'created_at';
    const sortOrder = req.query.sortOrder || 'desc';

    let whereConditions = ['p.is_active = true'];
    let params = [];
    let paramCount = 1;

    if (search) {
      whereConditions.push(`(p.name ILIKE $${paramCount} OR p.description ILIKE $${paramCount} OR p.short_description ILIKE $${paramCount})`);
      params.push(`%${search}%`);
      paramCount++;
    }

    if (category) {
      whereConditions.push(`c.slug = $${paramCount}`);
      params.push(category);
      paramCount++;
    }

    if (minPrice) {
      whereConditions.push(`p.price >= $${paramCount}`);
      params.push(minPrice);
      paramCount++;
    }

    if (maxPrice) {
      whereConditions.push(`p.price <= $${paramCount}`);
      params.push(maxPrice);
      paramCount++;
    }

    if (featured === 'true') {
      whereConditions.push('p.is_featured = true');
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
    
    // Get products with category info and primary image
    const productsQuery = `
      SELECT 
        p.id, p.name, p.description, p.short_description, p.sku, p.price, 
        p.material, p.weight_grams, p.dimensions, p.care_instructions,
        p.is_featured, p.created_at, p.updated_at,
        c.name as category_name, c.slug as category_slug,
        pi.image_url as primary_image_url, pi.alt_text as primary_image_alt,
        i.quantity_available
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = true
      LEFT JOIN inventory i ON p.id = i.product_id
      ${whereClause}
      ORDER BY p.${sortBy} ${sortOrder.toUpperCase()}
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `;

    params.push(limit, offset);
    const result = await pool.query(productsQuery, params);

    // Get total count for pagination
    const countQuery = `
      SELECT COUNT(DISTINCT p.id) 
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ${whereClause}
    `;
    const countResult = await pool.query(countQuery, params.slice(0, -2));
    const totalProducts = parseInt(countResult.rows[0].count);

    res.json({
      products: result.rows.map(product => ({
        id: product.id,
        name: product.name,
        description: product.description,
        shortDescription: product.short_description,
        sku: product.sku,
        price: parseFloat(product.price),
        material: product.material,
        weightGrams: product.weight_grams ? parseFloat(product.weight_grams) : null,
        dimensions: product.dimensions,
        careInstructions: product.care_instructions,
        isFeatured: product.is_featured,
        category: product.category_name ? {
          name: product.category_name,
          slug: product.category_slug
        } : null,
        primaryImage: product.primary_image_url ? {
          url: product.primary_image_url.startsWith('http') ? product.primary_image_url : `http://${req.get('host') || 'localhost:3002'}${product.primary_image_url}`,
          alt: product.primary_image_alt
        } : null,
        quantityAvailable: product.quantity_available || 0,
        createdAt: product.created_at,
        updatedAt: product.updated_at
      })),
      pagination: {
        page,
        limit,
        total: totalProducts,
        pages: Math.ceil(totalProducts / limit)
      },
      filters: {
        search,
        category,
        minPrice: minPrice ? parseFloat(minPrice) : null,
        maxPrice: maxPrice ? parseFloat(maxPrice) : null,
        featured: featured === 'true',
        sortBy,
        sortOrder
      }
    });

  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get product by ID
app.get('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Get product with category info
    const productResult = await pool.query(`
      SELECT 
        p.id, p.name, p.description, p.short_description, p.sku, p.price,
        p.material, p.weight_grams, p.dimensions, p.care_instructions,
        p.is_active, p.is_featured, p.created_at, p.updated_at,
        c.id as category_id, c.name as category_name, c.slug as category_slug,
        i.quantity_available, i.quantity_reserved
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN inventory i ON p.id = i.product_id
      WHERE p.id = $1 AND p.is_active = true
    `, [id]);

    if (productResult.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const product = productResult.rows[0];

    // Get product images
    const imagesResult = await pool.query(
      'SELECT id, image_url, alt_text, sort_order, is_primary FROM product_images WHERE product_id = $1 ORDER BY sort_order, id',
      [id]
    );

    // Get product reviews
    const reviewsResult = await pool.query(`
      SELECT 
        r.id, r.rating, r.title, r.comment, r.is_verified_purchase, r.created_at,
        u.first_name, u.last_name
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.product_id = $1 AND r.is_approved = true
      ORDER BY r.created_at DESC
      LIMIT 10
    `, [id]);

    // Calculate average rating
    const ratingResult = await pool.query(
      'SELECT AVG(rating) as avg_rating, COUNT(*) as review_count FROM reviews WHERE product_id = $1 AND is_approved = true',
      [id]
    );

    res.json({
      product: {
        id: product.id,
        name: product.name,
        description: product.description,
        shortDescription: product.short_description,
        sku: product.sku,
        price: parseFloat(product.price),
        material: product.material,
        weightGrams: product.weight_grams ? parseFloat(product.weight_grams) : null,
        dimensions: product.dimensions,
        careInstructions: product.care_instructions,
        isActive: product.is_active,
        isFeatured: product.is_featured,
        category: product.category_id ? {
          id: product.category_id,
          name: product.category_name,
          slug: product.category_slug
        } : null,
        images: imagesResult.rows.map(image => ({
          id: image.id,
          url: image.image_url.startsWith('http') ? image.image_url : `http://${req.get('host') || 'localhost:3002'}${image.image_url}`,
          alt: image.alt_text,
          sortOrder: image.sort_order,
          isPrimary: image.is_primary
        })),
        inventory: {
          quantityAvailable: product.quantity_available || 0,
          quantityReserved: product.quantity_reserved || 0
        },
        reviews: reviewsResult.rows.map(review => ({
          id: review.id,
          rating: review.rating,
          title: review.title,
          comment: review.comment,
          isVerifiedPurchase: review.is_verified_purchase,
          reviewerName: `${review.first_name} ${review.last_name.charAt(0)}.`,
          createdAt: review.created_at
        })),
        rating: {
          average: ratingResult.rows[0].avg_rating ? parseFloat(ratingResult.rows[0].avg_rating) : 0,
          count: parseInt(ratingResult.rows[0].review_count)
        },
        createdAt: product.created_at,
        updatedAt: product.updated_at
      }
    });

  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin: Get all products (including inactive ones)
app.get('/admin/products', verifyToken, verifyAdmin, [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 1000 }),
  query('search').optional().trim(),
  query('category').optional().trim(),
  query('status').optional().trim(),
  query('sortBy').optional().isIn(['name', 'price', 'created_at']),
  query('sortOrder').optional().isIn(['asc', 'desc'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const offset = (page - 1) * limit;
    const search = req.query.search;
    const category = req.query.category;
    const status = req.query.status;
    const sortBy = req.query.sortBy || 'created_at';
    const sortOrder = req.query.sortOrder || 'desc';

    let whereConditions = []; // No active filter for admin
    let params = [];
    let paramCount = 1;

    if (search) {
      whereConditions.push(`(p.name ILIKE $${paramCount} OR p.description ILIKE $${paramCount} OR p.short_description ILIKE $${paramCount} OR p.sku ILIKE $${paramCount})`);
      params.push(`%${search}%`);
      paramCount++;
    }

    if (category) {
      whereConditions.push(`c.slug = $${paramCount}`);
      params.push(category);
      paramCount++;
    }

    if (status) {
      if (status === 'active') {
        whereConditions.push('p.is_active = true');
      } else if (status === 'inactive') {
        whereConditions.push('p.is_active = false');
      }
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
    
    // Get products with category info and primary image
    const productsQuery = `
      SELECT 
        p.id, p.name, p.description, p.short_description, p.sku, p.price, 
        p.category_id, p.material, p.weight_grams, p.dimensions, p.care_instructions,
        p.is_active, p.is_featured, p.created_at, p.updated_at,
        c.name as category_name, c.slug as category_slug,
        pi.image_url as primary_image_url, pi.alt_text as primary_image_alt,
        i.quantity_available
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = true
      LEFT JOIN inventory i ON p.id = i.product_id
      ${whereClause}
      ORDER BY p.${sortBy} ${sortOrder.toUpperCase()}
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `;

    params.push(limit, offset);
    const result = await pool.query(productsQuery, params);

    // Get total count for pagination
    const countQuery = `
      SELECT COUNT(DISTINCT p.id) 
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ${whereClause}
    `;
    const countResult = await pool.query(countQuery, params.slice(0, -2));
    const totalProducts = parseInt(countResult.rows[0].count);

    // Helper function to get full image URL
    const getFullImageUrl = (imageUrl) => {
      if (!imageUrl) return null;
      if (imageUrl.startsWith('http')) {
        return imageUrl; // Already a full URL
      }
      // Convert relative URL to full URL
      return `${req.protocol}://${req.get('host')}${imageUrl}`;
    };

    res.json({
      products: result.rows.map(product => ({
        id: product.id,
        name: product.name,
        description: product.description,
        shortDescription: product.short_description,
        sku: product.sku,
        price: parseFloat(product.price),
        categoryId: product.category_id,
        categoryName: product.category_name, // Added for admin convenience
        material: product.material,
        weightGrams: product.weight_grams ? parseFloat(product.weight_grams) : null,
        dimensions: product.dimensions,
        careInstructions: product.care_instructions,
        isActive: product.is_active,
        isFeatured: product.is_featured,
        category: product.category_name ? {
          name: product.category_name,
          slug: product.category_slug
        } : null,
        primaryImage: product.primary_image_url ? {
          url: getFullImageUrl(product.primary_image_url),
          alt: product.primary_image_alt
        } : null,
        quantityAvailable: product.quantity_available || 0,
        createdAt: product.created_at,
        updatedAt: product.updated_at
      })),
      pagination: {
        page,
        limit,
        total: totalProducts,
        pages: Math.ceil(totalProducts / limit)
      },
      filters: {
        search,
        category,
        status,
        sortBy,
        sortOrder
      }
    });

  } catch (error) {
    console.error('Get admin products error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin: Create new product
app.post('/admin/products', verifyToken, verifyAdmin, validateProduct, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name, description, shortDescription, sku, price, categoryId,
      material, weightGrams, dimensions, careInstructions,
      isActive = true, isFeatured = false, quantityAvailable = 0
    } = req.body;

    // Check if SKU already exists
    const existingSku = await pool.query('SELECT id FROM products WHERE sku = $1', [sku]);
    if (existingSku.rows.length > 0) {
      return res.status(400).json({ error: 'SKU already exists' });
    }

    const result = await pool.query(`
      INSERT INTO products (
        name, description, short_description, sku, price, category_id,
        material, weight_grams, dimensions, care_instructions, is_active, is_featured
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `, [name, description, shortDescription, sku, price, categoryId, material, weightGrams, dimensions, careInstructions, isActive, isFeatured]);

    const product = result.rows[0];

    // Initialize inventory with specified quantity
    await pool.query(
      'INSERT INTO inventory (product_id, quantity_available, quantity_reserved) VALUES ($1, $2, 0)',
      [product.id, quantityAvailable]
    );

    res.status(201).json({
      message: 'Product created successfully',
      product: {
        id: product.id,
        name: product.name,
        description: product.description,
        shortDescription: product.short_description,
        sku: product.sku,
        price: parseFloat(product.price),
        categoryId: product.category_id,
        material: product.material,
        weightGrams: product.weight_grams ? parseFloat(product.weight_grams) : null,
        dimensions: product.dimensions,
        careInstructions: product.care_instructions,
        isActive: product.is_active,
        isFeatured: product.is_featured,
        createdAt: product.created_at
      }
    });

  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin: Update product
app.put('/admin/products/:id', verifyToken, verifyAdmin, validateProduct, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const {
      name, description, shortDescription, sku, price, categoryId,
      material, weightGrams, dimensions, careInstructions, isActive, isFeatured
    } = req.body;

    // Check if SKU already exists for different product
    const existingSku = await pool.query('SELECT id FROM products WHERE sku = $1 AND id != $2', [sku, id]);
    if (existingSku.rows.length > 0) {
      return res.status(400).json({ error: 'SKU already exists' });
    }

    const result = await pool.query(`
      UPDATE products SET
        name = $1, description = $2, short_description = $3, sku = $4, price = $5,
        category_id = $6, material = $7, weight_grams = $8, dimensions = $9,
        care_instructions = $10, is_active = $11, is_featured = $12,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $13
      RETURNING *
    `, [name, description, shortDescription, sku, price, categoryId, material, weightGrams, dimensions, careInstructions, isActive, isFeatured, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const product = result.rows[0];
    res.json({
      message: 'Product updated successfully',
      product: {
        id: product.id,
        name: product.name,
        description: product.description,
        shortDescription: product.short_description,
        sku: product.sku,
        price: parseFloat(product.price),
        categoryId: product.category_id,
        material: product.material,
        weightGrams: product.weight_grams ? parseFloat(product.weight_grams) : null,
        dimensions: product.dimensions,
        careInstructions: product.care_instructions,
        isActive: product.is_active,
        isFeatured: product.is_featured,
        updatedAt: product.updated_at
      }
    });

  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin: Delete product
app.delete('/admin/products/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING id', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });

  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin: Update inventory
app.put('/admin/inventory/:productId', verifyToken, verifyAdmin, [
  body('quantityAvailable').isInt({ min: 0 }).withMessage('Quantity available must be a non-negative integer'),
  body('reorderLevel').optional().isInt({ min: 0 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { productId } = req.params;
    const { quantityAvailable, reorderLevel } = req.body;

    const updates = ['quantity_available = $1', 'updated_at = CURRENT_TIMESTAMP'];
    const values = [quantityAvailable];
    let paramCount = 2;

    if (reorderLevel !== undefined) {
      updates.push(`reorder_level = $${paramCount++}`);
      values.push(reorderLevel);
    }

    values.push(productId);

    const result = await pool.query(`
      UPDATE inventory SET ${updates.join(', ')}
      WHERE product_id = $${paramCount}
      RETURNING *
    `, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product inventory not found' });
    }

    const inventory = result.rows[0];
    res.json({
      message: 'Inventory updated successfully',
      inventory: {
        productId: inventory.product_id,
        quantityAvailable: inventory.quantity_available,
        quantityReserved: inventory.quantity_reserved,
        reorderLevel: inventory.reorder_level,
        updatedAt: inventory.updated_at
      }
    });

  } catch (error) {
    console.error('Update inventory error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin: Create category
app.post('/admin/categories', verifyToken, verifyAdmin, validateCategory, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, slug, imageUrl } = req.body;

    // Check if slug already exists
    const existingSlug = await pool.query('SELECT id FROM categories WHERE slug = $1', [slug]);
    if (existingSlug.rows.length > 0) {
      return res.status(400).json({ error: 'Slug already exists' });
    }

    const result = await pool.query(
      'INSERT INTO categories (name, description, slug, image_url) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, description, slug, imageUrl]
    );

    const category = result.rows[0];
    res.status(201).json({
      message: 'Category created successfully',
      category: {
        id: category.id,
        name: category.name,
        description: category.description,
        slug: category.slug,
        imageUrl: category.image_url,
        createdAt: category.created_at
      }
    });

  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin: Upload product image
app.post('/admin/products/:id/images', verifyToken, verifyAdmin, upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { altText, isPrimary = false } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Check if product exists
    const productCheck = await pool.query('SELECT id FROM products WHERE id = $1', [id]);
    if (productCheck.rows.length === 0) {
      // Delete uploaded file if product doesn't exist
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ error: 'Product not found' });
    }

    // If this is set as primary, remove primary flag from other images
    if (isPrimary === 'true' || isPrimary === true) {
      await pool.query('UPDATE product_images SET is_primary = false WHERE product_id = $1', [id]);
    }

    // Get next sort order
    const sortResult = await pool.query('SELECT COALESCE(MAX(sort_order), -1) + 1 as next_order FROM product_images WHERE product_id = $1', [id]);
    const sortOrder = sortResult.rows[0].next_order;

    // Construct image URL (relative to the service)
    const imageUrl = `/uploads/${req.file.filename}`;

    // Insert image record
    const result = await pool.query(`
      INSERT INTO product_images (product_id, image_url, alt_text, sort_order, is_primary)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [id, imageUrl, altText || req.file.originalname, sortOrder, isPrimary === 'true' || isPrimary === true]);

    const image = result.rows[0];

    res.status(201).json({
      message: 'Image uploaded successfully',
      image: {
        id: image.id,
        url: image.image_url,
        alt: image.alt_text,
        sortOrder: image.sort_order,
        isPrimary: image.is_primary
      }
    });

  } catch (error) {
    // Clean up uploaded file on error
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    console.error('Upload image error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin: Add product image by URL
app.post('/admin/products/:id/images/url', verifyToken, verifyAdmin, [
  body('imageUrl').isURL().withMessage('Valid image URL is required'),
  body('altText').optional().trim(),
  body('isPrimary').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { imageUrl, altText, isPrimary = false } = req.body;

    // Check if product exists
    const productCheck = await pool.query('SELECT id FROM products WHERE id = $1', [id]);
    if (productCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // If this is set as primary, remove primary flag from other images
    if (isPrimary) {
      await pool.query('UPDATE product_images SET is_primary = false WHERE product_id = $1', [id]);
    }

    // Get next sort order
    const sortResult = await pool.query('SELECT COALESCE(MAX(sort_order), -1) + 1 as next_order FROM product_images WHERE product_id = $1', [id]);
    const sortOrder = sortResult.rows[0].next_order;

    // Insert image record
    const result = await pool.query(`
      INSERT INTO product_images (product_id, image_url, alt_text, sort_order, is_primary)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [id, imageUrl, altText || 'Product image', sortOrder, isPrimary]);

    const image = result.rows[0];

    res.status(201).json({
      message: 'Image added successfully',
      image: {
        id: image.id,
        url: image.image_url,
        alt: image.alt_text,
        sortOrder: image.sort_order,
        isPrimary: image.is_primary
      }
    });

  } catch (error) {
    console.error('Add image URL error:', error);
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
  console.log(`🛍️ Products service running on port ${PORT}`);
});

module.exports = app; 