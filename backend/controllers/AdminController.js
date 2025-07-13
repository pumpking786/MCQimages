// controllers/AdminController.js
const { Question, QuizResult, User } = require("../models");
const bcrypt = require("bcrypt");

const defaultImage =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJdeTnZsjXpwZL9NNELSkDEv9mEpnxWbThXS_N21pOeAEfymWC2FZBidBOp1AawK2ZBUk&usqp=CAU";

exports.addQuestion = async (req, res) => {
  console.log("Request body:", req.body); // Debug the incoming data
  console.log("Uploaded file:", req.file); // Debug the uploaded file

  const { question, options, correctAnswer, hint } = req.body;
  const questionImage = req.file
    ? `/upload/${req.file.filename}`
    : defaultImage;

  // Parse options from string to array
  let parsedOptions = [];
  if (options && typeof options === "string") {
    try {
      parsedOptions = JSON.parse(options);
      if (!Array.isArray(parsedOptions)) {
        throw new Error("Options must be a valid array");
      }
    } catch (error) {
      return res
        .status(400)
        .json({ message: "Invalid options format", error: error.message });
    }
  } else if (options) {
    parsedOptions = options; // Use as-is if already an array
  }

  // Validation
  if (
    !question ||
    !Array.isArray(parsedOptions) ||
    parsedOptions.length < 2 ||
    !correctAnswer
  ) {
    return res.status(400).json({
      message: "Invalid question format",
      details: { question, options: parsedOptions, correctAnswer },
    });
  }

  if (!parsedOptions.includes(correctAnswer)) {
    return res
      .status(400)
      .json({ message: "Correct answer must be one of the options" });
  }

  try {
    const newQuestion = await Question.create({
      questionImage,
      question,
      options: parsedOptions,
      correctAnswer,
      hint,
    });
    res
      .status(201)
      .json({ message: "Question added successfully", question: newQuestion });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding question", error: error.message });
  }
};

exports.updateQuestion = async (req, res) => {
  console.log("Request body:", req.body); // Debug the incoming data
  console.log("Uploaded file:", req.file); // Debug the uploaded file

  const { question, options, correctAnswer, hint } = req.body;
  const questionId = req.params.id;

  // Check if at least one field or image is provided for update
  if (
    question === undefined &&
    options === undefined &&
    correctAnswer === undefined &&
    hint === undefined &&
    !req.file &&
    !req.body.questionImage
  ) {
    return res
      .status(400)
      .json({ message: "At least one field or image is required to update" });
  }

  // Find existing question
  const existingQuestion = await Question.findByPk(questionId);
  if (!existingQuestion) {
    return res.status(404).json({ message: "Question not found" });
  }

  // Handle image update
  if (req.file) {
    existingQuestion.questionImage = `/upload/${req.file.filename}`;
  } else if (req.body.questionImage !== undefined) {
    existingQuestion.questionImage =
      req.body.questionImage?.trim() || defaultImage;
  }

  // Update question text
  if (question !== undefined) {
    if (question.trim() === "") {
      return res.status(400).json({ message: "Question text cannot be empty" });
    }
    existingQuestion.question = question.trim();
  }

  // Parse and update options
  let parsedOptions = existingQuestion.options; // Default to existing options
  if (options !== undefined) {
    if (typeof options === "string") {
      try {
        parsedOptions = JSON.parse(options);
        if (!Array.isArray(parsedOptions)) {
          throw new Error("Options must be a valid array");
        }
      } catch (error) {
        return res
          .status(400)
          .json({ message: "Invalid options format", error: error.message });
      }
    } else if (Array.isArray(options)) {
      parsedOptions = options;
    }
    if (parsedOptions.length < 2) {
      return res
        .status(400)
        .json({ message: "Options must be an array with at least 2 items" });
    }
    existingQuestion.options = parsedOptions.map((opt) => opt.trim());
  }

  // Update correct answer
  if (correctAnswer !== undefined) {
    const validOptions =
      options !== undefined ? parsedOptions : existingQuestion.options;
    if (!validOptions.includes(correctAnswer)) {
      return res
        .status(400)
        .json({ message: "Correct answer must be one of the options" });
    }
    existingQuestion.correctAnswer = correctAnswer;
  }

  // Update hint
  if (hint !== undefined) {
    existingQuestion.hint = hint.trim() || null; // Allow null if empty
  }

  try {
    await existingQuestion.save();
    res.status(200).json({
      message: "Question updated successfully",
      question: existingQuestion,
    });
  } catch (error) {
    console.error("Save error:", error);
    res.status(500).json({
      message: "Failed to update the question",
      error: error.message,
    });
  }
};

exports.deleteQuestion = async (req, res) => {
  const questionId = req.params.id;

  const existingQuestion = await Question.findByPk(questionId);
  if (!existingQuestion) {
    return res.status(404).json({ message: "Question not found" });
  }

  await existingQuestion.destroy();
  res.status(200).json({ message: "Question deleted successfully" });
};

exports.getAllQuestions = async (req, res) => {
  const questions = await Question.findAll({
    attributes: [
      "id",
      "questionImage",
      "question",
      "options",
      "correctAnswer",
      "hint",
    ],
  });

  res.status(200).json(questions);
};

exports.getAllQuizResults = async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;
  const offset = (page - 1) * limit;
  const sortBy = req.query.sortBy === "score" ? "score" : "createdAt";
  const sortOrder =
    (req.query.order || "desc").toUpperCase() === "ASC" ? "ASC" : "DESC";

  const quizResults = await QuizResult.findAll({
    include: {
      model: User,
      attributes: ["name"],
      as: "user",
    },
    limit,
    offset,
    order: [[sortBy, sortOrder]],
  });

  const formattedResults = quizResults.map((result) => ({
    id: result.id,
    name: result.user?.name || null,
    score: result.score,
    total: result.total,
    createdAt: new Date(result.createdAt).toLocaleString(),
  }));

  const totalResults = await QuizResult.count();
  const totalPages = Math.ceil(totalResults / limit);

  res.json({
    currentPage: page,
    totalPages,
    totalResults,
    results: formattedResults,
  });
};

exports.resetUserPassword = async (req, res) => {
  const { username, newPassword } = req.body;

  if (!username || !newPassword) {
    return res
      .status(400)
      .json({ message: "Username and new password are required" });
  }

  if (newPassword.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters long" });
  }

  const user = await User.findOne({ where: { username } });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();

  res.status(200).json({
    message: `Password for user '${username}' has been reset successfully.`,
  });
};

exports.getAllUsers = async (req, res) => {
  const user = await User.findAll({
    attributes: ["id", "name", "age", "username", "role"],
  });
  if (!user) return res.status(404).json({ message: "No User Found" });
  res.status(200).json(user);
};
