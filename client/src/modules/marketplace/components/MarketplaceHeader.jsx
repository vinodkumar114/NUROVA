import React from "react";

export default function MarketplaceHeader({
  activeView,
  onSelectView,
  cartCount,
  cartTotal,
  wishlistCount
}) {
  return (
    <header className="clay-header">
      {/* Top Announcement Bar */}
      <div className="clay-announcement-bar">
        <div className="clay-announcement-content">
          <span>🌿 100% Certified Ayurvedic</span>
          <span className="announcement-sep">•</span>
          <span>
            <strong className="badge-highlight">AYUR20</strong> 20% Off Orders
          </span>
          <span className="announcement-sep">•</span>
          <span>🚚 Free Express Shipping Over ₹999</span>
        </div>
      </div>

      {/* Main Brand & Actions Bar */}
      <div className="clay-header-container">
        {/* Brand */}
        <div
          className="clay-brand"
          onClick={() => onSelectView("catalogue")}
          role="button"
          tabIndex={0}
        >
          <div className="clay-brand-logo">🍃</div>
          <div className="clay-brand-info">
            <h1>NUROVA</h1>
            <span>Ayurveda Marketplace</span>
          </div>
        </div>

        {/* Center Desktop Navigation Tabs */}
        <nav className="clay-nav-tabs desktop-only" aria-label="Marketplace Navigation">
          <button
            type="button"
            className={`clay-tab-btn ${activeView === "catalogue" ? "active" : ""}`}
            onClick={() => onSelectView("catalogue")}
          >
            <span>🌿</span>
            <span>Remedies & Shop</span>
          </button>

          <button
            type="button"
            className={`clay-tab-btn ${activeView === "wishlist" ? "active" : ""}`}
            onClick={() => onSelectView("wishlist")}
          >
            <span>❤️</span>
            <span>Wishlist</span>
            {wishlistCount > 0 && (
              <span className="clay-badge-counter">{wishlistCount}</span>
            )}
          </button>

          <button
            type="button"
            className={`clay-tab-btn ${activeView === "cart" ? "active" : ""}`}
            onClick={() => onSelectView("cart")}
          >
            <span>🛒</span>
            <span>My Cart</span>
            {cartCount > 0 && (
              <span className="clay-badge-counter">{cartCount}</span>
            )}
          </button>
        </nav>

        {/* Right Actions (Both Desktop & Mobile) */}
        <div className="clay-header-actions">
          <button
            type="button"
            className={`clay-action-btn icon-only-mobile ${activeView === "wishlist" ? "active" : ""}`}
            onClick={() => onSelectView("wishlist")}
            title="View Wishlist"
            aria-label="View Wishlist"
          >
            <span>❤️</span>
            <span className="action-text-desktop">Saved</span>
            {wishlistCount > 0 && (
              <span className="clay-badge-counter">{wishlistCount}</span>
            )}
          </button>

          <button
            type="button"
            className="clay-action-btn primary-cart-btn"
            onClick={() => onSelectView("cart")}
            title="View Cart & Checkout"
            aria-label="View Cart"
          >
            <span>🛒</span>
            <span className="action-text-desktop">Cart</span>
            {cartCount > 0 && (
              <span className="clay-badge-counter">{cartCount}</span>
            )}
            {cartTotal > 0 && (
              <span className="action-total-desktop">
                • ₹{cartTotal.toLocaleString('en-IN')}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Tab Bar */}
      <div className="clay-mobile-tab-bar mobile-only">
        <button
          type="button"
          className={`clay-mobile-tab-btn ${activeView === "catalogue" ? "active" : ""}`}
          onClick={() => onSelectView("catalogue")}
        >
          <span>🌿 Shop</span>
        </button>
        <button
          type="button"
          className={`clay-mobile-tab-btn ${activeView === "wishlist" ? "active" : ""}`}
          onClick={() => onSelectView("wishlist")}
        >
          <span>❤️ Wishlist {wishlistCount > 0 ? `(${wishlistCount})` : ""}</span>
        </button>
        <button
          type="button"
          className={`clay-mobile-tab-btn ${activeView === "cart" ? "active" : ""}`}
          onClick={() => onSelectView("cart")}
        >
          <span>🛒 Cart {cartCount > 0 ? `(${cartCount})` : ""}</span>
        </button>
      </div>
    </header>
  );
}
