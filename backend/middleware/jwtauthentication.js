// authMiddleware.js
const jwt = require("jsonwebtoken");
const SECRET_KEY = "your_secret_key";

const authenticateJWT = (req, res, next) => {
  try {
    const token = req.session.token;
    if (!token) return res.status(401).send("Access denied. No token provided.");

    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) return res.status(403).send("Invalid token.");
      req.user = user; // Pass decoded info
      next();
    });
  } catch (err) {
    res.status(402).send("Error");
  }
};

module.exports = authenticateJWT;
