const Stride = require("../models/Stride");

const getAll = () => Stride.find().populate("userId", "name email");

const getById = (id) => Stride.findById(id).populate("userId", "name email");

const create = (data) => Stride.create(data);

const remove = (id) => Stride.findByIdAndDelete(id);

module.exports = { getAll, getById, create, remove };
