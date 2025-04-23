import { useState, useEffect } from "react";
import axios from "axios";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Quiz from "./pages/Quiz";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if the session is still valid when app loads
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await axios.get("http://localhost:8000/users/check-session", {
          withCredentials: true,
        });
        setIsLoggedIn(res.data.loggedIn);
      } catch (error) {
        console.error("Session check failed:", error);
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  // Show loading state while checking session
  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <>
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Routes>
        <Route
          path="/"
          element={isLoggedIn ? <Quiz /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/login"
          element={
            isLoggedIn ? (
              <Navigate to="/" replace />
            ) : (
              <Login setIsLoggedIn={setIsLoggedIn} />
            )
          }
        />
        <Route
          path="/signup"
          element={isLoggedIn ? <Navigate to="/" replace /> : <Signup />}
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
