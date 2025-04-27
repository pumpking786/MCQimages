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
  
      if (quizResults.length === 0) {
        return res.status(404).json({ message: "No quiz results found for this user." });
      }
  
      // Send back the fetched quiz results
      res.json({
        message: "User's quiz results retrieved successfully",
        results: quizResults,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: "An error occurred while fetching quiz results." });
    }
  });
  
module.exports = router;