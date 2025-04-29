const express=require("express")
const router=express.Router();
const authenticateJWT=require("../middleware/jwtauthentication")
const {QuizResult}=require("../models")

router.post("/",authenticateJWT, async (req,res)=>{
    try{
        const {score,total}=req.body;
        await QuizResult.create({score,total,userId:req.user.id})
        res.json({
            message: "Score recorded successfully",
            addedItem: {score,total},
          });
    }catch(err){
        res.status(500).send(err)
    } 
})

router.get("/", authenticateJWT, async (req, res) => {
  try {
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
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "An error occurred while fetching quiz results." });
  }
});

  
module.exports = router;