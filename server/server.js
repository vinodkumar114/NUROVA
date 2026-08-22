const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const productRoutes = require("./modules/marketplace/products/product.routes");
const cartRoutes = require("./modules/marketplace/cart/cart.routes");
const orderRoutes = require("./modules/marketplace/orders/order.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
console.log("Order routes loaded");

app.get("/api/test", (req, res) => {
  res.json({
    message: "Backend is working!",
  });
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, {
    family: 4,
  })
  .then(() => {
    console.log("MongoDB connected successfully");

    app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });