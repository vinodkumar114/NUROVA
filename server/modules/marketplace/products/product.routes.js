const express = require("express");
const router = express.Router();

const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("./product.controller");

// Get all products
router.get("/", getAllProducts);

// Get one product
router.get("/:id", getProductById);

// Create product
router.post("/", createProduct);

// Update product
router.put("/:id", updateProduct);

// Delete product
router.delete("/:id", deleteProduct);

module.exports = router;