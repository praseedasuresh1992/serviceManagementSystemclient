import React from "react";
import backgroundImage from './assets/background.jpg'; 

const Home= () => {
  return (
    <div
      className="w-full min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/60"></div>

      {/* Content */}
      <div className="relative z-10 text-center text-white p-5 rounded-lg shadow-lg max-w-2xl">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-green-500">
          Welcome to Service Management
        </h1>
        <p className="text-lg md:text-xl mb-6">
          Manage your services, bookings, and providers all in one modern platform.
        </p>
        <div className="flex justify-center gap-4">
          <button className="btn btn-success px-6 py-2 rounded-full font-semibold transition-transform transform hover:scale-105">
            Get Started
          </button>
          <button className="btn btn-outline-light px-6 py-2 rounded-full font-semibold transition-transform transform hover:scale-105">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
