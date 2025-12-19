import React, { useEffect, useState } from "react";
import api from "../../config/axiosinstance";
import { Card, Button, Alert, Container, Row, Col } from "react-bootstrap";

function ViewProviderProfile() {
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProvider = async () => {
      try {
        const res = await api.get("/viewMyProviderProfile");
        setProvider(res.data.data);
      } catch (err) {
        console.error("Error loading provider profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProvider();
  }, []);

  if (loading) return <p className="text-center mt-5">Loading...</p>;
  if (!provider) return <p className="text-center mt-5">No profile found</p>;

  return (
    <Container className="mt-5">
      <h2 className="fw-bold text-center mb-4">My Profile</h2>

      {provider.status === "blocked" && (
        <Alert variant="danger" className="text-center fw-semibold">
          🚫 Your account is currently <strong>Blocked</strong> <br />
          Please wait for authorization from admin.
        </Alert>
      )}

      <Card
        className="p-4 shadow"
        style={{ borderRadius: "20px", maxWidth: "750px", margin: "0 auto" }}
      >
        <Row>
          {/* ================= PROFILE IMAGE ================= */}
          <Col md={4} className="text-center">
            <img
              src={
                provider.profile_image?.url ||
                "https://via.placeholder.com/150"
              }
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

          {/* ================= PROVIDER DETAILS ================= */}
          <Col md={8}>
            <h4 className="fw-bold">{provider.name}</h4>

            <p><strong>Email:</strong> {provider.email}</p>
            <p><strong>Username:</strong> {provider.username}</p>
            <p><strong>Contact No:</strong> {provider.contactno}</p>
            <p><strong>Address:</strong> {provider.address}</p>

            <p>
              <strong>Available Locations:</strong>{" "}
              {provider.available_location?.length > 0
                ? provider.available_location.join(", ")
                : "Not specified"}
            </p>

            <p>
              <strong>Service Category:</strong>{" "}
              {provider.service_category?.name || "Not assigned"}
            </p>

            <p>
              <strong>Group:</strong>{" "}
              {provider.is_group ? "Yes" : "No"}
            </p>

            {provider.is_group && (
              <p><strong>Members:</strong> {provider.members}</p>
            )}

            <p>
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
                {provider.status?.toUpperCase()}
              </span>
            </p>

            {/* ================= DOCUMENTS ================= */}
            <div className="mt-3">
              <strong>Verification Documents:</strong>
              {provider.verification_document?.length > 0 ? (
                provider.verification_document.map((doc, index) => (
                  <div key={index}>
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Document {index + 1}
                    </a>
                  </div>
                ))
              ) : (
                <p className="text-muted">No documents uploaded</p>
              )}
            </div>

            {/* ================= UPDATE BUTTON ================= */}
            <div className="mt-4">
              <Button
                variant="primary"
                style={{
                  padding: "10px 25px",
                  borderRadius: "12px",
                  backgroundColor: "#4e73df",
                }}
                onClick={() => (window.location.href = "viewprovider/updateprovider")}
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
