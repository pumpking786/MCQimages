import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Login = ({ setIsLoggedIn, setIsAdmin }) => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setMessageType("");

    const { username, password } = formData;
    if (!username || !password) {
      setMessage("Please fill in all fields.");
      setMessageType("error");
      return;
    }

    try {
      // Login request
      await axios.post(
        "http://localhost:8000/auth/login",
        { username, password },
        { withCredentials: true }
      );

      // Set login status
      setIsLoggedIn(true);

      // Fetch role
      const roleRes = await axios.get("http://localhost:8000/user/user-details", {
        withCredentials: true,
      });

      const role = roleRes.data?.role;
      setIsAdmin(role === "admin");

      setMessage("Login successful!");
      setMessageType("success");

      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      console.error(err);
      setMessage("Invalid username or password.");
      setMessageType("error");
    }
  };

  return (
    <div className="flex items-center justify-center flex-grow bg-blue-300">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        {message && (
          <div
            className={`mb-4 text-center ${
              messageType === "success" ? "text-green-500" : "text-red-500"
            }`}
          >
            {message}
          </div>
        )}
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
            <span className="text-sm text-gray-600">Create an account</span>
            <Link to="/signup">
  <button
    type="button"
    className="px-4 py-1 text-blue-600 text-sm font-medium hover:underline transition cursor-pointer"
  >
    Sign Up
  </button>
</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
