const Product = require("./product.model");

// Get all products
const getAllProducts = async () => {
  return await Product.find().sort({ createdAt: -1 });
};

// Get one product by ID
const getProductById = async (productId) => {
  return await Product.findById(productId);
};

// Create a new product
const createProduct = async (productData) => {
  return await Product.create(productData);
};

// Update a product
const updateProduct = async (productId, productData) => {
  return await Product.findByIdAndUpdate(
    productId,
    productData,
    {
      new: true,
      runValidators: true,
    }
  );
};

// Delete a product
const deleteProduct = async (productId) => {
  return await Product.findByIdAndDelete(productId);
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};