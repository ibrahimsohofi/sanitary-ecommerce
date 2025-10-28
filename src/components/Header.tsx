import {
  Globe,
  Menu,
  Moon,
  Search,
  ShoppingCart,
  Sun,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCartStore, useLanguageStore, useThemeStore } from "../lib/store";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const navigate = useNavigate();

  const cartItems = useCartStore((state) => state.items);
  const { currentLanguage, setLanguage, t } = useLanguageStore();
  const { isDark, toggleTheme } = useThemeStore();

  const cartItemCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const handleLanguageChange = (language: "fr" | "ar") => {
    setLanguage(language);
    setIsLanguageMenuOpen(false);
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-md border-b border-gray-200 dark:border-gray-700 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 rtl:space-x-reverse"
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">
                S
              </span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              SanitaryShop
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
            <Link
              to="/"
              className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-accent transition-colors"
            >
              {t("nav.home")}
            </Link>
            <Link
              to="/products"
              className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-accent transition-colors"
            >
              {t("nav.products")}
            </Link>
            <Link
              to="/products?category=toilettes"
              className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-accent transition-colors"
            >
              {t("nav.toilets")}
            </Link>
            <Link
              to="/products?category=lavabos"
              className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-accent transition-colors"
            >
              {t("nav.sinks")}
            </Link>
            <Link
              to="/products?category=robinetterie"
              className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-accent transition-colors"
            >
              {t("nav.faucets")}
            </Link>
          </nav>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex items-center max-w-sm flex-1 mx-8"
          >
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("nav.search")}
                className="w-full pl-4 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                dir={currentLanguage === "ar" ? "rtl" : "ltr"}
              />
              <button
                type="submit"
                className="absolute inset-y-0 right-0 rtl:right-auto rtl:left-0 flex items-center pr-3 rtl:pr-0 rtl:pl-3"
              >
                <Search className="h-5 w-5 text-gray-400 hover:text-primary dark:hover:text-accent" />
              </button>
            </div>
          </form>

          {/* Right Icons */}
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-accent transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            {/* Language Toggle */}
            <div className="relative">
              <button
                onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                className="flex items-center space-x-1 rtl:space-x-reverse p-2 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-accent transition-colors"
                aria-label="Change language"
              >
                <Globe className="h-5 w-5" />
                <span className="text-sm font-medium">
                  {currentLanguage.toUpperCase()}
                </span>
              </button>

              {isLanguageMenuOpen && (
                <div className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                  <button
                    onClick={() => handleLanguageChange("fr")}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                      currentLanguage === "fr"
                        ? "bg-accent/20 dark:bg-accent/20 text-primary dark:text-accent"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    Français
                  </button>
                  <button
                    onClick={() => handleLanguageChange("ar")}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded-b-lg ${
                      currentLanguage === "ar"
                        ? "bg-accent/20 dark:bg-accent/20 text-primary dark:text-accent"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    العربية
                  </button>
                </div>
              )}
            </div>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-accent transition-colors"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 rtl:-right-auto rtl:-left-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            <Link
              to="/login"
              className="p-2 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-accent transition-colors"
            >
              <User className="h-6 w-6" />
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-accent"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden py-3 border-t border-gray-200 dark:border-gray-700">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("nav.search")}
                className="w-full pl-4 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                dir={currentLanguage === "ar" ? "rtl" : "ltr"}
              />
              <button
                type="submit"
                className="absolute inset-y-0 right-0 rtl:right-auto rtl:left-0 flex items-center pr-3 rtl:pr-0 rtl:pl-3"
              >
                <Search className="h-5 w-5 text-gray-400" />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <nav className="px-4 py-4 space-y-3">
            <Link
              to="/"
              className="block text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-accent transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {t("nav.home")}
            </Link>
            <Link
              to="/products"
              className="block text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-accent transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {t("nav.products")}
            </Link>
            <Link
              to="/products?category=toilettes"
              className="block text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-accent transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {t("nav.toilets")}
            </Link>
            <Link
              to="/products?category=lavabos"
              className="block text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-accent transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {t("nav.sinks")}
            </Link>
            <Link
              to="/products?category=robinetterie"
              className="block text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-accent transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {t("nav.faucets")}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
