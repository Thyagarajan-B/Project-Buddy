const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = { id: decoded.id };
      next();
    } catch (err) {
      console.error("JWT verification failed", err);
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
  } else {
    return res.status(401).json({ success: false, message: "No token provided" });
  }
};

module.exports = protect;
