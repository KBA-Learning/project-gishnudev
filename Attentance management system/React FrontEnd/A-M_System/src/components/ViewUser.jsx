import React, { useEffect, useState } from 'react';

const ViewUser = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const res = await fetch('/api/viewAll', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (res.ok) {
          const data = await res.json();
          setAllUsers(data);
          setLoading(false);
        } else {
          throw new Error('Failed to fetch data');
        }
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAllUsers();
  }, []);

  const totalPages = Math.ceil(allUsers.length / rowsPerPage);
  const startRow = (currentPage - 1) * rowsPerPage;
  const currentRows = allUsers.slice(startRow, startRow + rowsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDelete = async (userId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this user?');
    if (confirmDelete) {
      try {
        const res = await fetch(`/api/deleteUser/${userId}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          alert('User deleted successfully!');
          setAllUsers((prev) => prev.filter((user) => user._id !== userId));
        } else {
          alert('Failed to delete user');
        }
      } catch (err) {
        console.error(err);
        alert('An error occurred while deleting the user.');
      }
    }
  };

  const handleEdit = (user) => {
    // Implement edit logic, e.g., redirect to an edit form page or display a modal
    alert(`Edit feature for user "${user.name}" is under construction!`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Users</h1>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 border-b">Number</th>
            <th className="py-2 px-4 border-b">User ID</th>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Department</th>
            <th className="py-2 px-4 border-b">Password</th>
            <th className="py-2 px-4 border-b">Role</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentRows.map((user, index) => (
            <tr key={user._id} className="hover:bg-gray-100">
              <td className="py-2 px-4 border-b">{startRow + index + 1}</td>
              <td className="py-2 px-4 border-b">{user.employeeId}</td>
              <td className="py-2 px-4 border-b">{user.Name}</td>
              <td className="py-2 px-4 border-b">{user.department}</td>
              <td className="py-2 px-4 border-b">{user.Password}</td>
              <td className="py-2 px-4 border-b">{user.Role}</td>
              <td className="py-2 px-4 border-b flex space-x-2">
                <button
                  className="px-3 py-1 bg-green-500 text-white rounded-md"
                  onClick={() => handleEdit(user)}
                >
                  Edit
                </button>
                <button
                  className="px-3 py-1 bg-red-500 text-white rounded-md"
                  onClick={() => handleDelete(user._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="mt-4 flex justify-center">
        <button
          className="px-4 py-2 mx-1 bg-blue-500 text-white rounded-lg disabled:opacity-50"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            className={`px-4 py-2 mx-1 ${
              currentPage === index + 1
                ? 'bg-blue-700 text-white'
                : 'bg-gray-200 text-black'
            } rounded-lg`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
        <button
          className="px-4 py-2 mx-1 bg-blue-500 text-white rounded-lg disabled:opacity-50"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ViewUser;
