// middleware/session.js
const session = require("express-session");

// Middleware to configure session
const sessionMiddleware = () => {
  return session({
    secret: "your-session-secret", // Secret for signing session IDs
    resave: false, // Don't resave session if it hasn't changed
    saveUninitialized: true, // Save uninitialized sessions
    cookie: { 
      secure: false, // In production, set to true with HTTPS
      maxAge: 1000 * 60 * 60 // Optional: Session expiration (1 hour)
    },
  });
};

module.exports = sessionMiddleware;