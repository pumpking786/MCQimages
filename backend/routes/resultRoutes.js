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
    // Fetch quiz results for the authenticated user
    const quizResults = await QuizResult.findAll({
      where: {
        userId: req.user.id, // Filter results for the authenticated user
      },
    });

    // Return a successful response even if no results are found, with an empty array
    res.json({
      message: "User's quiz results retrieved successfully",
      results: quizResults || [],  // Ensure results is always an array
    });
});

  
module.exports = router;