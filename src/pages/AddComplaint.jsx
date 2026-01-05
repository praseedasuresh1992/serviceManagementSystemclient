import React, { useState } from "react";
import { Form, Button, Container, Alert } from "react-bootstrap";
import api from "../config/axiosinstance";

const AddComplaint = () => {
  const [providerId, setProviderId] = useState("");
  const [complaintText, setComplaintText] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await api.post("/addcomplaints", {
        provider_id: providerId,
        complaints_text: complaintText
      });

      setSuccess("Complaint submitted successfully");
      setProviderId("");
      setComplaintText("");
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
        <Form.Group className="mb-3">
          <Form.Label>Provider ID</Form.Label>
          <Form.Control
            type="text"
            value={providerId}
            onChange={(e) => setProviderId(e.target.value)}
            required
          />
        </Form.Group>

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
