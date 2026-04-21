const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { authenticate } = require("../middleware/authMiddleware");

router.post("/signup", authController.signup);
router.post("/signin", authController.signin);
router.get("/me", authenticate, authController.me);

module.exports = router;
