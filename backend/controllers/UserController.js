// controllers/UserController.js
const { User } = require("../models");
const bcrypt = require("bcrypt");

exports.getUserDetails = async (req, res) => {
  const user = await User.findOne({
    where: { id: req.user.id },
    attributes: ["name", "age", "username", "role"],
  });

  if (!user) return res.status(404).json({ message: "User not found" });

  res.status(200).json(user);
};

exports.updateUserDetails = async (req, res) => {
  const { name, age, username } = req.body;

  if (name === undefined && age === undefined && username === undefined) {
    return res
      .status(400)
      .json({ message: "At least one field is required to update" });
  }

  const user = await User.findByPk(req.user.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  if (name !== undefined) {
    if (name.trim() === "") {
      return res.status(400).json({ message: "Name cannot be empty" });
    }
    user.name = name;
  }

  if (age !== undefined) {
    if (isNaN(age) || Number(age) <= 0) {
      return res
        .status(400)
        .json({ message: "Age must be a valid positive number" });
    }
    user.age = age;
  }

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
};

exports.deleteUser = async (req, res) => {
  const user = await User.findByPk(req.user.id);

  if (!user) return res.status(404).json({ message: "User not found" });

  await user.destroy();

  res.status(200).json({ message: "User account deleted successfully" });
};

exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  if (!oldPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (newPassword.length < 6) {
    return res
      .status(400)
      .json({ message: "New password must be at least 6 characters long" });
  }

  if (newPassword !== confirmPassword) {
    return res
      .status(400)
      .json({ message: "New password and confirmation do not match" });
  }
  if (oldPassword === newPassword) {
    return res
      .status(400)
      .json({ message: "old password and new password cannot be same." });
  }

  const user = await User.findByPk(req.user.id);
  if (!user) return res.status(404).json({ message: "User not found" });
if (newPassword === user.username) {
    return res
      .status(400)
      .json({ message: "New password cannot be the same as the username" });
  }
  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Old password is incorrect" });
  }

  const hashedNewPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedNewPassword;
  await user.save();

  res.status(200).json({ message: "Password changed successfully" });
};
