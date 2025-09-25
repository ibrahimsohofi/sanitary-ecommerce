const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticateToken, isAdmin, optionalAuth } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/products/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Fallback product data
const fallbackProducts = [
  {
    id: 1,
    name_fr: 'Roca In-Tank Meridian',
    name_ar: 'روكا إن-تانك مريديان',
    description_fr: 'WC avec réservoir intégré dans la cuvette, design révolutionnaire et gain d\'espace optimal.',
    description_ar: 'مرحاض مع خزان متكامل في الحوض، تصميم ثوري وتوفير مساحة مثالي.',
    price: 4850.00,
    sale_price: 4200.00,
    image_url: '/uploads/products/toilet-roca-1.jpg',
    brand: 'Roca',
    is_featured: true,
    category_id: 1,
    category_name_fr: 'Toilettes'
  },
  {
    id: 2,
    name_fr: 'Roca In-Tank Rimless',
    name_ar: 'روكا إن-تانك ريملس',
    description_fr: 'WC In-Tank sans bride pour un nettoyage optimal et une hygiène maximale.',
    description_ar: 'مرحاض إن-تانك بدون حافة للتنظيف الأمثل والنظافة القصوى.',
    price: 5200.00,
    image_url: '/uploads/products/toilet-roca-2.jpg',
    brand: 'Roca',
    is_featured: true,
    category_id: 1,
    category_name_fr: 'Toilettes'
  },
  {
    id: 3,
    name_fr: 'Lavabo Roca Meridian',
    name_ar: 'حوض روكا مريديان',
    description_fr: 'Lavabo suspendu au design épuré et moderne. Céramique de haute qualité.',
    description_ar: 'حوض معلق بتصميم نظيف وحديث. سيراميك عالي الجودة.',
    price: 2800.00,
    sale_price: 2400.00,
    image_url: '/uploads/products/sink-roca-1.jpg',
    brand: 'Roca',
    is_featured: false,
    category_id: 2,
    category_name_fr: 'Lavabos'
  },
  {
    id: 4,
    name_fr: 'Robinet Roca L20',
    name_ar: 'صنبور روكا L20',
    description_fr: 'Mitigeur de lavabo au design minimaliste avec cartouche céramique.',
    description_ar: 'خلاط حوض بتصميم بسيط مع خرطوشة سيراميك.',
    price: 1200.00,
    sale_price: 980.00,
    image_url: '/uploads/products/faucet-roca-1.jpg',
    brand: 'Roca',
    is_featured: false,
    category_id: 3,
    category_name_fr: 'Robinetterie'
  }
];

// Get all products with filters
router.get('/', async (req, res) => {
  try {
    const { category, search, min_price, max_price, sort, page = 1, limit = 12 } = req.query;
    const offset = (page - 1) * limit;

    if (db.isConnected()) {
      try {
        let query = 'SELECT p.*, c.name_fr as category_name_fr, c.name_ar as category_name_ar FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.is_active = 1';
        let countQuery = 'SELECT COUNT(*) as total FROM products p WHERE p.is_active = 1';
        const params = [];
        const countParams = [];

        if (category) {
          query += ' AND p.category_id = ?';
          countQuery += ' AND p.category_id = ?';
          params.push(category);
          countParams.push(category);
        }

        if (search) {
          query += ' AND (p.name_fr LIKE ? OR p.name_ar LIKE ? OR p.description_fr LIKE ? OR p.description_ar LIKE ?)';
          countQuery += ' AND (p.name_fr LIKE ? OR p.name_ar LIKE ? OR p.description_fr LIKE ? OR p.description_ar LIKE ?)';
          const searchTerm = `%${search}%`;
          params.push(searchTerm, searchTerm, searchTerm, searchTerm);
          countParams.push(searchTerm, searchTerm, searchTerm, searchTerm);
        }

        if (min_price) {
          query += ' AND p.price >= ?';
          countQuery += ' AND p.price >= ?';
          params.push(min_price);
          countParams.push(min_price);
        }

        if (max_price) {
          query += ' AND p.price <= ?';
          countQuery += ' AND p.price <= ?';
          params.push(max_price);
          countParams.push(max_price);
        }

        // Sorting
        if (sort === 'price_asc') {
          query += ' ORDER BY p.price ASC';
        } else if (sort === 'price_desc') {
          query += ' ORDER BY p.price DESC';
        } else if (sort === 'newest') {
          query += ' ORDER BY p.created_at DESC';
        } else {
          query += ' ORDER BY p.is_featured DESC, p.created_at DESC';
        }

        // Pagination
        query += ' LIMIT ? OFFSET ?';
        params.push(parseInt(limit), parseInt(offset));

        const products = await db.executeQuery(query, params);
        const countResult = await db.queryOne(countQuery, countParams);
        const total = countResult ? countResult.total : 0;

        return res.json({
          success: true,
          products,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / limit)
          }
        });
      } catch (error) {
        console.error('Database products error:', error);
        // Fall through to fallback
      }
    }

    // Fallback to hardcoded products
    console.log('Using fallback products data');
    let filteredProducts = [...fallbackProducts];

    // Apply filters
    if (category) {
      filteredProducts = filteredProducts.filter(p => p.category_id === parseInt(category));
    }
    if (search) {
      const searchLower = search.toLowerCase();
      filteredProducts = filteredProducts.filter(p =>
        p.name_fr.toLowerCase().includes(searchLower) ||
        p.name_ar.toLowerCase().includes(searchLower) ||
        p.description_fr.toLowerCase().includes(searchLower) ||
        p.description_ar.toLowerCase().includes(searchLower)
      );
    }
    if (min_price) {
      filteredProducts = filteredProducts.filter(p => p.price >= parseFloat(min_price));
    }
    if (max_price) {
      filteredProducts = filteredProducts.filter(p => p.price <= parseFloat(max_price));
    }

    // Apply sorting
    if (sort === 'price_asc') {
      filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sort === 'price_desc') {
      filteredProducts.sort((a, b) => b.price - a.price);
    } else {
      filteredProducts.sort((a, b) => b.is_featured - a.is_featured);
    }

    // Apply pagination
    const total = filteredProducts.length;
    const startIndex = (page - 1) * limit;
    const paginatedProducts = filteredProducts.slice(startIndex, startIndex + parseInt(limit));

    res.json({
      success: true,
      products: paginatedProducts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get products'
    });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    if (db.isConnected()) {
      try {
        const product = await db.queryOne(
          'SELECT p.*, c.name_fr as category_name_fr, c.name_ar as category_name_ar FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = ?',
          [req.params.id]
        );

        if (product) {
          // Get reviews
          const reviews = await db.executeQuery(
            'SELECT r.*, u.name as user_name FROM reviews r JOIN users u ON r.user_id = u.id WHERE r.product_id = ? ORDER BY r.created_at DESC',
            [req.params.id]
          );

          return res.json({
            success: true,
            product: { ...product, reviews: reviews || [] }
          });
        }
      } catch (error) {
        console.error('Database get product error:', error);
        // Fall through to fallback
      }
    }

    // Fallback to hardcoded products
    const product = fallbackProducts.find(p => p.id === parseInt(req.params.id));

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    res.json({
      success: true,
      product: { ...product, reviews: [] }
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get product'
    });
  }
});

// Get featured products
router.get('/featured/list', async (req, res) => {
  try {
    if (db.isConnected()) {
      try {
        const products = await db.executeQuery(
          'SELECT p.*, c.name_fr as category_name_fr, c.name_ar as category_name_ar FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.is_featured = 1 AND p.is_active = 1 ORDER BY p.created_at DESC LIMIT 4'
        );

        return res.json({
          success: true,
          products
        });
      } catch (error) {
        console.error('Database featured products error:', error);
        // Fall through to fallback
      }
    }

    // Fallback
    const featuredProducts = fallbackProducts.filter(p => p.is_featured).slice(0, 4);
    res.json({
      success: true,
      products: featuredProducts
    });
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get featured products'
    });
  }
});

// Create product (admin only)
router.post('/', authenticateToken, isAdmin, upload.single('image'), async (req, res) => {
  try {
    const {
      name_fr, name_ar, description_fr, description_ar,
      price, sale_price, sku, category_id, stock_quantity,
      brand, features_fr, features_ar, is_featured
    } = req.body;

    const image_url = req.file ? `/uploads/products/${req.file.filename}` : null;

    if (!db.isConnected()) {
      return res.status(503).json({
        success: false,
        error: 'Database not available'
      });
    }

    const result = await db.executeQuery(
      `INSERT INTO products (name_fr, name_ar, description_fr, description_ar, price, sale_price,
        sku, category_id, stock_quantity, image_url, brand, features_fr, features_ar, is_featured)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name_fr, name_ar, description_fr, description_ar,
        price, sale_price || null, sku, category_id, stock_quantity || 0,
        image_url, brand, features_fr || '[]', features_ar || '[]', is_featured || false
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      productId: result.lastID
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create product'
    });
  }
});

module.exports = router;
