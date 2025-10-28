import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  ArrowRight,
  Check,
  ChevronLeft,
  Heart,
  Info,
  MinusCircle,
  PlusCircle,
  Shield,
  ShoppingCart,
  Star,
  Truck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
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

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { currentLanguage, t } = useLanguageStore();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<
    "description" | "specs" | "reviews"
  >("description");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const addToCart = useCartStore((state) => state.addItem);

  // Fetch product details using enhanced API
  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => enhancedProductApi.getProduct(Number(id)),
  });

  // Fetch related products using enhanced API
  const { data: relatedProducts, isLoading: isLoadingRelated } = useQuery({
    queryKey: ["relatedProducts", id],
    queryFn: () => enhancedProductApi.getRelated(Number(id), 4),
    enabled: !!id,
  });

  const handleQuantityChange = (value: number) => {
    if (value >= 1 && value <= (product?.stock_quantity || 10)) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      toast.success(
        currentLanguage === "fr"
          ? `${product.name_fr} ajouté au panier`
          : `${product.name_ar} تم إضافته إلى السلة`,
      );
    }
  };

  const getProductName = (p: Product) => {
    return currentLanguage === "fr" ? p.name_fr : p.name_ar;
  };

  const getProductDescription = (p: Product) => {
    return currentLanguage === "fr" ? p.description_fr : p.description_ar;
  };

  // Generate product images array (actual + fallbacks)
  const getProductImages = (p: Product) => {
    // Default images if none available
    const defaultImages = [
      p.image_url,
      `https://ext.same-assets.com/1783899293/${p.category_id === 1 ? "2781443950" : p.category_id === 2 ? "4219792059" : p.category_id === 3 ? "1040907038" : "185599656"}.jpeg`,
    ];

    // If product has additional images array, use it
    if (p.images) {
      try {
        // Fix the type issue by converting to string first if needed
        const imagesStr =
          typeof p.images === "string" ? p.images : JSON.stringify(p.images);
        const imageArray = JSON.parse(imagesStr);
        if (Array.isArray(imageArray) && imageArray.length > 0) {
          return [...imageArray, p.image_url];
        }
      } catch (e) {
        console.error("Error parsing product images:", e);
      }
    }

    return defaultImages;
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="bg-gray-200 h-6 w-48 mb-4 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-200 h-96 rounded"></div>
            <div>
              <div className="bg-gray-200 h-8 w-3/4 mb-4 rounded"></div>
              <div className="bg-gray-200 h-4 w-1/2 mb-2 rounded"></div>
              <div className="bg-gray-200 h-4 w-full mb-2 rounded"></div>
              <div className="bg-gray-200 h-4 w-full mb-2 rounded"></div>
              <div className="bg-gray-200 h-8 w-32 mb-4 rounded mt-4"></div>
              <div className="bg-gray-200 h-12 w-full mb-4 rounded"></div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-gray-200 h-12 rounded"></div>
                <div className="bg-gray-200 h-12 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>
              {currentLanguage === "fr"
                ? "Produit non trouvé ou erreur lors du chargement"
                : "المنتج غير موجود أو خطأ أثناء التحميل"}
            </span>
          </div>
          <p className="text-sm mt-2">
            {currentLanguage === "fr"
              ? "Veuillez réessayer ou retourner à la page des produits"
              : "يرجى المحاولة مرة أخرى أو العودة إلى صفحة المنتجات"}
          </p>
        </div>
        <button
          onClick={() => navigate("/products")}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          {currentLanguage === "fr"
            ? "Retour aux produits"
            : "العودة إلى المنتجات"}
        </button>
      </div>
    );
  }

  // Get product images
  const productImages = getProductImages(product);

  // Parse features if available
  let features: { title: string; value: string }[] = [];
  try {
    // Check if product has features field (type casting for backward compatibility)
    const productWithFeatures = product as any;
    const featuresField =
      currentLanguage === "fr"
        ? productWithFeatures.features_fr
        : productWithFeatures.features_ar;
    if (featuresField) {
      features = JSON.parse(featuresField as string);
    }
  } catch (e) {
    console.error("Error parsing product features:", e);
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex mb-6 text-sm text-gray-500 dark:text-gray-400">
          <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-500">
            {currentLanguage === "fr" ? "Accueil" : "الرئيسية"}
          </Link>
          <span className="mx-2">/</span>
          <Link
            to="/products"
            className="hover:text-blue-600 dark:hover:text-blue-500"
          >
            {currentLanguage === "fr" ? "Produits" : "المنتجات"}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 dark:text-white font-medium">
            {getProductName(product)}
          </span>
        </nav>

        {/* Product details */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
            {/* Product images */}
            <div>
              <div className="aspect-w-1 aspect-h-1 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden mb-4">
                <img
                  src={productImages[activeImageIndex]}
                  alt={getProductName(product)}
                  className="w-full h-full object-center object-cover"
                />
              </div>

              {/* Thumbnail images */}
              {productImages.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {productImages.map((img, index) => (
                    <button
                      key={index}
                      className={`bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden border-2 ${
                        index === activeImageIndex
                          ? "border-blue-500"
                          : "border-transparent"
                      }`}
                      onClick={() => setActiveImageIndex(index)}
                    >
                      <img
                        src={img}
                        alt={`${getProductName(product)} - Vue ${index + 1}`}
                        className="w-full h-full object-center object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product info */}
            <div>
              {/* Brand and SKU */}
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  {product.brand}
                </span>
                {product.sku && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    SKU: {product.sku}
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {getProductName(product)}
              </h1>

              {/* Rating */}
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= 4
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300 dark:text-gray-600"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                    4.0 (12 {currentLanguage === "fr" ? "avis" : "تقييمات"})
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="mb-6">
                {product.sale_price ? (
                  <div className="flex items-center">
                    <span className="text-2xl font-bold text-red-600 dark:text-red-500 mr-2">
                      {formatPrice(product.sale_price)}
                    </span>
                    <span className="text-lg text-gray-500 line-through">
                      {formatPrice(product.price)}
                    </span>
                    <span className="ml-2 bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded-full">
                      -
                      {Math.round(
                        ((product.price - product.sale_price) / product.price) *
                          100,
                      )}
                      %
                    </span>
                  </div>
                ) : (
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatPrice(product.price)}
                  </span>
                )}
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {currentLanguage === "fr"
                    ? "Prix TTC, livraison non incluse"
                    : "السعر شامل الضريبة، لا يشمل الشحن"}
                </p>
              </div>

              {/* Short description */}
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                {getProductDescription(product)}
              </p>

              {/* Availability - Using Enhanced API */}
              <div className="flex items-center mb-6">
                {getStockStatus(product.stock_quantity) === "in_stock" && (
                  <>
                    <div className="w-3 h-3 rounded-full mr-2 bg-green-500" />
                    <span className="text-sm text-green-600 dark:text-green-500 flex items-center">
                      <Check className="h-4 w-4 mr-1" />
                      {currentLanguage === "fr"
                        ? "En stock"
                        : "متوفر في المخزون"}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                      (
                      {currentLanguage === "fr"
                        ? `${product.stock_quantity} disponibles`
                        : `${product.stock_quantity} متوفرة`}
                      )
                    </span>
                  </>
                )}
                {getStockStatus(product.stock_quantity) === "low_stock" && (
                  <>
                    <div className="w-3 h-3 rounded-full mr-2 bg-orange-500" />
                    <span className="text-sm text-orange-600 dark:text-orange-500 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {currentLanguage === "fr"
                        ? `Stock limité - ${product.stock_quantity} restant${product.stock_quantity > 1 ? "s" : ""}`
                        : `مخزون محدود - ${product.stock_quantity} متبقي`}
                    </span>
                  </>
                )}
                {getStockStatus(product.stock_quantity) === "out_of_stock" && (
                  <>
                    <div className="w-3 h-3 rounded-full mr-2 bg-red-500" />
                    <span className="text-sm text-red-600 dark:text-red-500">
                      {currentLanguage === "fr"
                        ? "Rupture de stock"
                        : "غير متوفر في المخزون"}
                    </span>
                  </>
                )}
              </div>

              {/* Quantity selector */}
              {isProductInStock(product) && (
                <div className="mb-6">
                  <label
                    htmlFor="quantity"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    {currentLanguage === "fr" ? "Quantité" : "الكمية"}
                  </label>
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(quantity - 1)}
                      className={`text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 ${
                        quantity <= 1 ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      disabled={quantity <= 1}
                    >
                      <MinusCircle className="h-5 w-5" />
                    </button>
                    <input
                      type="number"
                      id="quantity"
                      name="quantity"
                      min="1"
                      max={product.stock_quantity}
                      value={quantity}
                      onChange={(e) =>
                        handleQuantityChange(Number.parseInt(e.target.value))
                      }
                      className="mx-2 block w-16 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-center"
                    />
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(quantity + 1)}
                      className={`text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 ${
                        quantity >= (product.stock_quantity || 10)
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      disabled={quantity >= (product.stock_quantity || 10)}
                    >
                      <PlusCircle className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Add to cart and buy now buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={!isProductInStock(product)}
                  className={`flex items-center justify-center px-4 py-3 border border-transparent rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    !isProductInStock(product)
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {currentLanguage === "fr"
                    ? "Ajouter au panier"
                    : "إضافة إلى السلة"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleAddToCart();
                    navigate("/cart");
                  }}
                  disabled={
                    !product.stock_quantity || product.stock_quantity <= 0
                  }
                  className={`flex items-center justify-center px-4 py-3 border border-transparent rounded-lg shadow-sm text-white bg-gray-800 dark:bg-gray-700 hover:bg-gray-900 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 ${
                    !product.stock_quantity || product.stock_quantity <= 0
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {currentLanguage === "fr"
                    ? "Acheter maintenant"
                    : "شراء الآن"}
                </button>
              </div>

              {/* Shipping and returns */}
              <div className="space-y-3 border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex items-center text-sm">
                  <Truck className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-3" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {currentLanguage === "fr"
                      ? "Livraison gratuite pour les commandes supérieures à 500 €"
                      : "شحن مجاني للطلبات التي تزيد عن 500 €"}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <Shield className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-3" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {currentLanguage === "fr"
                      ? "Garantie de 2 ans"
                      : "ضمان لمدة 2 سنة"}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <Check className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-3" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {currentLanguage === "fr"
                      ? "Retours gratuits sous 30 jours"
                      : "إرجاع مجاني خلال 30 يومًا"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product tabs - Description, Specifications, Reviews */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden mb-12">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex -mb-px">
              <button
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === "description"
                    ? "border-blue-500 text-blue-600 dark:text-blue-500"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
                onClick={() => setActiveTab("description")}
              >
                {currentLanguage === "fr" ? "Description" : "الوصف"}
              </button>
              <button
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === "specs"
                    ? "border-blue-500 text-blue-600 dark:text-blue-500"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
                onClick={() => setActiveTab("specs")}
              >
                {currentLanguage === "fr" ? "Caractéristiques" : "المواصفات"}
              </button>
              <button
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === "reviews"
                    ? "border-blue-500 text-blue-600 dark:text-blue-500"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
                onClick={() => setActiveTab("reviews")}
              >
                {currentLanguage === "fr" ? "Avis" : "التقييمات"}
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Description tab */}
            {activeTab === "description" && (
              <div className="prose max-w-none dark:prose-invert">
                <p className="text-gray-700 dark:text-gray-300">
                  {getProductDescription(product)}
                </p>
                <p className="text-gray-700 dark:text-gray-300 mt-4">
                  {currentLanguage === "fr"
                    ? `${getProductName(product)} de la marque ${
                        product.brand
                      } est un produit de haute qualité conçu pour durer. Avec son design élégant et moderne, il s'intègrera parfaitement dans votre salle de bain.`
                    : `${getProductName(product)} من ماركة ${
                        product.brand
                      } هو منتج عالي الجودة مصمم ليدوم. بتصميمه الأنيق والحديث، سيندمج بشكل مثالي في حمامك.`}
                </p>
              </div>
            )}

            {/* Specifications tab */}
            {activeTab === "specs" && (
              <div>
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    <tr>
                      <td className="py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                        {currentLanguage === "fr" ? "Marque" : "الماركة"}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                        {product.brand}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                        {currentLanguage === "fr" ? "Référence" : "المرجع"}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                        {product.sku || "-"}
                      </td>
                    </tr>
                    {features.length > 0 ? (
                      features.map((feature, index) => (
                        <tr key={index}>
                          <td className="py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                            {feature.title}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                            {feature.value}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <>
                        <tr>
                          <td className="py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                            {currentLanguage === "fr" ? "Matériau" : "المادة"}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                            {currentLanguage === "fr" ? "Céramique" : "سيراميك"}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                            {currentLanguage === "fr" ? "Couleur" : "اللون"}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                            {currentLanguage === "fr" ? "Blanc" : "أبيض"}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                            {currentLanguage === "fr"
                              ? "Dimensions"
                              : "الأبعاد"}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                            {currentLanguage === "fr"
                              ? "Selon spécifications produit"
                              : "حسب مواصفات المنتج"}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                            {currentLanguage === "fr" ? "Garantie" : "الضمان"}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                            {currentLanguage === "fr" ? "2 ans" : "سنتان"}
                          </td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Reviews tab */}
            {activeTab === "reviews" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {currentLanguage === "fr"
                      ? "Avis clients"
                      : "تقييمات العملاء"}
                  </h3>
                  <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    {currentLanguage === "fr"
                      ? "Écrire un avis"
                      : "كتابة تقييم"}
                  </button>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <img
                        className="h-10 w-10 rounded-full"
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt="Customer"
                      />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                        {currentLanguage === "fr" ? "Jean Dupont" : "جان دوبون"}
                      </h4>
                      <div className="flex items-center mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= 5
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                        {currentLanguage === "fr"
                          ? "Excellent produit, très satisfait de mon achat. La qualité est au rendez-vous et le rapport qualité-prix est imbattable."
                          : "منتج ممتاز، راضٍ جداً عن شرائي. الجودة موجودة ونسبة الجودة إلى السعر لا تضاهى."}
                      </p>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {currentLanguage === "fr"
                          ? "Posté le 12 mars 2023"
                          : "نُشر في 12 مارس 2023"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <img
                        className="h-10 w-10 rounded-full"
                        src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt="Customer"
                      />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                        {currentLanguage === "fr"
                          ? "Marie Martin"
                          : "ماري مارتن"}
                      </h4>
                      <div className="flex items-center mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= 4
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                        {currentLanguage === "fr"
                          ? "Très bon produit, conforme à mes attentes. Installation facile et design moderne. Je recommande vivement."
                          : "منتج جيد جدًا، يتوافق مع توقعاتي. سهل التركيب وتصميم عصري. أوصي به بشدة."}
                      </p>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {currentLanguage === "fr"
                          ? "Posté le 5 février 2023"
                          : "نُشر في 5 فبراير 2023"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-center mt-8">
                  <button className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    {currentLanguage === "fr"
                      ? "Voir tous les avis"
                      : "عرض جميع التقييمات"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related products */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {currentLanguage === "fr"
                ? "Produits similaires"
                : "منتجات مشابهة"}
            </h2>
            <Link
              to={`/products?category=${product.category_id}`}
              className="text-blue-600 dark:text-blue-500 hover:text-blue-800 dark:hover:text-blue-400 flex items-center text-sm font-medium"
            >
              {currentLanguage === "fr"
                ? "Voir tous les produits similaires"
                : "عرض جميع المنتجات المشابهة"}
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoadingRelated ? (
              // Loading skeletons
              Array(4)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden animate-pulse"
                  >
                    <div className="h-48 bg-gray-300 dark:bg-gray-700"></div>
                    <div className="p-4">
                      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                      <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/3"></div>
                    </div>
                  </div>
                ))
            ) : relatedProducts && relatedProducts.length > 0 ? (
              relatedProducts
                .filter((p: Product) => p.id !== product.id)
                .slice(0, 4)
                .map((relatedProduct: Product) => (
                  <div
                    key={relatedProduct.id}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <Link to={`/products/${relatedProduct.id}`}>
                      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-100 dark:bg-gray-700">
                        <img
                          src={relatedProduct.image_url}
                          alt={getProductName(relatedProduct)}
                          className="h-48 w-full object-cover object-center"
                        />
                      </div>
                    </Link>
                    <div className="p-4">
                      <Link to={`/products/${relatedProduct.id}`}>
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 line-clamp-2 mb-1">
                          {getProductName(relatedProduct)}
                        </h3>
                      </Link>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                        {relatedProduct.brand}
                      </p>
                      <div className="flex items-center justify-between">
                        <div>
                          {relatedProduct.sale_price ? (
                            <div className="flex items-center">
                              <span className="text-sm font-bold text-red-600 dark:text-red-500 mr-1">
                                {formatPrice(relatedProduct.sale_price)}
                              </span>
                              <span className="text-xs text-gray-500 line-through">
                                {formatPrice(relatedProduct.price)}
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm font-bold text-gray-900 dark:text-white">
                              {formatPrice(relatedProduct.price)}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => {
                            addToCart(relatedProduct);
                            toast.success(
                              currentLanguage === "fr"
                                ? `${relatedProduct.name_fr} ajouté au panier`
                                : `${relatedProduct.name_ar} تم إضافته إلى السلة`,
                            );
                          }}
                          className="p-1 rounded-full text-blue-600 dark:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900"
                        >
                          <ShoppingCart className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Info className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  {currentLanguage === "fr"
                    ? "Aucun produit similaire trouvé"
                    : "لم يتم العثور على منتجات مشابهة"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
