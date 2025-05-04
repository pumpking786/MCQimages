const express = require("express");
const router = express.Router();
const isAdmin = require("../middleware/isAdmin");
const authenticateJWT = require("../middleware/jwtauthentication");
const { Question } = require("../models");

// POST /admin/add-question
router.post("/add-question", authenticateJWT, isAdmin, async (req, res) => {
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
  
});

router.put("/quiz-question/:id", authenticateJWT, isAdmin, async (req, res) => {
 
    const questionId = req.params.id;
    const { questionImage, question, options, correctAnswer, hint } = req.body;

    // Check if at least one field is present
    if (
      questionImage === undefined &&
      question === undefined &&
      options === undefined &&
      correctAnswer === undefined &&
      hint === undefined
    ) {
      return res.status(400).json({ message: "At least one field is required to update" });
    }

    // Find the question
    const existingQuestion = await Question.findByPk(questionId);
    if (!existingQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Validate and update fields if provided
    if (question !== undefined) {
      if (question.trim() === "") {
        return res.status(400).json({ message: "Question text cannot be empty" });
      }
      existingQuestion.question = question;
    }

    if (options !== undefined) {
      if (!Array.isArray(options) || options.length < 2) {
        return res.status(400).json({ message: "Options must be an array with at least 2 items" });
      }
      existingQuestion.options = options;

      // If correctAnswer is also present, validate it against new options
      if (correctAnswer !== undefined && !options.includes(correctAnswer)) {
        return res.status(400).json({ message: "Correct answer must be one of the updated options" });
      }
    }

    if (correctAnswer !== undefined) {
      // If options are not updated but correctAnswer is, validate against current options
      const validOptions = options || existingQuestion.options;
      if (!validOptions.includes(correctAnswer)) {
        return res.status(400).json({ message: "Correct answer must be one of the options" });
      }
      existingQuestion.correctAnswer = correctAnswer;
    }

    if (questionImage !== undefined) {
      if (questionImage.trim() === "") {
        return res.status(400).json({ message: "Question Image text cannot be empty" });
      }
      existingQuestion.questionImage = questionImage;
    }

    if (hint !== undefined) {
      if (hint.trim() === "") {
        return res.status(400).json({ message: "Hint cannot be empty" });
      }
      existingQuestion.hint = hint;
    }

    await existingQuestion.save();

    res.status(200).json({ message: "Question updated successfully", question: existingQuestion });
});

router.delete("/quiz-question/:id", authenticateJWT, isAdmin, async (req, res) => {
    const questionId = req.params.id;

    // Find the question
    const existingQuestion = await Question.findByPk(questionId);
    if (!existingQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Delete the question
    await existingQuestion.destroy();

    res.status(200).json({ message: "Question deleted successfully" });
});


// GET /quiz-questions - Public or protected depending on use
router.get("/quiz-question", async (req, res) => {
    const questions = await Question.findAll({
      attributes: ["id", "questionImage", "question", "options", "correctAnswer", "hint"]
    });

    res.status(200).json(questions);
});

module.exports = router;
