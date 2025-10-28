const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticateToken, isAdmin } = require('../middleware/auth');

// Generate order number
function generateOrderNumber() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `ORD-${year}${month}${day}-${random}`;
}

// Get user's orders
router.get('/my-orders', authenticateToken, async (req, res) => {
  try {
    const [orders] = await db.promise().query(
      `SELECT o.*,
        (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as item_count
       FROM orders o
       WHERE o.user_id = ?
       ORDER BY o.created_at DESC`,
      [req.user.id]
    );

    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Failed to get orders' });
  }
});

// Get all orders (admin only)
router.get('/', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let query = `SELECT o.*, u.name as customer_name, u.email as customer_email,
                 (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as item_count
                 FROM orders o
                 LEFT JOIN users u ON o.user_id = u.id`;

    const params = [];

    if (status) {
      query += ' WHERE o.status = ?';
      params.push(status);
    }

    query += ' ORDER BY o.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [orders] = await db.promise().query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM orders';
    const countParams = [];

    if (status) {
      countQuery += ' WHERE status = ?';
      countParams.push(status);
    }

    const [countResult] = await db.promise().query(countQuery, countParams);
    const total = countResult[0].total;

    res.json({
      orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ error: 'Failed to get orders' });
  }
});

// Get single order
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const [orders] = await db.promise().query(
      'SELECT * FROM orders WHERE id = ? AND (user_id = ? OR ?)',
      [req.params.id, req.user.id, req.user.role === 'admin']
    );

    if (orders.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Get order items
    const [items] = await db.promise().query(
      `SELECT oi.*, p.name_fr, p.name_ar, p.image_url
       FROM order_items oi
       LEFT JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ?`,
      [req.params.id]
    );

    res.json({ ...orders[0], items });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Failed to get order' });
  }
});

// Create order from cart
router.post('/create', authenticateToken, async (req, res) => {
  const connection = await db.promise().getConnection();

  try {
    await connection.beginTransaction();

    const {
      payment_method,
      shipping_address,
      shipping_city,
      shipping_country,
      shipping_postal_code,
      notes
    } = req.body;

    // Get cart items
    const [cartItems] = await connection.query(
      `SELECT c.*, p.price, p.sale_price, p.stock_quantity
       FROM cart c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = ?`,
      [req.user.id]
    );

    if (cartItems.length === 0) {
      await connection.rollback();
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Calculate total and check stock
    let totalAmount = 0;
    for (const item of cartItems) {
      if (item.stock_quantity < item.quantity) {
        await connection.rollback();
        return res.status(400).json({
          error: `Insufficient stock for product ${item.product_id}`
        });
      }
      const price = item.sale_price || item.price;
      totalAmount += price * item.quantity;
    }

    // Create order
    const orderNumber = generateOrderNumber();
    const [orderResult] = await connection.query(
      `INSERT INTO orders (user_id, order_number, total_amount, payment_method,
        shipping_address, shipping_city, shipping_country, shipping_postal_code, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user.id, orderNumber, totalAmount, payment_method,
        shipping_address, shipping_city, shipping_country, shipping_postal_code, notes
      ]
    );

    const orderId = orderResult.insertId;

    // Add order items and update stock
    for (const item of cartItems) {
      const price = item.sale_price || item.price;

      // Add to order items
      await connection.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, item.product_id, item.quantity, price]
      );

      // Update product stock
      await connection.query(
        'UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?',
        [item.quantity, item.product_id]
      );
    }

    // Clear cart
    await connection.query('DELETE FROM cart WHERE user_id = ?', [req.user.id]);

    await connection.commit();

    res.status(201).json({
      message: 'Order created successfully',
      orderId,
      orderNumber
    });
  } catch (error) {
    await connection.rollback();
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  } finally {
    connection.release();
  }
});

// Update order status (admin only)
router.put('/:id/status', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { status, payment_status } = req.body;

    const updateFields = [];
    const params = [];

    if (status) {
      updateFields.push('status = ?');
      params.push(status);
    }

    if (payment_status) {
      updateFields.push('payment_status = ?');
      params.push(payment_status);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    params.push(req.params.id);

    await db.promise().query(
      `UPDATE orders SET ${updateFields.join(', ')} WHERE id = ?`,
      params
    );

    res.json({ message: 'Order status updated successfully' });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// Cancel order
router.post('/:id/cancel', authenticateToken, async (req, res) => {
  const connection = await db.promise().getConnection();

  try {
    await connection.beginTransaction();

    // Check if order exists and belongs to user
    const [orders] = await connection.query(
      'SELECT * FROM orders WHERE id = ? AND user_id = ? AND status = ?',
      [req.params.id, req.user.id, 'pending']
    );

    if (orders.length === 0) {
      await connection.rollback();
      return res.status(404).json({ error: 'Order not found or cannot be cancelled' });
    }

    // Get order items to restore stock
    const [items] = await connection.query(
      'SELECT * FROM order_items WHERE order_id = ?',
      [req.params.id]
    );

    // Restore stock
    for (const item of items) {
      await connection.query(
        'UPDATE products SET stock_quantity = stock_quantity + ? WHERE id = ?',
        [item.quantity, item.product_id]
      );
    }

    // Update order status
    await connection.query(
      'UPDATE orders SET status = ? WHERE id = ?',
      ['cancelled', req.params.id]
    );

    await connection.commit();

    res.json({ message: 'Order cancelled successfully' });
  } catch (error) {
    await connection.rollback();
    console.error('Cancel order error:', error);
    res.status(500).json({ error: 'Failed to cancel order' });
  } finally {
    connection.release();
  }
});

module.exports = router;
