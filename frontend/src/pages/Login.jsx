import React, { useState } from "react";
import axios from "axios"; // To make HTTP requests to the backend

const Login = () => {
  // State for form data
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  // State for error message
  const [error, setError] = useState("");

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    const { username, password } = formData;

    if (!username || !password) {
      return setError("Please fill in all fields.");
    }

    try {
      // Make API request to backend for login
      const response = await axios.post("http://localhost:8000/users/login", {
        username,
        password,
      });

      // Assuming the backend returns a token on successful login
      if (response.data.token) {
        localStorage.setItem("token", response.data.token); // Store token in local storage
        // Redirect or update state (you can use useNavigate or React Router for navigation)
        alert("Login successful!");
      }
    } catch (err) {
      console.error(err);
      setError("Invalid username or password.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-88px)] bg-blue-300">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your username"
            />
          </div>
          <div className="mb-6">
            <label className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white cursor-pointer py-2 rounded-md hover:bg-blue-700 transition"
          >
            Login
          </button>
          <div className="mt-4 flex justify-center items-center gap-2">
            <span className="text-lm text-gray-600">Create an account</span>
            <a href="/signup">
              <button
                type="button"
                className="px-4 py-1 text-blue-600 text-lm font-medium hover:underline transition cursor-pointer"
              >
                Sign Up
              </button>
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
