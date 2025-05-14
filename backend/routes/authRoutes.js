// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const authenticateJWT = require("../middleware/jwtauthentication");
const AuthController = require("../controllers/AuthController");

router.post("/signup", AuthController.signup);
router.post("/login", AuthController.login);
router.get("/check-session", AuthController.checkSession);
router.post("/logout", AuthController.logout);
router.get("/user-details", authenticateJWT, AuthController.getUserDetails);
router.put("/user-details", authenticateJWT, AuthController.updateUserDetails);
router.delete("/user-details", authenticateJWT, AuthController.deleteUser);

module.exports = router;
