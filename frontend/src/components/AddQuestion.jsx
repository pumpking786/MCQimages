import React, { useState } from "react";
import axios from "axios";

const AddQuestion = ({ onQuestionAdded }) => {
  const [formData, setFormData] = useState({
    question: "",
    questionImage: null, // Changed to null to hold File object
    options: ["", "", "", ""],
    correctAnswer: "",
    hint: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [previewImage, setPreviewImage] = useState(""); // New state for image preview

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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, questionImage: file });
      setPreviewImage(URL.createObjectURL(file)); // Preview the selected file
    }
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

    const data = new FormData();
    data.append("question", formData.question.trim());
    data.append(
      "options",
      JSON.stringify(formData.options.map((opt) => opt.trim()))
    ); // Send as JSON string
    data.append("correctAnswer", formData.correctAnswer);
    data.append("hint", formData.hint.trim());
    if (formData.questionImage) {
      data.append("image", formData.questionImage); // Upload the file
    }

    try {
      const res = await axios.post(
        "http://localhost:8000/admin/add-question",
        data,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setSuccess("Question added successfully!");
      setFormData({
        question: "",
        questionImage: null,
        options: ["", "", "", ""],
        correctAnswer: "",
        hint: "",
      });
      setPreviewImage("");
      onQuestionAdded?.(res.data); // Notify parent to refresh list
    } catch (err) {
      setError("Failed to add question. Please try again.");
      console.error("Add question error:", err.response?.data || err);
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

        {/* Image Preview & Upload Button */}
        {previewImage && (
          <img
            src={previewImage}
            alt="Preview"
            className="h-40 w-auto max-h-40 object-contain mb-2"
          />
        )}
        <label className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mb-2 inline-block">
          Upload File
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </label>

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
          placeholder="Explanation (optional)"
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
