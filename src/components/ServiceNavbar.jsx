import React from "react";
import { Link } from "react-router-dom";

export default function ServiceNavbar() {
  return (
    <>
      <nav className="bg-blue shadow-md py-2 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          
          {/* Brand */}
          <div className="text-2xl font-bold text-blue-600">
            ServicelQ
          </div>

          {/* Menu */}
          <div className="hidden lg:flex space-x-6 text-gray-700 font-medium">
            <Link to="/" className="hover:text-blue-600">Home</Link>
            <Link to="/aboutUs" className="hover:text-blue-600">Know About ServicelQ</Link>
            <Link to="/providerRegistration" className="hover:text-blue-600">List Your Business</Link>
            <Link to="/userRegistration" className="hover:text-blue-600">Enter as a User</Link>
            <Link to="/login" className="hover:text-blue-600">Login</Link>
            {/* <Link to="/addComplaint">RegisterComplaint</Link> */}
            <Link to="/contactUs" className="hover:text-blue-600">Contact Us</Link>
          </div>

          {/* Mobile Menu Button (optional placeholder) */}
          <div className="lg:hidden">
            <button className="text-gray-700 focus:outline-none">
              ☰
            </button>
          </div>

        </div>
      </nav>
    </>
  );
}