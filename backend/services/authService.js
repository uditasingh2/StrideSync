const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

function requireJwtSecret() {
  if (!process.env.JWT_SECRET) {
    const err = new Error("JWT_SECRET is not configured");
    err.status = 500;
    throw err;
  }
}

function signToken(user) {
  requireJwtSecret();
  return jwt.sign(
    {
      sub: user._id.toString(),
      email: user.email,
      name: user.name,
    },
    process.env.JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

async function signup({ name, email, password }) {
  const existing = await User.findOne({ email: email.toLowerCase().trim() });
  if (existing) {
    const err = new Error("Email is already registered");
    err.status = 409;
    throw err;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password: hashedPassword,
  });

  const token = signToken(user);
  return { user, token };
}

async function signin({ email, password }) {
  const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");
  if (!user || !user.password) {
    const err = new Error("Invalid email or password");
    err.status = 401;
    throw err;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const err = new Error("Invalid email or password");
    err.status = 401;
    throw err;
  }

  const plainUser = user.toObject();
  delete plainUser.password;

  const token = signToken(plainUser);
  return { user: plainUser, token };
}

async function getCurrentUser(userId) {
  return User.findById(userId);
}

module.exports = {
  signup,
  signin,
  getCurrentUser,
};
