import React from "react";
import { Outlet } from "react-router-dom";
import ServiceNavbar from "./ServiceNavbar";
import Footer from "./Footer";

const MainLayout = () => {
  return (
    <>
        <div className="min-h-screen bg-lime-300">
      <ServiceNavbar />
      <main className="px-4 py-4">
      <Outlet />
      </main>
      <Footer />
      </div>
    </>
  );
};

export default MainLayout;
