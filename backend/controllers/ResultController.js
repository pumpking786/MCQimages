// controllers/ResultController.js
const { QuizResult } = require("../models");

exports.recordScore = async (req, res) => {
  const { score, total } = req.body;

  try {
    const result = await QuizResult.create({ score, total, userId: req.user.id });

    res.json({
      message: "Score recorded successfully",
      addedItem: {
        score: result.score,
        total: result.total,
      },
    });
  } catch (error) {
    console.error("Error recording score:", error);
    res.status(500).json({ message: "Failed to record score" });
  }
};

exports.getUserResults = async (req, res) => {
  const limit = parseInt(req.query.limit) || 5;
  const page = parseInt(req.query.page) || 1;
  const offset = (page - 1) * limit;

  try {
    const { count, rows: quizResults } = await QuizResult.findAndCountAll({
      where: { userId: req.user.id },
      limit,
      offset,
    });

    const formattedResults = quizResults.map((result) => ({
      id: result.id,
      score: result.score,
      total: result.total,
      createdAt: new Date(result.createdAt).toLocaleString(),
    }));

    const totalPages = Math.ceil(count / limit);
    const hasNextPage = page < totalPages;

    res.json({
      message: "User's quiz results retrieved successfully",
      results: formattedResults || [],
      pagination: {
        currentPage: page,
        totalPages,
        totalResults: count,
        hasNextPage,
      },
    });
  } catch (error) {
    console.error("Error retrieving quiz results:", error);
    res.status(500).json({ message: "Failed to retrieve results" });
  }
};
