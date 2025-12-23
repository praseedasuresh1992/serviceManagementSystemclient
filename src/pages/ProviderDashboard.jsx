import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
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
      link: "/providerDashboard/viewAllRequests",
    },
    // {
    //   title: "Complaints",
    //   icon: <FaClipboardList size={40} />,
    //   color: "#e74a3b",
    //   link: "/provider/complaints",
    // },
    // {
    //   title: "Create Availability",
    //   icon: <FaCalendarCheck size={40} />,
    //   color: "#f6c23e",
    //   link: "/providerDashboard/create_availability",
    // },
  ];

  return (
    <>
      <Container className="mt-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">Provider Dashboard</h2>
          <Button
            variant="danger"
            onClick={() => navigate("/logout")}
            style={{ display: "flex", alignItems: "center", gap: "8px" }}
          >
            <FaSignOutAlt /> Logout
          </Button>
        </div>

        <Row className="g-4">
          {cards.map((card, index) => (
            <Col md={3} sm={6} key={index}>
              <Card
                style={{
                  borderRadius: "20px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  cursor: "pointer",
                  transition: "0.3s",
                }}
                className="p-4 text-center dashboard-card"
                onClick={() => navigate(card.link)}
              >
                <div
                  style={{
                    background: card.color,
                    color: "white",
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    margin: "0 auto",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {card.icon}
                </div>

                <h5 className="mt-3 fw-semibold">{card.title}</h5>
              </Card>
            </Col>
          ))}
        </Row>

        <style>
          {`
          .dashboard-card:hover {
            transform: translateY(-6px);
            box-shadow: 0 8px 20px rgba(0,0,0,0.15);
          }
        `}
        </style>
      </Container>
      <Outlet />
    </>
  );
}

export default ProviderDashboard;
