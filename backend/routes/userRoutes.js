const express = require("express");
const router = express.Router();
const { User } = require("../models");
const bcrypt = require("bcrypt");
const authenticateJWT = require("../middleware/jwtauthentication");

// Fetch user details route
router.get("/user-details", authenticateJWT, async (req, res) => {
  const user = await User.findOne({
    where: { id: req.user.id },
    attributes: ["name", "age", "username", "role"], // Only fetching name, age, and username
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json(user);
});

router.put("/user-details", authenticateJWT, async (req, res) => {
  const { name, age, username } = req.body;

  // Check if at least one field is present
  if (name === undefined && age === undefined && username === undefined) {
    return res
      .status(400)
      .json({ message: "At least one field is required to update" });
  }

  const user = await User.findByPk(req.user.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Validate and update name
  if (name !== undefined) {
    if (name.trim() === "") {
      return res.status(400).json({ message: "Name cannot be empty" });
    }
    user.name = name;
  }

  // Validate and update age
  if (age !== undefined) {
    if (isNaN(age) || Number(age) <= 0) {
      return res
        .status(400)
        .json({ message: "Age must be a valid positive number" });
    }
    user.age = age;
  }

  // Validate and update username
  if (username !== undefined) {
    if (username.trim() === "") {
      return res.status(400).json({ message: "Username cannot be empty" });
    }

    const existingUser = await User.findOne({ where: { username } });
    if (existingUser && existingUser.id !== req.user.id) {
      return res.status(409).json({ message: "Username already taken" });
    }
    user.username = username;
  }

  await user.save();

  res.status(200).json({ message: "User details updated successfully" });
});

router.delete("/user-details", authenticateJWT, async (req, res) => {
  // Find the user by ID (from the JWT token)
  const user = await User.findByPk(req.user.id);

  // If user is not found, return a 404 error
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Delete the user from the database
  await user.destroy();

  // Send a success response
  res.status(200).json({ message: "User account deleted successfully" });
});

router.put("/change-password", authenticateJWT, async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  if (!oldPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ message: "New password must be at least 6 characters long" });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: "New password and confirmation do not match" });
  }

  const user = await User.findByPk(req.user.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Old password is incorrect" });
  }

  const hashedNewPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedNewPassword;
  await user.save();

  res.status(200).json({ message: "Password changed successfully" });
});

module.exports = router;
