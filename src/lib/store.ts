import { create } from "zustand";
import { persist } from "zustand/middleware";

// Types
export interface Product {
  id: number;
  name_fr: string;
  name_ar: string;
  description_fr: string;
  description_ar: string;
  price: number;
  sale_price?: number;
  sku: string;
  category_id: number;
  stock_quantity: number;
  image_url: string;
  images?: string[];
  brand: string;
  is_featured: boolean;
  is_active: boolean;
}

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: "customer" | "admin";
  language: string;
}

// Theme Store
interface ThemeStore {
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      isDark: false,

      toggleTheme: () => {
        set((state) => {
          const newIsDark = !state.isDark;
          // Update document class for Tailwind dark mode
          if (newIsDark) {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.remove("dark");
          }
          return { isDark: newIsDark };
        });
      },

      setTheme: (isDark) => {
        set({ isDark });
        if (isDark) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      },
    }),
    {
      name: "theme-storage",
      onRehydrateStorage: () => (state) => {
        // Apply theme on hydration
        if (state?.isDark) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      },
    },
  ),
);

// Language Store
interface LanguageStore {
  currentLanguage: "fr" | "ar";
  setLanguage: (language: "fr" | "ar") => void;
  t: (key: string) => string;
}

// Translations
const translations = {
  fr: {
    // Navigation
    "nav.home": "Accueil",
    "nav.products": "Produits",
    "nav.toilets": "Toilettes",
    "nav.sinks": "Lavabos",
    "nav.faucets": "Robinetterie",
    "nav.showers": "Douches",
    "nav.bathtubs": "Baignoires",
    "nav.accessories": "Accessoires",
    "nav.cart": "Panier",
    "nav.login": "Connexion",
    "nav.search": "Rechercher des produits...",

    // Home page
    "home.hero.title": "Équipez votre salle de bain avec style",
    "home.hero.subtitle":
      "Découvrez notre sélection premium d'équipements sanitaires. Qualité, design et innovation pour votre confort quotidien.",
    "home.hero.cta1": "Voir tous les produits",
    "home.hero.cta2": "Nos coups de cœur",
    "home.features.title": "Pourquoi choisir SanitaryShop ?",
    "home.features.subtitle":
      "Nous nous engageons à vous offrir la meilleure expérience d'achat avec des produits de qualité et un service client exceptionnel.",
    "home.categories.title": "Nos Catégories",
    "home.cta.title": "Prêt à transformer votre salle de bain ?",
    "home.cta.button": "Commencer mes achats",

    // Features
    "features.quality.title": "Qualité Garantie",
    "features.quality.desc":
      "Produits certifiés et garantis pour votre tranquillité d'esprit",
    "features.shipping.title": "Livraison Rapide",
    "features.shipping.desc":
      "Livraison gratuite sous 48h pour toutes commandes",
    "features.expertise.title": "Expertise",
    "features.expertise.desc":
      "15 ans d'expérience dans l'équipement sanitaire",
    "features.choice.title": "Large Choix",
    "features.choice.desc": "Plus de 1000 références disponibles en stock",

    // Products
    "products.title": "Produits",
    "products.found": "produit(s) trouvé(s)",
    "products.filters": "Filtres",
    "products.featured": "Produit vedette",
    "products.add_cart": "Ajouter",
    "products.no_results": "Aucun produit trouvé avec ces critères.",

    // Cart
    "cart.title": "Panier",
    "cart.empty": "Votre panier est vide",
    "cart.empty_desc":
      "Découvrez notre sélection de produits sanitaires et ajoutez vos favoris au panier.",
    "cart.continue": "Continuer les achats",
    "cart.clear": "Vider le panier",
    "cart.subtotal": "Sous-total",
    "cart.shipping": "Livraison",
    "cart.total": "Total",
    "cart.checkout": "Procéder au paiement",
    "cart.free_shipping": "Gratuite",
    "cart.free_shipping_notice":
      "✓ Livraison gratuite pour les commandes de plus de 1000 MAD",

    // Auth
    "auth.login.title": "Connexion à votre compte",
    "auth.login.subtitle": "Ou créez un nouveau compte",
    "auth.email": "Adresse e-mail",
    "auth.password": "Mot de passe",
    "auth.remember": "Se souvenir de moi",
    "auth.forgot": "Mot de passe oublié ?",
    "auth.login.button": "Se connecter",
    "auth.no_account": "Pas encore de compte ?",
    "auth.create_account": "Créer un compte",

    // Common
    "common.price": "Prix",
    "common.brand": "Marque",
    "common.category": "Catégorie",
    "common.currency": "MAD",
  },
  ar: {
    // Navigation
    "nav.home": "الرئيسية",
    "nav.products": "المنتجات",
    "nav.toilets": "مراحيض",
    "nav.sinks": "أحواض",
    "nav.faucets": "حنفيات",
    "nav.showers": "دوشات",
    "nav.bathtubs": "أحواض استحمام",
    "nav.accessories": "إكسسوارات",
    "nav.cart": "العربة",
    "nav.login": "تسجيل الدخول",
    "nav.search": "البحث عن المنتجات...",

    // Home page
    "home.hero.title": "جهز حمامك بأناقة",
    "home.hero.subtitle":
      "اكتشف مجموعتنا المتميزة من المعدات الصحية. الجودة والتصميم والابتكار لراحتك اليومية.",
    "home.hero.cta1": "عرض جميع المنتجات",
    "home.hero.cta2": "منتجاتنا المميزة",
    "home.features.title": "لماذا تختار SanitaryShop؟",
    "home.features.subtitle":
      "نحن ملتزمون بتقديم أفضل تجربة تسوق مع منتجات عالية الجودة وخدمة عملاء استثنائية.",
    "home.categories.title": "فئاتنا",
    "home.cta.title": "مستعد لتحويل حمامك؟",
    "home.cta.button": "ابدأ التسوق",

    // Features
    "features.quality.title": "جودة مضمونة",
    "features.quality.desc": "منتجات معتمدة ومضمونة لراحة بالك",
    "features.shipping.title": "توصيل سريع",
    "features.shipping.desc": "توصيل مجاني خلال 48 ساعة لجميع الطلبات",
    "features.expertise.title": "خبرة",
    "features.expertise.desc": "15 سنة من الخبرة في المعدات الصحية",
    "features.choice.title": "خيارات واسعة",
    "features.choice.desc": "أكثر من 1000 منتج متوفر في المخزون",

    // Products
    "products.title": "المنتجات",
    "products.found": "منتج موجود",
    "products.filters": "المرشحات",
    "products.featured": "منتج مميز",
    "products.add_cart": "أضف",
    "products.no_results": "لم يتم العثور على منتجات بهذه المعايير.",

    // Cart
    "cart.title": "عربة التسوق",
    "cart.empty": "عربتك فارغة",
    "cart.empty_desc":
      "اكتشف مجموعة منتجاتنا الصحية وأضف المفضلة لديك إلى العربة.",
    "cart.continue": "متابعة التسوق",
    "cart.clear": "إفراغ العربة",
    "cart.subtotal": "المجموع الفرعي",
    "cart.shipping": "الشحن",
    "cart.total": "الإجمالي",
    "cart.checkout": "إتمام الشراء",
    "cart.free_shipping": "مجاني",
    "cart.free_shipping_notice": "✓ شحن مجاني للطلبات أكثر من 1000 درهم",

    // Auth
    "auth.login.title": "تسجيل الدخول إلى حسابك",
    "auth.login.subtitle": "أو إنشاء حساب جديد",
    "auth.email": "البريد الإلكتروني",
    "auth.password": "كلمة المرور",
    "auth.remember": "تذكرني",
    "auth.forgot": "نسيت كلمة المرور؟",
    "auth.login.button": "تسجيل الدخول",
    "auth.no_account": "ليس لديك حساب؟",
    "auth.create_account": "إنشاء حساب",

    // Common
    "common.price": "السعر",
    "common.brand": "العلامة التجارية",
    "common.category": "الفئة",
    "common.currency": "درهم",
  },
};

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set, get) => ({
      currentLanguage: "fr",

      setLanguage: (language) => {
        set({ currentLanguage: language });
        // Update document direction for RTL
        document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
        document.documentElement.lang = language;
      },

      t: (key) => {
        const { currentLanguage } = get();
        const langTranslations =
          translations[currentLanguage as keyof typeof translations];
        return (langTranslations as Record<string, string>)[key] || key;
      },
    }),
    {
      name: "language-storage",
      onRehydrateStorage: () => (state) => {
        // Apply language on hydration
        if (state?.currentLanguage) {
          document.documentElement.dir =
            state.currentLanguage === "ar" ? "rtl" : "ltr";
          document.documentElement.lang = state.currentLanguage;
        }
      },
    },
  ),
);

// Cart Store
interface CartStore {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1) => {
        const currentItems = get().items;
        const existingItem = currentItems.find(
          (item) => item.product.id === product.id,
        );

        if (existingItem) {
          set({
            items: currentItems.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item,
            ),
          });
        } else {
          set({
            items: [...currentItems, { id: Date.now(), product, quantity }],
          });
        }
      },

      removeItem: (productId) => {
        set({
          items: get().items.filter((item) => item.product.id !== productId),
        });
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set({
          items: get().items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item,
          ),
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotal: () => {
        return get().items.reduce((total, item) => {
          const price = item.product.sale_price || item.product.price;
          return total + price * item.quantity;
        }, 0);
      },

      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: "cart-storage",
    },
  ),
);

// Auth Store
interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: (user, token) => {
        set({
          user,
          token,
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
        // Clear cart on logout
        useCartStore.getState().clearCart();
      },

      updateUser: (userData) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, ...userData },
          });
        }
      },
    }),
    {
      name: "auth-storage",
    },
  ),
);

// Currency formatter for MAD
export const formatPrice = (
  price: number | undefined,
  language: "fr" | "ar" = "fr",
): string => {
  if (price === undefined || price === null) {
    return language === "ar" ? "السعر غير متوفر" : "Prix non disponible";
  }
  if (language === "ar") {
    return `${price.toFixed(2)} درهم`;
  }
  return `${price.toFixed(2)} MAD`;
};
