import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";

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
          
          {/* HEADER */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-center w-full">
              Admin Dashboard
            </h1>

            {/* LOGOUT */}
            <button
              onClick={() => navigate("/logout")}
              className="absolute right-10 flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>

          {/* (Optional Search Section - kept commented as-is) */}
          {/* 
          <div className="flex items-center gap-3 mb-6">
            <input
              value={providerId}
              onChange={(e) => setProviderId(e.target.value)}
              placeholder="Enter provider ID ..."
              className="flex-1 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={handleSearch}
              className="bg-indigo-600 text-white px-4 py-3 rounded-xl hover:bg-indigo-700 transition"
            >
              Find Complaints
            </button>
          </div> 
          */}

          {/* BUTTONS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            
            <button
              onClick={() => navigate("/adminDashboard/ViewAllUsers")}
              className="p-4 rounded-2xl text-lg bg-gray-200 hover:bg-gray-300 transition"
            >
              View All Users
            </button>

            <button
              onClick={() => navigate("/adminDashboard/ViewAllProviders")}
              className="p-4 rounded-2xl text-lg bg-gray-200 hover:bg-gray-300 transition"
            >
              View All Providers
            </button>

            <button
              onClick={() => navigate("/adminDashboard/CreateServiceCategory")}
              className="p-4 rounded-2xl text-lg bg-gray-200 hover:bg-gray-300 transition"
            >
              Create Service Category
            </button>

            <button
              onClick={() => navigate("/adminDashboard/ViewAllServiceCategory")}
              className="p-4 rounded-2xl text-lg bg-gray-200 hover:bg-gray-300 transition"
            >
              View All Service Categories
            </button>

          </div>
        </div>
      </div>

      <Outlet />
    </>
  );
}