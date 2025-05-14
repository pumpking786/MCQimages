// controllers/AuthController.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

const SECRET_KEY = process.env.SECRET_KEY;

exports.signup = async (req, res) => {
  const { name, age, username, password, cpassword } = req.body;

  if (!name || !age || !username || !password || !cpassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (isNaN(age) || Number(age) <= 0) {
    return res.status(400).json({ message: "Age must be a valid positive number" });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters long" });
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
    role: "user",
  });

  res.status(201).json({ message: "User registered successfully" });
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
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
    { id: user.id, username: user.username, role: user.role },
    SECRET_KEY,
    { expiresIn: "1h" }
  );

  req.session.token = token;

  res.status(200).json({ message: "Login successful", token });
};

exports.checkSession = (req, res) => {
  if (req.session && req.session.token) {
    return res.status(200).json({ loggedIn: true });
  }
  res.status(200).json({ loggedIn: false });
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ message: "Logout failed" });
    res.clearCookie("connect.sid");
    res.status(200).json({ message: "Logout successful" });
  });
};

exports.getUserDetails = async (req, res) => {
  const user = await User.findOne({
    where: { id: req.user.id },
    attributes: ["name", "age", "username", "role"],
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json(user);
};

exports.updateUserDetails = async (req, res) => {
  const { name, age, username } = req.body;

  if (name === undefined && age === undefined && username === undefined) {
    return res.status(400).json({ message: "At least one field is required to update" });
  }

  const user = await User.findByPk(req.user.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  if (name !== undefined && name.trim() === "") {
    return res.status(400).json({ message: "Name cannot be empty" });
  }

  if (name !== undefined) user.name = name;

  if (age !== undefined) {
    if (isNaN(age) || Number(age) <= 0) {
      return res.status(400).json({ message: "Age must be a valid positive number" });
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
