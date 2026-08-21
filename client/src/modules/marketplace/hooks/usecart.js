import { useState, useEffect, useCallback } from "react";
import {
  getStoredCart,
  saveCart,
  calculateCartTotals,
  placeOrder,
  PROMO_COUPONS
} from "../services/cartservice";

export function useCart() {
  const [cartItems, setCartItems] = useState(getStoredCart);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [ecoPackaging, setEcoPackaging] = useState(true);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [lastCompletedOrder, setLastCompletedOrder] = useState(null);

  // Sync with localStorage
  useEffect(() => {
    saveCart(cartItems);
  }, [cartItems]);

  const addToCart = useCallback((product, quantity = 1) => {
    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity
        };
        return updated;
      } else {
        return [...prevItems, { ...product, quantity }];
      }
    });
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity: newQty } : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCartItems([]);
    setAppliedCoupon(null);
  }, []);

  const applyCouponCode = useCallback((code) => {
    const cleanCode = code.trim().toUpperCase();
    if (PROMO_COUPONS[cleanCode]) {
      setAppliedCoupon(cleanCode);
      return { success: true, message: `Promo code "${cleanCode}" applied: ${PROMO_COUPONS[cleanCode].desc}` };
    }
    return { success: false, message: `Invalid coupon code "${code}". Try AYUR20 or HERBAL10` };
  }, []);

  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
  }, []);

  const toggleEcoPackaging = useCallback(() => {
    setEcoPackaging((prev) => !prev);
  }, []);

  const checkoutOrder = useCallback((shippingInfo, paymentMethod) => {
    setIsCheckingOut(true);
    const totals = calculateCartTotals(cartItems, appliedCoupon, ecoPackaging);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const receipt = placeOrder({
          items: cartItems,
          totals,
          shippingInfo,
          paymentMethod,
          appliedCoupon
        });
        setLastCompletedOrder(receipt);
        clearCart();
        setIsCheckingOut(false);
        resolve(receipt);
      }, 1200);
    });
  }, [cartItems, appliedCoupon, ecoPackaging, clearCart]);

  const totals = calculateCartTotals(cartItems, appliedCoupon, ecoPackaging);

  const isInCart = useCallback((productId) => {
    return cartItems.some((item) => item.id === productId);
  }, [cartItems]);

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    appliedCoupon,
    applyCouponCode,
    removeCoupon,
    ecoPackaging,
    toggleEcoPackaging,
    totals,
    isCheckingOut,
    checkoutOrder,
    lastCompletedOrder,
    setLastCompletedOrder,
    isInCart
  };
}

export default useCart;
