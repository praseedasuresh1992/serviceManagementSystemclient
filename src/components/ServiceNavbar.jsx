import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function ServiceNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-lime-900 shadow-md py-2 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">

        {/* Brand */}
        <div className="text-2xl font-bold text-lime-400">
          ServicelQ
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 text-white font-medium">
          <Link to="/" className="hover:text-blue-400">Home</Link>
          <Link to="/aboutUs" className="hover:text-blue-400">Know About ServicelQ</Link>
          <Link to="/providerRegistration" className="hover:text-blue-400">List Your Business</Link>
          <Link to="/userregistration" className="hover:text-blue-400">Enter as a User</Link>
          <Link to="/login" className="hover:text-blue-400">Login</Link>
          <Link to="/contactUs" className="hover:text-blue-400">Contact Us</Link>
        </div>

        {/* Mobile Button */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white text-2xl"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-lime-800 px-4 py-3 space-y-3 text-white font-medium">
          <Link to="/" className="block">Home</Link>
          <Link to="/aboutUs" className="block">Know About ServicelQ</Link>
          <Link to="/providerRegistration" className="block">List Your Business</Link>
          <Link to="/userregistration" className="block">Enter as a User</Link>
          <Link to="/login" className="block">Login</Link>
          <Link to="/contactUs" className="block">Contact Us</Link>
        </div>
      )}
    </nav>
  );
}