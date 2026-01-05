import React from "react";
import { Button, Card, Container, Row, Col } from "react-bootstrap";
import { Outlet, useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";

function Userdashboard() {
  const navigate = useNavigate();

  return (
    <>
      <Container className="mt-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">User Dashboard</h2>

          {/* Small Logout Button */}
          <Button
            variant="danger"
            size="sm"
            className="d-flex align-items-center gap-2 px-3"
            onClick={() => navigate("/logout")}
          >
            <FaSignOutAlt size={14} /> Logout
          </Button>
        </div>

        <Row className="g-3 justify-content-center">
          {/* Card 1 */}
          <Col xs={6} md={4} lg={3}>
            <Card className="dashboard-tile text-center p-3">
              <h6 className="mb-2">Need Service?</h6>
              <Button size="sm" variant="primary" href="/userDashboard/createbooking">
                Request
              </Button>
            </Card>
          </Col>

          {/* Card 2 */}
          <Col xs={6} md={4} lg={3}>
            <Card className="dashboard-tile text-center p-3">
              <h6 className="mb-2">My Profile</h6>
              <Button size="sm" variant="success" href="/userDashboard/UpdateMyUserProfile">
                Update
              </Button>
            </Card>
          </Col>

          {/* Card 3 */}
          <Col xs={6} md={4} lg={3}>
            <Card className="dashboard-tile text-center p-3">
              <h6 className="mb-2">My Requests</h6>
              <Button size="sm" variant="info" href="/userDashboard/ViewMyBookings">
                View
              </Button>
            </Card>
          </Col>

          {/* Card 4 */}
          <Col xs={6} md={4} lg={3}>
            <Card className="dashboard-tile text-center p-3">
              <h6 className="mb-2">Complaints</h6>
              <Button size="sm" variant="secondary" href="/profile">
                Add
              </Button>
            </Card>
          </Col>

          {/* Card 5 */}
          <Col xs={6} md={4} lg={3}>
            <Card className="dashboard-tile text-center p-3">
              <h6 className="mb-2">My Complaints</h6>
              <Button size="sm" variant="dark" href="/my-complaints">
                View
              </Button>
            </Card>
          </Col>
        </Row>

        {/* Hover + button-style effect */}
        <style>
          {`
            .dashboard-tile {
              border-radius: 14px;
              box-shadow: 0 4px 10px rgba(0,0,0,0.08);
              transition: all 0.25s ease;
            }

            .dashboard-tile:hover {
              transform: translateY(-4px);
              box-shadow: 0 8px 18px rgba(0,0,0,0.15);
            }
          `}
        </style>
      </Container>

      <Outlet />
    </>
  );
}

export default Userdashboard;
