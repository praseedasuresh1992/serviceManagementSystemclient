import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [providerId, setProviderId] = useState("");

  const handleSearch = () => {
    if (providerId.trim() === "") return;
    navigate(`/adminDashboard/ViewComplaintsById/${providerId}`);
  };

  return (
    <>
      <div className="min-h-screen p-6 bg-gray-100">
        <div className="max-w-3xl mx-auto p-6 shadow-xl rounded-2xl bg-white">
          <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>

          {/* Search Section */}
          <div className="flex items-center gap-3 mb-6">
            <input
              value={providerId}
              onChange={(e) => setProviderId(e.target.value)}
              placeholder="Enter complaint ID ..."
              className="flex-1 p-3 border rounded-xl"
            />
            <Button
              variant="primary"
              className="p-3 rounded-xl"
              onClick={handleSearch}
            >
              Search
            </Button>
          </div>

          {/* Buttons Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Button
              onClick={() => navigate("/adminDashboard/ViewAllUsers")}
              className="p-4 rounded-2xl text-lg bg-gray-200"
            >
              View All Users
            </Button>

            <Button
              onClick={() => navigate("/adminDashboard/ViewAllProviders")}
              className="p-4 rounded-2xl text-lg bg-gray-200"
            >
              View All Providers
            </Button>

            <Button
              onClick={() => navigate("/adminDashboard/ViewAllComplaints")}
              className="p-4 rounded-2xl text-lg bg-gray-200"
            >
              View All Complaints
            </Button>
          </div>
        </div>
      </div>
      <Outlet />
    </>
  );
}
