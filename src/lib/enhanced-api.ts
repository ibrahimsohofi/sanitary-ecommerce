import axios from "axios";
import { categories, products as localProducts } from "../data/products";
import type { Product } from "./store";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const enhancedApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000,
});

// Add auth token to requests
enhancedApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Enhanced Product Interface
export interface EnhancedProduct extends Product {
  rating?: number;
  reviews_count?: number;
  sale_price?: number;
  specifications?: Record<string, string>;
  tags?: string[];
}

export interface ProductFilters {
  category?: number;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  inStock?: boolean;
  featured?: boolean;
  limit?: number;
  offset?: number;
}

export interface PaginatedResponse<T> {
  products: T[];
  total: number;
  hasMore: boolean;
  page: number;
  limit: number;
}

// Stock management utilities
const isProductInStock = (product: Product): boolean => {
  return product.stock_quantity > 0;
};

const getStockStatus = (stock: number): string => {
  if (stock === 0) return "out_of_stock";
  if (stock < 5) return "low_stock";
  return "in_stock";
};

// Enhanced Product API
export const enhancedProductApi = {
  // Get products with advanced filtering and pagination
  async getProducts(
    filters: ProductFilters = {},
  ): Promise<PaginatedResponse<EnhancedProduct>> {
    try {
      const response = await enhancedApi.get("/products", { params: filters });

      if (response.data && Array.isArray(response.data)) {
        return {
          products: response.data,
          total: response.data.length,
          hasMore: false,
          page: 1,
          limit: filters.limit || 20,
        };
      }
    } catch (error) {
      console.warn("Backend API unavailable, using local data");
    }

    // Fallback to local data
    return this.getProductsFromLocal(filters);
  },

  // Get products from local data (fallback)
  getProductsFromLocal(
    filters: ProductFilters = {},
  ): PaginatedResponse<EnhancedProduct> {
    let filtered = [...localProducts] as EnhancedProduct[];

    // Apply category filter
    if (filters.category !== undefined) {
      filtered = filtered.filter((p) => p.category_id === filters.category);
    }

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name_fr.toLowerCase().includes(searchLower) ||
          p.name_ar.includes(filters.search || "") ||
          p.brand?.toLowerCase().includes(searchLower) ||
          p.description_fr?.toLowerCase().includes(searchLower),
      );
    }

    // Apply price filters
    if (filters.minPrice !== undefined) {
      const minPrice = filters.minPrice;
      filtered = filtered.filter((p) => p.price >= minPrice);
    }

    if (filters.maxPrice !== undefined) {
      const maxPrice = filters.maxPrice;
      filtered = filtered.filter((p) => p.price <= maxPrice);
    }

    // Apply brand filter
    if (filters.brand) {
      filtered = filtered.filter((p) => p.brand === filters.brand);
    }

    // Apply stock filter
    if (filters.inStock) {
      filtered = filtered.filter((p) => isProductInStock(p));
    }

    // Apply featured filter
    if (filters.featured) {
      filtered = filtered.filter((p) => p.is_featured);
    }

    // Calculate pagination
    const limit = filters.limit || 20;
    const offset = filters.offset || 0;
    const total = filtered.length;
    const paginatedProducts = filtered.slice(offset, offset + limit);
    const hasMore = offset + limit < total;

    return {
      products: paginatedProducts,
      total,
      hasMore,
      page: Math.floor(offset / limit) + 1,
      limit,
    };
  },

  // Get single product by ID
  async getProduct(id: number): Promise<EnhancedProduct | null> {
    try {
      const response = await enhancedApi.get(`/products/${id}`);
      if (response.data) {
        return response.data;
      }
    } catch (error) {
      console.warn("Backend API unavailable, using local data");
    }

    // Fallback to local data
    const product = localProducts.find((p) => p.id === id);
    return product ? (product as EnhancedProduct) : null;
  },

  // Get featured products
  async getFeatured(limit = 8): Promise<EnhancedProduct[]> {
    try {
      const response = await enhancedApi.get("/products", {
        params: { featured: true, limit },
      });

      if (response.data && Array.isArray(response.data)) {
        return response.data;
      }
    } catch (error) {
      console.warn("Backend API unavailable, using local data");
    }

    // Fallback to local data
    return localProducts
      .filter((p) => p.is_featured)
      .slice(0, limit) as EnhancedProduct[];
  },

  // Get products by category
  async getByCategory(
    categoryId: number,
    limit?: number,
  ): Promise<EnhancedProduct[]> {
    const result = await this.getProducts({ category: categoryId, limit });
    return result.products;
  },

  // Search products
  async search(
    query: string,
    filters: ProductFilters = {},
  ): Promise<EnhancedProduct[]> {
    const result = await this.getProducts({ ...filters, search: query });
    return result.products;
  },

  // Get related products
  async getRelated(productId: number, limit = 4): Promise<EnhancedProduct[]> {
    const product = await this.getProduct(productId);
    if (!product) return [];

    const result = await this.getProducts({
      category: product.category_id,
      limit: limit + 1,
    });

    return result.products.filter((p) => p.id !== productId).slice(0, limit);
  },

  // Get all categories
  async getCategories() {
    try {
      const response = await enhancedApi.get("/categories");
      if (response.data && Array.isArray(response.data)) {
        return response.data;
      }
    } catch (error) {
      console.warn("Backend API unavailable, using local categories");
    }

    // Fallback to local categories
    return categories;
  },

  // Get all unique brands
  getBrands(): string[] {
    const brands = new Set<string>();
    localProducts.forEach((p) => {
      if (p.brand) brands.add(p.brand);
    });
    return Array.from(brands).sort();
  },

  // Get price range
  getPriceRange(): { min: number; max: number } {
    const prices = localProducts.map((p) => p.price);
    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices)),
    };
  },

  // Get product statistics
  async getStats() {
    const result = await this.getProducts({ limit: 10000 });
    const products = result.products;

    return {
      totalProducts: products.length,
      categories: categories.length,
      brands: this.getBrands().length,
      averagePrice:
        products.reduce((sum, p) => sum + p.price, 0) / products.length,
      inStockCount: products.filter((p) => isProductInStock(p)).length,
      outOfStockCount: products.filter((p) => !isProductInStock(p)).length,
    };
  },
};

// Export utilities
export { isProductInStock, getStockStatus };

// Default export
export default enhancedProductApi;
