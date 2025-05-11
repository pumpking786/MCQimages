import React, { useEffect, useState } from "react";
import axios from "axios";

const UserDetail = () => {
  const [userDetails, setUserDetails] = useState({
    name: "",
    age: "",
    username: "",
  });
  const [updatedDetails, setUpdatedDetails] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);
  const [quizResults, setQuizResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 5;

  // Fetch user details
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get("http://localhost:8000/user/user-details", {
          withCredentials: true,
        });
        setUserDetails(response.data);
        setUpdatedDetails(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUserDetails();
  }, []);

  // Fetch paginated quiz results
  useEffect(() => {
    const fetchQuizResults = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/quizresult?page=${page}`, {
          withCredentials: true,
        });
        setQuizResults(response.data.results || []);
        setHasNextPage(response.data.pagination.hasNextPage);
        setTotalPages(Math.max(response.data.pagination.totalPages, 1));
      } catch (err) {
        setError(err.message);
      }
    };
    fetchQuizResults();
  }, [page]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedDetails((prev) => ({
      ...prev,
      [name]: name === "age" ? Number(value) : value,
    }));
  };

  const handleSave = async () => {
  try {
    const response = await axios.put(
      "http://localhost:8000/user/user-details",
      updatedDetails,
      {
        withCredentials: true,
      }
    );
    
    // On successful update, update the state
    setUserDetails(updatedDetails);
    setEditMode(false);
    setMessage(response.data.message);
    setError(null);

  } catch (err) {
    // Get the error message from backend response or default to "Update failed"
    const errorMessage = err.response?.data?.message || "Update failed.";
    
    // Show the error message from the backend in an alert
    alert(errorMessage);
    
    // Set the error in the state if you want to display it elsewhere in the UI
  }
};




  if (loading)
    return <p className="text-center mt-10 text-lg font-semibold">Loading...</p>;
  if (error)
    return <p className="text-center text-red-500 mt-10">Error: {error}</p>;

  return (
    <div className="flex items-center justify-center flex-grow bg-blue-300 min-h-screen">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg m-4">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">User Details</h2>

        {message && <p className="text-green-600 text-center mb-4">{message}</p>}
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        <div className="mb-6 space-y-4">
          {["name", "age", "username"].map((field) => (
            <div key={field} className="flex items-center">
              <label className="block text-lg font-medium text-gray-600 w-24 capitalize">
                {field}
              </label>
              {editMode ? (
                <input
                  name={field}
                  type={field === "age" ? "number" : "text"}
                  value={updatedDetails[field] || ""}
                  onChange={handleInputChange}
                  className="border rounded px-3 py-1 flex-1"
                />
              ) : (
                <p className="text-xl font-semibold text-gray-800">
                  : {userDetails[field]}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Edit / Save Controls */}
        <div className="flex justify-end space-x-4 mb-6">
          {editMode ? (
            <>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setEditMode(false);
                  setUpdatedDetails(userDetails);
                  setError(null);
                  setMessage("");
                }}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                setEditMode(true);
                setMessage("");
                setError(null);
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Edit
            </button>
          )}
        </div>

        <div className="mt-8 p-4 bg-indigo-100 rounded-md shadow-inner">
          <h3 className="text-lg font-semibold text-indigo-700 mb-2">Academy</h3>
          <p className="text-md text-gray-700">PumpKing Academy</p>
        </div>

        {/* Quiz Results Table */}
        <div className="mt-8 bg-white p-4 rounded-xl shadow-lg">
          <h3 className="text-2xl font-bold text-center text-blue-700 mb-6">
            Performance Scores
          </h3>

          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-lg font-medium text-gray-600">SN</th>
                <th className="px-4 py-2 text-left text-lg font-medium text-gray-600">Date</th>
                <th className="px-4 py-2 text-left text-lg font-medium text-gray-600">Score</th>
                <th className="px-4 py-2 text-left text-lg font-medium text-gray-600">Total</th>
              </tr>
            </thead>
            <tbody>
              {quizResults.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center text-lg py-4 text-gray-500">
                    No Results Found.
                  </td>
                </tr>
              ) : (
                quizResults.map((result, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-4 py-2 text-gray-700">
                      {(page - 1) * pageSize + index + 1}
                    </td>
                    <td className="px-4 py-2 text-gray-700">{result.createdAt}</td>
                    <td className="px-4 py-2 text-center text-gray-700">{result.score}</td>
                    <td className="px-4 py-2 text-center text-gray-700">{result.total}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination Controls */}
          {totalPages > 0 && (
            <div className="mt-6 flex justify-center space-x-4">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 cursor-pointer"
              >
                Previous
              </button>
              <span className="self-center font-medium text-gray-700">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((prev) => prev + 1)}
                disabled={!hasNextPage}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 cursor-pointer"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
