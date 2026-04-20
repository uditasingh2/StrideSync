const strideService = require("../services/strideService");

const getAllStrides = async (req, res, next) => {
  try {
    const strides = await strideService.getAll();
    res.json({ success: true, count: strides.length, data: strides });
  } catch (err) { next(err); }
};

const getStrideById = async (req, res, next) => {
  try {
    const stride = await strideService.getById(req.params.id);
    if (!stride) return res.status(404).json({ success: false, error: "Stride record not found" });
    res.json({ success: true, data: stride });
  } catch (err) { next(err); }
};

const createStride = async (req, res, next) => {
  try {
    const { userId, steps, cadence, balance, pressure } = req.body;
    if (!userId)
      return res.status(400).json({ success: false, error: "userId is required" });
    const stride = await strideService.create({ userId, steps, cadence, balance, pressure });
    res.status(201).json({ success: true, data: stride });
  } catch (err) { next(err); }
};

const deleteStride = async (req, res, next) => {
  try {
    const deleted = await strideService.remove(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, error: "Stride record not found" });
    res.json({ success: true, message: "Stride record deleted" });
  } catch (err) { next(err); }
};

module.exports = { getAllStrides, getStrideById, createStride, deleteStride };
