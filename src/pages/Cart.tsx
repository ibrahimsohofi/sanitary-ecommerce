import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { formatPrice, useCartStore, useLanguageStore } from "../lib/store";

const Cart = () => {
  const { items, updateQuantity, removeItem, clearCart, getTotal } =
    useCartStore();
  const { currentLanguage, t } = useLanguageStore();

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(productId);
      toast.info(
        currentLanguage === "ar"
          ? "تم إزالة المنتج من العربة"
          : "Produit retiré du panier",
      );
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleRemoveItem = (productId: number, productName: string) => {
    removeItem(productId);
    toast.success(
      `${productName} ${currentLanguage === "ar" ? "تم إزالته من العربة" : "retiré du panier"}`,
    );
  };

  const handleClearCart = () => {
    clearCart();
    toast.success(currentLanguage === "ar" ? "تم إفراغ العربة" : "Panier vidé");
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">
        <div className="text-center">
          <ShoppingBag className="h-24 w-24 text-gray-400 dark:text-gray-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {t("cart.empty")}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            {t("cart.empty_desc")}
          </p>
          <Link
            to="/products"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center"
          >
            {t("cart.continue")}
          </Link>
        </div>
      </div>
    );
  }

  const total = getTotal();
  const shipping = total > 1000 ? 0 : 99.99; // Free shipping over 1000 MAD
  const finalTotal = total + shipping;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {t("cart.title")} ({items.length})
            </h1>
            <button
              onClick={handleClearCart}
              className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors text-sm"
            >
              {t("cart.clear")}
            </button>
          </div>

          <div className="space-y-4">
            {items.map((item) => {
              const productName =
                currentLanguage === "ar"
                  ? item.product.name_ar
                  : item.product.name_fr;
              const price = item.product.sale_price || item.product.price;

              return (
                <div
                  key={item.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors"
                >
                  <div className="flex items-center space-x-4 rtl:space-x-reverse">
                    <img
                      src={item.product.image_url}
                      alt={productName}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {productName}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                        SKU: {item.product.sku}
                      </p>
                      <div className="flex items-center mt-2">
                        {item.product.sale_price ? (
                          <>
                            <span className="text-lg font-bold text-red-600 dark:text-red-400">
                              {formatPrice(
                                item.product.sale_price,
                                currentLanguage,
                              )}
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400 line-through ml-2 rtl:ml-0 rtl:mr-2">
                              {formatPrice(item.product.price, currentLanguage)}
                            </span>
                          </>
                        ) : (
                          <span className="text-lg font-bold text-gray-900 dark:text-white">
                            {formatPrice(item.product.price, currentLanguage)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <button
                        onClick={() =>
                          handleQuantityChange(
                            item.product.id,
                            item.quantity - 1,
                          )
                        }
                        className="p-1 rounded-full bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                      >
                        <Minus className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                      </button>
                      <span className="w-8 text-center font-semibold text-gray-900 dark:text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleQuantityChange(
                            item.product.id,
                            item.quantity + 1,
                          )
                        }
                        className="p-1 rounded-full bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                      >
                        <Plus className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {formatPrice(price * item.quantity, currentLanguage)}
                      </p>
                      <button
                        onClick={() =>
                          handleRemoveItem(item.product.id, productName)
                        }
                        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors mt-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-4 transition-colors">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {currentLanguage === "ar" ? "ملخص الطلب" : "Récapitulatif"}
            </h2>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">
                  {t("cart.subtotal")}
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {formatPrice(total, currentLanguage)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">
                  {t("cart.shipping")}
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {shipping === 0
                    ? t("cart.free_shipping")
                    : formatPrice(shipping, currentLanguage)}
                </span>
              </div>
              {shipping === 0 && (
                <p className="text-sm text-green-600 dark:text-green-400">
                  {t("cart.free_shipping_notice")}
                </p>
              )}
              <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    {t("cart.total")}
                  </span>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    {formatPrice(finalTotal, currentLanguage)}
                  </span>
                </div>
              </div>
            </div>

            <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors mb-3">
              {t("cart.checkout")}
            </button>

            <Link
              to="/products"
              className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors block text-center"
            >
              {t("cart.continue")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
