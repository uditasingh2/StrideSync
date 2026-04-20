const userService = require("../services/userService");

const getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAll();
    res.json({ success: true, count: users.length, data: users });
  } catch (err) { next(err); }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await userService.getById(req.params.id);
    if (!user) return res.status(404).json({ success: false, error: "User not found" });
    res.json({ success: true, data: user });
  } catch (err) { next(err); }
};

const createUser = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    if (!name || !email)
      return res.status(400).json({ success: false, error: "name and email are required" });
    const user = await userService.create({ name, email });
    res.status(201).json({ success: true, data: user });
  } catch (err) { next(err); }
};

const updateUser = async (req, res, next) => {
  try {
    const user = await userService.update(req.params.id, req.body);
    if (!user) return res.status(404).json({ success: false, error: "User not found" });
    res.json({ success: true, data: user });
  } catch (err) { next(err); }
};

const deleteUser = async (req, res, next) => {
  try {
    const deleted = await userService.remove(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, error: "User not found" });
    res.json({ success: true, message: "User deleted" });
  } catch (err) { next(err); }
};

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser };
