import React, { useState, useCallback } from "react";
import MarketplaceHeader from "./modules/marketplace/components/MarketplaceHeader";
import Toast from "./modules/marketplace/components/Toast";
import ProductPage from "./modules/marketplace/pages/productpage";
import CartPage from "./modules/marketplace/pages/cartpage";
import WishlistPage from "./modules/marketplace/pages/whislistpage";
import { useProducts } from "./modules/marketplace/hooks/useproducts";
import { useCart } from "./modules/marketplace/hooks/usecart";
import { useWishlist } from "./modules/marketplace/hooks/usewhislist";
import "./modules/marketplace/marketplace.css";

function App() {
  const [activeView, setActiveView] = useState("catalogue"); // 'catalogue' | 'cart' | 'wishlist'
  const [toasts, setToasts] = useState([]);

  // Initialize hooks
  const productsHook = useProducts();
  const rawCartHook = useCart();
  const rawWishlistHook = useWishlist();

  // Toast notification helper
  const addToast = useCallback((message, icon = "🌿", type = "success") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, icon, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Enhanced Cart Actions with Toast Feedback
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
    addToCart: handleAddToCart
  };

  // Enhanced Wishlist Actions with Toast Feedback
  const handleToggleWishlist = useCallback(
    (product) => {
      const wasWishlisted = rawWishlistHook.isWishlisted(product.id);
      rawWishlistHook.toggleWishlist(product);
      if (wasWishlisted) {
        addToast(`Removed "${product.name}" from your wishlist.`, "🤍", "warning");
      } else {
        addToast(`Saved "${product.name}" to your sacred wishlist!`, "❤️", "success");
      }
    },
    [rawWishlistHook, addToast]
  );

  const wishlistHook = {
    ...rawWishlistHook,
    toggleWishlist: handleToggleWishlist
  };

  return (
    <div className="nurova-marketplace-app">
      {/* Claymorphic Marketplace Top Navigation */}
      <MarketplaceHeader
        activeView={activeView}
        onSelectView={setActiveView}
        cartCount={cartHook.totals.totalCount}
        cartTotal={cartHook.totals.grandTotal}
        wishlistCount={wishlistHook.wishlistCount}
      />

      {/* Dynamic Module Views */}
      {activeView === "catalogue" && (
        <ProductPage
          productsHook={productsHook}
          cartHook={cartHook}
          wishlistHook={wishlistHook}
          onNavigateToCart={() => setActiveView("cart")}
        />
      )}

      {activeView === "cart" && (
        <CartPage
          cartHook={cartHook}
          wishlistHook={wishlistHook}
          onNavigateToShop={() => setActiveView("catalogue")}
        />
      )}

      {activeView === "wishlist" && (
        <WishlistPage
          wishlistHook={wishlistHook}
          cartHook={cartHook}
          onNavigateToShop={() => setActiveView("catalogue")}
        />
      )}

      {/* Floating Claymorphic Toast Feedback */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

export default App;
