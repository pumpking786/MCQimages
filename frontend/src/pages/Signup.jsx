import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom"; // Import useNavigate for redirection

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    username: "",
    password: "",
    cpassword: "",
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setMessageType("");
    try {
      const res = await axios.post(
        "http://localhost:8000/auth/signup",
        formData
      );
      setMessage(res.data.message);
      setMessageType("success");
      setFormData({
        name: "",
        age: "",
        username: "",
        password: "",
        cpassword: "",
      });

      // Redirect to /login after a 2-second delay
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong");
      setMessageType("error");
    }
  };

  return (
    <div className="flex items-center justify-center flex-grow bg-green-300 p-4">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4 text-center">Create Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block mb-1 font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Full name"
            />
          </div>
          <div className="mb-3">
            <label className="block mb-1 font-medium">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Age"
            />
          </div>
          <div className="mb-3">
            <label className="block mb-1 font-medium">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Username"
            />
          </div>
          <div className="mb-3">
            <label className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Password"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Confirm</label>
            <input
              type="password"
              name="cpassword"
              value={formData.cpassword}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Confirm"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-md cursor-pointer hover:bg-green-700 transition mb-4"
          >
            Sign Up
          </button>
        </form>
        <div className="flex items-center justify-center text-sm space-x-1 mb-4">
          <span>Already have an account?</span>
          <Link to="/login">
  <button
    type="button"
    className="text-green-600 hover:underline cursor-pointer "
  >
    Log in
  </button>
</Link>
        </div>
        {message && (
          <p
            className={`mt-3 text-center text-sm ${
              messageType === "success" ? "text-green-500" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default Signup;
