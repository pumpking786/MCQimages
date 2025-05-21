// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const authenticateJWT = require("../middleware/jwtauthentication");
const AuthController = require("../controllers/AuthController");

router.post("/signup", AuthController.signup);
router.post("/login", AuthController.login);
router.get("/check-session", AuthController.checkSession);
router.post("/logout", AuthController.logout);

module.exports = router;
