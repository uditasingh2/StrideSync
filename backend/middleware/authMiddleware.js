const jwt = require("jsonwebtoken");

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ success: false, error: "Unauthorized: token missing" });
  }

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ success: false, error: "JWT_SECRET is not configured" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.auth = {
      userId: payload.sub,
      email: payload.email,
      name: payload.name,
    };
    return next();
  } catch (_err) {
    return res.status(401).json({ success: false, error: "Unauthorized: invalid token" });
  }
}

module.exports = { authenticate };
