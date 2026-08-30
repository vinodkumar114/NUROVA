const dns = require("dns");

// Use reliable public DNS servers for MongoDB Atlas SRV resolution
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

// Import recommendation routes
const recommendationRoutes = require("./modules/recommendations/recommendation.routes");

const app = express();

app.use(cors());
app.use(express.json());

// ========================================
// TEST ROUTE
// ========================================

app.get("/api/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend is working!",
  });
});

// ========================================
// RECOMMENDATIONS ROUTES
// ========================================

app.use("/api/recommendations", recommendationRoutes);

// ========================================
// SERVER
// ========================================

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed.");
    process.exit(1);
  }
}

startServer();