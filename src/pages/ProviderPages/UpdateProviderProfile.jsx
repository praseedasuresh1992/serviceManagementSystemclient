import React, { useEffect, useState } from "react";
import api from "../../config/axiosinstance";
import { Form, Button, Container, Card, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function UpdateProviderProfile() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    username: "",
    contactno: "",
    address: "",
    available_location: "",
    is_group: false,
    members: 1
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // ================= FETCH EXISTING PROFILE =================
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/viewMyProviderProfile");
        const p = res.data.data;

        setForm({
          name: p.name || "",
          email: p.email || "",
          username: p.username || "",
          contactno: p.contactno || "",
          address: p.address || "",
          available_location: p.available_location?.join(", ") || "",
          is_group: p.is_group || false,
          members: p.members || 1
        });
      } catch (err) {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });
  };

  // ================= SUBMIT UPDATE =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = {
        ...form,
        available_location: form.available_location
          .split(",")
          .map((loc) => loc.trim())
      };

      await api.post("/updateprovider", payload);

      // ✅ Redirect back with refresh flag
      navigate("/providerDashboard/viewprovider", {
        state: { refresh: true }
      });

    } catch (err) {
      setError("Update failed. Please check your details.");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    );

  return (
    <Container className="mt-5">
      <Card className="p-4 shadow" style={{ maxWidth: "650px", margin: "0 auto" }}>
        <h3 className="mb-4 text-center fw-bold">Update Profile</h3>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              name="username"
              value={form.username}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Contact Number</Form.Label>
            <Form.Control
              name="contactno"
              value={form.contactno}
              onChange={handleChange}
              pattern="[0-9]{10}"
              required
            />
            <Form.Text className="text-muted">
              Enter 10-digit mobile number
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Address</Form.Label>
            <Form.Control
              name="address"
              as="textarea"
              value={form.address}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Available Locations</Form.Label>
            <Form.Control
              name="available_location"
              value={form.available_location}
              onChange={handleChange}
              placeholder="Kochi, Trivandrum, Thrissur"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Is Group?"
              name="is_group"
              checked={form.is_group}
              onChange={handleChange}
            />
          </Form.Group>

          {form.is_group && (
            <Form.Group className="mb-3">
              <Form.Label>Members</Form.Label>
              <Form.Control
                type="number"
                min="1"
                name="members"
                value={form.members}
                onChange={handleChange}
              />
            </Form.Group>
          )}

          <div className="d-flex justify-content-between mt-4">
            <Button
              variant="secondary"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={saving}
              variant="primary"
            >
              {saving ? "Saving..." : "Update Profile"}
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
}

export default UpdateProviderProfile;
