function validateRecommendation(data = {}) {
  const errors = {};

  // ========================================
  // REQUIRED FIELDS
  // ========================================

  if (
    !data.title ||
    typeof data.title !== "string" ||
    !data.title.trim()
  ) {
    errors.title = "Title is required.";
  }

  if (
    !data.category ||
    typeof data.category !== "string" ||
    !data.category.trim()
  ) {
    errors.category = "Category is required.";
  }

  if (
    !data.description ||
    typeof data.description !== "string" ||
    !data.description.trim()
  ) {
    errors.description = "Description is required.";
  }

  // ========================================
  // ARRAY FIELDS
  // ========================================

  if (
    data.tags !== undefined &&
    !Array.isArray(data.tags)
  ) {
    errors.tags = "Tags must be an array.";
  }

  if (
    data.targetSymptoms !== undefined &&
    !Array.isArray(data.targetSymptoms)
  ) {
    errors.targetSymptoms =
      "targetSymptoms must be an array.";
  }

  if (
    data.targetGoals !== undefined &&
    !Array.isArray(data.targetGoals)
  ) {
    errors.targetGoals =
      "targetGoals must be an array.";
  }

  // ========================================
  // NUMBER FIELDS
  // ========================================

  if (
    data.priority !== undefined &&
    (
      typeof data.priority !== "number" ||
      Number.isNaN(data.priority)
    )
  ) {
    errors.priority = "Priority must be a valid number.";
  }

  // ========================================
  // BOOLEAN FIELDS
  // ========================================

  if (
    data.isActive !== undefined &&
    typeof data.isActive !== "boolean"
  ) {
    errors.isActive =
      "isActive must be a boolean.";
  }

  // ========================================
  // RESULT
  // ========================================

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

module.exports = {
  validateRecommendation,
};