// controllers/AdminController.js
const { Question, QuizResult, User } = require("../models");

const defaultImage =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJdeTnZsjXpwZL9NNELSkDEv9mEpnxWbThXS_N21pOeAEfymWC2FZBidBOp1AawK2ZBUk&usqp=CAU";

exports.addQuestion = async (req, res) => {
  const { questionImage, question, options, correctAnswer, hint } = req.body;

  if (!question || !Array.isArray(options) || options.length < 2 || !correctAnswer) {
    return res.status(400).json({ message: "Invalid question format" });
  }

  if (!options.includes(correctAnswer)) {
    return res.status(400).json({ message: "Correct answer must be one of the options" });
  }

  const imageToUse = questionImage?.trim() || defaultImage;

  const newQuestion = await Question.create({
    questionImage: imageToUse,
    question,
    options,
    correctAnswer,
    hint,
  });

  res.status(201).json({ message: "Question added successfully", question: newQuestion });
};

exports.updateQuestion = async (req, res) => {
  const questionId = req.params.id;
  const { questionImage, question, options, correctAnswer, hint } = req.body;

  if (
    questionImage === undefined &&
    question === undefined &&
    options === undefined &&
    correctAnswer === undefined &&
    hint === undefined
  ) {
    return res.status(400).json({ message: "At least one field is required to update" });
  }

  const existingQuestion = await Question.findByPk(questionId);
  if (!existingQuestion) {
    return res.status(404).json({ message: "Question not found" });
  }

  existingQuestion.questionImage = questionImage?.trim() || defaultImage;

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

    if (correctAnswer !== undefined && !options.includes(correctAnswer)) {
      return res.status(400).json({ message: "Correct answer must be one of the updated options" });
    }
  }

  if (correctAnswer !== undefined) {
    const validOptions = options || existingQuestion.options;
    if (!validOptions.includes(correctAnswer)) {
      return res.status(400).json({ message: "Correct answer must be one of the options" });
    }
    existingQuestion.correctAnswer = correctAnswer;
  }

  if (hint !== undefined) {
    existingQuestion.hint = hint.trim();
  }

  await existingQuestion.save();

  res.status(200).json({ message: "Question updated successfully", question: existingQuestion });
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
    attributes: ["id", "questionImage", "question", "options", "correctAnswer", "hint"],
  });

  res.status(200).json(questions);
};

exports.getAllQuizResults = async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;
  const offset = (page - 1) * limit;

  const quizResults = await QuizResult.findAll({
    include: {
      model: User,
      attributes: ["name"],
      as: "user",
    },
    limit,
    offset,
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
