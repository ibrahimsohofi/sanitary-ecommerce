-- Roca Products Database
-- Based on https://www.roca.co.ma/produits product catalog

USE sanitary_ecommerce;

-- First, let's add more categories based on Roca's catalog
INSERT INTO categories (name_fr, name_ar, description_fr, description_ar, image_url) VALUES
('Meubles de salle de bain', 'أثاث الحمام', 'Meubles avec lavabo et rangements', 'أثاث مع أحواض وخزائن', 'https://ext.same-assets.com/1783899293/421986251.jpeg'),
('Miroirs', 'مرايا', 'Miroirs avec et sans éclairage', 'مرايا مع وبدون إضاءة', 'https://ext.same-assets.com/1783899293/391789856.jpeg'),
('Hydrothérapie', 'العلاج المائي', 'Colonnes de douche et systèmes spa', 'أعمدة الاستحمام وأنظمة السبا', 'https://ext.same-assets.com/1783899293/185599656.jpeg'),
('Parois de douche', 'حواجز الدوش', 'Parois et portes de douche', 'حواجز وأبواب الاستحمام', 'https://ext.same-assets.com/1783899293/2809613452.jpeg'),
('Receveurs de douche', 'قواعد الدوش', 'Bacs et receveurs de douche', 'قواعد وأحواض الاستحمام', 'https://ext.same-assets.com/1783899293/2201697803.jpeg'),
('Systèmes d\'installation', 'أنظمة التركيب', 'Systèmes encastrés et plaques de commande', 'أنظمة مدفونة ولوحات تحكم', 'https://ext.same-assets.com/1783899293/1133712453.jpeg'),
('Urinoirs', 'مباول', 'Urinoirs et accessoires', 'مباول وملحقاتها', 'https://ext.same-assets.com/1783899293/1257812574.jpeg'),
('Bidets', 'بيديه', 'Bidets au sol et suspendus', 'بيديه أرضي ومعلق', 'https://ext.same-assets.com/1783899293/3787516315.jpeg'),
('Mécanismes', 'آليات', 'Mécanismes et plaques de commande', 'آليات ولوحات تحكم', 'https://ext.same-assets.com/1783899293/2913317008.jpeg'),
('WC In-Wash', 'مراحيض ذكية', 'WC lavants intelligents', 'مراحيض ذكية للغسيل', 'https://ext.same-assets.com/1783899293/2781443950.jpeg');

-- Insert comprehensive Roca products

-- WC CATEGORY (Toilettes)
INSERT INTO products (name_fr, name_ar, description_fr, description_ar, price, sku, category_id, stock_quantity, image_url, brand, features_fr, features_ar, is_featured, is_active) VALUES

-- WC In-Tank Series
('Roca In-Tank Meridian', 'روكا إن تانك مريديان', 'WC avec réservoir intégré dans la cuvette, design révolutionnaire et gain d\'espace optimal.', 'مرحاض مع خزان مدمج في الكوب، تصميم ثوري وتوفير مثالي للمساحة.', 4850.00, 'ROC-INT-MER-001', 1, 15, 'https://ext.same-assets.com/1783899293/391789856.jpeg', 'Roca', '["Réservoir intégré", "Évacuation 3/6L", "Sortie horizontale", "Installation au sol"]', '["خزان مدمج", "تصريف 3/6 لتر", "مخرج أفقي", "تركيب أرضي"]', true, true),

('Roca In-Tank Rimless', 'روكا إن تانك ريملس', 'WC In-Tank sans bride pour un nettoyage optimal et une hygiène maximale.', 'مرحاض إن تانك بدون حافة للتنظيف الأمثل والنظافة القصوى.', 5200.00, 'ROC-INT-RIM-002', 1, 12, 'https://ext.same-assets.com/1783899293/1889297441.jpeg', 'Roca', '["Sans bride", "Évacuation 3/6L", "Technologie Supraglaze", "Facile à nettoyer"]', '["بدون حافة", "تصريف 3/6 لتر", "تقنية سوبرا جليز", "سهل التنظيف"]', true, true),

-- WC avec réservoir attenant
('Roca Nexo Compact', 'روكا نيكسو كومباكت', 'WC avec réservoir attenant, design moderne et fonctionnel pour toutes les salles de bain.', 'مرحاض مع خزان ملحق، تصميم عصري ووظيفي لجميع الحمامات.', 2850.00, 'ROC-NEX-COM-003', 1, 25, 'https://ext.same-assets.com/1783899293/4294830786.jpeg', 'Roca', '["Évacuation 3/6L", "Sortie horizontale", "Installation au sol", "Abattant inclus"]', '["تصريف 3/6 لتر", "مخرج أفقي", "تركيب أرضي", "مقعد مشمول"]', false, true),

('Roca Dama-N', 'روكا داما إن', 'WC classique avec lignes épurées, robuste et élégant pour un usage quotidien.', 'مرحاض كلاسيكي بخطوط نظيفة، قوي وأنيق للاستخدام اليومي.', 2450.00, 'ROC-DAM-N-004', 1, 30, 'https://ext.same-assets.com/1783899293/773246513.jpeg', 'Roca', '["Évacuation 4,5/3L", "Sortie duale", "Installation facile", "Garantie 25 ans"]', '["تصريف 4.5/3 لتر", "مخرج مزدوج", "تركيب سهل", "ضمان 25 سنة"]', false, true);

-- WC IN-WASH CATEGORY (WC Intelligents)
INSERT INTO products (name_fr, name_ar, description_fr, description_ar, price, sku, category_id, stock_quantity, image_url, brand, features_fr, features_ar, is_featured, is_active) VALUES

('Roca In-Wash Inspira', 'روكا إن واش إنسبيرا', 'WC lavant intelligent avec télécommande, fonctions de lavage et séchage intégrées.', 'مرحاض ذكي للغسيل مع جهاز تحكم عن بعد، وظائف الغسيل والتجفيف مدمجة.', 12500.00, 'ROC-INW-INS-005', 11, 8, 'https://ext.same-assets.com/1783899293/2781443950.jpeg', 'Roca', '["Lavage et séchage", "Télécommande", "Siège chauffant", "Detection de présence"]', '["غسيل وتجفيف", "جهاز تحكم", "مقعد مدفأ", "استشعار الحضور"]', true, true),

('Roca In-Wash Meridian', 'روكا إن واش مريديان', 'WC lavant avec design contemporain, technologie avancée pour le confort ultime.', 'مرحاض ذكي بتصميم معاصر، تقنية متقدمة للراحة القصوى.', 15800.00, 'ROC-INW-MER-006', 11, 5, 'https://ext.same-assets.com/1783899293/3415699354.jpeg', 'Roca', '["Eau pulsée", "Contrôle température", "Séchage à l\'air chaud", "Abattant automatique"]', '["مياه نابضة", "تحكم بالحرارة", "تجفيف بالهواء الساخن", "مقعد أوتوماتيكي"]', true, true);

-- LAVABOS CATEGORY
INSERT INTO products (name_fr, name_ar, description_fr, description_ar, price, sku, category_id, stock_quantity, image_url, brand, features_fr, features_ar, is_featured, is_active) VALUES

-- Lavabos muraux
('Roca Meridian Lavabo Mural', 'روكا مريديان حوض جداري', 'Lavabo suspendu design avec trop-plein intégré, idéal pour les espaces modernes.', 'حوض معلق بتصميم عصري مع فائض مدمج، مثالي للمساحات الحديثة.', 1850.00, 'ROC-MER-LAV-007', 2, 20, 'https://ext.same-assets.com/1783899293/4219792059.jpeg', 'Roca', '["Suspensio murale", "Trop-plein intégré", "Émail Supraglaze", "Dimension 60x42cm"]', '["تعليق جداري", "فائض مدمج", "مينا سوبرا جليز", "قياس 60x42 سم"]', true, true),

('Roca Nexo Lavabo 65', 'روكا نيكسو حوض 65', 'Lavabo rectangulaire de 65cm, design épuré et fonctionnel pour toute salle de bain.', 'حوض مستطيل 65 سم، تصميم نظيف ووظيفي لأي حمام.', 1450.00, 'ROC-NEX-LAV-008', 2, 35, 'https://ext.same-assets.com/1783899293/421986251.jpeg', 'Roca', '["65x42cm", "1 trou robinetterie", "Installation murale", "Évacuation sans trop-plein"]', '["65x42 سم", "فتحة واحدة للحنفية", "تركيب جداري", "تصريف بدون فائض"]', false, true),

-- Vasques à poser
('Roca Inspira Vasque Ronde', 'روكا إنسبيرا حوض مستدير', 'Vasque à poser ronde, finition mate pour un style contemporain unique.', 'حوض مستدير للوضع، تشطيب مات لأسلوب معاصر فريد.', 2250.00, 'ROC-INS-VAS-009', 2, 18, 'https://ext.same-assets.com/1783899293/1176043819.jpeg', 'Roca', '["Diamètre 37cm", "Finition mate", "À poser", "Sans trop-plein"]', '["قطر 37 سم", "تشطيب مات", "للوضع", "بدون فائض"]', true, true),

('Roca Beyond Vasque Carrée', 'روكا بيوند حوض مربع', 'Vasque carrée design avec angles arrondis, élégance et modernité assurées.', 'حوض مربع بتصميم عصري مع زوايا مدورة، أناقة وحداثة مضمونة.', 2680.00, 'ROC-BEY-VAS-010', 2, 14, 'https://ext.same-assets.com/1783899293/3276859123.jpeg', 'Roca', '["40x40cm", "Angles arrondis", "Évacuation centrale", "Installation sur plan"]', '["40x40 سم", "زوايا مدورة", "تصريف مركزي", "تركيب على السطح"]', false, true);

-- ROBINETTERIE CATEGORY
INSERT INTO products (name_fr, name_ar, description_fr, description_ar, price, sku, category_id, stock_quantity, image_url, brand, features_fr, features_ar, is_featured, is_active) VALUES

-- Robinetterie pour lavabo
('Roca L90 Mitigeur Lavabo', 'روكا إل 90 خلاط حوض', 'Mitigeur monocommande pour lavabo, finition chromée brillante et cartouche céramique.', 'خلاط أحادي التحكم للحوض، تشطيب كروم لامع وخرطوشة سيراميك.', 850.00, 'ROC-L90-MIT-011', 3, 40, 'https://ext.same-assets.com/1783899293/1040907038.jpeg', 'Roca', '["Monocommande", "Cartouche céramique", "Finition chrome", "Économie d\'eau"]', '["أحادي التحكم", "خرطوشة سيراميك", "تشطيب كروم", "توفير المياه"]', true, true),

('Roca Atlas Mitigeur Haut', 'روكا أتلاس خلاط عالي', 'Mitigeur haut pour vasques à poser, design élégant et fonctionnalité premium.', 'خلاط عالي للأحواض الموضوعة، تصميم أنيق ووظائف فاخرة.', 1250.00, 'ROC-ATL-MIT-012', 3, 25, 'https://ext.same-assets.com/1783899293/2299428279.jpeg', 'Roca', '["Hauteur 285mm", "Pour vasques", "Bec fixe", "Garantie 5 ans"]', '["ارتفاع 285 مم", "للأحواض", "فوهة ثابتة", "ضمان 5 سنوات"]', false, true),

-- Robinetterie pour douche
('Roca Victoria Mitigeur Douche', 'روكا فيكتوريا خلاط دوش', 'Mitigeur thermostatique pour douche, sécurité anti-brûlure et confort optimal.', 'خلاط حراري للدوش، أمان ضد الحروق وراحة مثلى.', 1680.00, 'ROC-VIC-MIT-013', 3, 30, 'https://ext.same-assets.com/1783899293/3995636118.jpeg', 'Roca', '["Thermostatique", "Anti-brûlure", "Débit 20L/min", "Installation murale"]', '["حراري", "مضاد للحروق", "تدفق 20 لتر/دقيقة", "تركيب جداري"]', true, true);

-- MEUBLES CATEGORY
INSERT INTO products (name_fr, name_ar, description_fr, description_ar, price, sku, category_id, stock_quantity, image_url, brand, features_fr, features_ar, is_featured, is_active) VALUES

('Roca Nexo Meuble 80cm', 'روكا نيكسو خزانة 80 سم', 'Meuble sous-lavabo 80cm avec 2 tiroirs, finition chêne naturel et lavabo inclus.', 'خزانة تحت الحوض 80 سم مع درجين، تشطيب البلوط الطبيعي والحوض مشمول.', 3850.00, 'ROC-NEX-MEU-014', 7, 12, 'https://ext.same-assets.com/1783899293/580404928.jpeg', 'Roca', '["Largeur 80cm", "2 tiroirs", "Lavabo inclus", "Finition chêne"]', '["عرض 80 سم", "درجان", "الحوض مشمول", "تشطيب البلوط"]', true, true),

('Roca In-Wash Meuble Compact', 'روكا إن واش خزانة مدمجة', 'Meuble compact avec rangements et plan vasque intégré, solution tout-en-un.', 'خزانة مدمجة مع تخزين وسطح حوض مدمج، حل شامل.', 2850.00, 'ROC-INW-MEU-015', 7, 15, 'https://ext.same-assets.com/1783899293/2781001991.jpeg', 'Roca', '["60cm largeur", "Plan intégré", "Rangement optimisé", "Design minimaliste"]', '["عرض 60 سم", "سطح مدمج", "تخزين محسن", "تصميم بسيط"]', false, true);

-- MIROIRS CATEGORY
INSERT INTO products (name_fr, name_ar, description_fr, description_ar, price, sku, category_id, stock_quantity, image_url, brand, features_fr, features_ar, is_featured, is_active) VALUES

('Roca Luna Miroir LED', 'روكا لونا مرآة إل إي دي', 'Miroir avec éclairage LED intégré, interrupteur tactile et fonction anti-buée.', 'مرآة مع إضاءة إل إي دي مدمجة، مفتاح لمسي ووظيفة منع الضباب.', 1450.00, 'ROC-LUN-MIR-016', 8, 20, 'https://ext.same-assets.com/1783899293/391789856.jpeg', 'Roca', '["Éclairage LED", "Interrupteur tactile", "Anti-buée", "Dimension 80x60cm"]', '["إضاءة إل إي دي", "مفتاح لمسي", "منع الضباب", "قياس 80x60 سم"]', true, true),

('Roca Prisma Miroir', 'روكا بريزما مرآة', 'Miroir rectangulaire simple, bordure polie et fixations incluses.', 'مرآة مستطيلة بسيطة، حافة مصقولة ومثبتات مشمولة.', 650.00, 'ROC-PRI-MIR-017', 8, 35, 'https://ext.same-assets.com/1783899293/1257812574.jpeg', 'Roca', '["70x50cm", "Bordure polie", "Fixations incluses", "Design épuré"]', '["70x50 سم", "حافة مصقولة", "مثبتات مشمولة", "تصميم نظيف"]', false, true);

-- HYDROTHÉRAPIE CATEGORY
INSERT INTO products (name_fr, name_ar, description_fr, description_ar, price, sku, category_id, stock_quantity, image_url, brand, features_fr, features_ar, is_featured, is_active) VALUES

('Roca Colonne Hydrothérapie Premium', 'روكا عمود هيدروثيرابي فاخر', 'Colonne de douche complète avec jets massants, douchette et douche de tête.', 'عمود دوش كامل مع نفاثات مدلكة، دوش يدوي ودوش علوي.', 4850.00, 'ROC-COL-HYD-018', 9, 8, 'https://ext.same-assets.com/1783899293/185599656.jpeg', 'Roca', '["Jets massants", "Douchette extractible", "Douche de tête 20cm", "Mitigeur thermostatique"]', '["نفاثات مدلكة", "دوش قابل للسحب", "دوش علوي 20 سم", "خلاط حراري"]', true, true),

('Roca Douchette à Main Wellness', 'روكا دوش يدوي ويلنس', 'Douchette ergonomique 5 jets, design moderne et fonction économie d\'eau.', 'دوش يدوي مريح 5 نفاثات، تصميم حديث ووظيفة توفير المياه.', 450.00, 'ROC-DOU-WEL-019', 9, 50, 'https://ext.same-assets.com/1783899293/1377293256.jpeg', 'Roca', '["5 types de jets", "Poignée ergonomique", "Économie d\'eau", "Flexible 150cm"]', '["5 أنواع نفاثات", "مقبض مريح", "توفير المياه", "خرطوم 150 سم"]', false, true);

-- Continue with more categories...

-- BAIGNOIRES CATEGORY
INSERT INTO products (name_fr, name_ar, description_fr, description_ar, price, sku, category_id, stock_quantity, image_url, brand, features_fr, features_ar, is_featured, is_active) VALUES

('Roca Hall Baignoire Acrylique', 'روكا هول حوض استحمام أكريليك', 'Baignoire rectangulaire 170x75cm en acrylique renforcé, design intemporel.', 'حوض استحمام مستطيل 170x75 سم من الأكريليك المقوى، تصميم خالد.', 3850.00, 'ROC-HAL-BAI-020', 5, 10, 'https://ext.same-assets.com/1783899293/1644920899.jpeg', 'Roca', '["170x75cm", "Acrylique renforcé", "Vidage central", "Pieds réglables"]', '["170x75 سم", "أكريليك مقوى", "تصريف مركزي", "أرجل قابلة للتعديل"]', true, true),

('Roca Sureste Baignoire Îlot', 'روكا سوريستي حوض جزيرة', 'Baignoire îlot design ovale, installation libre pour un effet spa luxueux.', 'حوض استحمام جزيرة بتصميم بيضاوي، تركيب حر لتأثير سبا فاخر.', 8500.00, 'ROC-SUR-BAI-021', 5, 5, 'https://ext.same-assets.com/1783899293/1606317503.jpeg', 'Roca', '["Installation libre", "Design ovale", "180x85cm", "Effet spa"]', '["تركيب حر", "تصميم بيضاوي", "180x85 سم", "تأثير سبا"]', true, true);

-- ACCESSOIRES CATEGORY
INSERT INTO products (name_fr, name_ar, description_fr, description_ar, price, sku, category_id, stock_quantity, image_url, brand, features_fr, features_ar, is_featured, is_active) VALUES

('Roca Select Porte-Serviettes', 'روكا سيليكت حامل مناشف', 'Porte-serviettes double en acier inoxydable, finition chromée brillante.', 'حامل مناشف مزدوج من الفولاذ المقاوم للصدأ، تشطيب كروم لامع.', 285.00, 'ROC-SEL-POR-022', 6, 60, 'https://ext.same-assets.com/1783899293/4113503982.jpeg', 'Roca', '["Double barre", "Acier inoxydable", "60cm longueur", "Fixation murale"]', '["قضيب مزدوج", "فولاذ مقاوم للصدأ", "طول 60 سم", "تثبيت جداري"]', false, true),

('Roca Hotels Distributeur Savon', 'روكا هوتيل موزع صابون', 'Distributeur de savon liquide automatique, capteur infrarouge et réservoir 1L.', 'موزع صابون سائل أوتوماتيكي، مستشعر أشعة تحت الحمراء وخزان 1 لتر.', 850.00, 'ROC-HOT-DIS-023', 6, 25, 'https://ext.same-assets.com/1783899293/429725567.jpeg', 'Roca', '["Capteur infrarouge", "Réservoir 1L", "Fonctionne sur piles", "Design moderne"]', '["مستشعر أشعة تحت حمراء", "خزان 1 لتر", "يعمل بالبطاريات", "تصميم حديث"]', false, true);

-- PAROIS DE DOUCHE CATEGORY
INSERT INTO products (name_fr, name_ar, description_fr, description_ar, price, sku, category_id, stock_quantity, image_url, brand, features_fr, features_ar, is_featured, is_active) VALUES

('Roca Town Paroi Fixe', 'روكا تاون حاجز ثابت', 'Paroi de douche fixe 120cm, verre sécurit 8mm et profilés aluminium.', 'حاجز دوش ثابت 120 سم، زجاج أمان 8 مم وملامح ألمنيوم.', 1850.00, 'ROC-TOW-PAR-024', 10, 15, 'https://ext.same-assets.com/1783899293/2809613452.jpeg', 'Roca', '["Largeur 120cm", "Verre 8mm", "Traitement anti-calcaire", "Profilés aluminium"]', '["عرض 120 سم", "زجاج 8 مم", "معالجة ضد الكلس", "ملامح ألمنيوم"]', true, true),

('Roca Town Porte Coulissante', 'روكا تاون باب منزلق', 'Porte de douche coulissante 140cm, ouverture facile et étanchéité parfaite.', 'باب دوش منزلق 140 سم، فتح سهل وإغلاق محكم.', 2450.00, 'ROC-TOW-POR-025', 10, 12, 'https://ext.same-assets.com/1783899293/772529207.jpeg', 'Roca', '["Largeur 140cm", "Coulissement doux", "Joints étanches", "Poignées ergonomiques"]', '["عرض 140 سم", "انزلاق ناعم", "مفاصل مانعة للتسرب", "مقابض مريحة"]', false, true);

-- More products for remaining categories would continue here...
-- This gives us a solid foundation of realistic Roca products across all major categories
