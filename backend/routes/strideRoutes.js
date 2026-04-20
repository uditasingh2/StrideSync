const express = require("express");
const router = express.Router();
const strideController = require("../controllers/strideController");

router.get("/", strideController.getAllStrides);
router.get("/:id", strideController.getStrideById);
router.post("/", strideController.createStride);
router.delete("/:id", strideController.deleteStride);

module.exports = router;
