import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-xl font-bold">SanitaryShop</span>
            </div>
            <p className="text-gray-300 mb-4">
              Votre spécialiste en équipements sanitaires de qualité. Trouvez
              tout ce dont vous avez besoin pour votre salle de bain.
            </p>
            <div className="flex space-x-4">
              <button
                type="button"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </button>
              <button
                type="button"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </button>
              <button
                type="button"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liens Rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Accueil
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Produits
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=toilettes"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Toilettes
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=lavabos"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Lavabos
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=robinetterie"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Robinetterie
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Catégories</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/products?category=douches"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Douches
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=baignoires"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Baignoires
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=accessoires"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Accessoires
                </Link>
              </li>
              <li>
                <Link
                  to="/products?promotions=true"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Promotions
                </Link>
              </li>
              <li>
                <Link
                  to="/products?new=true"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Nouveautés
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-blue-400" />
                <span className="text-gray-300">+33 1 23 45 67 89</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-400" />
                <span className="text-gray-300">contact@sanitaryshop.fr</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-blue-400" />
                <span className="text-gray-300">
                  123 Rue de la Paix
                  <br />
                  75001 Paris, France
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 SanitaryShop. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
