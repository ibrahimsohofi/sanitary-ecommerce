const db = require('../config/database');
const bcrypt = require('bcryptjs');

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting comprehensive database seeding...\n');

    // Initialize database schema first
    console.log('🔧 Initializing database schema...');
    await db.initializeDatabase();
    console.log('✅ Database schema initialized\n');

    // Wait a bit for database to be ready
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Create admin user
    console.log('👤 Creating admin user...');
    const adminPassword = await bcrypt.hash('admin123', 10);
    try {
      await db.executeQuery(`
        INSERT INTO users (name, email, password, role, language)
        VALUES (?, ?, ?, ?, ?)
      `, ['Admin', 'admin@sanitary.com', adminPassword, 'admin', 'fr']);
      console.log('✅ Admin user created (email: admin@sanitary.com, password: admin123)\n');
    } catch (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        console.log('ℹ️  Admin user already exists\n');
      } else {
        throw err;
      }
    }

    // Create test user
    console.log('👤 Creating test user...');
    const userPassword = await bcrypt.hash('user123', 10);
    try {
      await db.executeQuery(`
        INSERT INTO users (name, email, password, role, language)
        VALUES (?, ?, ?, ?, ?)
      `, ['Test User', 'user@test.com', userPassword, 'customer', 'fr']);
      console.log('✅ Test user created (email: user@test.com, password: user123)\n');
    } catch (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        console.log('ℹ️  Test user already exists\n');
      } else {
        console.error('❌ Error creating test user:', err.message);
      }
    }

    // Insert categories
    console.log('📂 Seeding categories...');
    const categories = [
      {
        name_fr: 'Toilettes',
        name_ar: 'مراحيض',
        description_fr: 'WC et accessoires de qualité',
        description_ar: 'مراحيض وملحقاتها عالية الجودة',
        image_url: '/uploads/categories/toilettes.jpg'
      },
      {
        name_fr: 'Lavabos',
        name_ar: 'أحواض',
        description_fr: 'Lavabos et vasques modernes',
        description_ar: 'أحواض الغسيل الحديثة',
        image_url: '/uploads/categories/lavabos.jpg'
      },
      {
        name_fr: 'Robinetterie',
        name_ar: 'حنفيات',
        description_fr: 'Robinets et mitigeurs design',
        description_ar: 'صنابير وخلاطات تصميم',
        image_url: '/uploads/categories/robinetterie.jpg'
      },
      {
        name_fr: 'Douches',
        name_ar: 'دوشات',
        description_fr: 'Cabines et accessoires de douche',
        description_ar: 'كبائن الاستحمام وملحقاتها',
        image_url: '/uploads/categories/douches.jpg'
      },
      {
        name_fr: 'Baignoires',
        name_ar: 'أحواض استحمام',
        description_fr: 'Baignoires élégantes et confortables',
        description_ar: 'أحواض استحمام أنيقة ومريحة',
        image_url: '/uploads/categories/baignoires.jpg'
      },
      {
        name_fr: 'Accessoires',
        name_ar: 'إكسسوارات',
        description_fr: 'Accessoires de salle de bain',
        description_ar: 'ملحقات الحمام',
        image_url: '/uploads/categories/accessoires.jpg'
      },
      {
        name_fr: 'Meubles de salle de bain',
        name_ar: 'أثاث الحمام',
        description_fr: 'Meubles élégants et fonctionnels',
        description_ar: 'أثاث أنيق وعملي',
        image_url: '/uploads/categories/meubles.jpg'
      },
      {
        name_fr: 'Miroirs',
        name_ar: 'مرايا',
        description_fr: 'Miroirs avec ou sans éclairage',
        description_ar: 'مرايا مع أو بدون إضاءة',
        image_url: '/uploads/categories/miroirs.jpg'
      },
      {
        name_fr: 'Hydrothérapie',
        name_ar: 'العلاج المائي',
        description_fr: 'Solutions d\'hydrothérapie',
        description_ar: 'حلول العلاج المائي',
        image_url: '/uploads/categories/hydrotherapie.jpg'
      },
      {
        name_fr: 'Parois de douche',
        name_ar: 'حواجز الدوش',
        description_fr: 'Parois et portes de douche',
        description_ar: 'حواجز وأبواب الدوش',
        image_url: '/uploads/categories/parois.jpg'
      },
      {
        name_fr: 'WC In-Wash',
        name_ar: 'مراحيض ذكية',
        description_fr: 'WC lavants intelligents',
        description_ar: 'مراحيض ذكية',
        image_url: '/uploads/categories/inwash.jpg'
      }
    ];

    let categoryCount = 0;
    for (const category of categories) {
      try {
        await db.executeQuery(`
          INSERT INTO categories (name_fr, name_ar, description_fr, description_ar, image_url)
          VALUES (?, ?, ?, ?, ?)
        `, [category.name_fr, category.name_ar, category.description_fr, category.description_ar, category.image_url]);
        categoryCount++;
      } catch (err) {
        if (!err.message.includes('UNIQUE constraint failed')) {
          console.error(`❌ Error inserting category ${category.name_fr}:`, err.message);
        }
      }
    }
    console.log(`✅ ${categoryCount} categories seeded\n`);

    // Get category IDs for reference
    const categoriesInDb = await db.executeQuery('SELECT * FROM categories ORDER BY id');
    console.log(`📋 Categories in database: ${categoriesInDb.length}\n`);

    // Insert products
    console.log('🛍️  Seeding products...');

    // Products data from frontend (JSON format)
    const products = require('./products-data.json');

    let productCount = 0;
    let skippedCount = 0;

    for (const product of products) {
      try {
        await db.executeQuery(`
          INSERT INTO products (
            name_fr, name_ar, description_fr, description_ar,
            price, sale_price, sku, category_id, stock_quantity,
            image_url, images, brand, features_fr, features_ar,
            specifications, is_featured, is_active, rating, reviews_count
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          product.name_fr,
          product.name_ar,
          product.description_fr,
          product.description_ar,
          product.price,
          product.sale_price || null,
          product.sku,
          product.category_id,
          product.stock_quantity || 10,
          product.image_url,
          JSON.stringify(product.images || [product.image_url]),
          product.brand || 'Roca',
          JSON.stringify(product.features_fr || []),
          JSON.stringify(product.features_ar || []),
          JSON.stringify(product.specifications || {}),
          product.is_featured ? 1 : 0,
          product.is_active !== false ? 1 : 0,
          product.rating || 4.5,
          product.reviews_count || Math.floor(Math.random() * 50) + 10
        ]);
        productCount++;

        if (productCount % 10 === 0) {
          console.log(`   Seeded ${productCount} products...`);
        }
      } catch (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          skippedCount++;
        } else {
          console.error(`❌ Error inserting product ${product.sku}:`, err.message);
        }
      }
    }

    console.log(`✅ ${productCount} products seeded successfully`);
    if (skippedCount > 0) {
      console.log(`ℹ️  ${skippedCount} products skipped (already exist)\n`);
    }

    // Display summary
    const totalProducts = await db.executeQuery('SELECT COUNT(*) as count FROM products');
    const totalCategories = await db.executeQuery('SELECT COUNT(*) as count FROM categories');
    const featuredProducts = await db.executeQuery('SELECT COUNT(*) as count FROM products WHERE is_featured = 1');

    console.log('\n📊 Database Seeding Summary:');
    console.log('================================');
    console.log(`Total Categories: ${totalCategories[0].count}`);
    console.log(`Total Products: ${totalProducts[0].count}`);
    console.log(`Featured Products: ${featuredProducts[0].count}`);
    console.log('================================\n');

    console.log('✨ Database seeding completed successfully!');

  } catch (error) {
    console.error('❌ Fatal error during seeding:', error);
    throw error;
  }
};

// Run if executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('\n🎉 All done! Exiting...');
      process.exit(0);
    })
    .catch((err) => {
      console.error('\n💥 Seeding failed:', err);
      process.exit(1);
    });
}

module.exports = seedDatabase;
