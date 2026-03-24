import React from "react";
import {
  FaUserCircle,
  FaBell,
  FaCalendarCheck,
  FaClipboardList,
  FaSignOutAlt,
} from "react-icons/fa";
import { Outlet, useNavigate } from "react-router-dom";

function ProviderDashboard() {
  const navigate = useNavigate();

  const cards = [
    {
      title: "View Profile",
      icon: <FaUserCircle size={40} />,
      color: "#4e73df",
      link: "/providerDashboard/viewprovider",
    },
    {
      title: "Request Details",
      icon: <FaBell size={40} />,
      color: "#1cc88a",
      link: "/providerDashboard/viewAllRequest",
    },
    {
      title: "All Reviews",
      icon: <FaClipboardList size={40} />,
      color: "#e74a3b",
      link: "/providerDashboard/viewAllReview",
    },
    {
      title: "Create Availability",
      icon: <FaCalendarCheck size={40} />,
      color: "#f6c23e",
      link: "/providerDashboard/create_availability",
    },
  ];

  return (
    <>
      <div className="max-w-7xl mx-auto mt-10 px-4">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Provider Dashboard</h2>

          <button
            onClick={() => navigate("/logout")}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {cards.map((card, index) => (
            <div
              key={index}
              onClick={() => navigate(card.link)}
              className="bg-white rounded-2xl shadow-md p-6 text-center cursor-pointer transform transition duration-300 hover:-translate-y-1.5 hover:shadow-xl"
            >
              {/* Icon Circle */}
              <div
                className="w-20 h-20 mx-auto rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: card.color }}
              >
                {card.icon}
              </div>

              <h5 className="mt-4 font-semibold text-lg">
                {card.title}
              </h5>
            </div>
          ))}
        </div>
      </div>

      <Outlet />
    </>
  );
}

export default ProviderDashboard;