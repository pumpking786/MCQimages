// routes/resultRoutes.js
const express = require("express");
const router = express.Router();
const authenticateJWT = require("../middleware/jwtauthentication");
const ResultController = require("../controllers/ResultController");

router.post("/", authenticateJWT, ResultController.recordScore);
router.get("/", authenticateJWT, ResultController.getUserResults);

module.exports = router;
