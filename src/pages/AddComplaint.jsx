import React, { useState } from "react";
import { Form, Button, Container, Alert } from "react-bootstrap";
import api from "../config/axiosinstance";

const AddComplaint = () => {
  const [complaintType, setComplaintType] = useState("system");
  const [providerId, setProviderId] = useState("");
  const [complaintText, setComplaintText] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const payload = {
        complaints_text: complaintText
      };

      // only send provider_id if complaint is about provider
      if (complaintType === "provider") {
        payload.provider_id = providerId;
      }

      await api.post("/addcomplaints", payload);

      setSuccess("Complaint submitted successfully");
      setComplaintText("");
      setProviderId("");
      setComplaintType("system");

    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <Container className="mt-4">
      <h3>Add Complaint</h3>

      {success && <Alert variant="success">{success}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>

        {/* Complaint Type */}
        <Form.Group className="mb-3">
          <Form.Label>Complaint Type</Form.Label>
          <Form.Select
            value={complaintType}
            onChange={(e) => setComplaintType(e.target.value)}
          >
            <option value="system">System / App Issue</option>
            <option value="provider">Service Provider</option>
          </Form.Select>
        </Form.Group>

        {/* Provider ID – only show if provider complaint */}
        {complaintType === "provider" && (
          <Form.Group className="mb-3">
            <Form.Label>Provider ID</Form.Label>
            <Form.Control
              type="text"
              value={providerId}
              onChange={(e) => setProviderId(e.target.value)}
              required
            />
          </Form.Group>
        )}

        {/* Complaint Text */}
        <Form.Group className="mb-3">
          <Form.Label>Complaint</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            value={complaintText}
            onChange={(e) => setComplaintText(e.target.value)}
            required
          />
        </Form.Group>

        <Button type="submit">Submit Complaint</Button>
      </Form>
    </Container>
  );
};

export default AddComplaint;
