/**
 * Backend Starter Script
 *
 * This script initializes the backend server with proper error handling,
 * database setup, and directory creation.
 */

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const { spawn } = require('child_process');

// Load environment variables
dotenv.config();

// Create necessary directories
const createDirectories = () => {
  const directories = [
    path.join(__dirname, 'uploads'),
    path.join(__dirname, 'uploads', 'products'),
    path.join(__dirname, 'data'),
    path.join(__dirname, 'logs')
  ];

  directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
  });
};

// Run database initialization if requested
const initializeDatabase = async () => {
  if (process.argv.includes('--init-db')) {
    console.log('Initializing database...');
    try {
      require('./database/init-db');
      console.log('Database initialization started.');
      return true;
    } catch (error) {
      console.error('Failed to initialize database:', error);
      console.log('Continuing with server startup...');
    }
  }
  return false;
};

// Download product images if requested
const downloadImages = async () => {
  if (process.argv.includes('--download-images')) {
    console.log('Downloading product images...');
    try {
      require('./scripts/download-images');
      console.log('Image download started.');
      return true;
    } catch (error) {
      console.error('Failed to download images:', error);
      console.log('Continuing with server startup...');
    }
  }
  return false;
};

// Start the server
const startServer = () => {
  // Don't start server if only running initialization tasks
  if ((process.argv.includes('--init-db') || process.argv.includes('--download-images')) &&
      !process.argv.includes('--with-server')) {
    return;
  }

  console.log('Starting server...');

  // Set NODE_ENV
  const nodeEnv = process.env.NODE_ENV || 'development';

  // Use node directly instead of nodemon to avoid dependency issues
  const serverProcess = spawn('node', ['server.js'], { stdio: 'inherit' });

  serverProcess.on('error', (error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });

  process.on('SIGINT', () => {
    console.log('Shutting down server...');
    serverProcess.kill('SIGINT');
    process.exit(0);
  });
};

// Main execution flow
(async () => {
  try {
    // Create required directories
    createDirectories();

    // Run optional initializations
    const dbInitStarted = await initializeDatabase();
    const imageDownloadStarted = await downloadImages();

    // If only running initialization tasks, wait for them to complete before exiting
    if ((dbInitStarted || imageDownloadStarted) &&
        !process.argv.includes('--with-server')) {
      console.log('Initialization tasks started. Server will not be started.');
      // Add a small delay to allow initialization scripts to output their logs
      setTimeout(() => {
        console.log('You can start the server later with: node start.js');
      }, 1000);
      return;
    }

    // Start the server if no initialization tasks or --with-server flag
    startServer();
  } catch (error) {
    console.error('Error during startup:', error);
    process.exit(1);
  }
})();
