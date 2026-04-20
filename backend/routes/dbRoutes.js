const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

/**
 * GET /api/db-status
 * Returns Mongoose connection state + DB name.
 * States: 0=disconnected, 1=connected, 2=connecting, 3=disconnecting
 */
router.get("/", (req, res) => {
  const stateMap = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };

  const state = mongoose.connection.readyState;

  if (state === 1) {
    return res.json({
      success: true,
      status: stateMap[state],
      database: mongoose.connection.name,
      host: mongoose.connection.host,
      port: mongoose.connection.port,
    });
  }

  return res.status(503).json({
    success: false,
    status: stateMap[state] || "unknown",
    message: "Database is not connected",
  });
});

module.exports = router;
