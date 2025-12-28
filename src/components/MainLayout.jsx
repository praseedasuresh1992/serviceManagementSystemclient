import React from "react";
import { Outlet } from "react-router-dom";
import ServiceNavbar from "./ServiceNavbar";
import Footer from "./Footer";

const MainLayout = () => {
  return (
    <>
      <ServiceNavbar />
      <Outlet />
      <Footer />
    </>
  );
};

export default MainLayout;
