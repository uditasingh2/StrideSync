const Sample = require("../models/Sample");

const SENSOR_FIELDS = [
  "Force_1_mean",
  "Force_2_mean",
  "Force_3_mean",
  "Force_4_mean",
  "Piezo_1_mean",
  "Piezo_2_mean",
  "Piezo_3_mean",
  "Piezo_4_mean",
  "Piezo_5_mean",
];

function buildFilter({ foot, gait_score, flat_foot }) {
  const filter = {};

  if (foot && ["left", "right"].includes(foot)) {
    filter.foot = foot;
  }

  if (gait_score !== undefined && gait_score !== "") {
    const score = Number(gait_score);
    if (!Number.isNaN(score) && score >= 0 && score <= 3) {
      filter.gait_score = score;
    }
  }

  if (flat_foot && ["yes", "no"].includes(flat_foot)) {
    filter.flat_foot = flat_foot;
  }

  return filter;
}

async function getDashboardSummary() {
  const [
    totalSamples,
    avgMetrics,
    footDistribution,
    gaitScoreDistribution,
    flatFootDistribution,
    highRiskCount,
  ] = await Promise.all([
    Sample.countDocuments(),
    Sample.aggregate([
      {
        $group: {
          _id: null,
          avgGaitScore: { $avg: "$gait_score" },
          avgForceImbalance: { $avg: "$force_imbalance" },
          avgAge: { $avg: "$age" },
        },
      },
    ]),
    Sample.aggregate([
      { $group: { _id: "$foot", count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]),
    Sample.aggregate([
      { $group: { _id: "$gait_score", count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]),
    Sample.aggregate([
      { $group: { _id: "$flat_foot", count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]),
    Sample.countDocuments({ gait_score: { $gte: 2 } }),
  ]);

  const metrics = avgMetrics[0] || {
    avgGaitScore: 0,
    avgForceImbalance: 0,
    avgAge: 0,
  };

  return {
    totalSamples,
    highRiskCount,
    avgGaitScore: Number(metrics.avgGaitScore.toFixed(2)),
    avgForceImbalance: Number(metrics.avgForceImbalance.toFixed(2)),
    avgAge: Number(metrics.avgAge.toFixed(1)),
    footDistribution: footDistribution.map((item) => ({
      foot: item._id,
      count: item.count,
    })),
    gaitScoreDistribution: gaitScoreDistribution.map((item) => ({
      score: item._id,
      count: item.count,
    })),
    flatFootDistribution: flatFootDistribution.map((item) => ({
      flat_foot: item._id,
      count: item.count,
    })),
  };
}

async function getDashboardTrends({ foot }) {
  const filter = buildFilter({ foot });
  const matchStage = Object.keys(filter).length ? [{ $match: filter }] : [];

  const [gaitByAgeBand, sensorAverages, riskByFoot] = await Promise.all([
    Sample.aggregate([
      ...matchStage,
      {
        $addFields: {
          ageBand: {
            $switch: {
              branches: [
                { case: { $lte: ["$age", 35] }, then: "30-35" },
                { case: { $lte: ["$age", 40] }, then: "36-40" },
                { case: { $lte: ["$age", 45] }, then: "41-45" },
                { case: { $lte: ["$age", 50] }, then: "46-50" },
                { case: { $lte: ["$age", 55] }, then: "51-55" },
              ],
              default: "56-60",
            },
          },
        },
      },
      {
        $group: {
          _id: "$ageBand",
          avgGaitScore: { $avg: "$gait_score" },
          sampleCount: { $sum: 1 },
        },
      },
      {
        $addFields: {
          sortKey: {
            $indexOfArray: [
              ["30-35", "36-40", "41-45", "46-50", "51-55", "56-60"],
              "$_id",
            ],
          },
        },
      },
      { $sort: { sortKey: 1 } },
      {
        $project: {
          _id: 0,
          ageBand: "$_id",
          avgGaitScore: { $round: ["$avgGaitScore", 2] },
          sampleCount: 1,
        },
      },
    ]),
    Sample.aggregate([
      ...matchStage,
      {
        $group: {
          _id: null,
          Force_1_mean: { $avg: "$Force_1_mean" },
          Force_2_mean: { $avg: "$Force_2_mean" },
          Force_3_mean: { $avg: "$Force_3_mean" },
          Force_4_mean: { $avg: "$Force_4_mean" },
          Piezo_1_mean: { $avg: "$Piezo_1_mean" },
          Piezo_2_mean: { $avg: "$Piezo_2_mean" },
          Piezo_3_mean: { $avg: "$Piezo_3_mean" },
          Piezo_4_mean: { $avg: "$Piezo_4_mean" },
          Piezo_5_mean: { $avg: "$Piezo_5_mean" },
        },
      },
      {
        $project: SENSOR_FIELDS.reduce((acc, field) => {
          acc[field] = { $round: [`$${field}`, 2] };
          return acc;
        }, { _id: 0 }),
      },
    ]),
    Sample.aggregate([
      ...matchStage,
      {
        $group: {
          _id: "$foot",
          avgImbalance: { $avg: "$force_imbalance" },
          avgGaitScore: { $avg: "$gait_score" },
          highRiskCount: {
            $sum: { $cond: [{ $gte: ["$gait_score", 2] }, 1, 0] },
          },
          total: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          foot: "$_id",
          avgImbalance: { $round: ["$avgImbalance", 2] },
          avgGaitScore: { $round: ["$avgGaitScore", 2] },
          highRiskCount: 1,
          total: 1,
        },
      },
    ]),
  ]);

  return {
    filter: foot || "all",
    gaitByAgeBand,
    sensorAverages: sensorAverages[0] || {},
    riskByFoot,
  };
}

async function getSamples({ foot, gait_score, flat_foot, page = 1, limit = 20 }) {
  const filter = buildFilter({ foot, gait_score, flat_foot });
  const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);
  const safePage = Math.max(Number(page) || 1, 1);
  const skip = (safePage - 1) * safeLimit;

  const [items, total] = await Promise.all([
    Sample.find(filter)
      .sort({ source_row_number: 1, _id: 1 })
      .skip(skip)
      .limit(safeLimit),
    Sample.countDocuments(filter),
  ]);

  return {
    page: safePage,
    limit: safeLimit,
    total,
    totalPages: Math.max(Math.ceil(total / safeLimit), 1),
    items,
  };
}

function computeRiskProfile({
  force_imbalance = 0,
  missing_sensor_count = 0,
  force_zero_ratio = 0,
  toe_ratio = 0,
  flat_foot = "no",
}) {
  let points = 0;

  if (force_imbalance >= 400) points += 2;
  else if (force_imbalance >= 250) points += 1;

  if (missing_sensor_count >= 2) points += 2;
  else if (missing_sensor_count >= 1) points += 1;

  if (force_zero_ratio >= 0.6) points += 2;
  else if (force_zero_ratio >= 0.4) points += 1;

  if (toe_ratio >= 0.65 || toe_ratio <= 0.1) points += 1;
  if (flat_foot === "yes") points += 1;

  let riskLevel = "low";
  let predictedGaitScore = 0;

  if (points >= 6) {
    riskLevel = "high";
    predictedGaitScore = 3;
  } else if (points >= 4) {
    riskLevel = "medium";
    predictedGaitScore = 2;
  } else if (points >= 2) {
    riskLevel = "watch";
    predictedGaitScore = 1;
  }

  const recommendations = [];
  if (force_imbalance >= 250) {
    recommendations.push("Add left-right balance drills for 10-15 minutes daily.");
  }
  if (force_zero_ratio >= 0.4) {
    recommendations.push("Review sensor placement and reduce prolonged stationary stance.");
  }
  if (flat_foot === "yes") {
    recommendations.push("Use arch-support insoles and include calf/arch mobility stretches.");
  }
  if (missing_sensor_count >= 1) {
    recommendations.push("Check hardware/sensor connectivity before next session.");
  }
  if (!recommendations.length) {
    recommendations.push("Maintain current routine and monitor weekly gait trend.");
  }

  return { points, riskLevel, predictedGaitScore, recommendations };
}

async function getAlerts(limit = 10) {
  const safeLimit = Math.min(Math.max(Number(limit) || 10, 1), 50);
  const riskyRows = await Sample.find({
    $or: [{ gait_score: { $gte: 2 } }, { flat_foot: "yes" }],
  })
    .sort({ gait_score: -1, force_imbalance: -1, source_row_number: 1 })
    .limit(safeLimit)
    .select("foot gait_score flat_foot force_imbalance file source_row_number");

  return riskyRows.map((row, index) => {
    const severity = row.gait_score >= 3 ? "high" : row.gait_score >= 2 ? "medium" : "low";
    return {
      id: `${row._id}`,
      severity,
      title: `Risk alert ${index + 1}: ${row.foot} foot`,
      message: `gait_score=${row.gait_score}, imbalance=${row.force_imbalance.toFixed(
        2
      )}, flat_foot=${row.flat_foot}`,
      file: row.file,
      source_row_number: row.source_row_number,
    };
  });
}

module.exports = {
  getDashboardSummary,
  getDashboardTrends,
  getSamples,
  computeRiskProfile,
  getAlerts,
};
