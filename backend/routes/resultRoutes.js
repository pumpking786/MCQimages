const express=require("express")
const router=express.Router();
const authenticateJWT=require("../middleware/jwtauthentication")
const {QuizResult}=require("../models")

router.post("/",authenticateJWT, async (req,res)=>{
        const {score,total}=req.body;
        await QuizResult.create({score,total,userId:req.user.id})
        res.json({
            message: "Score recorded successfully",
            addedItem: {score,total},
          });
})

router.get("/", authenticateJWT, async (req, res) => {
  const limit = parseInt(req.query.limit) || 2;
  const page = parseInt(req.query.page) || 1;
  const offset = (page - 1) * limit;

  // Fetch quiz results and count total results
  const { count, rows: quizResults } = await QuizResult.findAndCountAll({
    where: {
      userId: req.user.id,
    },
    limit,
    offset,
  });

  const formattedResults = quizResults.map((result) => ({
    id: result.id,
    score: result.score,
    total: result.total,
    createdAt: new Date(result.createdAt).toLocaleString(),
  }));

  // Calculate pagination metadata
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
});
  
module.exports = router;