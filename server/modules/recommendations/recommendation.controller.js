const mongoose = require("mongoose");

const {
  getRecommendations,
  getRecommendationById,
  createRecommendation,
  updateRecommendation,
  deleteRecommendation,
} = require("./recommendation.service");

const {
  validateRecommendation,
} = require("./recommendation.validation");

/**
 * GET /api/recommendations
 */
async function getRecommendationsController(req, res) {
  try {
    const { category, symptom, goal } = req.query;

    let limit;

    if (req.query.limit !== undefined) {
      const parsedLimit = Number(req.query.limit);

      if (!Number.isInteger(parsedLimit) || parsedLimit <= 0) {
        return res.status(400).json({
          success: false,
          message: "Limit must be a positive integer.",
        });
      }

      limit = Math.min(parsedLimit, 100);
    }

    const recommendations = await getRecommendations({
      category,
      symptom,
      goal,
      limit,
    });

    return res.status(200).json({
      success: true,
      count: Array.isArray(recommendations)
        ? recommendations.length
        : 0,
      data: Array.isArray(recommendations)
        ? recommendations
        : [],
    });
  } catch (error) {
    console.error(
      "=========================================="
    );
    console.error(
      "ERROR: GET /api/recommendations"
    );
    console.error(
      "Message:",
      error.message
    );
    console.error(
      "Stack:",
      error.stack
    );
    console.error(
      "=========================================="
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch recommendations.",
      error:
        process.env.NODE_ENV === "production"
          ? undefined
          : error.message,
    });
  }
}

/**
 * GET /api/recommendations/:id
 */
async function getRecommendationController(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid recommendation ID.",
      });
    }

    const recommendation =
      await getRecommendationById(id);

    if (!recommendation) {
      return res.status(404).json({
        success: false,
        message: "Recommendation not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: recommendation,
    });
  } catch (error) {
    console.error(
      "=========================================="
    );
    console.error(
      "ERROR: GET /api/recommendations/:id"
    );
    console.error(
      "Message:",
      error.message
    );
    console.error(
      "Stack:",
      error.stack
    );
    console.error(
      "=========================================="
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch recommendation.",
      error:
        process.env.NODE_ENV === "production"
          ? undefined
          : error.message,
    });
  }
}

/**
 * POST /api/recommendations
 */
async function createRecommendationController(req, res) {
  try {
    const validation = validateRecommendation(req.body);

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: "Validation failed.",
        errors: validation.errors,
      });
    }

    const recommendation =
      await createRecommendation(req.body);

    return res.status(201).json({
      success: true,
      message: "Recommendation created successfully.",
      data: recommendation,
    });
  } catch (error) {
    console.error(
      "=========================================="
    );
    console.error(
      "ERROR: POST /api/recommendations"
    );
    console.error(
      "Message:",
      error.message
    );
    console.error(
      "Stack:",
      error.stack
    );
    console.error(
      "=========================================="
    );

    return res.status(500).json({
      success: false,
      message: "Failed to create recommendation.",
      error:
        process.env.NODE_ENV === "production"
          ? undefined
          : error.message,
    });
  }
}

/**
 * PATCH /api/recommendations/:id
 */
async function updateRecommendationController(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid recommendation ID.",
      });
    }

    const recommendation =
      await updateRecommendation(id, req.body);

    if (!recommendation) {
      return res.status(404).json({
        success: false,
        message: "Recommendation not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Recommendation updated successfully.",
      data: recommendation,
    });
  } catch (error) {
    console.error(
      "=========================================="
    );
    console.error(
      "ERROR: PATCH /api/recommendations/:id"
    );
    console.error(
      "Message:",
      error.message
    );
    console.error(
      "Stack:",
      error.stack
    );
    console.error(
      "=========================================="
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update recommendation.",
      error:
        process.env.NODE_ENV === "production"
          ? undefined
          : error.message,
    });
  }
}

/**
 * DELETE /api/recommendations/:id
 */
async function deleteRecommendationController(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid recommendation ID.",
      });
    }

    const recommendation =
      await deleteRecommendation(id);

    if (!recommendation) {
      return res.status(404).json({
        success: false,
        message: "Recommendation not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Recommendation deleted successfully.",
    });
  } catch (error) {
    console.error(
      "=========================================="
    );
    console.error(
      "ERROR: DELETE /api/recommendations/:id"
    );
    console.error(
      "Message:",
      error.message
    );
    console.error(
      "Stack:",
      error.stack
    );
    console.error(
      "=========================================="
    );

    return res.status(500).json({
      success: false,
      message: "Failed to delete recommendation.",
      error:
        process.env.NODE_ENV === "production"
          ? undefined
          : error.message,
    });
  }
}

module.exports = {
  getRecommendationsController,
  getRecommendationController,
  createRecommendationController,
  updateRecommendationController,
  deleteRecommendationController,
};