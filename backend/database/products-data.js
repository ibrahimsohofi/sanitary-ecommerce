// Roca Products Data
// Comprehensive product catalog based on https://www.roca.co.ma/produits



const categories = [
  { id: 1, name_fr: "Toilettes", name_ar: "مراحيض" },
  { id: 2, name_fr: "Lavabos", name_ar: "أحواض" },
  { id: 3, name_fr: "Robinetterie", name_ar: "حنفيات" },
  { id: 4, name_fr: "Douches", name_ar: "دوشات" },
  { id: 5, name_fr: "Baignoires", name_ar: "أحواض استحمام" },
  { id: 6, name_fr: "Accessoires", name_ar: "إكسسوارات" },
  { id: 7, name_fr: "Meubles de salle de bain", name_ar: "أثاث الحمام" },
  { id: 8, name_fr: "Miroirs", name_ar: "مرايا" },
  { id: 9, name_fr: "Hydrothérapie", name_ar: "العلاج المائي" },
  { id: 10, name_fr: "Parois de douche", name_ar: "حواجز الدوش" },
  { id: 11, name_fr: "WC In-Wash", name_ar: "مراحيض ذكية" },
];

const products = [
  // WC CATEGORY (Toilettes)
  {
    id: 1,
    name_fr: "Roca In-Tank Meridian",
    name_ar: "روكا إن تانك مريديان",
    description_fr:
      "WC avec réservoir intégré dans la cuvette, design révolutionnaire et gain d'espace optimal. Solution innovante pour les salles de bain modernes.",
    description_ar:
      "مرحاض مع خزان مدمج في الكوب، تصميم ثوري وتوفير مثالي للمساحة. حل مبتكر للحمامات الحديثة.",
    price: 4850.0,
    sku: "ROC-INT-MER-001",
    category_id: 1,
    stock_quantity: 15,
    image_url: "https://ext.same-assets.com/1783899293/391789856.jpeg",
    images: [
      "https://ext.same-assets.com/1783899293/391789856.jpeg",
      "https://ext.same-assets.com/1783899293/1889297441.jpeg",
    ],
    brand: "Roca",
    is_featured: true,
    is_active: true,
  },
  {
    id: 2,
    name_fr: "Roca In-Tank Rimless",
    name_ar: "روكا إن تانك ريملس",
    description_fr:
      "WC In-Tank sans bride pour un nettoyage optimal et une hygiène maximale. Technologie Supraglaze pour une surface ultra-lisse.",
    description_ar:
      "مرحاض إن تانك بدون حافة للتنظيف الأمثل والنظافة القصوى. تقنية سوبرا جليز لسطح فائق النعومة.",
    price: 5200.0,
    sku: "ROC-INT-RIM-002",
    category_id: 1,
    stock_quantity: 12,
    image_url: "https://ext.same-assets.com/1783899293/1889297441.jpeg",
    images: [
      "https://ext.same-assets.com/1783899293/1889297441.jpeg",
      "https://ext.same-assets.com/1783899293/4294830786.jpeg",
    ],
    brand: "Roca",
    is_featured: true,
    is_active: true,
  },
  {
    id: 3,
    name_fr: "Roca Nexo Compact",
    name_ar: "روكا نيكسو كومباكت",
    description_fr:
      "WC avec réservoir attenant, design moderne et fonctionnel pour toutes les salles de bain. Installation facile et garantie 25 ans.",
    description_ar:
      "مرحاض مع خزان ملحق، تصميم عصري ووظيفي لجميع الحمامات. تركيب سهل وضمان 25 سنة.",
    price: 2850.0,
    sku: "ROC-NEX-COM-003",
    category_id: 1,
    stock_quantity: 25,
    image_url: "https://ext.same-assets.com/1783899293/4294830786.jpeg",
    images: [
      "https://ext.same-assets.com/1783899293/4294830786.jpeg",
      "https://ext.same-assets.com/1783899293/773246513.jpeg",
    ],
    brand: "Roca",
    is_featured: false,
    is_active: true,
  },

  // WC IN-WASH CATEGORY (WC Intelligents)
  {
    id: 4,
    name_fr: "Roca In-Wash Inspira",
    name_ar: "روكا إن واش إنسبيرا",
    description_fr:
      "WC lavant intelligent avec télécommande, fonctions de lavage et séchage intégrées. Siège chauffant et détection de présence automatique.",
    description_ar:
      "مرحاض ذكي للغسيل مع جهاز تحكم عن بعد، وظائف الغسيل والتجفيف مدمجة. مقعد مدفأ واستشعار حضور أوتوماتيكي.",
    price: 12500.0,
    sku: "ROC-INW-INS-005",
    category_id: 11,
    stock_quantity: 8,
    image_url: "https://ext.same-assets.com/1783899293/2781443950.jpeg",
    images: [
      "https://ext.same-assets.com/1783899293/2781443950.jpeg",
      "https://ext.same-assets.com/1783899293/3415699354.jpeg",
    ],
    brand: "Roca",
    is_featured: true,
    is_active: true,
  },
  {
    id: 5,
    name_fr: "Roca In-Wash Meridian",
    name_ar: "روكا إن واش مريديان",
    description_fr:
      "WC lavant avec design contemporain, technologie avancée pour le confort ultime. Eau pulsée et contrôle température précis.",
    description_ar:
      "مرحاض ذكي بتصميم معاصر، تقنية متقدمة للراحة القصوى. مياه نابضة وتحكم دقيق بالحرارة.",
    price: 15800.0,
    sku: "ROC-INW-MER-006",
    category_id: 11,
    stock_quantity: 5,
    image_url: "https://ext.same-assets.com/1783899293/3415699354.jpeg",
    images: [
      "https://ext.same-assets.com/1783899293/3415699354.jpeg",
      "https://ext.same-assets.com/1783899293/2781443950.jpeg",
    ],
    brand: "Roca",
    is_featured: true,
    is_active: true,
  },

  // LAVABOS CATEGORY
  {
    id: 6,
    name_fr: "Roca Meridian Lavabo Mural",
    name_ar: "روكا مريديان حوض جداري",
    description_fr:
      "Lavabo suspendu design avec trop-plein intégré, idéal pour les espaces modernes. Émail Supraglaze résistant aux rayures.",
    description_ar:
      "حوض معلق بتصميم عصري مع فائض مدمج، مثالي للمساحات الحديثة. مينا سوبرا جليز مقاوم للخدوش.",
    price: 1850.0,
    sku: "ROC-MER-LAV-007",
    category_id: 2,
    stock_quantity: 20,
    image_url: "https://ext.same-assets.com/1783899293/4219792059.jpeg",
    images: [
      "https://ext.same-assets.com/1783899293/4219792059.jpeg",
      "https://ext.same-assets.com/1783899293/421986251.jpeg",
    ],
    brand: "Roca",
    is_featured: true,
    is_active: true,
  },
  {
    id: 7,
    name_fr: "Roca Inspira Vasque Ronde",
    name_ar: "روكا إنسبيرا حوض مستدير",
    description_fr:
      "Vasque à poser ronde, finition mate pour un style contemporain unique. Sans trop-plein pour un design épuré.",
    description_ar:
      "حوض مستدير للوضع، تشطيب مات لأسلوب معاصر فريد. بدون فائض للحصول على تصميم نظيف.",
    price: 2250.0,
    sku: "ROC-INS-VAS-009",
    category_id: 2,
    stock_quantity: 18,
    image_url: "https://ext.same-assets.com/1783899293/1176043819.jpeg",
    images: [
      "https://ext.same-assets.com/1783899293/1176043819.jpeg",
      "https://ext.same-assets.com/1783899293/3276859123.jpeg",
    ],
    brand: "Roca",
    is_featured: true,
    is_active: true,
  },
  {
    id: 8,
    name_fr: "Roca Beyond Vasque Carrée",
    name_ar: "روكا بيوند حوض مربع",
    description_fr:
      "Vasque carrée design avec angles arrondis, élégance et modernité assurées. Installation sur plan de travail.",
    description_ar:
      "حوض مربع بتصميم عصري مع زوايا مدورة، أناقة وحداثة مضمونة. تركيب على سطح العمل.",
    price: 2680.0,
    sku: "ROC-BEY-VAS-010",
    category_id: 2,
    stock_quantity: 14,
    image_url: "https://ext.same-assets.com/1783899293/3276859123.jpeg",
    images: [
      "https://ext.same-assets.com/1783899293/3276859123.jpeg",
      "https://ext.same-assets.com/1783899293/1176043819.jpeg",
    ],
    brand: "Roca",
    is_featured: false,
    is_active: true,
  },

  // ROBINETTERIE CATEGORY
  {
    id: 9,
    name_fr: "Roca L90 Mitigeur Lavabo",
    name_ar: "روكا إل 90 خلاط حوض",
    description_fr:
      "Mitigeur monocommande pour lavabo, finition chromée brillante et cartouche céramique. Technologie d'économie d'eau intégrée.",
    description_ar:
      "خلاط أحادي التحكم للحوض، تشطيب كروم لامع وخرطوشة سيراميك. تقنية توفير المياه مدمجة.",
    price: 850.0,
    sku: "ROC-L90-MIT-011",
    category_id: 3,
    stock_quantity: 40,
    image_url: "https://ext.same-assets.com/1783899293/1040907038.jpeg",
    images: [
      "https://ext.same-assets.com/1783899293/1040907038.jpeg",
      "https://ext.same-assets.com/1783899293/2299428279.jpeg",
    ],
    brand: "Roca",
    is_featured: true,
    is_active: true,
  },
  {
    id: 10,
    name_fr: "Roca Victoria Mitigeur Douche",
    name_ar: "روكا فيكتوريا خلاط دوش",
    description_fr:
      "Mitigeur thermostatique pour douche, sécurité anti-brûlure et confort optimal. Débit contrôlé 20L/min.",
    description_ar:
      "خلاط حراري للدوش، أمان ضد الحروق وراحة مثلى. تدفق محكوم 20 لتر/دقيقة.",
    price: 1680.0,
    sku: "ROC-VIC-MIT-013",
    category_id: 3,
    stock_quantity: 30,
    image_url: "https://ext.same-assets.com/1783899293/3995636118.jpeg",
    images: [
      "https://ext.same-assets.com/1783899293/3995636118.jpeg",
      "https://ext.same-assets.com/1783899293/1040907038.jpeg",
    ],
    brand: "Roca",
    is_featured: true,
    is_active: true,
  },

  // MEUBLES CATEGORY
  {
    id: 11,
    name_fr: "Roca Nexo Meuble 80cm",
    name_ar: "روكا نيكسو خزانة 80 سم",
    description_fr:
      "Meuble sous-lavabo 80cm avec 2 tiroirs, finition chêne naturel et lavabo inclus. Solutions de rangement optimisées.",
    description_ar:
      "خزانة تحت الحوض 80 سم مع درجين، تشطيب البلوط الطبيعي والحوض مشمول. حلول تخزين محسنة.",
    price: 3850.0,
    sku: "ROC-NEX-MEU-014",
    category_id: 7,
    stock_quantity: 12,
    image_url: "https://ext.same-assets.com/1783899293/580404928.jpeg",
    images: [
      "https://ext.same-assets.com/1783899293/580404928.jpeg",
      "https://ext.same-assets.com/1783899293/2781001991.jpeg",
    ],
    brand: "Roca",
    is_featured: true,
    is_active: true,
  },

  // MIROIRS CATEGORY
  {
    id: 12,
    name_fr: "Roca Luna Miroir LED",
    name_ar: "روكا لونا مرآة إل إي دي",
    description_fr:
      "Miroir avec éclairage LED intégré, interrupteur tactile et fonction anti-buée. Dimension 80x60cm pour une utilisation optimale.",
    description_ar:
      "مرآة مع إضاءة إل إي دي مدمجة، مفتاح لمسي ووظيفة منع الضباب. قياس 80x60 سم للاستخدام الأمثل.",
    price: 1450.0,
    sku: "ROC-LUN-MIR-016",
    category_id: 8,
    stock_quantity: 20,
    image_url: "https://ext.same-assets.com/1783899293/391789856.jpeg",
    images: [
      "https://ext.same-assets.com/1783899293/391789856.jpeg",
      "https://ext.same-assets.com/1783899293/1257812574.jpeg",
    ],
    brand: "Roca",
    is_featured: true,
    is_active: true,
  },

  // HYDROTHÉRAPIE CATEGORY
  {
    id: 13,
    name_fr: "Roca Colonne Hydrothérapie Premium",
    name_ar: "روكا عمود هيدروثيرابي فاخر",
    description_fr:
      "Colonne de douche complète avec jets massants, douchette et douche de tête. Mitigeur thermostatique intégré pour un confort maximum.",
    description_ar:
      "عمود دوش كامل مع نفاثات مدلكة، دوش يدوي ودوش علوي. خلاط حراري مدمج لراحة قصوى.",
    price: 4850.0,
    sku: "ROC-COL-HYD-018",
    category_id: 9,
    stock_quantity: 8,
    image_url: "https://ext.same-assets.com/1783899293/185599656.jpeg",
    images: [
      "https://ext.same-assets.com/1783899293/185599656.jpeg",
      "https://ext.same-assets.com/1783899293/1377293256.jpeg",
    ],
    brand: "Roca",
    is_featured: true,
    is_active: true,
  },

  // BAIGNOIRES CATEGORY
  {
    id: 14,
    name_fr: "Roca Hall Baignoire Acrylique",
    name_ar: "روكا هول حوض استحمام أكريليك",
    description_fr:
      "Baignoire rectangulaire 170x75cm en acrylique renforcé, design intemporel. Pieds réglables et vidage central inclus.",
    description_ar:
      "حوض استحمام مستطيل 170x75 سم من الأكريليك المقوى، تصميم خالد. أرجل قابلة للتعديل وتصريف مركزي مشمول.",
    price: 3850.0,
    sku: "ROC-HAL-BAI-020",
    category_id: 5,
    stock_quantity: 10,
    image_url: "https://ext.same-assets.com/1783899293/1644920899.jpeg",
    images: [
      "https://ext.same-assets.com/1783899293/1644920899.jpeg",
      "https://ext.same-assets.com/1783899293/1606317503.jpeg",
    ],
    brand: "Roca",
    is_featured: true,
    is_active: true,
  },
  {
    id: 15,
    name_fr: "Roca Sureste Baignoire Îlot",
    name_ar: "روكا سوريستي حوض جزيرة",
    description_fr:
      "Baignoire îlot design ovale, installation libre pour un effet spa luxueux. Dimensions 180x85cm pour un confort optimal.",
    description_ar:
      "حوض استحمام جزيرة بتصميم بيضاوي، تركيب حر لتأثير سبا فاخر. أبعاد 180x85 سم للراحة المثلى.",
    price: 8500.0,
    sku: "ROC-SUR-BAI-021",
    category_id: 5,
    stock_quantity: 5,
    image_url: "https://ext.same-assets.com/1783899293/1606317503.jpeg",
    images: [
      "https://ext.same-assets.com/1783899293/1606317503.jpeg",
      "https://ext.same-assets.com/1783899293/1644920899.jpeg",
    ],
    brand: "Roca",
    is_featured: true,
    is_active: true,
  },

  // ACCESSOIRES CATEGORY
  {
    id: 16,
    name_fr: "Roca Select Porte-Serviettes",
    name_ar: "روكا سيليكت حامل مناشف",
    description_fr:
      "Porte-serviettes double en acier inoxydable, finition chromée brillante. Fixation murale solide et installation facile.",
    description_ar:
      "حامل مناشف مزدوج من الفولاذ المقاوم للصدأ، تشطيب كروم لامع. تثبيت جداري قوي وتركيب سهل.",
    price: 285.0,
    sku: "ROC-SEL-POR-022",
    category_id: 6,
    stock_quantity: 60,
    image_url: "https://ext.same-assets.com/1783899293/4113503982.jpeg",
    images: [
      "https://ext.same-assets.com/1783899293/4113503982.jpeg",
      "https://ext.same-assets.com/1783899293/429725567.jpeg",
    ],
    brand: "Roca",
    is_featured: false,
    is_active: true,
  },

  // PAROIS DE DOUCHE CATEGORY
  {
    id: 17,
    name_fr: "Roca Town Paroi Fixe",
    name_ar: "روكا تاون حاجز ثابت",
    description_fr:
      "Paroi de douche fixe 120cm, verre sécurit 8mm et profilés aluminium. Traitement anti-calcaire pour un entretien facile.",
    description_ar:
      "حاجز دوش ثابت 120 سم، زجاج أمان 8 مم وملامح ألمنيوم. معالجة ضد الكلس للصيانة السهلة.",
    price: 1850.0,
    sku: "ROC-TOW-PAR-024",
    category_id: 10,
    stock_quantity: 15,
    image_url: "https://ext.same-assets.com/1783899293/2809613452.jpeg",
    images: [
      "https://ext.same-assets.com/1783899293/2809613452.jpeg",
      "https://ext.same-assets.com/1783899293/772529207.jpeg",
    ],
    brand: "Roca",
    is_featured: true,
    is_active: true,
  },

  // DOUCHES CATEGORY
  {
    id: 18,
    name_fr: "Roca Douchette à Main Wellness",
    name_ar: "روكا دوش يدوي ويلنس",
    description_fr:
      "Douchette ergonomique 5 jets, design moderne et fonction économie d'eau. Flexible 150cm inclus pour une utilisation confortable.",
    description_ar:
      "دوش يدوي مريح 5 نفاثات، تصميم حديث ووظيفة توفير المياه. خرطوم 150 سم مشمول للاستخدام المريح.",
    price: 450.0,
    sku: "ROC-DOU-WEL-019",
    category_id: 4,
    stock_quantity: 50,
    image_url: "https://ext.same-assets.com/1783899293/1377293256.jpeg",
    images: [
      "https://ext.same-assets.com/1783899293/1377293256.jpeg",
      "https://ext.same-assets.com/1783899293/185599656.jpeg",
    ],
    brand: "Roca",
    is_featured: false,
    is_active: true,
  },

  // Additional featured products
  {
    id: 19,
    name_fr: "Roca Hotels Distributeur Savon",
    name_ar: "روكا هوتيل موزع صابون",
    description_fr:
      "Distributeur de savon liquide automatique, capteur infrarouge et réservoir 1L. Fonctionne sur piles avec design moderne.",
    description_ar:
      "موزع صابون سائل أوتوماتيكي، مستشعر أشعة تحت الحمراء وخزان 1 لتر. يعمل بالبطاريات مع تصميم حديث.",
    price: 850.0,
    sku: "ROC-HOT-DIS-023",
    category_id: 6,
    stock_quantity: 25,
    image_url: "https://ext.same-assets.com/1783899293/429725567.jpeg",
    images: [
      "https://ext.same-assets.com/1783899293/429725567.jpeg",
      "https://ext.same-assets.com/1783899293/4113503982.jpeg",
    ],
    brand: "Roca",
    is_featured: false,
    is_active: true,
  },

  {
    id: 20,
    name_fr: "Roca Town Porte Coulissante",
    name_ar: "روكا تاون باب منزلق",
    description_fr:
      "Porte de douche coulissante 140cm, ouverture facile et étanchéité parfaite. Poignées ergonomiques et coulissement doux.",
    description_ar:
      "باب دوش منزلق 140 سم، فتح سهل وإغلاق محكم. مقابض مريحة وانزلاق ناعم.",
    price: 2450.0,
    sku: "ROC-TOW-POR-025",
    category_id: 10,
    stock_quantity: 12,
    image_url: "https://ext.same-assets.com/1783899293/772529207.jpeg",
    images: [
      "https://ext.same-assets.com/1783899293/772529207.jpeg",
      "https://ext.same-assets.com/1783899293/2809613452.jpeg",
    ],
    brand: "Roca",
    is_featured: false,
    is_active: true,
  },
];

export const getFeaturedProducts = () => products.filter((p) => p.is_featured);
export const getProductsByCategory = (categoryId: number) =>
  products.filter((p) => p.category_id === categoryId);
export const getProductById = (id: number) => products.find((p) => p.id === id);


module.exports = products;
