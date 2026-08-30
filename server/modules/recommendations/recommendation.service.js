const Recommendation = require("./recommendation.model");

/**
 * Get recommendations
 */
async function getRecommendations(filters = {}) {
  const {
    category,
    symptom,
    goal,
    limit = 20,
  } = filters;

  const query = {
    isActive: true,
  };

  // Filter by category
  if (category) {
    query.category = category;
  }

  // Filter by symptom
  if (symptom) {
    query.targetSymptoms = {
      $in: [symptom],
    };
  }

  // Filter by goal
  if (goal) {
    query.targetGoals = {
      $in: [goal],
    };
  }

  const parsedLimit = Math.min(
    Math.max(parseInt(limit, 10) || 20, 1),
    100
  );

  return Recommendation.find(query)
    .sort({
      priority: -1,
      createdAt: -1,
    })
    .limit(parsedLimit)
    .lean();
}

/**
 * Get recommendation by ID
 */
async function getRecommendationById(id) {
  return Recommendation.findById(id).lean();
}

/**
 * Create recommendation
 */
async function createRecommendation(data) {
  const recommendation = new Recommendation(data);

  return recommendation.save();
}

/**
 * Update recommendation
 */
async function updateRecommendation(id, data) {
  return Recommendation.findByIdAndUpdate(
    id,
    data,
    {
      new: true,
      runValidators: true,
    }
  ).lean();
}

/**
 * Delete recommendation
 */
async function deleteRecommendation(id) {
  return Recommendation.findByIdAndDelete(id).lean();
}

module.exports = {
  getRecommendations,
  getRecommendationById,
  createRecommendation,
  updateRecommendation,
  deleteRecommendation,
};