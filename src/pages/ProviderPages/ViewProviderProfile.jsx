import React, { useEffect, useState } from "react";
import api from "../../config/axiosinstance";
import { Card, Button, Alert, Container, Row, Col } from "react-bootstrap";

function ViewProviderProfile() {
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    const fetchProvider = async () => {
      try {
        const res = await api.get("viewMyProviderProfile"); // change API URL based on your backend
        setProvider(res.data.data);
      } catch (err) {
        console.log("Error loading provider profile:", err);
      }
    };
    fetchProvider();
  }, []);

  if (!provider) return <p className="text-center mt-5">Loading...</p>;

  return (
    <Container className="mt-5">
      <h2 className="fw-bold text-center mb-4">My Profile</h2>

      {provider.status === "blocked" && (
        <Alert variant="danger" className="text-center fw-semibold">
          🚫 Your account is currently <strong>Blocked</strong>. <br />
          <span>Please wait for getting authorization from admin.</span>
        </Alert>
      )}

      <Card
        className="p-4 shadow"
        style={{ borderRadius: "20px", maxWidth: "700px", margin: "0 auto" }}
      >
        <Row>
          <Col md={4} className="text-center">
            <img
              src={provider.profile_image}
              alt="Profile"
              style={{
                width: "150px",
                height: "150px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "4px solid #4e73df",
              }}
            />
          </Col>

          <Col md={8}>
            <h4 className="fw-bold">{provider.name}</h4>
            <p className="mb-1"><strong>Email:</strong> {provider.email}</p>
            <p className="mb-1"><strong>Username:</strong> {provider.username}</p>
            <p className="mb-1"><strong>Contact No:</strong> {provider.contactno}</p>
            <p className="mb-1"><strong>Address:</strong> {provider.address}</p>
            <p className="mb-1"><strong>Location:</strong> {provider.available_location}</p>
            <p className="mb-1"><strong>Service Category:</strong> {provider.service_category?.name}</p>
            <p className="mb-1">
              <strong>Group:</strong> {provider.is_group ? "Yes" : "No"}
            </p>
            {provider.is_group && (
              <p className="mb-1"><strong>Members:</strong> {provider.members}</p>
            )}

            <p className="mb-1">
              <strong>Status:</strong>{" "}
              <span
                style={{
                  color:
                    provider.status === "active"
                      ? "green"
                      : provider.status === "blocked"
                      ? "red"
                      : "orange",
                  fontWeight: "bold",
                }}
              >
                {provider.status.toUpperCase()}
              </span>
            </p>

            {/* Update Button */}
            <div className="mt-4">
              <Button
                variant="primary"
                style={{
                  padding: "10px 25px",
                  borderRadius: "12px",
                  backgroundColor: "#4e73df",
                }}
                onClick={() => window.location.href = "/provider/update"}
              >
                Update Profile
              </Button>
            </div>
          </Col>
        </Row>
      </Card>
    </Container>
  );
}

export default ViewProviderProfile;
