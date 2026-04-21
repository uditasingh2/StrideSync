const authService = require("../services/authService");

const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, error: "name, email and password are required" });
    }
    if (String(password).length < 6) {
      return res
        .status(400)
        .json({ success: false, error: "password must be at least 6 characters" });
    }

    const result = await authService.signup({
      name: String(name),
      email: String(email),
      password: String(password),
    });

    return res.status(201).json({ success: true, ...result });
  } catch (err) {
    return next(err);
  }
};

const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ success: false, error: "email and password are required" });
    }

    const result = await authService.signin({
      email: String(email),
      password: String(password),
    });

    return res.json({ success: true, ...result });
  } catch (err) {
    return next(err);
  }
};

const me = async (req, res, next) => {
  try {
    const user = await authService.getCurrentUser(req.auth.userId);
    if (!user) return res.status(404).json({ success: false, error: "User not found" });
    return res.json({ success: true, data: user });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  signup,
  signin,
  me,
};
