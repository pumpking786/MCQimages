import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Header = ({ isLoggedIn, setIsLoggedIn, isAdmin }) => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // ✅ Check login status from session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await axios.get("http://localhost:8000/auth/check-session", {
          withCredentials: true,
        });
        if (res.data.loggedIn) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (err) {
        console.error("Session check failed:", err);
        setIsLoggedIn(false);
      }
    };
    checkSession();
  }, [setIsLoggedIn]);

  // ✅ Logout via session
  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8000/auth/logout", {}, { withCredentials: true });
      setIsLoggedIn(false);
      navigate("/login");
      setIsDropdownOpen(false);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // Dropdown logic
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleDropdown();
    }
  };

  return (
    <header className="bg-gradient-to-r from-blue-300 to-purple-300 text-white shadow-md">
      <div className="container mx-auto px-4 md:px-6 lg:px-10 py-3 md:py-4 lg:py-5 flex justify-between items-center">
        <Link to="/" className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-wide text-yellow-300">
          MCQ
        </Link>
        <nav>
          <ul className="flex space-x-4 md:space-x-6 lg:space-x-8 text-base md:text-lg lg:text-xl font-semibold">
            {isLoggedIn ? (
              <li className="relative flex items-center" ref={dropdownRef}>
                {/* Dropdown Trigger */}
                <div
                  onClick={toggleDropdown}
                  onKeyDown={handleKeyDown}
                  role="button"
                  tabIndex={0}
                  aria-expanded={isDropdownOpen}
                  aria-haspopup="true"
                  className="inline-flex items-center justify-center px-3 py-1 md:px-4 md:py-2 lg:px-6 lg:py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                >
                  Profile
                  <span className={`ml-2 inline-block transform transition-transform ${isDropdownOpen ? "rotate-180" : "rotate-0"}`}>
                    ▼
                  </span>
                </div>
                {/* Dropdown Menu */}
                <div
                  className={`absolute top-full right-0 mt-2 w-40 bg-white text-gray-800 rounded-lg shadow-lg transition-all duration-200 transform z-10 ${
                    isDropdownOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"
                  }`}
                >
                  <Link
                    to="/"
                    onClick={() => setIsDropdownOpen(false)}
                    className="block px-4 py-2 text-sm hover:bg-blue-100 hover:text-blue-600 rounded-t-lg"
                  >
                    Play Quiz
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setIsDropdownOpen(false)}
                    className="block px-4 py-2 text-sm hover:bg-blue-100 hover:text-blue-600 rounded-t-lg"
                  >
                    View Details
                  </Link>
                  

                  {/* Admin Links */}
                  {isAdmin && (
                    <>
                      <Link
                        to="/manage-questions"
                        onClick={() => setIsDropdownOpen(false)}
                        className="block px-4 py-2 text-sm hover:bg-blue-100 hover:text-blue-600"
                      >
                        Manage Questions
                      </Link>
                      <Link
                        to="/quiz-results-admin"
                        onClick={() => setIsDropdownOpen(false)}
                        className="block px-4 py-2 text-sm hover:bg-blue-100 hover:text-blue-600"
                      >
                        Quiz Results
                      </Link>
                      
                    </>
                  )}
                  <Link
                    to="/change-password"
                    onClick={() => setIsDropdownOpen(false)}
                    className="block px-4 py-2 text-sm hover:bg-blue-100 hover:text-blue-600 rounded-t-lg"
                  >
                    Change Password
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 cursor-pointer text-sm hover:bg-blue-100 hover:text-blue-600 rounded-b-lg"
                  >
                    Logout
                  </button>
                </div>
              </li>
            ) : (
              <>
                <li className="flex items-center">
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center px-3 py-1 md:px-4 md:py-2 lg:px-6 lg:py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105"
                  >
                    Login
                  </Link>
                </li>
                <li className="flex items-center">
                  <Link
                    to="/signup"
                    className="inline-flex items-center justify-center px-3 py-1 md:px-4 md:py-2 lg:px-6 lg:py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition duration-300 ease-in-out transform hover:scale-105"
                  >
                    Signup
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
