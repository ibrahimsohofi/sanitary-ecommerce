/**
 * Product Image Downloader Script
 *
 * This script downloads product images for the sanitary e-commerce store.
 * It creates an uploads directory and downloads placeholder images for products.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Define the uploads directory
const uploadsDir = path.join(__dirname, '../uploads');

// Sample Roca product image URLs
const productImages = [
  {
    id: 1,
    name: 'toilet-roca-1.jpg',
    url: 'https://ext.same-assets.com/1783899293/2781443950.jpeg'
  },
  {
    id: 2,
    name: 'sink-roca-1.jpg',
    url: 'https://ext.same-assets.com/1783899293/4219792059.jpeg'
  },
  {
    id: 3,
    name: 'faucet-roca-1.jpg',
    url: 'https://ext.same-assets.com/1783899293/1040907038.jpeg'
  },
  {
    id: 4,
    name: 'shower-roca-1.jpg',
    url: 'https://ext.same-assets.com/1783899293/185599656.jpeg'
  },
  {
    id: 5,
    name: 'bathroom-roca-1.jpg',
    url: 'https://ext.same-assets.com/1783899293/2781001991.jpeg'
  },
  // Add more product images as needed
  {
    id: 6,
    name: 'toilet-roca-2.jpg',
    url: 'https://ext.same-assets.com/1783899293/2781443950.jpeg'
  },
  {
    id: 7,
    name: 'sink-roca-2.jpg',
    url: 'https://ext.same-assets.com/1783899293/4219792059.jpeg'
  },
  {
    id: 8,
    name: 'faucet-roca-2.jpg',
    url: 'https://ext.same-assets.com/1783899293/1040907038.jpeg'
  },
  {
    id: 9,
    name: 'shower-roca-2.jpg',
    url: 'https://ext.same-assets.com/1783899293/185599656.jpeg'
  },
  {
    id: 10,
    name: 'bathroom-roca-2.jpg',
    url: 'https://ext.same-assets.com/1783899293/2781001991.jpeg'
  }
];

// Function to download an image
function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(uploadsDir, filename);
    const file = fs.createWriteStream(filePath);

    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download image: ${response.statusCode} ${response.statusMessage}`));
        return;
      }

      response.pipe(file);

      file.on('finish', () => {
        file.close();
        console.log(`Downloaded: ${filename}`);
        resolve(filePath);
      });

      file.on('error', (err) => {
        fs.unlink(filePath, () => {}); // Delete the file if there was an error
        reject(err);
      });
    }).on('error', (err) => {
      fs.unlink(filePath, () => {}); // Delete the file if there was an error
      reject(err);
    });
  });
}

// Main function to download all images
async function downloadAllImages() {
  console.log('Starting image download process...');

  // Create uploads directory if it doesn't exist
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('Created uploads directory');
  }

  // Create a products directory inside uploads
  const productsDir = path.join(uploadsDir, 'products');
  if (!fs.existsSync(productsDir)) {
    fs.mkdirSync(productsDir, { recursive: true });
    console.log('Created products directory');
  }

  // Download all images
  const promises = productImages.map(image =>
    downloadImage(image.url, `products/${image.name}`)
      .catch(err => console.error(`Error downloading ${image.name}:`, err.message))
  );

  try {
    await Promise.all(promises);
    console.log('All images downloaded successfully!');

    // Create a JSON file mapping product IDs to image paths
    const imageMap = productImages.reduce((map, image) => {
      map[image.id] = `/uploads/products/${image.name}`;
      return map;
    }, {});

    fs.writeFileSync(
      path.join(uploadsDir, 'image-map.json'),
      JSON.stringify(imageMap, null, 2)
    );
    console.log('Image mapping JSON created');

  } catch (error) {
    console.error('Error downloading images:', error);
  }
}

// Run the download function
downloadAllImages()
  .then(() => {
    console.log('Image download process completed.');
  })
  .catch(err => {
    console.error('Image download process failed:', err);
  });
