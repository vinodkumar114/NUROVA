import React, { useState } from "react";

export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  totals,
  onConfirmOrder,
  isCheckingOut
}) {
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Success Receipt
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "Priya Sharma",
    email: "priya.sharma@example.com",
    phone: "+91 98765 43210",
    address: "42 Lotus Bloom Avenue, Shanti Nagar",
    city: "Bangalore",
    state: "Karnataka",
    postalCode: "560001",
    practitionerNote: "Recommended by Dr. Vaidya for Vata grounding."
  });

  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [orderReceipt, setOrderReceipt] = useState(null);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleGoToPayment = (e) => {
    e.preventDefault();
    if (!shippingInfo.fullName || !shippingInfo.address || !shippingInfo.phone) {
      alert("Please fill in the required delivery fields.");
      return;
    }
    setStep(2);
  };

  const handleFinalizeOrder = async () => {
    const receipt = await onConfirmOrder(shippingInfo, paymentMethod);
    setOrderReceipt(receipt);
    setStep(3);
  };

  const handleCloseAndReset = () => {
    setStep(1);
    setOrderReceipt(null);
    onClose();
  };

  return (
    <div className="clay-modal-backdrop" onClick={step === 3 ? handleCloseAndReset : onClose}>
      <div
        className="clay-modal-window checkout-flow"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button
          type="button"
          className="clay-modal-close-btn"
          onClick={handleCloseAndReset}
          aria-label="Close checkout"
        >
          ✕
        </button>

        <div className="clay-checkout-modal-body">
          {/* Stepper Header */}
          <div className="clay-checkout-stepper">
            <div className={`clay-step-node ${step >= 1 ? "active" : ""} ${step > 1 ? "completed" : ""}`}>
              <div className="clay-step-circle">{step > 1 ? "✓" : "1"}</div>
              <span className="clay-step-title">Delivery</span>
            </div>
            <div style={{ flex: 1, height: "3px", background: step > 1 ? "var(--forest-primary)" : "var(--warm-beige-dark)", margin: "0 10px" }} />
            <div className={`clay-step-node ${step >= 2 ? "active" : ""} ${step > 2 ? "completed" : ""}`}>
              <div className="clay-step-circle">{step > 2 ? "✓" : "2"}</div>
              <span className="clay-step-title">Payment</span>
            </div>
            <div style={{ flex: 1, height: "3px", background: step > 2 ? "var(--forest-primary)" : "var(--warm-beige-dark)", margin: "0 10px" }} />
            <div className={`clay-step-node ${step === 3 ? "active completed" : ""}`}>
              <div className="clay-step-circle">3</div>
              <span className="clay-step-title">Receipt</span>
            </div>
          </div>

          {/* STEP 1: DELIVERY INFO */}
          {step === 1 && (
            <form onSubmit={handleGoToPayment}>
              <h3 style={{ fontSize: "1.4rem", color: "var(--forest-dark)", marginBottom: "1.2rem" }}>
                🌿 Ayurvedic Delivery Details
              </h3>

              <div className="clay-form-grid">
                <div className="clay-form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    className="clay-form-input"
                    value={shippingInfo.fullName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="clay-form-group">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    className="clay-form-input"
                    value={shippingInfo.phone}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="clay-form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  className="clay-form-input"
                  value={shippingInfo.email}
                  onChange={handleInputChange}
                />
              </div>

              <div className="clay-form-group">
                <label>Street Address *</label>
                <input
                  type="text"
                  name="address"
                  required
                  className="clay-form-input"
                  value={shippingInfo.address}
                  onChange={handleInputChange}
                />
              </div>

              <div className="clay-form-grid">
                <div className="clay-form-group">
                  <label>City *</label>
                  <input
                    type="text"
                    name="city"
                    required
                    className="clay-form-input"
                    value={shippingInfo.city}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="clay-form-group">
                  <label>PIN / Postal Code *</label>
                  <input
                    type="text"
                    name="postalCode"
                    required
                    className="clay-form-input"
                    value={shippingInfo.postalCode}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="clay-form-group">
                <label>Practitioner Note / Health Instructions (Optional)</label>
                <textarea
                  name="practitionerNote"
                  rows="2"
                  className="clay-form-textarea"
                  value={shippingInfo.practitionerNote}
                  onChange={handleInputChange}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.5rem" }}>
                <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--forest-dark)" }}>
                  Order Total: ₹{totals.grandTotal.toLocaleString('en-IN')}
                </span>
                <button type="submit" className="clay-checkout-cta-btn" style={{ width: "auto", padding: "0.85rem 2rem" }}>
                  Continue to Payment →
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: PAYMENT METHOD */}
          {step === 2 && (
            <div>
              <h3 style={{ fontSize: "1.4rem", color: "var(--forest-dark)", marginBottom: "1.2rem" }}>
                💳 Choose Payment Method
              </h3>

              <div className="clay-payment-options">
                <div
                  className={`clay-payment-card ${paymentMethod === "upi" ? "selected" : ""}`}
                  onClick={() => setPaymentMethod("upi")}
                >
                  <span className="pay-icon">📱</span>
                  <div>
                    <h5>Instant UPI / QR</h5>
                    <p>GPay, PhonePe, Paytm, BHIM</p>
                  </div>
                </div>

                <div
                  className={`clay-payment-card ${paymentMethod === "card" ? "selected" : ""}`}
                  onClick={() => setPaymentMethod("card")}
                >
                  <span className="pay-icon">💳</span>
                  <div>
                    <h5>Credit / Debit Card</h5>
                    <p>Visa, MasterCard, RuPay</p>
                  </div>
                </div>

                <div
                  className={`clay-payment-card ${paymentMethod === "netbanking" ? "selected" : ""}`}
                  onClick={() => setPaymentMethod("netbanking")}
                >
                  <span className="pay-icon">🏛️</span>
                  <div>
                    <h5>Net Banking</h5>
                    <p>SBI, HDFC, ICICI, Axis & more</p>
                  </div>
                </div>

                <div
                  className={`clay-payment-card ${paymentMethod === "cod" ? "selected" : ""}`}
                  onClick={() => setPaymentMethod("cod")}
                >
                  <span className="pay-icon">📦</span>
                  <div>
                    <h5>Cash on Delivery</h5>
                    <p>Pay upon doorstep arrival</p>
                  </div>
                </div>
              </div>

              {/* Order Mini Breakdown */}
              <div className="clay-receipt-box">
                <div className="clay-receipt-row">
                  <span>Ship To:</span>
                  <strong>{shippingInfo.fullName}, {shippingInfo.city}</strong>
                </div>
                <div className="clay-receipt-row">
                  <span>Items:</span>
                  <strong>{cartItems.length} Products ({totals.totalCount} items)</strong>
                </div>
                <div className="clay-receipt-row">
                  <span>Total Amount Due:</span>
                  <strong style={{ color: "var(--forest-dark)", fontSize: "1.1rem" }}>
                    ₹{totals.grandTotal.toLocaleString('en-IN')}
                  </strong>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.5rem" }}>
                <button
                  type="button"
                  className="clay-action-btn"
                  onClick={() => setStep(1)}
                >
                  ← Back to Address
                </button>

                <button
                  type="button"
                  className="clay-checkout-cta-btn"
                  style={{ width: "auto", padding: "0.85rem 2rem" }}
                  onClick={handleFinalizeOrder}
                  disabled={isCheckingOut}
                >
                  <span>🔒</span>
                  <span>{isCheckingOut ? "Placing Order..." : `Pay ₹${totals.grandTotal.toLocaleString('en-IN')}`}</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: ORDER SUCCESS RECEIPT */}
          {step === 3 && orderReceipt && (
            <div className="clay-success-receipt">
              <div className="clay-success-icon">🪷</div>
              <h3 style={{ fontSize: "1.8rem", color: "var(--forest-dark)", marginBottom: "0.4rem" }}>
                Order Confirmed!
              </h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
                Thank you for choosing authentic holistic wellness. Your remedies are being freshly prepared.
              </p>

              <div className="clay-receipt-box">
                <div className="clay-receipt-row">
                  <span>Order Number:</span>
                  <strong>{orderReceipt.orderId}</strong>
                </div>
                <div className="clay-receipt-row">
                  <span>Tracking Code:</span>
                  <strong>{orderReceipt.trackingCode}</strong>
                </div>
                <div className="clay-receipt-row">
                  <span>Estimated Delivery:</span>
                  <strong style={{ color: "var(--forest-primary)" }}>{orderReceipt.deliveryEstimate}</strong>
                </div>
                <div className="clay-receipt-row">
                  <span>Status:</span>
                  <strong>{orderReceipt.status}</strong>
                </div>
                <div className="clay-receipt-row" style={{ borderTop: "1px dashed #ccc", paddingTop: "0.6rem", marginTop: "0.4rem" }}>
                  <span>Total Paid ({paymentMethod.toUpperCase()}):</span>
                  <strong style={{ fontSize: "1.15rem", color: "var(--forest-dark)" }}>
                    ₹{orderReceipt.totals.grandTotal.toLocaleString('en-IN')}
                  </strong>
                </div>
              </div>

              <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
                <button
                  type="button"
                  className="clay-action-btn primary-cart-btn"
                  onClick={handleCloseAndReset}
                >
                  🌿 Continue Browsing Remedies
                </button>
                <button
                  type="button"
                  className="clay-action-btn"
                  onClick={() => alert(`Receipt downloaded for Order ${orderReceipt.orderId}`)}
                >
                  📥 Print Ayurvedic Receipt
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
