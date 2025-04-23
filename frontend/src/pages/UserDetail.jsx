import React, { useEffect, useState } from 'react';

const UserDetail = () => {
  const [userDetails, setUserDetails] = useState({
    name: '',
    age: '',
    username: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch('http://localhost:8000/users/user-details', {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user details');
        }

        const data = await response.json();
        setUserDetails(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  if (loading) return <p className="text-center mt-10 text-lg font-semibold">Loading...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">Error: {error}</p>;

  return (
    <div className="flex items-center justify-center flex-grow min-h-screen bg-blue-300">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">User Details</h2>

        <div className="mb-6 space-y-4">
          <div>
            <label className="block text-lg font-medium text-gray-600">Name:</label>
            <p className="text-xl font-semibold text-gray-800">{userDetails.name}</p>
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-600">Age:</label>
            <p className="text-xl font-semibold text-gray-800">{userDetails.age}</p>
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-600">Username:</label>
            <p className="text-xl font-semibold text-gray-800">{userDetails.username}</p>
          </div>
        </div>

        <div className="mt-8 p-4 bg-indigo-100 rounded-md shadow-inner">
          <h3 className="text-lg font-semibold text-indigo-700 mb-2">Academy</h3>
          <p className="text-md text-gray-700">Himalayan Chess Academy</p>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
