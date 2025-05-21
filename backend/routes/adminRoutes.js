// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const authenticateJWT = require("../middleware/jwtauthentication");
const isAdmin = require("../middleware/isAdmin");
const AdminController = require("../controllers/AdminController");

router.post("/add-question", authenticateJWT, isAdmin, AdminController.addQuestion);
router.put("/quiz-question/:id", authenticateJWT, isAdmin, AdminController.updateQuestion);
router.delete("/quiz-question/:id", authenticateJWT, isAdmin, AdminController.deleteQuestion);
router.get("/quiz-question", authenticateJWT, AdminController.getAllQuestions);
router.get("/quizresults", authenticateJWT, isAdmin, AdminController.getAllQuizResults);
router.get("/getallusers", authenticateJWT, isAdmin, AdminController.getAllUsers);

module.exports = router;
