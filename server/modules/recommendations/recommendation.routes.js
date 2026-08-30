const express = require("express");

const {
  getRecommendationsController,
  getRecommendationController,
  createRecommendationController,
  updateRecommendationController,
  deleteRecommendationController,
} = require("./recommendation.controller");

const {
  chatWithWellnessAI,
} = require("./recommendationChatController");

const router = express.Router();

// ========================================
// AI WELLNESS CHATBOT
// POST /api/recommendations/chat
// ========================================

router.post(
  "/chat",
  chatWithWellnessAI
);

// ========================================
// GET ALL RECOMMENDATIONS
// GET /api/recommendations
// ========================================

router.get(
  "/",
  getRecommendationsController
);

// ========================================
// GET ONE RECOMMENDATION
// GET /api/recommendations/:id
// ========================================

router.get(
  "/:id",
  getRecommendationController
);

// ========================================
// CREATE RECOMMENDATION
// POST /api/recommendations
// ========================================

router.post(
  "/",
  createRecommendationController
);

// ========================================
// UPDATE RECOMMENDATION
// PATCH /api/recommendations/:id
// ========================================

router.patch(
  "/:id",
  updateRecommendationController
);

// ========================================
// DELETE RECOMMENDATION
// DELETE /api/recommendations/:id
// ========================================

router.delete(
  "/:id",
  deleteRecommendationController
);

module.exports = router;