import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("viewMyProviderProfile");
        const p = res.data.data;

        setForm({
          name: p.name,
          email: p.email,
          username: p.username,
          contactno: p.contactno,
          address: p.address,
          available_location: p.available_location,
          is_group: p.is_group,
          members: p.members,
          service_category: p.service_category
        });
      } catch (err) {
        console.log("Error fetching profile", err);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("updateprovider", form);
      alert("Profile updated!");
    } catch (err) {
      console.log("Update error:", err);
    }
  };

  return (
    <Container className="mt-5">
      <Card className="p-4 shadow">
        <h3 className="mb-4">Update Profile</h3>

        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control name="name" value={form.name} onChange={handleChange} />
          </Form.Group>
          
          <Form.Group className="mt-2">
            <Form.Label>Email</Form.Label>
            <Form.Control name="email" value={form.email} onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mt-2">
            <Form.Label>Username</Form.Label>
            <Form.Control name="username" value={form.username} onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mt-2">
            <Form.Label>Contact No</Form.Label>
            <Form.Control name="contactno" value={form.contactno} onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mt-2">
            <Form.Label>Address</Form.Label>
            <Form.Control name="address" value={form.address} onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mt-2">
            <Form.Label>Available Location</Form.Label>
            <Form.Control name="available_location" value={form.available_location} onChange={handleChange} />
          </Form.Group>

          <Button className="mt-4" type="submit">Update Profile</Button>
          <Button className="mt-4 ms-3" variant="warning" href="/provider/change-password">
            Change Password
          </Button>
        </Form>
      </Card>
    </Container>
  );
}

export default UpdateProviderProfile;
