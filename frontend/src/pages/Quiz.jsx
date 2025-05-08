import React, { useState, useEffect } from "react";
import QuizResultModal from "../components/QuizResultModal";
import axios from "axios";

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8000/admin/quiz-question", {
        withCredentials: true, // This ensures cookies are sent with the request
      });
      const fetchedQuestions = shuffleArray(res.data).slice(0, 5);
      setQuestions(fetchedQuestions);
      setShuffledQuestions(fetchedQuestions);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch questions", err);
      setError("Failed to load quiz questions.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleRestart = () => {
    const selected = shuffleArray([...questions]).slice(0, 5);
    setShuffledQuestions(selected);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
  };

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
  const currentQuestion = shuffledQuestions[currentQuestionIndex];

  if (loading)
    return <div className="text-white text-center mt-10">Loading quiz...</div>;
  if (error)
    return <div className="text-red-400 text-center mt-10">{error}</div>;

  return (
    <div className="flex justify-center flex-grow bg-gradient-to-br from-blue-900 via-blue-800 to-black text-white">
      <div className="bg-[#001f3f] p-8 rounded-none shadow-none w-full">
        <div className="mt-2 text-center text-lg">
          <p className="text-4xl font-bold text-yellow-400 mb-4">
            Your Score: <span className="text-5xl text-green-500">{score}</span>{" "}
            / {shuffledQuestions.length}
          </p>
        </div>

        {!isQuizFinished && currentQuestion && (
          <div className="flex flex-col md:flex-row items-start md:items-center justify-center mb-6 gap-6">
            <div className="flex flex-col items-center md:items-start w-full md:w-1/2">
              <div className="mb-4 text-center md:text-left">
                <p className="text-5xl font-bold text-yellow-400">
                  Q. {currentQuestionIndex + 1}
                </p>
              </div>
              <div className="flex justify-center items-center w-full">
                <img
                  src={currentQuestion.questionImage}
                  alt="Quiz"
                  className="w-64 h-64 md:w-96 md:h-96 max-w-full object-contain"
                />
              </div>
            </div>

            <div className="w-full md:w-1/2">
              <div className="w-full mb-4">
                <p className="text-3xl font-medium text-white text-center md:text-left">
                  {currentQuestion.question}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-6 mb-6">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelection(option)}
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

              {isAnswered && (
                <div className="mb-4 text-center text-xl font-medium">
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
                  <p className="text-gray-400 mt-2">{currentQuestion.hint}</p>
                </div>
              )}

              {isAnswered && (
                <button
                  onClick={handleNextQuestion}
                  className="w-full bg-yellow-500 text-black py-3 rounded-lg font-semibold hover:bg-yellow-400 transition"
                >
                  {currentQuestionIndex === shuffledQuestions.length - 1
                    ? "Finish Quiz"
                    : "Next Question"}
                </button>
              )}
            </div>
          </div>
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
