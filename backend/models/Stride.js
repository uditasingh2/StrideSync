const mongoose = require("mongoose");

const StrideSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "userId is required"],
    },
    steps: {
      type: Number,
      default: 0,
      min: 0,
    },
    cadence: {
      type: Number,
      default: 0,
      min: 0,
      comment: "Steps per minute",
    },
    balance: {
      type: Number,
      default: 100,
      min: 0,
      max: 100,
      comment: "Balance score 0-100",
    },
    pressure: {
      type: [Number],
      default: [],
      comment: "Array of pressure sensor readings",
    },
    recordedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Stride", StrideSchema);
