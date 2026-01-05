import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, Outlet } from "react-router-dom";

export default function ServiceNavbar() {
  return (
    <>
  
    <Navbar bg="light" expand="lg" className="shadow-md py-3" sticky="top">
      <Container>
        <Navbar.Brand href="#" className="font-bold text-2xl">
          ServicelQ
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto text-lg">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link  as={Link} to="/aboutUs">Know About ServicelQ</Nav.Link>
            <Nav.Link as={Link} to="/providerRegistration">List Your Business</Nav.Link>
            <Nav.Link as={Link} to="/userRegistration">Enter as a User</Nav.Link>
            <Nav.Link as={Link} to="/login">Login</Nav.Link>
            {/* <Nav.Link as={Link} to="/addComplaint">RegisterComplaint</Nav.Link> */}
            <Nav.Link  as={Link} to="/contactUs">Contact Us</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    
    </>
  );
}