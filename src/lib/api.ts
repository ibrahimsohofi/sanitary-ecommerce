import axios from "axios";
import {
  categories,
  getFeaturedProducts,
  getProductById,
  getProductsByCategory,
  products,
} from "../data/products";
import type { Product } from "./store";

export interface RegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
}

export interface CartItem {
  product_id: number;
  quantity: number;
}

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
api.interceptors.request.use(
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

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// Check if backend is available
let backendAvailable = true;

const checkBackend = async () => {
  try {
    await api.get("/status", { timeout: 2000 });
    backendAvailable = true;
  } catch {
    backendAvailable = false;
    console.warn("Backend not available, using fallback data");
  }
};

// Initialize backend check
checkBackend();

// Product API methods
export const productApi = {
  // Get all products with filters
  async getProducts(params?: {
    category?: number;
    search?: string;
    min_price?: number;
    max_price?: number;
    sort?: string;
    page?: number;
    limit?: number;
  }) {
    try {
      if (backendAvailable) {
        const response = await api.get("/products", { params });
        // Our backend returns { success: true, products: [...], pagination: {...} }
        if (response.data.success) {
          return response.data;
        }
      }
    } catch (error) {
      console.warn("Backend not available, using local data");
      backendAvailable = false;
    }

    // Fallback to local data
    let filteredProducts = [...products];

    // Apply filters
    if (params?.category) {
      filteredProducts = filteredProducts.filter(
        (p) => p.category_id === params.category,
      );
    }

    if (params?.search) {
      const searchTerm = params.search.toLowerCase();
      filteredProducts = filteredProducts.filter(
        (p) =>
          p.name_fr.toLowerCase().includes(searchTerm) ||
          p.name_ar.toLowerCase().includes(searchTerm) ||
          p.description_fr.toLowerCase().includes(searchTerm) ||
          p.description_ar.toLowerCase().includes(searchTerm),
      );
    }

    if (params?.min_price !== undefined) {
      filteredProducts = filteredProducts.filter(
        (p) => p.price >= params.min_price!,
      );
    }

    if (params?.max_price !== undefined) {
      filteredProducts = filteredProducts.filter(
        (p) => p.price <= params.max_price!,
      );
    }

    // Apply sorting
    if (params?.sort === "price_asc") {
      filteredProducts.sort((a, b) => a.price - b.price);
    } else if (params?.sort === "price_desc") {
      filteredProducts.sort((a, b) => b.price - a.price);
    } else if (params?.sort === "newest") {
      filteredProducts.sort((a, b) => b.id - a.id);
    } else {
      // Default: featured first, then by id
      filteredProducts.sort((a, b) => {
        if (a.is_featured && !b.is_featured) return -1;
        if (!a.is_featured && b.is_featured) return 1;
        return b.id - a.id;
      });
    }

    // Apply pagination
    const page = params?.page || 1;
    const limit = params?.limit || 12;
    const offset = (page - 1) * limit;
    const paginatedProducts = filteredProducts.slice(offset, offset + limit);

    return {
      products: paginatedProducts,
      pagination: {
        page,
        limit,
        total: filteredProducts.length,
        pages: Math.ceil(filteredProducts.length / limit),
      },
    };
  },

  // Get single product
  async getProduct(id: number) {
    try {
      if (backendAvailable) {
        const response = await api.get(`/products/${id}`);
        // Our backend returns { success: true, product: {...} }
        if (response.data.success) {
          return response.data.product;
        }
      }
    } catch (error) {
      console.warn("Backend not available, using local data");
      backendAvailable = false;
    }

    // Fallback to local data
    const product = getProductById(id);
    if (!product) {
      throw new Error("Product not found");
    }

    return {
      ...product,
      reviews: [], // Mock empty reviews for now
    };
  },

  // Get featured products
  async getFeatured() {
    try {
      if (backendAvailable) {
        const response = await api.get("/products/featured/list");
        // Our backend returns { success: true, products: [...] }
        if (response.data.success) {
          return response.data.products;
        }
      }
    } catch (error) {
      console.warn("Backend not available, using local data");
      backendAvailable = false;
    }

    // Fallback to local data
    return getFeaturedProducts().slice(0, 8);
  },

  // Get products by category
  async getByCategory(categoryId: number, limit = 12) {
    try {
      if (backendAvailable) {
        const response = await api.get(
          `/products?category=${categoryId}&limit=${limit}`,
        );
        return response.data.products;
      }
    } catch (error) {
      console.warn("Backend not available, using local data");
      backendAvailable = false;
    }

    // Fallback to local data
    return getProductsByCategory(categoryId).slice(0, limit);
  },
};

// Categories API
export const categoryApi = {
  async getCategories() {
    try {
      if (backendAvailable) {
        const response = await api.get("/categories");
        console.log("Categories API response:", response.data);
        // Our backend returns { success: true, categories: [...] }
        if (response.data.success && Array.isArray(response.data.categories)) {
          return response.data.categories;
        } else if (Array.isArray(response.data)) {
          return response.data;
        }
      }
    } catch (error) {
      console.warn("Backend not available, using local data");
      backendAvailable = false;
    }

    // Fallback to local data
    console.log("Using fallback categories");
    return categories;
  },
};

// Auth API methods
export const authApi = {
  async login(email: string, password: string) {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  },

  async register(userData: RegisterData) {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },

  async logout() {
    await api.post("/auth/logout");
  },
};

// Cart API methods (will use localStorage when backend not available)
export const cartApi = {
  async getCart() {
    try {
      if (backendAvailable) {
        const response = await api.get("/cart");
        return response.data;
      }
    } catch (error) {
      console.warn("Backend not available, using localStorage for cart");
      backendAvailable = false;
    }

    // Fallback to localStorage
    const cart = localStorage.getItem("cart");
    return cart ? JSON.parse(cart) : [];
  },

  async addToCart(productId: number, quantity = 1) {
    try {
      if (backendAvailable) {
        const response = await api.post("/cart", {
          product_id: productId,
          quantity,
        });
        return response.data;
      }
    } catch (error) {
      console.warn("Backend not available, using localStorage for cart");
      backendAvailable = false;
    }

    // Fallback to localStorage
    const cart: CartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItem = cart.find(
      (item: CartItem) => item.product_id === productId,
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ product_id: productId, quantity });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    return { success: true };
  },
};

export default api;
