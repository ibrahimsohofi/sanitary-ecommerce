const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Database file path
const dbPath = path.join(__dirname, '../data/sanitary_ecommerce.db');

// Ensure data directory exists
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log('Data directory created.');
}

// Create database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database successfully');
    // Enable foreign keys
    db.run('PRAGMA foreign_keys = ON');
  }
});

// Database connection status tracker
let isConnected = true;

// Initialize database with schema
const initializeDatabase = () => {
  return new Promise((resolve, reject) => {
    // Try SQLite-specific schema first
    const sqliteSchemaPath = path.join(__dirname, '../database/schema-sqlite.sql');
    const schemaPath = fs.existsSync(sqliteSchemaPath)
      ? sqliteSchemaPath
      : path.join(__dirname, '../database/schema.sql');

    if (fs.existsSync(schemaPath)) {
      const schema = fs.readFileSync(schemaPath, 'utf8');

      // Split into individual statements
      const statements = schema.split(';').filter(stmt => stmt.trim());

      let completed = 0;
      const total = statements.length;

      if (total === 0) {
        console.log('No SQL statements found in schema');
        resolve();
        return;
      }

      statements.forEach((statement, index) => {
        if (statement.trim()) {
          db.run(statement.trim(), (err) => {
            if (err && !err.message.includes('already exists')) {
              console.error(`Error executing statement ${index + 1}:`, err.message);
            }
            completed++;
            if (completed === total) {
              console.log('Database schema initialized successfully');
              resolve();
            }
          });
        } else {
          completed++;
          if (completed === total) resolve();
        }
      });
    } else {
      console.log('Schema file not found, skipping initialization');
      resolve();
    }
  });
};

// Wrapper for database queries
const executeQuery = (query, params = []) => {
  return new Promise((resolve, reject) => {
    if (query.trim().toUpperCase().startsWith('SELECT')) {
      db.all(query, params, (err, rows) => {
        if (err) {
          console.error('Database query error:', err.message);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    } else {
      db.run(query, params, function(err) {
        if (err) {
          console.error('Database query error:', err.message);
          reject(err);
        } else {
          resolve({
            lastID: this.lastID,
            changes: this.changes,
            affectedRows: this.changes
          });
        }
      });
    }
  });
};

// Get single row
const queryOne = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(query, params, (err, row) => {
      if (err) {
        console.error('Database query error:', err.message);
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

// Check connection function
const checkConnection = async () => {
  try {
    await executeQuery('SELECT 1');
    console.log('Database connection verified');
    return true;
  } catch (error) {
    console.error('Database connection check failed:', error.message);
    isConnected = false;
    return false;
  }
};

// Create uploads directory
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Uploads directory created.');
}

module.exports = {
  db,
  executeQuery,
  queryOne,
  checkConnection,
  initializeDatabase,
  isConnected: () => isConnected
};
