import React, { useEffect, useState } from "react";
import axios from "axios";

const QuizResultsAdmin = () => {
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;
  const fetchResults = async (pageNum) => {
    try {
      const res = await axios.get(
        `http://localhost:8000/admin/quizresults?page=${pageNum}`,
        {
          withCredentials: true,
        }
      );
      setResults(res.data.results);
      setTotalPages(res.data.totalPages);
      setPage(res.data.currentPage);
    } catch (err) {
      console.error("Failed to load results:", err);
    }
  };

  useEffect(() => {
    fetchResults(page);
  }, [page]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Quiz Results</h1>
      <table className="w-full border table-auto">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">SN</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Score</th>
            <th className="border px-4 py-2">Total</th>
            <th className="border px-4 py-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r, index) => (
            <tr key={r.id}>
              <td className="border px-4 py-2">
                {(page - 1) * pageSize + index + 1}
              </td>
              <td className="border px-4 py-2">{r.name || "Unknown"}</td>
              <td className="border px-4 py-2">{r.score}</td>
              <td className="border px-4 py-2">{r.total}</td>
              <td className="border px-4 py-2">{r.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="text-sm">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default QuizResultsAdmin;
