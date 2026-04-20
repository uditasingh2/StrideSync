const sampleService = require("../services/sampleService");

const getDashboardSummary = async (_req, res, next) => {
  try {
    const data = await sampleService.getDashboardSummary();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const getDashboardTrends = async (req, res, next) => {
  try {
    const { foot } = req.query;
    if (foot && !["left", "right"].includes(String(foot).toLowerCase())) {
      return res.status(400).json({
        success: false,
        error: "foot must be one of: left, right",
      });
    }

    const data = await sampleService.getDashboardTrends({
      foot: foot ? String(foot).toLowerCase() : undefined,
    });
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const getSamples = async (req, res, next) => {
  try {
    const { foot, gait_score, flat_foot, page, limit } = req.query;
    const data = await sampleService.getSamples({
      foot: foot ? String(foot).toLowerCase() : undefined,
      gait_score,
      flat_foot: flat_foot ? String(flat_foot).toLowerCase() : undefined,
      page,
      limit,
    });
    res.json({ success: true, ...data });
  } catch (err) {
    next(err);
  }
};

const predictRisk = async (req, res, next) => {
  try {
    const {
      force_imbalance,
      missing_sensor_count,
      force_zero_ratio,
      toe_ratio,
      flat_foot,
    } = req.body || {};

    const required = ["force_imbalance", "missing_sensor_count", "force_zero_ratio", "toe_ratio"];
    for (const field of required) {
      if (req.body?.[field] === undefined) {
        return res.status(400).json({
          success: false,
          error: `${field} is required`,
        });
      }
    }

    const profile = sampleService.computeRiskProfile({
      force_imbalance: Number(force_imbalance),
      missing_sensor_count: Number(missing_sensor_count),
      force_zero_ratio: Number(force_zero_ratio),
      toe_ratio: Number(toe_ratio),
      flat_foot: String(flat_foot || "no").toLowerCase(),
    });

    res.json({
      success: true,
      input: {
        force_imbalance: Number(force_imbalance),
        missing_sensor_count: Number(missing_sensor_count),
        force_zero_ratio: Number(force_zero_ratio),
        toe_ratio: Number(toe_ratio),
        flat_foot: String(flat_foot || "no").toLowerCase(),
      },
      prediction: profile,
    });
  } catch (err) {
    next(err);
  }
};

const getAlerts = async (req, res, next) => {
  try {
    const data = await sampleService.getAlerts(req.query.limit);
    res.json({ success: true, count: data.length, data });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getDashboardSummary,
  getDashboardTrends,
  getSamples,
  predictRisk,
  getAlerts,
};
