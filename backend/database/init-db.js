/**
 * Database Initialization Script
 *
 * This script initializes the MySQL database using the schema.sql and roca-products.sql files.
 * Run this script after setting up your MySQL instance to create and populate the database.
 */

const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

async function initializeDatabase() {
  console.log('Starting database initialization...');

  // Create connection
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 3306,
    multipleStatements: true, // Allow multiple SQL statements in one query
  });

  try {
    // Read schema SQL
    console.log('Reading schema file...');
    const schemaSQL = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');

    // Execute schema SQL
    console.log('Creating database structure...');
    await connection.query(schemaSQL);

    // Read product data SQL
    console.log('Reading product data file...');
    const productDataPath = path.join(__dirname, 'roca-products.sql');

    // Check if product data file exists
    if (fs.existsSync(productDataPath)) {
      const productDataSQL = fs.readFileSync(productDataPath, 'utf8');

      // Execute product data SQL
      console.log('Importing product data...');
      await connection.query(productDataSQL);
      console.log('Product data imported successfully.');
    } else {
      console.log('No product data file found, skipping product import.');
    }

    // Create admin user with bcrypt hashed password
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('admin123', 10);

    const adminUserQuery = `
      UPDATE users
      SET password = ?
      WHERE email = 'admin@sanitary.com' AND role = 'admin';

      INSERT IGNORE INTO users (name, email, password, role)
      VALUES ('Admin', 'admin@sanitary.com', ?, 'admin');
    `;

    await connection.query(adminUserQuery, [hashedPassword, hashedPassword]);
    console.log('Admin user created or updated successfully.');

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
      console.log('Uploads directory created.');
    }

    console.log('Database initialization completed successfully!');

  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

// Run the initialization function
initializeDatabase()
  .then(() => {
    console.log('Database setup complete.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Database setup failed:', err);
    process.exit(1);
  });
