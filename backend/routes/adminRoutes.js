const express = require("express");
const router = express.Router();
const isAdmin = require("../middleware/isAdmin");
const authenticateJWT = require("../middleware/jwtauthentication");
const { Question } = require("../models");

// POST /admin/add-question
router.post("/add-question", authenticateJWT, isAdmin, async (req, res) => {
  try {
    const { questionImage, question, options, correctAnswer, hint } = req.body;

    // Basic validations
    if (!question || !Array.isArray(options) || options.length < 2 || !correctAnswer) {
      return res.status(400).json({ message: "Invalid question format" });
    }

    if (!options.includes(correctAnswer)) {
      return res.status(400).json({ message: "Correct answer must be one of the options" });
    }

    // Create question in DB
    const newQuestion = await Question.create({
      questionImage,
      question,
      options,
      correctAnswer,
      hint,
    });

    res.status(201).json({ message: "Question added successfully", question: newQuestion });
  } catch (error) {
    console.error("Error adding question:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET /quiz-questions - Public or protected depending on use
router.get("/quiz-questions", async (req, res) => {
  try {
    const questions = await Question.findAll({
      attributes: ["id", "questionImage", "question", "options", "correctAnswer", "hint"]
    });

    res.status(200).json(questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
