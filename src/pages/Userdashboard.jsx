import React from "react";
import { Button, Card, Container, Row, Col } from "react-bootstrap";
import { Outlet } from "react-router-dom";

function Userdashboard() {
  return (
    <>
    <Container className="mt-5">
      <h2 className="text-center mb-4">User Dashboard</h2>

      <Row className="g-4">
        <Col md={4}>
          <Card className="p-3 shadow-sm text-center">
            <h5>Need Service?</h5>
            <Button variant="primary" className="mt-2" href="/userDashboard/createbooking">
              Request Service
            </Button>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="p-3 shadow-sm text-center">
            <h5>Update Your Profile</h5>
            <Button variant="success" className="mt-2" href="/userDashboard/UpdateMyUserProfile">
             Update
            </Button>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="p-3 shadow-sm text-center">
       
            <Button variant="info" className="mt-2" href="/userDashboard/ViewMyBookings">
              View All Requests
            </Button>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="p-3 shadow-sm text-center">
            <Button variant="secondary" className="mt-2" href="/profile">
             Add Complaints
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
    <Outlet/>
    </>
  );
  
}

export default Userdashboard;
