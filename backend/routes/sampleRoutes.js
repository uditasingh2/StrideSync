const express = require("express");
const router = express.Router();
const sampleController = require("../controllers/sampleController");

router.get("/dashboard/summary", sampleController.getDashboardSummary);
router.get("/dashboard/trends", sampleController.getDashboardTrends);
router.get("/samples", sampleController.getSamples);
router.post("/predict", sampleController.predictRisk);
router.get("/alerts", sampleController.getAlerts);

module.exports = router;
