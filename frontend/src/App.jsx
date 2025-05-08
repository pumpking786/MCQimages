import { useState, useEffect } from "react";
import axios from "axios";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Quiz from "./pages/Quiz";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import UserDetail from "./pages/UserDetail";
import ManageQuestions from "./pages/admin/ManageQuestions";
import QuizResultsAdmin from "./pages/admin/QuizResultsAdmin";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // State to hold user role (admin or not)
  const [loading, setLoading] = useState(true);

  // Function to check session status and user role
  const checkSession = async () => {
    try {
      const res = await axios.get("http://localhost:8000/auth/check-session", {
        withCredentials: true,
      });

      if (res.data.loggedIn) {
        setIsLoggedIn(true);
        // Fetch user details to determine role
        const userDetailsRes = await axios.get("http://localhost:8000/user/user-details", {
          withCredentials: true,
        });
        if (userDetailsRes.data.role === 'admin') {
          setIsAdmin(true);
        }
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error("Session check failed:", error);
      setIsLoggedIn(false);
    }
  };

  // Initial session check on app load
  useEffect(() => {
    checkSession().finally(() => setLoading(false));
  }, []);

  // Periodically check the session every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      checkSession();
    }, 30 * 1000); // Check every 30 seconds

    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  }, []); // Run only once on mount

  // Show loading state while checking session
  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <>
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} isAdmin={isAdmin} />
      <Routes>
        <Route
          path="/"
          element={isLoggedIn ? <Quiz /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/profile"
          element={isLoggedIn ? <UserDetail /> : <Navigate to="/login" replace />}
        />
        <Route
  path="/login"
  element={
    isLoggedIn ? (
      <Navigate to="/" replace />
    ) : (
      <Login setIsLoggedIn={setIsLoggedIn} setIsAdmin={setIsAdmin} />
    )
  }
/>

        <Route
          path="/signup"
          element={isLoggedIn ? <Navigate to="/" replace /> : <Signup />}
        />
        {/* Admin Routes */}
        {isAdmin && (
          <>
            <Route path="/manage-questions" element={<ManageQuestions />} />
            <Route path="/quiz-results-admin" element={<QuizResultsAdmin />} />
          </>
        )}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
