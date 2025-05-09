import React, { useState } from "react";
import axios from "axios";

const AddQuestion = ({ onQuestionAdded }) => {
  const [formData, setFormData] = useState({
    question: "",
    questionImage: "",
    options: ["", "", "", ""],
    correctAnswer: "",
    hint: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const addOption = () => {
    setFormData({ ...formData, options: [...formData.options, ""] });
  };

  const removeOption = (index) => {
    const newOptions = formData.options.filter((_, i) => i !== index);
    setFormData({ ...formData, options: newOptions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Frontend validations
    if (!formData.question.trim()) {
      setError("Question is required.");
      return;
    }
    if (
      formData.options.length < 2 ||
      formData.options.some((opt) => !opt.trim())
    ) {
      setError("Please provide at least two valid options.");
      return;
    }
    if (
      !formData.correctAnswer ||
      !formData.options.includes(formData.correctAnswer)
    ) {
      setError("Correct answer must be one of the options.");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:8000/admin/add-question",
        formData,
        {
          withCredentials: true,
        }
      );
      setSuccess("Question added successfully!");
      setFormData({
        question: "",
        questionImage: "",
        options: ["", "", "", ""],
        correctAnswer: "",
        hint: "",
      });
      onQuestionAdded?.(res.data); // Notify parent to refresh list
    } catch (err) {
      setError("Failed to add question. Please try again.");
      console.error("Add question error:", err);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Add New Question</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {success && <div className="text-green-500 mb-2">{success}</div>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Question text"
          className="w-full border p-2 mb-2"
          value={formData.question}
          onChange={(e) => handleChange("question", e.target.value)}
        />
        <input
          type="text"
          placeholder="Image URL (optional)"
          className="w-full border p-2 mb-2"
          value={formData.questionImage}
          onChange={(e) => handleChange("questionImage", e.target.value)}
        />
        {formData.questionImage && (
          <img
            src={formData.questionImage}
            alt="Preview"
            className="w-32 h-32 object-cover mb-2"
          />
        )}

        <div className="mb-2">
          <p className="font-semibold mb-1">Options:</p>
          {formData.options.map((opt, idx) => (
            <div key={idx} className="flex items-center mb-1">
              <input
                type="text"
                value={opt}
                onChange={(e) => handleOptionChange(idx, e.target.value)}
                className="border p-2 flex-grow"
              />
              <input
                type="radio"
                name="correct"
                checked={formData.correctAnswer === opt}
                onChange={() => handleChange("correctAnswer", opt)}
                className="ml-2"
              />
              <button
                type="button"
                onClick={() => removeOption(idx)}
                className="ml-2 text-red-500"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addOption}
            className="text-blue-500 mt-2"
          >
            + Add Option
          </button>
        </div>

        <textarea
          placeholder="Hint (optional)"
          className="w-full border p-2 mb-2"
          value={formData.hint}
          onChange={(e) => handleChange("hint", e.target.value)}
        />

        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
          >
            Add Question
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddQuestion;
