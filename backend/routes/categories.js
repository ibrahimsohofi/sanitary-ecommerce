const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticateToken, isAdmin } = require('../middleware/auth');

// Fallback categories data
const fallbackCategories = [
  {
    id: 1,
    name_fr: 'Toilettes',
    name_ar: 'مراحيض',
    description_fr: 'WC et accessoires de qualité',
    description_ar: 'مراحيض وملحقاتها عالية الجودة'
  },
  {
    id: 2,
    name_fr: 'Lavabos',
    name_ar: 'أحواض',
    description_fr: 'Lavabos et vasques modernes',
    description_ar: 'أحواض الغسيل الحديثة'
  },
  {
    id: 3,
    name_fr: 'Robinetterie',
    name_ar: 'حنفيات',
    description_fr: 'Robinets et mitigeurs design',
    description_ar: 'صنابير وخلاطات تصميم'
  },
  {
    id: 4,
    name_fr: 'Douches',
    name_ar: 'دوشات',
    description_fr: 'Cabines et accessoires de douche',
    description_ar: 'كبائن الاستحمام وملحقاتها'
  }
];

// Get all categories
router.get('/', async (req, res) => {
  try {
    if (db.isConnected()) {
      try {
        const categories = await db.executeQuery(
          'SELECT * FROM categories ORDER BY name_fr'
        );

        if (categories && categories.length > 0) {
          return res.json({
            success: true,
            categories
          });
        }
      } catch (error) {
        console.error('Database categories error:', error);
        // Fall through to fallback
      }
    }

    // Fallback to hardcoded categories
    console.log('Using fallback categories data');
    res.json({
      success: true,
      categories: fallbackCategories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get categories'
    });
  }
});

// Get category with products
router.get('/:id', async (req, res) => {
  try {
    if (db.isConnected()) {
      try {
        const category = await db.queryOne(
          'SELECT * FROM categories WHERE id = ?',
          [req.params.id]
        );

        if (category) {
          const products = await db.executeQuery(
            'SELECT * FROM products WHERE category_id = ? AND is_active = 1',
            [req.params.id]
          );

          return res.json({
            success: true,
            category: { ...category, products: products || [] }
          });
        }
      } catch (error) {
        console.error('Database get category error:', error);
        // Fall through to fallback
      }
    }

    // Fallback to hardcoded data
    const category = fallbackCategories.find(c => c.id === parseInt(req.params.id));

    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }

    res.json({
      success: true,
      category: { ...category, products: [] }
    });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get category'
    });
  }
});

// Create category (admin only)
router.post('/', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { name_fr, name_ar, description_fr, description_ar, image_url, parent_id } = req.body;

    if (!db.isConnected()) {
      return res.status(503).json({
        success: false,
        error: 'Database not available'
      });
    }

    const result = await db.executeQuery(
      'INSERT INTO categories (name_fr, name_ar, description_fr, description_ar, image_url, parent_id) VALUES (?, ?, ?, ?, ?, ?)',
      [name_fr, name_ar, description_fr, description_ar, image_url, parent_id || null]
    );

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      categoryId: result.lastID
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create category'
    });
  }
});

module.exports = router;
