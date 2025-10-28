const db = require('../config/database');
const bcrypt = require('bcryptjs');

const seedProducts = async () => {
  try {
    console.log('Starting product seeding...');

    // Create admin user first
    const adminPassword = await bcrypt.hash('admin123', 10);
    try {
      await db.executeQuery(`
        INSERT INTO users (name, email, password, role, language)
        VALUES (?, ?, ?, ?, ?)
      `, ['Admin', 'admin@sanitary.com', adminPassword, 'admin', 'fr']);
      console.log('Admin user created');
    } catch (err) {
      if (!err.message.includes('UNIQUE constraint failed')) {
        console.error('Error creating admin user:', err.message);
      }
    }

    // Insert categories
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
      }
    ];

    for (const category of categories) {
      try {
        await db.executeQuery(`
          INSERT INTO categories (name_fr, name_ar, description_fr, description_ar, image_url)
          VALUES (?, ?, ?, ?, ?)
        `, [category.name_fr, category.name_ar, category.description_fr, category.description_ar, category.image_url]);
      } catch (err) {
        if (!err.message.includes('UNIQUE constraint failed')) {
          console.error('Error inserting category:', err.message);
        }
      }
    }

    // Insert products
    const products = [
      {
        name_fr: 'Roca In-Tank Meridian',
        name_ar: 'روكا إن-تانك مريديان',
        description_fr: 'WC avec réservoir intégré dans la cuvette, design révolutionnaire et gain d\'espace optimal. Solution innovante pour les salles de bains modernes.',
        description_ar: 'مرحاض مع خزان متكامل في الحوض، تصميم ثوري وتوفير مساحة مثالي. حل مبتكر للحمامات الحديثة.',
        price: 4850.00,
        sale_price: 4200.00,
        sku: 'ROCA-IT-MER-001',
        category_id: 1,
        stock_quantity: 15,
        image_url: '/uploads/products/toilet-roca-1.jpg',
        images: JSON.stringify(['/uploads/products/toilet-roca-1.jpg', '/uploads/products/toilet-roca-2.jpg']),
        brand: 'Roca',
        features_fr: JSON.stringify([
          'Réservoir intégré dans la cuvette',
          'Design compact et moderne',
          'Technologie d\'économie d\'eau',
          'Installation facile',
          'Garantie 5 ans'
        ]),
        features_ar: JSON.stringify([
          'خزان متكامل في الحوض',
          'تصميم مدمج وحديث',
          'تقنية توفير المياه',
          'تركيب سهل',
          'ضمان 5 سنوات'
        ]),
        is_featured: true
      },
      {
        name_fr: 'Roca In-Tank Rimless',
        name_ar: 'روكا إن-تانك ريملس',
        description_fr: 'WC In-Tank sans bride pour un nettoyage optimal et une hygiène maximale. Technologie Supraglaze pour une surface ultra-lisse.',
        description_ar: 'مرحاض إن-تانك بدون حافة للتنظيف الأمثل والنظافة القصوى. تقنية سوبراجليز للسطح فائق النعومة.',
        price: 5200.00,
        sku: 'ROCA-IT-RIM-001',
        category_id: 1,
        stock_quantity: 12,
        image_url: '/uploads/products/toilet-roca-2.jpg',
        images: JSON.stringify(['/uploads/products/toilet-roca-2.jpg', '/uploads/products/toilet-roca-1.jpg']),
        brand: 'Roca',
        features_fr: JSON.stringify([
          'Technologie Rimless sans bride',
          'Surface Supraglaze ultra-lisse',
          'Nettoyage facile et hygiénique',
          'Design élégant',
          'Économie d\'eau'
        ]),
        features_ar: JSON.stringify([
          'تقنية ريملس بدون حافة',
          'سطح سوبراجليز فائق النعومة',
          'تنظيف سهل وصحي',
          'تصميم أنيق',
          'توفير المياه'
        ]),
        is_featured: true
      },
      {
        name_fr: 'Roca In-Wash Inspira',
        name_ar: 'روكا إن-واش إنسبيرا',
        description_fr: 'WC lavant intelligent avec télécommande, fonctions de lavage et séchage intégrées. Siège chauffant et détection de présence.',
        description_ar: 'مرحاض ذكي مع جهاز تحكم عن بعد، وظائف الغسيل والتجفيف المتكاملة. مقعد مدفأ وكشف الحضور.',
        price: 12500.00,
        sale_price: 11000.00,
        sku: 'ROCA-IW-INS-001',
        category_id: 1,
        stock_quantity: 8,
        image_url: '/uploads/products/toilet-roca-1.jpg',
        images: JSON.stringify(['/uploads/products/toilet-roca-1.jpg']),
        brand: 'Roca',
        features_fr: JSON.stringify([
          'Fonction lavage intégrée',
          'Siège chauffant',
          'Télécommande incluse',
          'Détection automatique',
          'Séchage à air chaud'
        ]),
        features_ar: JSON.stringify([
          'وظيفة الغسيل المتكاملة',
          'مقعد مدفأ',
          'جهاز تحكم عن بعد مدرج',
          'كشف تلقائي',
          'تجفيف بالهواء الساخن'
        ]),
        is_featured: true
      },
      {
        name_fr: 'Roca In-Wash Meridian',
        name_ar: 'روكا إن-واش مريديان',
        description_fr: 'WC lavant avec design contemporain, technologie avancée pour le confort ultime. Eau pulsée et contrôle température précis.',
        description_ar: 'مرحاض غسيل مع تصميم معاصر، تقنية متقدمة للراحة القصوى. مياه نبضية وتحكم دقيق في درجة الحرارة.',
        price: 15800.00,
        sku: 'ROCA-IW-MER-001',
        category_id: 1,
        stock_quantity: 5,
        image_url: '/uploads/products/toilet-roca-2.jpg',
        images: JSON.stringify(['/uploads/products/toilet-roca-2.jpg']),
        brand: 'Roca',
        features_fr: JSON.stringify([
          'Design contemporain',
          'Technologie In-Wash avancée',
          'Contrôle température précis',
          'Interface tactile',
          'Mode éco-énergétique'
        ]),
        features_ar: JSON.stringify([
          'تصميم معاصر',
          'تقنية إن-واش المتقدمة',
          'تحكم دقيق في درجة الحرارة',
          'واجهة لمسية',
          'وضع توفير الطاقة'
        ]),
        is_featured: false
      },
      {
        name_fr: 'Lavabo Roca Meridian',
        name_ar: 'حوض روكا مريديان',
        description_fr: 'Lavabo suspendu au design épuré et moderne. Céramique de haute qualité avec finition brillante résistante.',
        description_ar: 'حوض معلق بتصميم نظيف وحديث. سيراميك عالي الجودة مع لمسة نهائية لامعة ومقاومة.',
        price: 2800.00,
        sale_price: 2400.00,
        sku: 'ROCA-LAV-MER-001',
        category_id: 2,
        stock_quantity: 20,
        image_url: '/uploads/products/sink-roca-1.jpg',
        images: JSON.stringify(['/uploads/products/sink-roca-1.jpg', '/uploads/products/sink-roca-2.jpg']),
        brand: 'Roca',
        features_fr: JSON.stringify([
          'Design suspendu moderne',
          'Céramique haute qualité',
          'Finition résistante',
          'Installation murale',
          'Garantie constructeur'
        ]),
        features_ar: JSON.stringify([
          'تصميم معلق حديث',
          'سيراميك عالي الجودة',
          'لمسة نهائية مقاومة',
          'تركيب على الحائط',
          'ضمان الشركة المصنعة'
        ]),
        is_featured: false
      },
      {
        name_fr: 'Robinet Roca L20',
        name_ar: 'صنبور روكا L20',
        description_fr: 'Mitigeur de lavabo au design minimaliste avec cartouche céramique longue durée. Finition chromée brillante.',
        description_ar: 'خلاط حوض بتصميم بسيط مع خرطوشة سيراميك طويلة المدى. لمسة نهائية مطلية بالكروم اللامع.',
        price: 1200.00,
        sale_price: 980.00,
        sku: 'ROCA-ROB-L20-001',
        category_id: 3,
        stock_quantity: 30,
        image_url: '/uploads/products/faucet-roca-1.jpg',
        images: JSON.stringify(['/uploads/products/faucet-roca-1.jpg', '/uploads/products/faucet-roca-2.jpg']),
        brand: 'Roca',
        features_fr: JSON.stringify([
          'Design minimaliste',
          'Cartouche céramique',
          'Finition chromée',
          'Installation facile',
          'Économiseur d\'eau'
        ]),
        features_ar: JSON.stringify([
          'تصميم بسيط',
          'خرطوشة سيراميك',
          'لمسة نهائية مطلية بالكروم',
          'تركيب سهل',
          'موفر للمياه'
        ]),
        is_featured: false
      },
      {
        name_fr: 'Colonne de Douche Roca',
        name_ar: 'عمود دش روكا',
        description_fr: 'Système de douche complet avec douchette de tête, douchette à main et thermostat intégré pour un confort optimal.',
        description_ar: 'نظام دش كامل مع رأس دش، دش يدوي وثيرموستات متكامل للراحة المثلى.',
        price: 3500.00,
        sku: 'ROCA-DOU-COL-001',
        category_id: 4,
        stock_quantity: 10,
        image_url: '/uploads/products/shower-roca-1.jpg',
        images: JSON.stringify(['/uploads/products/shower-roca-1.jpg', '/uploads/products/shower-roca-2.jpg']),
        brand: 'Roca',
        features_fr: JSON.stringify([
          'Système douche complet',
          'Thermostat intégré',
          'Douchette de tête et à main',
          'Installation murale',
          'Design contemporain'
        ]),
        features_ar: JSON.stringify([
          'نظام دش كامل',
          'ثيرموستات متكامل',
          'رأس دش ودش يدوي',
          'تركيب على الحائط',
          'تصميم معاصر'
        ]),
        is_featured: false
      }
    ];

    for (const product of products) {
      try {
        await db.executeQuery(`
          INSERT INTO products (
            name_fr, name_ar, description_fr, description_ar, price, sale_price,
            sku, category_id, stock_quantity, image_url, images, brand,
            features_fr, features_ar, is_featured, is_active
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          product.name_fr, product.name_ar, product.description_fr, product.description_ar,
          product.price, product.sale_price, product.sku, product.category_id,
          product.stock_quantity, product.image_url, product.images, product.brand,
          product.features_fr, product.features_ar, product.is_featured, true
        ]);
        console.log(`Product inserted: ${product.name_fr}`);
      } catch (err) {
        if (!err.message.includes('UNIQUE constraint failed')) {
          console.error(`Error inserting product ${product.name_fr}:`, err.message);
        }
      }
    }

    console.log('Product seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding products:', error);
  }
};

module.exports = { seedProducts };

// Run seeding if this file is executed directly
if (require.main === module) {
  seedProducts().then(() => {
    console.log('Seeding finished');
    process.exit(0);
  });
}
