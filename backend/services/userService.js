const User = require("../models/User");

const getAll = () => User.find();

const getById = (id) => User.findById(id);

const create = (data) => User.create(data);

const update = (id, data) =>
  User.findByIdAndUpdate(id, data, { new: true, runValidators: true });

const remove = (id) => User.findByIdAndDelete(id);

module.exports = { getAll, getById, create, update, remove };
