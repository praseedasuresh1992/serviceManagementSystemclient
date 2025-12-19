import React, { useEffect, useState } from "react";
import api from "../../config/axiosinstance";
import { Form, Button, Container, Card } from "react-bootstrap";

function UpdateProviderProfile() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    username: "",
    contactno: "",
    address: "",
    available_location: "",
    is_group: false,
    members: "",
    service_category: ""
  });

  const [profileImage, setProfileImage] = useState("");
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // FETCH PROVIDER PROFILE
  // =========================
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
          members: p.members || "",
          service_category: p.service_category || ""
        });

        setProfileImage(p.profile_image?.url || "");
        setDocuments(p.verification_document || []);
      } catch (err) {
        console.error("Error fetching profile", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // =========================
  // HANDLE INPUT CHANGE
  // =========================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });
  };

  // =========================
  // UPDATE PROFILE
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      available_location: form.available_location
        .split(",")
        .map((l) => l.trim())
    };

    try {
      await api.post("/updateprovider", payload);
      alert("Profile updated successfully");
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update profile");
    }
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <h5>Loading profile...</h5>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <Card className="p-4 shadow">

        {/* ================= PROFILE IMAGE ================= */}
        <div className="text-center mb-4">
          {profileImage ? (
            <img
              src={profileImage}
              alt="Profile"
              style={{
                width: "130px",
                height: "130px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid #ccc"
              }}
            />
          ) : (
            <p>No profile image</p>
          )}
        </div>

        {/* ================= DOCUMENTS ================= */}
        <div className="mb-4">
          <h5>Verification Documents</h5>
          {documents.length === 0 && <p>No documents uploaded</p>}

          {documents.map((doc, index) => (
            <div key={index}>
              <a
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Document {index + 1}
              </a>
            </div>
          ))}
        </div>

        {/* ================= FORM ================= */}
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mt-2">
            <Form.Label>Email</Form.Label>
            <Form.Control
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mt-2">
            <Form.Label>Username</Form.Label>
            <Form.Control
              name="username"
              value={form.username}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mt-2">
            <Form.Label>Contact Number</Form.Label>
            <Form.Control
              name="contactno"
              value={form.contactno}
              onChange={handleChange}
              maxLength={10}
              pattern="[0-9]{10}"
              required
            />
          </Form.Group>

          <Form.Group className="mt-2">
            <Form.Label>Address</Form.Label>
            <Form.Control
              name="address"
              value={form.address}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mt-2">
            <Form.Label>Available Locations</Form.Label>
            <Form.Control
              name="available_location"
              value={form.available_location}
              onChange={handleChange}
              placeholder="e.g. Kochi, Aluva, Kakkanad"
            />
            <small className="text-muted">
              Separate multiple locations with commas
            </small>
          </Form.Group>

          <Form.Group className="mt-2">
            <Form.Check
              type="checkbox"
              label="Is Group"
              name="is_group"
              checked={form.is_group}
              onChange={handleChange}
            />
          </Form.Group>

          {form.is_group && (
            <Form.Group className="mt-2">
              <Form.Label>Members</Form.Label>
              <Form.Control
                type="number"
                name="members"
                value={form.members}
                onChange={handleChange}
                min={1}
              />
            </Form.Group>
          )}

          <Button className="mt-4" type="submit">
            Update Profile
          </Button>

          <Button
            className="mt-4 ms-3"
            variant="warning"
            href="/provider/change-password"
          >
            Change Password
          </Button>
        </Form>
      </Card>
    </Container>
  );
}

export default UpdateProviderProfile;
