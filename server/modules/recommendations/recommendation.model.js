const mongoose = require("mongoose");

const recommendationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
      enum: [
        "Mental Wellness",
        "Movement",
        "Sleep & Recovery",
        "Nutrition",
        "Stress Management",
        "General Wellness",
      ],
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    icon: {
      type: String,
      default: "🌿",
    },

    accent: {
      type: String,
      enum: ["forest", "orange"],
      default: "forest",
    },

    tags: {
      type: [String],
      default: [],
    },

    targetSymptoms: {
      type: [String],
      default: [],
    },

    targetGoals: {
      type: [String],
      default: [],
    },

    source: {
      type: String,
      default: "NUROVA",
      trim: true,
    },

    externalUrl: {
      type: String,
      default: "",
      trim: true,
    },

    priority: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// ========================================
// INDEXES
// ========================================

recommendationSchema.index({
  category: 1,
  isActive: 1,
});

recommendationSchema.index({
  targetSymptoms: 1,
});

recommendationSchema.index({
  targetGoals: 1,
});

const Recommendation = mongoose.model(
  "Recommendation",
  recommendationSchema
);

module.exports = Recommendation;