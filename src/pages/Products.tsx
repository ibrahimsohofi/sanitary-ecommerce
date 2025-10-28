import {
  AlertCircle,
  Check,
  Filter,
  Grid,
  List,
  MinusCircle,
  Search,
  ShoppingCart,
  Star,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import {
  type ProductFilters,
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

interface Category {
  id: number;
  name: string;
  name_fr: string;
  name_ar: string;
}

interface ProductParams {
  page: number;
  limit: number;
  category?: number;
  search?: string;
  min_price?: number;
  max_price?: number;
  sort?: string;
}

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  });
  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "",
    search: searchParams.get("search") || "",
    minPrice: "",
    maxPrice: "",
    sort: "featured",
    featured: searchParams.get("featured") === "true",
  });

  const addToCart = useCartStore((state) => state.addItem);
  const { currentLanguage, t } = useLanguageStore();

  // Load products using enhanced API
  const loadProducts = async (page = 1) => {
    setLoading(true);
    try {
      const apiFilters: ProductFilters = {
        limit: pagination.limit,
        offset: (page - 1) * pagination.limit,
      };

      if (filters.category)
        apiFilters.category = Number.parseInt(filters.category);
      if (filters.search) apiFilters.search = filters.search;
      if (filters.minPrice)
        apiFilters.minPrice = Number.parseFloat(filters.minPrice);
      if (filters.maxPrice)
        apiFilters.maxPrice = Number.parseFloat(filters.maxPrice);
      if (filters.featured) apiFilters.featured = true;

      const response = await enhancedProductApi.getProducts(apiFilters);
      setProducts(response.products);
      setPagination({
        page: response.page,
        limit: response.limit,
        total: response.total,
        pages: Math.ceil(response.total / response.limit),
      });
    } catch (error) {
      console.error("Error loading products:", error);
      toast.error(
        t("error.loading_products") || "Erreur lors du chargement des produits",
      );
    } finally {
      setLoading(false);
    }
  };

  // Load categories using enhanced API
  const loadCategories = async () => {
    try {
      const categoriesData = await enhancedProductApi.getCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts(1);
  }, [filters]);

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    // Update URL params
    const newParams = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) newParams.set(k, String(v));
    });
    setSearchParams(newParams);
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    toast.success(
      currentLanguage === "fr"
        ? `${product.name_fr} ajouté au panier`
        : `${product.name_ar} تم إضافته إلى السلة`,
    );
  };

  const getCategoryName = (categoryId: number) => {
    const category = categories.find((c) => c.id === categoryId);
    if (!category) return "";
    return currentLanguage === "fr" ? category.name_fr : category.name_ar;
  };

  const getProductName = (product: Product) => {
    return currentLanguage === "fr" ? product.name_fr : product.name_ar;
  };

  const getProductDescription = (product: Product) => {
    return currentLanguage === "fr"
      ? product.description_fr
      : product.description_ar;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {t("products.title")}
          </h1>

          {/* Search Bar */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={
                currentLanguage === "fr"
                  ? "Rechercher des produits..."
                  : "ابحث عن المنتجات..."
              }
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            {/* Category Filter */}
            <select
              className="px-4 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              value={filters.category}
              onChange={(e) => handleFilterChange("category", e.target.value)}
            >
              <option value="">
                {currentLanguage === "fr"
                  ? "Toutes les catégories"
                  : "جميع الفئات"}
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {currentLanguage === "fr"
                    ? category.name_fr
                    : category.name_ar}
                </option>
              ))}
            </select>

            {/* Sort Filter */}
            <select
              className="px-4 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              value={filters.sort}
              onChange={(e) => handleFilterChange("sort", e.target.value)}
            >
              <option value="featured">
                {currentLanguage === "fr"
                  ? "Produits vedettes"
                  : "المنتجات المميزة"}
              </option>
              <option value="price_asc">
                {currentLanguage === "fr"
                  ? "Prix croissant"
                  : "السعر من الأقل للأعلى"}
              </option>
              <option value="price_desc">
                {currentLanguage === "fr"
                  ? "Prix décroissant"
                  : "السعر من الأعلى للأقل"}
              </option>
              <option value="newest">
                {currentLanguage === "fr" ? "Plus récents" : "الأحدث"}
              </option>
            </select>

            {/* Price Range */}
            <div className="flex gap-2">
              <input
                type="number"
                placeholder={currentLanguage === "fr" ? "Prix min" : "أقل سعر"}
                className="w-24 px-3 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange("minPrice", e.target.value)}
              />
              <input
                type="number"
                placeholder={currentLanguage === "fr" ? "Prix max" : "أعلى سعر"}
                className="w-24 px-3 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
              />
            </div>

            {/* View Mode */}
            <div className="flex border border-gray-300 rounded-md">
              <button
                className={`p-2 ${viewMode === "grid" ? "bg-blue-500 text-white" : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"}`}
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                className={`p-2 ${viewMode === "list" ? "bg-blue-500 text-white" : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"}`}
                onClick={() => setViewMode("list")}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Results Count */}
          <p className="text-gray-600 dark:text-gray-400">
            {pagination.total} {t("products.found")}{" "}
            {pagination.total > 1 ? "s" : ""}
          </p>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
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
            {/* Products Grid */}
            {products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  {t("products.no_results")}
                </p>
              </div>
            ) : (
              <div
                className={`grid gap-6 ${
                  viewMode === "grid"
                    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    : "grid-cols-1"
                }`}
              >
                {products.map((product) => (
                  <div
                    key={product.id}
                    className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 ${
                      viewMode === "list" ? "flex" : ""
                    }`}
                  >
                    {/* Product Image */}
                    <div
                      className={`${viewMode === "list" ? "w-48 flex-shrink-0" : "w-full"}`}
                    >
                      <img
                        src={product.image_url}
                        alt={getProductName(product)}
                        className={`w-full object-cover ${viewMode === "list" ? "h-full" : "h-48"}`}
                      />
                      {product.is_featured && (
                        <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                          {t("products.featured")}
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div
                      className={`p-4 ${viewMode === "list" ? "flex-1" : ""}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
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
                        {getCategoryName(product.category_id)} • {product.brand}
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
                            <ShoppingCart className="h-4 w-4 mr-1" />
                            {t("products.add_cart")}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-8">
                <button
                  disabled={pagination.page === 1}
                  onClick={() => loadProducts(pagination.page - 1)}
                  className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  {currentLanguage === "fr" ? "Précédent" : "السابق"}
                </button>

                {[...Array(pagination.pages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => loadProducts(i + 1)}
                    className={`px-3 py-2 border rounded-md ${
                      pagination.page === i + 1
                        ? "bg-blue-600 text-white border-blue-600"
                        : "border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  disabled={pagination.page === pagination.pages}
                  onClick={() => loadProducts(pagination.page + 1)}
                  className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  {currentLanguage === "fr" ? "Suivant" : "التالي"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Products;
