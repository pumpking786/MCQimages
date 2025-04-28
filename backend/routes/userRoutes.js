const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const authenticateJWT= require("../middleware/jwtauthentication")
const SECRET_KEY = "your_secret_key";

// Signup Route
router.post("/signup", async (req, res) => {
  try {
    const { name, age, username, password, cpassword } = req.body;

    if (!name || !age || !username || !password || !cpassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (isNaN(age) || Number(age) <= 0) {
      return res
        .status(400)
        .json({ message: "Age must be a valid positive number" });
    }

    // Validate password length (at least 6 characters)
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    if (password !== cpassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const existingUser = await User.findOne({ where: { username } });

    if (existingUser) {
      return res.status(409).json({ message: "Username already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      age,
      username,
      password: hashedPassword,
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      SECRET_KEY,
      { expiresIn: "1h" }
    );
     // Save token in session
     req.session.token = token;
    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/check-session", (req, res) => {
  if (req.session && req.session.token) {
    return res.status(200).json({ loggedIn: true });
  } else {
    return res.status(200).json({ loggedIn: false });
  }
});

// Fetch user details route
router.get("/user-details",authenticateJWT, async (req, res) => {
  try {
    const user = await User.findOne({ 
      where: { id: req.user.id }, 
      attributes: ['name', 'age', 'username'] // Only fetching name, age, and username
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("Error fetching user details:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});


router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ message: "Logout failed" });
    res.clearCookie("connect.sid");
    res.status(200).json({ message: "Logout successful" });
  });
});


module.exports = router;