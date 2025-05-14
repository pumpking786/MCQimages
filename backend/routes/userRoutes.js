// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const authenticateJWT = require("../middleware/jwtauthentication");
const UserController = require("../controllers/UserController");

router.get("/user-details", authenticateJWT, UserController.getUserDetails);
router.put("/user-details", authenticateJWT, UserController.updateUserDetails);
router.delete("/user-details", authenticateJWT, UserController.deleteUser);
router.put("/change-password", authenticateJWT, UserController.changePassword);

module.exports = router;
