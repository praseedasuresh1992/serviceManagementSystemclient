import React from "react";
import { Button, Card, Container, Row, Col } from "react-bootstrap";

function Userdashboard() {
  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">User Dashboard</h2>

      <Row className="g-4">
        <Col md={4}>
          <Card className="p-3 shadow-sm text-center">
            <h5>Need Service</h5>
            <Button variant="primary" className="mt-2" href="/services">
              View Services
            </Button>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="p-3 shadow-sm text-center">
            <h5>Create Booking</h5>
            <Button variant="success" className="mt-2" href="/createbooking">
              Create Booking
            </Button>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="p-3 shadow-sm text-center">
            <h5>My Bookings</h5>
            <Button variant="info" className="mt-2" href="/my-bookings">
              View All Bookings
            </Button>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="p-3 shadow-sm text-center">
            <h5>My Profile</h5>
            <Button variant="secondary" className="mt-2" href="/profile">
              View Profile
            </Button>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="p-3 shadow-sm text-center">
            <h5>Update Profile</h5>
            <Button variant="warning" className="mt-2" href="/update-profile">
              Update Profile
            </Button>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="p-3 shadow-sm text-center">
            <h5>Create Complaint</h5>
            <Button variant="danger" className="mt-2" href="/create-complaint">
              Add Complaint
            </Button>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="p-3 shadow-sm text-center">
            <h5>My Complaints</h5>
            <Button variant="dark" className="mt-2" href="/my-complaints">
              View All Complaints
            </Button>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Userdashboard;
