const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../config/database');
const { authenticateToken, generateToken } = require('../middleware/auth');
const fs = require('fs');
const path = require('path');

// Local user storage for when database is unavailable
let localUsers = [];
const LOCAL_USERS_FILE = path.join(__dirname, '../data/local-users.json');

// Load local users if file exists
try {
  if (fs.existsSync(LOCAL_USERS_FILE)) {
    const data = fs.readFileSync(LOCAL_USERS_FILE, 'utf8');
    localUsers = JSON.parse(data);
  } else {
    // Create directory if it doesn't exist
    const dataDir = path.join(__dirname, '../data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Initialize with admin user
    localUsers = [{
      id: 1,
      name: 'Admin',
      email: 'admin@sanitary.com',
      password: '$2a$10$GaXYnZYV7mMh7/YH94TRBezRHlj/fTUjjjQzwXMOl3F1Bz1GpJ1z2', // admin123
      role: 'admin',
      language: 'fr',
      created_at: new Date().toISOString()
    }];
    fs.writeFileSync(LOCAL_USERS_FILE, JSON.stringify(localUsers, null, 2));
  }
} catch (error) {
  console.error('Error loading local users:', error);
  localUsers = [];
}

// Save local users
const saveLocalUsers = () => {
  try {
    fs.writeFileSync(LOCAL_USERS_FILE, JSON.stringify(localUsers, null, 2));
  } catch (error) {
    console.error('Error saving local users:', error);
  }
};

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, address, city, country, postal_code, language = 'fr' } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email and password'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    // Check if database is connected
    if (db.isConnected()) {
      try {
        // Check if user exists
        const existingUsers = await db.executeQuery(
          'SELECT id FROM users WHERE email = ?',
          [email]
        );

        if (existingUsers && existingUsers.length > 0) {
          return res.status(400).json({
            success: false,
            message: 'Email already registered'
          });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user
        const result = await db.executeQuery(
          'INSERT INTO users (name, email, password, phone, address, city, country, postal_code, language) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [name, email, hashedPassword, phone || null, address || null, city || null, country || null, postal_code || null, language]
        );

        const userId = result.insertId;

        // Generate token
        const token = generateToken({
          id: userId,
          email,
          role: 'customer'
        });

        return res.status(201).json({
          success: true,
          message: 'Registration successful',
          token,
          user: {
            id: userId,
            name,
            email,
            role: 'customer',
            language
          }
        });
      } catch (dbError) {
        console.error('Database registration error:', dbError);
        // Fall through to local registration
      }
    }

    // Local registration (fallback when database is unavailable)
    console.log('Using local registration as fallback');

    // Check if user exists locally
    const existingUser = localUsers.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
      id: localUsers.length > 0 ? Math.max(...localUsers.map(u => u.id)) + 1 : 1,
      name,
      email,
      password: hashedPassword,
      phone: phone || null,
      address: address || null,
      city: city || null,
      country: country || null,
      postal_code: postal_code || null,
      role: 'customer',
      language,
      created_at: new Date().toISOString()
    };

    localUsers.push(newUser);
    saveLocalUsers();

    // Generate token
    const token = generateToken({
      id: newUser.id,
      email,
      role: 'customer'
    });

    return res.status(201).json({
      success: true,
      message: 'Registration successful (using local storage)',
      token,
      user: {
        id: newUser.id,
        name,
        email,
        role: 'customer',
        language
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed. Please try again.'
    });
  }
});

/**
 * @route POST /api/auth/login
 * @desc Login user and return JWT token
 * @access Public
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    let user = null;

    // Check if database is connected
    if (db.isConnected()) {
      try {
        // Get user from database
        const users = await db.executeQuery(
          'SELECT * FROM users WHERE email = ?',
          [email]
        );

        if (users && users.length > 0) {
          user = users[0];
        }
      } catch (dbError) {
        console.error('Database login error:', dbError);
        // Fall through to local login
      }
    }

    // If user not found in database, try local users
    if (!user) {
      console.log('User not found in database, trying local users');
      user = localUsers.find(u => u.email === email);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        language: user.language || 'fr'
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed. Please try again.'
    });
  }
});

/**
 * @route GET /api/auth/me
 * @desc Get current user data
 * @access Private
 */
router.get('/me', authenticateToken, async (req, res) => {
  try {
    let user = null;

    // Check if database is connected
    if (db.isConnected()) {
      try {
        const users = await db.executeQuery(
          'SELECT id, name, email, phone, address, city, country, postal_code, role, language FROM users WHERE id = ?',
          [req.user.id]
        );

        if (users && users.length > 0) {
          user = users[0];
        }
      } catch (dbError) {
        console.error('Database get user error:', dbError);
        // Fall through to local user
      }
    }

    // If user not found in database, try local users
    if (!user) {
      console.log('User not found in database, trying local users');
      const localUser = localUsers.find(u => u.id === req.user.id);

      if (localUser) {
        // Remove password from response
        const { password, ...userWithoutPassword } = localUser;
        user = userWithoutPassword;
      }
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user data'
    });
  }
});

/**
 * @route PUT /api/auth/profile
 * @desc Update user profile
 * @access Private
 */
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { name, phone, address, city, country, postal_code, language } = req.body;

    // Validate input
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Name is required'
      });
    }

    // Check if database is connected
    if (db.isConnected()) {
      try {
        await db.executeQuery(
          'UPDATE users SET name = ?, phone = ?, address = ?, city = ?, country = ?, postal_code = ?, language = ? WHERE id = ?',
          [name, phone || null, address || null, city || null, country || null, postal_code || null, language || 'fr', req.user.id]
        );

        return res.json({
          success: true,
          message: 'Profile updated successfully'
        });
      } catch (dbError) {
        console.error('Database update profile error:', dbError);
        // Fall through to local update
      }
    }

    // Update local user
    console.log('Using local user update as fallback');
    const userIndex = localUsers.findIndex(u => u.id === req.user.id);

    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update user data
    localUsers[userIndex] = {
      ...localUsers[userIndex],
      name,
      phone: phone || null,
      address: address || null,
      city: city || null,
      country: country || null,
      postal_code: postal_code || null,
      language: language || 'fr'
    };

    saveLocalUsers();

    res.json({
      success: true,
      message: 'Profile updated successfully (using local storage)'
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
});

/**
 * @route PUT /api/auth/password
 * @desc Update user password
 * @access Private
 */
router.put('/password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters'
      });
    }

    let user = null;

    // Check if database is connected
    if (db.isConnected()) {
      try {
        // Get user with password
        const users = await db.executeQuery(
          'SELECT id, password FROM users WHERE id = ?',
          [req.user.id]
        );

        if (users && users.length > 0) {
          user = users[0];

          // Verify current password
          const isMatch = await bcrypt.compare(currentPassword, user.password);
          if (!isMatch) {
            return res.status(400).json({
              success: false,
              message: 'Current password is incorrect'
            });
          }

          // Hash new password
          const hashedPassword = await bcrypt.hash(newPassword, 10);

          // Update password
          await db.executeQuery(
            'UPDATE users SET password = ? WHERE id = ?',
            [hashedPassword, req.user.id]
          );

          return res.json({
            success: true,
            message: 'Password updated successfully'
          });
        }
      } catch (dbError) {
        console.error('Database password update error:', dbError);
        // Fall through to local update
      }
    }

    // Update local user password
    console.log('Using local password update as fallback');
    const userIndex = localUsers.findIndex(u => u.id === req.user.id);

    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, localUsers[userIndex].password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    localUsers[userIndex].password = hashedPassword;
    saveLocalUsers();

    res.json({
      success: true,
      message: 'Password updated successfully (using local storage)'
    });
  } catch (error) {
    console.error('Password update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update password'
    });
  }
});

module.exports = router;
