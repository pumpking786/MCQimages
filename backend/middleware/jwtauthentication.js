// authMiddleware.js
const jwt = require("jsonwebtoken");
const SECRET_KEY = "your_secret_key"; // Secret key for signing the JWT

// Middleware to authenticate JWT tokens
const authenticateJWT = (req, res, next) => {
  try {
    const token =
      req.headers.authorization && req.headers.authorization.split(" ")[1];
    if (!token)
      return res.status(401).send("Access denied. No token provided.");

    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) return res.status(403).send("Invalid token.");
      req.user = user; // Store user in request object
      next();
    });
  } catch (err) {
    res.status(402).send("Error");
  }
};

module.exports = authenticateJWT;
