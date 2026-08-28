import React, { useState } from "react";

export default function CartItem({
  item,
  onUpdateQuantity,
  onRemove
}) {
  const [imgError, setImgError] = useState(false);
  const { id, name, price, quantity, icon, image, doshaLabel, categoryLabel } = item;
  const itemTotal = (price * quantity).toLocaleString('en-IN');

  return (
    <div className="clay-cart-item-card">
      {/* Visual */}
      <div className="clay-cart-item-img">
        {image && !imgError ? (
          <img
            src={image}
            alt={name}
            style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "inherit" }}
            onError={() => setImgError(true)}
          />
        ) : (
          <span>{icon || "🌿"}</span>
        )}
      </div>

      {/* Details */}
      <div className="clay-cart-item-info">
        <h4>{name}</h4>
        <p>
          {categoryLabel} • {doshaLabel || "Ayurvedic"}
        </p>
        <span className="item-unit-price">₹{price.toLocaleString('en-IN')} each</span>
      </div>

      {/* Quantity Stepper */}
      <div className="clay-qty-stepper">
        <button
          type="button"
          className="clay-stepper-btn"
          onClick={() => onUpdateQuantity(id, quantity - 1)}
          aria-label="Decrease quantity"
        >
          −
        </button>
        <span className="clay-stepper-value">{quantity}</span>
        <button
          type="button"
          className="clay-stepper-btn"
          onClick={() => onUpdateQuantity(id, quantity + 1)}
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>

      {/* Subtotal & Remove */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <span className="clay-cart-item-total">₹{itemTotal}</span>
        <button
          type="button"
          className="clay-item-remove-btn"
          onClick={() => onRemove(id)}
          title="Remove from Cart"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}
