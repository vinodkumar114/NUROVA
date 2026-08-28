// ==========================================================================
// NUROVA - MODULE C: CART & CHECKOUT SERVICE (INR PRICING)
// ==========================================================================

const CART_STORAGE_KEY = "nurova_ayurveda_cart";
const ORDER_HISTORY_KEY = "nurova_order_history";

export const PROMO_COUPONS = {
  "AYUR20": { type: "percent", value: 20, desc: "20% off your entire Ayurvedic order" },
  "HERBAL100": { type: "flat", value: 100, desc: "₹100 off on your Ayurvedic order" },
  "HERBAL10": { type: "flat", value: 100, desc: "₹100 flat discount applied" },
  "FREESHIP": { type: "shipping", value: 0, desc: "Free Express Ayurvedic Delivery" }
};

export const FREE_SHIPPING_THRESHOLD = 999.0;
export const STANDARD_SHIPPING_FEE = 79.0;
export const ESTIMATED_TAX_RATE = 0.05; // 5% Ayurvedic GST

export const getStoredCart = () => {
  try {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

export const saveCart = (items) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error("Failed to save cart to localStorage", err);
  }
};

export const calculateCartTotals = (items, appliedCoupon = null, ecoPackaging = true) => {
  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  
  // Calculate Discount
  let discountAmount = 0;
  if (appliedCoupon && PROMO_COUPONS[appliedCoupon]) {
    const coupon = PROMO_COUPONS[appliedCoupon];
    if (coupon.type === "percent") {
      discountAmount = (subtotal * coupon.value) / 100;
    } else if (coupon.type === "flat") {
      discountAmount = Math.min(coupon.value, subtotal);
    }
  }

  // Calculate Shipping
  let shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD || (appliedCoupon === "FREESHIP") || subtotal === 0 
    ? 0 
    : STANDARD_SHIPPING_FEE;

  // Packaging Fee (Sacred herbal packaging)
  const packagingFee = ecoPackaging && subtotal > 0 ? 49.0 : 0;

  // GST / Tax
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const tax = taxableAmount * ESTIMATED_TAX_RATE;

  // Grand Total
  const grandTotal = Math.max(0, taxableAmount + shippingFee + packagingFee + tax);

  // Progress towards free shipping
  const freeShippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  return {
    subtotal: Number(subtotal.toFixed(2)),
    discountAmount: Number(discountAmount.toFixed(2)),
    shippingFee: Number(shippingFee.toFixed(2)),
    packagingFee: Number(packagingFee.toFixed(2)),
    tax: Number(tax.toFixed(2)),
    grandTotal: Number(grandTotal.toFixed(2)),
    freeShippingProgress: Math.round(freeShippingProgress),
    amountNeededForFreeShipping: Number(amountNeededForFreeShipping.toFixed(2)),
    totalCount: items.reduce((acc, item) => acc + item.quantity, 0)
  };
};

export const placeOrder = (orderData) => {
  const orderId = "NUR-" + Math.floor(100000 + Math.random() * 900000);
  const orderReceipt = {
    orderId,
    timestamp: new Date().toISOString(),
    formattedDate: new Date().toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }),
    trackingCode: "TRK-AYUR-" + Math.random().toString(36).substring(2, 9).toUpperCase(),
    status: "Confirmed & Prepared by Ayurvedic Vaidya",
    deliveryEstimate: "2 - 4 Business Days Across India",
    ...orderData
  };

  try {
    const history = JSON.parse(localStorage.getItem(ORDER_HISTORY_KEY) || "[]");
    history.unshift(orderReceipt);
    localStorage.setItem(ORDER_HISTORY_KEY, JSON.stringify(history));
    localStorage.removeItem(CART_STORAGE_KEY);
  } catch (err) {
    console.error("Order persistence error", err);
  }

  return orderReceipt;
};
