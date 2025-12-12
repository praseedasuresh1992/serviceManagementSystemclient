import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import api from "../config/axiosinstance";

export default function ViewAllUsers() {
  const [users, setUsers] = useState([]);

  // Fetch users from backend
 useEffect(() => {
  api
    .get("//viewAllUsers")
    .then((res) => {
      setUsers(res.data);
    })
    .catch((err) => {
      console.error("Error fetching users:", err);
    });
}, []);

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-5xl mx-auto bg-white shadow-xl p-6 rounded-2xl">
        <h2 className="text-3xl font-bold mb-6 text-center">All Users</h2>

        <Table striped bordered hover responsive className="rounded-xl overflow-hidden">
          <thead className="bg-dark text-white">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Address</th>
              <th>Contact No</th>
              <th>Username</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.address}</td>
                  <td>{user.contactno}</td>
                  <td>{user.username}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center p-4">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );
}
