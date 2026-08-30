const mongoose = require("mongoose");

async function connectDB() {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI is not defined in the .env file.");
  }

  try {
    await mongoose.connect(mongoUri, {
      tls: true,
      tlsAllowInvalidCertificates: true, // Bypasses the OpenSSL handshake alert
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
      socketTimeoutMS: 45000,
    });

    console.log("MongoDB connected successfully.");
  } catch (error) {
    console.error("MongoDB connection failed:");
    console.error(error.message);

    throw error;
  }
}

module.exports = connectDB;