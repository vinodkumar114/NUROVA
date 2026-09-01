import React, { useState, useCallback } from "react";

import MarketplaceHeader from "./modules/marketplace/components/MarketplaceHeader";
import Toast from "./modules/marketplace/components/Toast";
import ProductPage from "./modules/marketplace/pages/productpage";
import CartPage from "./modules/marketplace/pages/cartpage";
import WishlistPage from "./modules/marketplace/pages/whislistpage";
import OrdersPage from "./modules/marketplace/pages/orderspage";

import { useProducts } from "./modules/marketplace/hooks/useproducts";
import { useCart } from "./modules/marketplace/hooks/usecart";
import { useWishlist } from "./modules/marketplace/hooks/usewhislist";
import { useOrders } from "./modules/marketplace/hooks/useorders";

import "./modules/marketplace/marketplace.css";

function App() {
  const [activeView, setActiveView] = useState("catalogue");
  const [toasts, setToasts] = useState([]);

  // ============================================================
  // INITIALIZE HOOKS
  // ============================================================

  const productsHook = useProducts();
  const rawCartHook = useCart();
  const rawWishlistHook = useWishlist();

  // Temporary/test user ID currently used by your MongoDB orders.
  // We will replace this with the real logged-in user's ID later
  // when authentication is added.
  const USER_ID = "89b4320151014a8ea9581d64";

  const ordersHook = useOrders(USER_ID);

  // ============================================================
  // TOAST NOTIFICATIONS
  // ============================================================

  const addToast = useCallback(
    (message, icon = "🌿", type = "success") => {
      const id = Date.now() + Math.random();

      setToasts((prev) => [
        ...prev,
        {
          id,
          message,
          icon,
          type,
        },
      ]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
      }, 3200);
    },
    []
  );

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // ============================================================
  // CART ACTION WITH TOAST
  // ============================================================

  const handleAddToCart = useCallback(
    (product, qty = 1) => {
      rawCartHook.addToCart(product, qty);

      addToast(
        `Added ${qty} × "${product.name}" to your apothecary cart!`,
        "🛒",
        "success"
      );
    },
    [rawCartHook, addToast]
  );

  const cartHook = {
    ...rawCartHook,
    addToCart: handleAddToCart,
  };

  // ============================================================
  // WISHLIST ACTION WITH TOAST
  // ============================================================

  const handleToggleWishlist = useCallback(
    (product) => {
      const wasWishlisted = rawWishlistHook.isWishlisted(product.id);

      rawWishlistHook.toggleWishlist(product);

      if (wasWishlisted) {
        addToast(
          `Removed "${product.name}" from your wishlist.`,
          "🤍",
          "warning"
        );
      } else {
        addToast(
          `Saved "${product.name}" to your sacred wishlist!`,
          "❤️",
          "success"
        );
      }
    },
    [rawWishlistHook, addToast]
  );

  const wishlistHook = {
    ...rawWishlistHook,
    toggleWishlist: handleToggleWishlist,
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="nurova-marketplace-app">
      {/* ======================================================
          HEADER
      ====================================================== */}

      <MarketplaceHeader
        activeView={activeView}
        onSelectView={setActiveView}
        cartCount={cartHook.totals.totalCount}
        cartTotal={cartHook.totals.grandTotal}
        wishlistCount={wishlistHook.wishlistCount}
      />

      {/* ======================================================
          PRODUCT CATALOGUE
      ====================================================== */}

      {activeView === "catalogue" && (
        <ProductPage
          productsHook={productsHook}
          cartHook={cartHook}
          wishlistHook={wishlistHook}
          onNavigateToCart={() => setActiveView("cart")}
        />
      )}

      {/* ======================================================
          CART
      ====================================================== */}

      {activeView === "cart" && (
        <CartPage
          cartHook={cartHook}
          wishlistHook={wishlistHook}
          onNavigateToShop={() => setActiveView("catalogue")}
        />
      )}

      {/* ======================================================
          WISHLIST
      ====================================================== */}

      {activeView === "wishlist" && (
        <WishlistPage
          wishlistHook={wishlistHook}
          cartHook={cartHook}
          onNavigateToShop={() => setActiveView("catalogue")}
        />
      )}

      {/* ======================================================
          MY ORDERS
      ====================================================== */}

      {activeView === "orders" && (
        <OrdersPage
          ordersHook={ordersHook}
          onNavigateToShop={() => setActiveView("catalogue")}
        />
      )}

      {/* ======================================================
          TOASTS
      ====================================================== */}

      <Toast
        toasts={toasts}
        onDismiss={dismissToast}
      />
    </div>
  );
}

export default App;