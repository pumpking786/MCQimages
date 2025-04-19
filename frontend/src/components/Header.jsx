import React from "react";

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-blue-300 to-purple-300 text-white shadow-md">
      <div className="container mx-auto px-4 md:px-6 lg:px-10 py-3 md:py-4 lg:py-5 flex justify-between items-center">
        {/* Left-aligned MCQ title */}
        <div className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-wide text-yellow-300">
          MCQ
        </div>

        {/* Right-aligned navigation links */}
        <nav>
          <ul className="flex space-x-4 md:space-x-6 lg:space-x-8 text-base md:text-lg lg:text-xl font-semibold">
            <li>
              <a
                href="/login"
                className="px-3 py-1 md:px-4 md:py-2 lg:px-6 lg:py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105"
              >
                Login
              </a>
            </li>
            <li>
              <a
                href="/signup"
                className="px-3 py-1 md:px-4 md:py-2 lg:px-6 lg:py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition duration-300 ease-in-out transform hover:scale-105"
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
