const jwt = require('jsonwebtoken');
const db = require('../config/database');

/**
 * Middleware to authenticate JWT token and add user to request
 */
const authenticateToken = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please login.'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

      // Check if token is about to expire (less than 1 day left)
      const tokenExp = new Date(decoded.exp * 1000);
      const now = new Date();
      const oneDayFromNow = new Date(now);
      oneDayFromNow.setDate(now.getDate() + 1);

      // Get user from database
      if (db.isConnected()) {
        try {
          const query = 'SELECT id, name, email, role FROM users WHERE id = ?';
          const users = await db.executeQuery(query, [decoded.id]);

          if (users && users.length > 0) {
            // Add user info to request
            req.user = users[0];
          } else {
            // User not found in database
            return res.status(401).json({
              success: false,
              message: 'User no longer exists in the system.'
            });
          }
        } catch (dbError) {
          // If database is not available, fallback to token data
          console.warn('Database not available, using token data for authentication');
          req.user = decoded;
        }
      } else {
        // Database not connected, use token data
        req.user = decoded;
      }

      // If token is about to expire, generate a new one
      if (tokenExp < oneDayFromNow) {
        const newToken = generateToken({
          id: req.user.id,
          role: req.user.role
        });

        // Send new token in response header
        res.setHeader('X-New-Token', newToken);
      }

      next();
    } catch (jwtError) {
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Your session has expired. Please login again.'
        });
      }

      return res.status(401).json({
        success: false,
        message: 'Invalid authentication token. Please login again.'
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication error. Please try again.'
    });
  }
};

/**
 * Middleware to check if user is an admin
 */
const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. Please login.'
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required. You do not have permission to perform this action.'
    });
  }

  next();
};

/**
 * Generate JWT token for user
 */
const generateToken = (userData) => {
  return jwt.sign(
    userData,
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

/**
 * Optional authentication - doesn't require auth but adds user to request if token exists
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return next();
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

      if (db.isConnected()) {
        try {
          const query = 'SELECT id, name, email, role FROM users WHERE id = ?';
          const users = await db.executeQuery(query, [decoded.id]);

          if (users && users.length > 0) {
            req.user = users[0];
          }
        } catch (dbError) {
          req.user = decoded;
        }
      } else {
        req.user = decoded;
      }
    } catch (jwtError) {
      // Invalid token but we don't fail the request
      console.warn('Invalid token in optionalAuth:', jwtError.message);
    }

    next();
  } catch (error) {
    console.error('Optional auth middleware error:', error);
    next();
  }
};

module.exports = {
  authenticateToken,
  isAdmin,
  generateToken,
  optionalAuth
};
