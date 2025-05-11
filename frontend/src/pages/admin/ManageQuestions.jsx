import React, { useEffect, useState } from "react";
import AddQuestion from "../../components/AddQuestion";
import axios from "axios";

const ManageQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editedData, setEditedData] = useState({
    question: "",
    questionImage: "",
    options: [],
    correctAnswer: "",
    hint: "",
  });

  const fetchQuestions = async () => {
    try {
      const res = await axios.get("http://localhost:8000/admin/quiz-question", {
        withCredentials: true,
      });
      setQuestions(res.data);
    } catch (err) {
      setError("Failed to load questions. Please try again later.");
      console.error("Error fetching questions:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteQuestion = async (id) => {
    if (!window.confirm("Are you sure you want to delete this question?"))
      return;
    try {
      await axios.delete(`http://localhost:8000/admin/quiz-question/${id}`, {
        withCredentials: true,
      });
      setQuestions((prev) => prev.filter((q) => q.id !== id));
    } catch (err) {
      setError("Failed to delete the question. Please try again.");
      console.error("Error deleting question:", err);
    }
  };

  const startEditing = (q) => {
    setEditingId(q.id);
    setEditedData({
      question: q.question,
      questionImage: q.questionImage || "",
      options: [...q.options],
      correctAnswer: q.correctAnswer,
      hint: q.hint || "",
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditedData({
      question: "",
      questionImage: "",
      options: [],
      correctAnswer: "",
      hint: "",
    });
  };

  const saveEdit = async (id) => {
    // Frontend validations
    if (!editedData.question || editedData.question.trim() === "") {
      alert("Question text cannot be empty.");
      return;
    }

    if (!Array.isArray(editedData.options) || editedData.options.length < 2) {
      alert("Please provide at least two options.");
      return;
    }

    if (editedData.options.some((opt) => opt.trim() === "")) {
      alert("Options cannot be empty.");
      return;
    }

    if (
      !editedData.correctAnswer ||
      !editedData.options.includes(editedData.correctAnswer)
    ) {
      alert("Correct answer must be one of the options.");
      return;
    }

    try {
      const res = await axios.put(
        `http://localhost:8000/admin/quiz-question/${id}`,
        editedData,
        { withCredentials: true }
      );

      setQuestions((prev) =>
        prev.map((q) => (q.id === id ? { ...q, ...res.data.question } : q))
      );

      cancelEditing();
    } catch (err) {
      setError("Failed to update the question.");
      console.error("Error updating question:", err.response?.data || err);
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...editedData.options];
    newOptions[index] = value;
    setEditedData({ ...editedData, options: newOptions });
  };

  const addOption = () => {
    setEditedData({ ...editedData, options: [...editedData.options, ""] });
  };

  const removeOption = (index) => {
    const newOptions = editedData.options.filter((_, i) => i !== index);
    setEditedData({ ...editedData, options: newOptions });
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  if (loading) return <div className="p-4">Loading questions...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <div className="flex justify-center">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="add-button cursor-pointer bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white py-4 px-12 md:px-20 lg:px-24 rounded-xl mb-4 text-xl font-semibold"
        >
          {showAddForm ? "Close" : "Add Question"}
        </button>
      </div>

      {showAddForm && <AddQuestion onQuestionAdded={fetchQuestions} />}

      <h1 className="text-2xl font-bold mb-4">Manage Questions</h1>
      {questions.length === 0 ? (
        <p>No questions available.</p>
      ) : (
        <ul className="space-y-4">
          {questions.map((q) => (
            <li key={q.id} className="border p-4 rounded bg-white shadow">
              {editingId === q.id ? (
                <>
                  {/* Question Text */}
                  <input
                    className="w-full border p-2 mb-2"
                    value={editedData.question}
                    onChange={(e) =>
                      setEditedData({ ...editedData, question: e.target.value })
                    }
                    placeholder="Question text"
                  />

                  {/* Image Preview & URL Input */}
                  {editedData.questionImage && (
                    <img
                      src={editedData.questionImage}
                      alt="Preview"
                      className="h-40 w-auto max-h-40 object-contain mb-2"
                    />
                  )}
                  <input
                    type="text"
                    className="w-full border p-2 mb-2"
                    value={editedData.questionImage}
                    onChange={(e) =>
                      setEditedData({
                        ...editedData,
                        questionImage: e.target.value,
                      })
                    }
                    placeholder="Image URL"
                  />

                  {/* Options Editor */}
                  {editedData.options.map((opt, idx) => (
                    <div key={idx} className="flex items-center mb-1">
                      <input
                        className="border p-1 flex-grow"
                        value={opt}
                        onChange={(e) =>
                          handleOptionChange(idx, e.target.value)
                        }
                      />
                      <input
                        type="radio"
                        name="correct"
                        checked={opt === editedData.correctAnswer}
                        onChange={() =>
                          setEditedData({ ...editedData, correctAnswer: opt })
                        }
                        className="ml-2"
                      />
                      <button
                        onClick={() => removeOption(idx)}
                        className="ml-2 text-red-500"
                      >
                        ✕
                      </button>
                    </div>
                  ))}

                  <button
                    onClick={addOption}
                    className="text-sm text-blue-500 mt-1"
                  >
                    + Add Option
                  </button>
                  {/* Hint Input */}
                  <textarea
                    className="w-full border p-2 mb-2"
                    value={editedData.hint}
                    onChange={(e) =>
                      setEditedData({ ...editedData, hint: e.target.value })
                    }
                    placeholder="Hint (optional)"
                  />
                  {/* Save / Cancel Buttons */}
                  <div className="mt-3">
                    <button
                      onClick={() => saveEdit(q.id)}
                      className="mr-2 px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="px-4 py-1 bg-gray-400 text-white rounded hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="font-semibold">{q.question}</p>

                  {q.questionImage && (
                    <img
                      src={q.questionImage}
                      alt="Question"
                      className="h-40 w-auto max-h-40 object-contain mb-2 rounded"
                    />
                  )}

                  <ul className="list-disc list-inside ml-4">
                    {q.options.map((opt, idx) => (
                      <li
                        key={idx}
                        className={
                          opt === q.correctAnswer
                            ? "text-green-600 font-bold"
                            : ""
                        }
                      >
                        {opt}
                      </li>
                    ))}
                  </ul>

                  {/* Hint Display */}
                  {q.hint && (
                    <p className="mt-2 text-gray-600 italic">Hint: {q.hint}</p>
                  )}

                  <div className="mt-2">
                    <button
                      onClick={() => deleteQuestion(q.id)}
                      className="mr-4 px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => startEditing(q)}
                      className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ManageQuestions;
