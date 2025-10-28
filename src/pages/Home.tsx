import {
  AlertCircle,
  ArrowRight,
  Award,
  Check,
  MinusCircle,
  Shield,
  ShoppingBag,
  ShoppingCart,
  Star,
  Truck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  enhancedProductApi,
  getStockStatus,
  isProductInStock,
} from "../lib/enhanced-api";
import {
  type Product,
  formatPrice,
  useCartStore,
  useLanguageStore,
} from "../lib/store";

const Home = () => {
  const { currentLanguage, t } = useLanguageStore();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const addToCart = useCartStore((state) => state.addItem);

  // Load featured products using enhanced API
  const loadFeaturedProducts = async () => {
    try {
      const products = await enhancedProductApi.getFeatured(8);
      setFeaturedProducts(products);
    } catch (error) {
      console.error("Error loading featured products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    toast.success(
      currentLanguage === "fr"
        ? `${product.name_fr} ajouté au panier`
        : `${product.name_ar} تم إضافته إلى السلة`,
    );
  };

  const getProductName = (product: Product) => {
    return currentLanguage === "fr" ? product.name_fr : product.name_ar;
  };

  const getProductDescription = (product: Product) => {
    return currentLanguage === "fr"
      ? product.description_fr
      : product.description_ar;
  };

  const features = [
    {
      icon: Shield,
      title: t("features.quality.title"),
      description: t("features.quality.desc"),
    },
    {
      icon: Truck,
      title: t("features.shipping.title"),
      description: t("features.shipping.desc"),
    },
    {
      icon: Award,
      title: t("features.expertise.title"),
      description: t("features.expertise.desc"),
    },
    {
      icon: ShoppingBag,
      title: t("features.choice.title"),
      description: t("features.choice.desc"),
    },
  ];

  const categories = [
    {
      name: t("nav.toilets"),
      image: "https://ext.same-assets.com/1783899293/2781443950.jpeg",
      link: "/products?category=1",
      description:
        currentLanguage === "ar"
          ? "مراحيض وملحقاتها عالية الجودة"
          : "WC et accessoires de qualité",
    },
    {
      name: t("nav.sinks"),
      image: "https://ext.same-assets.com/1783899293/4219792059.jpeg",
      link: "/products?category=2",
      description:
        currentLanguage === "ar"
          ? "أحواض وأوعية حديثة"
          : "Lavabos et vasques modernes",
    },
    {
      name: t("nav.faucets"),
      image: "https://ext.same-assets.com/1783899293/1040907038.jpeg",
      link: "/products?category=3",
      description:
        currentLanguage === "ar"
          ? "صنابير وخلاطات عصرية"
          : "Robinets et mitigeurs design",
    },
    {
      name: t("nav.showers"),
      image: "https://ext.same-assets.com/1783899293/185599656.jpeg",
      link: "/products?category=4",
      description:
        currentLanguage === "ar"
          ? "كبائن الاستحمام وملحقاتها"
          : "Cabines et accessoires de douche",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div
              className={`${currentLanguage === "ar" ? "text-right" : "text-left"}`}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                {t("home.hero.title")}
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                {t("home.hero.subtitle")}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/products"
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center group"
                >
                  {t("home.hero.cta1")}
                  <ArrowRight className="ml-2 rtl:ml-0 rtl:mr-2 rtl:rotate-180 h-5 w-5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/products?featured=true"
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors flex items-center justify-center"
                >
                  {t("home.hero.cta2")}
                </Link>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://ext.same-assets.com/1783899293/2781001991.jpeg"
                alt="Salle de bain moderne"
                className="rounded-lg shadow-2xl"
              />
              <div
                className={`absolute -bottom-6 ${currentLanguage === "ar" ? "-right-6" : "-left-6"} bg-yellow-400 text-gray-900 p-4 rounded-lg shadow-lg`}
              >
                <p className="font-semibold">
                  {currentLanguage === "ar"
                    ? "توصيل مجاني"
                    : "Livraison gratuite"}
                </p>
                <p className="text-sm">
                  {currentLanguage === "ar" ? "خلال 48 ساعة" : "sous 48h"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-gray-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {t("home.features.title")}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t("home.features.subtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow bg-gray-50 dark:bg-gray-700"
              >
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {currentLanguage === "ar"
                ? "منتجاتنا المميزة"
                : "Nos Produits Vedettes"}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {currentLanguage === "ar"
                ? "اكتشف مجموعة مختارة من أفضل منتجات Roca للحمام الحديث"
                : "Découvrez une sélection des meilleurs produits Roca pour votre salle de bain moderne"}
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-pulse"
                >
                  <div className="bg-gray-300 dark:bg-gray-600 h-48 rounded-md mb-4"></div>
                  <div className="bg-gray-300 dark:bg-gray-600 h-4 rounded w-3/4 mb-2"></div>
                  <div className="bg-gray-300 dark:bg-gray-600 h-4 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {featuredProducts.slice(0, 4).map((product) => (
                  <div
                    key={product.id}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="relative">
                      <img
                        src={product.image_url}
                        alt={getProductName(product)}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                        {currentLanguage === "ar" ? "مميز" : "Vedette"}
                      </div>
                      {product.sale_price && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                          -
                          {Math.round(
                            ((product.price - product.sale_price) /
                              product.price) *
                              100,
                          )}
                          %
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                          {getProductName(product)}
                        </h3>
                        <div className="flex items-center ml-2">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                            4.5
                          </span>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {product.brand}
                      </p>

                      {/* Stock Status Indicator */}
                      <div className="mb-2">
                        {getStockStatus(product.stock_quantity) ===
                          "in_stock" && (
                          <span className="inline-flex items-center text-xs text-green-600 dark:text-green-400">
                            <Check className="h-3 w-3 mr-1" />
                            {currentLanguage === "ar" ? "متوفر" : "En stock"}
                          </span>
                        )}
                        {getStockStatus(product.stock_quantity) ===
                          "low_stock" && (
                          <span className="inline-flex items-center text-xs text-orange-600 dark:text-orange-400">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            {currentLanguage === "ar"
                              ? `فقط ${product.stock_quantity} متبقي`
                              : `Seulement ${product.stock_quantity} restant${product.stock_quantity > 1 ? "s" : ""}`}
                          </span>
                        )}
                        {getStockStatus(product.stock_quantity) ===
                          "out_of_stock" && (
                          <span className="inline-flex items-center text-xs text-red-600 dark:text-red-400">
                            <MinusCircle className="h-3 w-3 mr-1" />
                            {currentLanguage === "ar"
                              ? "غير متوفر"
                              : "Rupture de stock"}
                          </span>
                        )}
                      </div>

                      <p className="text-gray-700 dark:text-gray-300 text-sm mb-3 line-clamp-2">
                        {getProductDescription(product)}
                      </p>

                      <div className="flex items-center justify-between">
                        <div>
                          {product.sale_price ? (
                            <div className="flex items-center space-x-2">
                              <span className="text-lg font-bold text-red-600">
                                {formatPrice(product.sale_price)}
                              </span>
                              <span className="text-sm text-gray-500 line-through">
                                {formatPrice(product.price)}
                              </span>
                            </div>
                          ) : (
                            <span className="text-lg font-bold text-gray-900 dark:text-white">
                              {formatPrice(product.price)}
                            </span>
                          )}
                        </div>

                        <div className="flex space-x-2">
                          <Link
                            to={`/products/${product.id}`}
                            className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-2 rounded-md text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                          >
                            {currentLanguage === "fr" ? "Voir" : "عرض"}
                          </Link>
                          <button
                            onClick={() => handleAddToCart(product)}
                            disabled={!isProductInStock(product)}
                            className={`px-3 py-2 rounded-md text-sm transition-colors flex items-center ${
                              isProductInStock(product)
                                ? "bg-blue-600 text-white hover:bg-blue-700"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}
                          >
                            <ShoppingCart className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <Link
                  to="/products?featured=true"
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center group"
                >
                  {currentLanguage === "ar"
                    ? "عرض جميع المنتجات المميزة"
                    : "Voir tous les produits vedettes"}
                  <ArrowRight className="ml-2 rtl:ml-0 rtl:mr-2 rtl:rotate-180 h-5 w-5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white dark:bg-gray-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {t("home.categories.title")}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {currentLanguage === "ar"
                ? "استكشف مجموعتنا الواسعة من المنتجات الصحية المنظمة حسب الفئة للعثور على ما تحتاجه بالضبط."
                : "Explorez notre large gamme de produits sanitaires organisés par catégorie pour trouver exactement ce dont vous avez besoin."}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={category.link}
                className="group bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="aspect-w-16 aspect-h-12 overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {category.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">{t("home.cta.title")}</h2>
          <p className="text-xl mb-8 text-blue-100">
            {currentLanguage === "ar"
              ? "اكتشف عروضنا الحصرية واستفد من نصائح الخبراء."
              : "Découvrez nos promotions exclusives et bénéficiez de conseils d'experts."}
          </p>
          <Link
            to="/products"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center group"
          >
            {t("home.cta.button")}
            <ArrowRight className="ml-2 rtl:ml-0 rtl:mr-2 rtl:rotate-180 h-5 w-5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
