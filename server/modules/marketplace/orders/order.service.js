const Order = require("./order.model");
const Product = require("../products/product.model");

// Create a new order
const createOrder = async (userId, productId, quantity) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  if (product.stock < quantity) {
    throw new Error("Insufficient product stock");
  }

  const totalAmount = product.price * quantity;

  const order = await Order.create({
    userId,
    productId,
    quantity,
    totalAmount,
  });

  return await Order.findById(order._id)
    .populate("productId", "name description price category stock");
};

// Get all orders for a user
const getUserOrders = async (userId) => {
  return await Order.find({ userId })
    .populate("productId", "name description price category stock")
    .sort({ orderDate: -1 });
};

// Get one order
const getOrderById = async (orderId) => {
  return await Order.findById(orderId).populate(
    "productId",
    "name description price category stock"
  );
};

// Update order status
const updateOrderStatus = async (orderId, status) => {
  const order = await Order.findByIdAndUpdate(
    orderId,
    { status },
    {
      new: true,
      runValidators: true,
    }
  ).populate("productId", "name description price category stock");

  return order;
};

// Cancel an order
const cancelOrder = async (orderId) => {
  const order = await Order.findByIdAndUpdate(
    orderId,
    { status: "cancelled" },
    {
      new: true,
      runValidators: true,
    }
  ).populate("productId", "name description price category stock");

  return order;
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
};