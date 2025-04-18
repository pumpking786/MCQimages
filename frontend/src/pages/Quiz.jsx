import React, { useState, useEffect } from "react";
import QuizResultModal from "../components/QuizResultModal"; // Import the modal component

const questions = [
  {
    questionImage:
      "https://hips.hearstapps.com/hmg-prod/images/william-shakespeare-194895-1-402.jpg", // Replace with actual image URL
    options: ["Berlin", "Madrid", "Paris", "Rome"],
    correctAnswer: "Paris",
  },
  {
    questionImage:
      "https://hips.hearstapps.com/hmg-prod/images/william-shakespeare-194895-1-402.jpg", // Replace with actual image URL
    options: ["Earth", "Mars", "Venus", "Jupiter"],
    correctAnswer: "Mars",
  },
  {
    questionImage:
      "https://hips.hearstapps.com/hmg-prod/images/william-shakespeare-194895-1-402.jpg", // Replace with actual image URL
    options: ["3", "4", "5", "6"],
    correctAnswer: "4",
  },
  {
    questionImage:
      "https://hips.hearstapps.com/hmg-prod/images/william-shakespeare-194895-1-402.jpg", // Replace with actual image URL
    options: ["Atlantic", "Indian", "Arctic", "Pacific"],
    correctAnswer: "Pacific",
  },
  {
    questionImage:
      "https://hips.hearstapps.com/hmg-prod/images/william-shakespeare-194895-1-402.jpg", // Replace with actual image URL
    options: [
      "William Wordsworth",
      "William Shakespeare",
      "Jane Austen",
      "Mark Twain",
    ],
    correctAnswer: "William Shakespeare",
  },
];

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const Quiz = () => {
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  useEffect(() => {
    const selected = shuffleArray([...questions]).slice(0, 5);
    setShuffledQuestions(selected);
  }, []);

  const handleRestart = () => {
    const selected = shuffleArray([...questions]).slice(0, 5);
    setShuffledQuestions(selected);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
  };

  if (shuffledQuestions.length === 0)
    return <div className="text-white text-center mt-10">Loading quiz...</div>;

  const currentQuestion = shuffledQuestions[currentQuestionIndex];

  const handleAnswerSelection = (answer) => {
    setSelectedAnswer(answer);
    setIsAnswered(true);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }
    setSelectedAnswer(null);
    setIsAnswered(false);
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  const isQuizFinished = currentQuestionIndex >= shuffledQuestions.length;

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-88px)] bg-gradient-to-br from-blue-900 via-blue-800 to-black text-white">
      <div className="bg-[#001f3f] p-8 rounded-none shadow-none w-full min-h-[calc(100vh-88px)] border-t-4 border-yellow-400">
        {/* Score Display */}
        <div className="mt-2 text-center text-lg">
          <p className="text-4xl font-bold text-yellow-400 mb-4">
            Your Score: <span className="text-5xl text-green-500">{score}</span>{" "}
            / {shuffledQuestions.length}
          </p>
        </div>
        {/* Show quiz only if not finished */}
        {!isQuizFinished && (
          <>
            {/* Main container for question and options */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-center mb-6 gap-6">
              {/* Question Number and Image (Left on Desktop, Full Width on Mobile) */}
              <div className="flex flex-col items-center md:items-start w-full md:w-1/2">
                {/* Question Number */}
                <div className="mb-4 text-center md:text-left">
                  <p className="text-5xl font-bold text-yellow-400">
                    Q. {currentQuestionIndex + 1}
                  </p>
                </div>
                {/* Image */}
                <div className="flex justify-center items-center w-full">
                  <img
                    src={currentQuestion.questionImage}
                    alt="Quiz Image"
                    className="w-64 h-64 md:w-100 md:h-100 object-cover"
                  />
                </div>
              </div>

              {/* Options (Right on Desktop, Full Width on Mobile, Vertically Centered on Desktop) */}
              <div className="w-full md:w-1/2">
                <div className="grid grid-cols-2 gap-6 mb-8">
                  {currentQuestion.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        handleAnswerSelection(option);
                        setIsAnswered(true);
                      }}
                      className={`w-full py-4 px-6 text-lg font-bold rounded-lg transition-all duration-200 
                border-2 border-yellow-400 
                ${
                  isAnswered && option === selectedAnswer
                    ? option === currentQuestion.correctAnswer
                      ? "bg-green-600"
                      : "bg-red-600"
                    : "bg-blue-800 hover:bg-blue-700"
                }`}
                      disabled={isAnswered}
                    >
                      <span className="mr-2">
                        {String.fromCharCode(65 + index)}:
                      </span>
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Feedback */}
        {isAnswered && (
          <div className="mb-6 text-center text-xl font-medium">
            {selectedAnswer === currentQuestion.correctAnswer ? (
              <p className="text-green-400">Correct!</p>
            ) : (
              <p className="text-red-400">
                Wrong! Correct Answer:{" "}
                <span className="font-bold text-yellow-300">
                  {currentQuestion.correctAnswer}
                </span>
              </p>
            )}
          </div>
        )}

        {/* Show Next Question button only after an answer is selected */}
        {isAnswered && (
          <button
            onClick={handleNextQuestion}
            className="w-full bg-yellow-500 text-black py-3 rounded-lg font-semibold hover:bg-yellow-400 transition mt-4"
          >
            {currentQuestionIndex === shuffledQuestions.length - 1
              ? "Finish Quiz"
              : "Next Question"}
          </button>
        )}

        {isQuizFinished && (
          <QuizResultModal
            score={score}
            total={shuffledQuestions.length}
            onRestart={handleRestart}
          />
        )}
      </div>
    </div>
  );
};

export default Quiz;
