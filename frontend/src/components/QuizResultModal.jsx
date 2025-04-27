import React from "react";
import axios from "axios";

const QuizResultModal = ({ score, total, onRestart }) => {
  const handleSaveScore = async () => {
    try {
      // Send the score and total to the backend, with credentials (cookie) included
      const response = await axios.post(
        "http://localhost:8000/quizresult", // Replace with your actual backend API URL
        { score, total },
        {
          withCredentials: true, // Include credentials (cookie) in the request
        }
      );
      console.log("Score saved:", response.data);
    } catch (error) {
      console.error("Error saving score:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-yellow-400 via-orange-300 to-pink-500 text-white p-12 rounded-3xl shadow-2xl w-full max-w-2xl text-center transform transition-transform duration-500 scale-105">
        <h2 className="text-4xl font-extrabold text-green-800 mb-6">
          🎉 Awesome Job! 🎉
        </h2>
        <p className="text-3xl mb-8 font-semibold">
          Your Score:{" "}
          <span className="font-bold text-green-600 text-5xl">{score}</span> /{" "}
          <span className="font-bold text-red-600 text-5xl">{total}</span>
        </p>
        <button
          onClick={() => {
            onRestart(); // This restarts the quiz
            handleSaveScore(); // This sends the score and total to the backend
          }}
          className="bg-blue-600 hover:bg-blue-500 text-white px-12 py-5 rounded-3xl font-semibold text-2xl shadow-xl transition-all transform hover:scale-110 duration-300"
        >
          Play Again!
        </button>
      </div>
    </div>
  );
};

export default QuizResultModal;
