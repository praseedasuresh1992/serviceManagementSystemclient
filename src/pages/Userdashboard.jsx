import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";

function Userdashboard() {
  const navigate = useNavigate();

  return (
    <>
      <div className="max-w-6xl mx-auto mt-10 px-4">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">User Dashboard</h2>

          <button
            onClick={() => navigate("/logout")}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 text-sm rounded-lg transition"
          >
            <FaSignOutAlt size={14} /> Logout
          </button>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-center">

          {/* Card 1 */}
          <div className="bg-white text-center p-4 rounded-xl shadow-md transition hover:-translate-y-1 hover:shadow-xl">
            <h6 className="mb-2 font-medium">Need Service?</h6>
            <a
              href="/userDashboard/createbooking"
              className="inline-block mt-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Request
            </a>
          </div>

          {/* Card 2 */}
          <div className="bg-white text-center p-4 rounded-xl shadow-md transition hover:-translate-y-1 hover:shadow-xl">
            <h6 className="mb-2 font-medium">My Profile</h6>
            <a
              href="/userDashboard/UpdateMyUserProfile"
              className="inline-block mt-2 px-3 py-1.5 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Update
            </a>
          </div>

          {/* Card 3 */}
          <div className="bg-white text-center p-4 rounded-xl shadow-md transition hover:-translate-y-1 hover:shadow-xl">
            <h6 className="mb-2 font-medium">My Requests</h6>
            <a
              href="/userDashboard/ViewMyBookings"
              className="inline-block mt-2 px-3 py-1.5 text-sm bg-cyan-600 text-white rounded hover:bg-cyan-700 transition"
            >
              View
            </a>
          </div>

        </div>
      </div>

      <Outlet />
    </>
  );
}

export default Userdashboard;