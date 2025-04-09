import React from "react";

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-blue-300 to-purple-300 text-white shadow-md">
      <div className="container mx-auto px-10 flex justify-between items-center py-5">
        {/* Left-aligned MCQ title */}
        <div className="text-5xl font-extrabold tracking-wide text-yellow-300">
          MCQ
        </div>

        {/* Right-aligned navigation links */}
        <nav>
          <ul className="flex space-x-8 text-xl font-semibold">
            <li>
              <a
                href="/login"
                className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105"
              >
                Login
              </a>
            </li>
            <li>
              <a
                href="/signup"
                className="px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition duration-300 ease-in-out transform hover:scale-105"
              >
                Signup
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
