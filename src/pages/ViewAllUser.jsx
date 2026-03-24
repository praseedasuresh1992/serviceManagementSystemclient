import React, { useEffect, useState } from "react";
import api from "../config/axiosinstance";

export default function ViewAllUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api
      .get("/viewAllUsers")
      .then((res) => {
        setUsers(res.data.data);
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
      });
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-5xl mx-auto bg-white shadow-xl p-6 rounded-2xl">
        <h2 className="text-3xl font-bold mb-6 text-center">All Users</h2>

        <div className="overflow-x-auto rounded-xl shadow">
          <table className="min-w-full border border-gray-200">

            {/* Head */}
            <thead className="bg-gray-800 text-white text-sm">
              <tr>
                <th className="px-4 py-2 border">Id</th>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Address</th>
                <th className="px-4 py-2 border">Contact No</th>
                <th className="px-4 py-2 border">Username</th>
              </tr>
            </thead>

            {/* Body */}
            <tbody className="text-sm">
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border break-all">
                      {user._id}
                    </td>
                    <td className="px-4 py-2 border">{user.name}</td>
                    <td className="px-4 py-2 border">{user.email}</td>
                    <td className="px-4 py-2 border">{user.address}</td>
                    <td className="px-4 py-2 border">{user.contactno}</td>
                    <td className="px-4 py-2 border">{user.username}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
}