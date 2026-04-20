const mongoose = require("mongoose");

const SampleSchema = new mongoose.Schema(
  {
    sample_key: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    Piezo_1_hits: Number,
    Piezo_1_mean: Number,
    Piezo_2_hits: Number,
    Piezo_2_mean: Number,
    Piezo_3_hits: Number,
    Piezo_3_mean: Number,
    Piezo_4_hits: Number,
    Piezo_4_mean: Number,
    Piezo_5_hits: Number,
    Piezo_5_mean: Number,
    toe_ratio: Number,
    Force_1_mean: Number,
    Force_1_max: Number,
    Force_1_std: Number,
    Force_1_nonzero_count: Number,
    Force_2_mean: Number,
    Force_2_max: Number,
    Force_2_std: Number,
    Force_2_nonzero_count: Number,
    Force_3_mean: Number,
    Force_3_max: Number,
    Force_3_std: Number,
    Force_3_nonzero_count: Number,
    Force_4_mean: Number,
    Force_4_max: Number,
    Force_4_std: Number,
    Force_4_nonzero_count: Number,
    force_zero_ratio: Number,
    force_overall_std: Number,
    missing_sensor_count: Number,
    force_imbalance: Number,
    gait_score: {
      type: Number,
      min: 0,
      max: 3,
      index: true,
    },
    foot: {
      type: String,
      enum: ["left", "right"],
      required: true,
      index: true,
    },
    age: Number,
    file: {
      type: String,
      required: true,
      index: true,
    },
    source_row_number: {
      type: Number,
      min: 1,
    },
    flat_foot: {
      type: String,
      enum: ["yes", "no"],
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

SampleSchema.index({ foot: 1, gait_score: 1 });
SampleSchema.index({ flat_foot: 1, foot: 1 });

module.exports = mongoose.model("Sample", SampleSchema);
