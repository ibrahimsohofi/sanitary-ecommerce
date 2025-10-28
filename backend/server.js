const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');

// Database connection and initialization
const db = require('./config/database');

// Initialize database on startup
const initializeApp = async () => {
  try {
    console.log('Initializing database...');
    await db.initializeDatabase();
    console.log('Database initialization completed');

    // Verify connection
    const isConnected = await db.checkConnection();
    if (isConnected) {
      console.log('SQLite database is ready');
    }
  } catch (error) {
    console.error('Database initialization failed:', error);
  }
};

// Initialize the app
initializeApp();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Sanitary E-commerce API is running',
    database: 'SQLite',
    status: 'active'
  });
});

// API status route
app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    database: db.isConnected() ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}`);
});
