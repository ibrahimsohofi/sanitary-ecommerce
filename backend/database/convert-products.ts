import { products } from '../../src/data/products';
import * as fs from 'fs';
import * as path from 'path';

// Convert products to JSON and save
const productsJson = JSON.stringify(products, null, 2);
const outputPath = path.join(__dirname, 'products-data.json');

fs.writeFileSync(outputPath, productsJson);

console.log(`✅ Converted ${products.length} products to JSON`);
console.log(`📄 File saved to: ${outputPath}`);
