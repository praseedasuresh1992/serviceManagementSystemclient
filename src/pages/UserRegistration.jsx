import React, { useState } from "react";
import axios from "axios";
import { Form, Button } from "react-bootstrap";
import api from "../config/axiosinstance";

const UserRegistration = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    contactno: "",
    username: "",
    password: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post(
        "registeruser",
        formData
      );

      setMessage("User created successfully!");
      setFormData({
        name: "",
        email: "",
        address: "",
        contactno: "",
        username: "",
        password: ""
      });
    } catch (err) {
      console.error(err);
      setMessage("Error creating user");
    }
  };

  return (
    <div className="flex justify-center mt-10">
      <div className="w-full max-w-lg p-6 bg-white shadow-xl rounded-2xl border">

        <h2 className="text-3xl font-bold text-center mb-4 text-blue-700">
          Create User
        </h2>

        {message && (
          <p className="text-center text-green-700 mb-3 font-semibold">
            {message}
          </p>
        )}

        <Form onSubmit={handleSubmit}>

          {/* Name */}
          <Form.Group className="mb-3">
            <Form.Label className="font-semibold">Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              placeholder="Enter full name"
              value={formData.name}
              onChange={handleChange}
              required
              className="p-2 rounded"
            />
          </Form.Group>

          {/* Email */}
          <Form.Group className="mb-3">
            <Form.Label className="font-semibold">Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
              required
              className="p-2 rounded"
            />
          </Form.Group>

          {/* Address */}
          <Form.Group className="mb-3">
            <Form.Label className="font-semibold">Address</Form.Label>
            <Form.Control
              as="textarea"
              name="address"
              placeholder="Enter address"
              value={formData.address}
              onChange={handleChange}
              required
              rows={3}
              className="p-2 rounded"
            />
          </Form.Group>

          {/* Contact Number */}
          <Form.Group className="mb-3">
            <Form.Label className="font-semibold">Contact Number</Form.Label>
            <Form.Control
              type="text"
              name="contactno"
              placeholder="Enter contact number"
              value={formData.contactno}
              onChange={handleChange}
              required
              className="p-2 rounded"
            />
          </Form.Group>

          {/* Username */}
          <Form.Group className="mb-3">
            <Form.Label className="font-semibold">Username</Form.Label>
            <Form.Control
              type="text"
              name="username"
              placeholder="Choose a username"
              value={formData.username}
              onChange={handleChange}
              required
              className="p-2 rounded"
            />
          </Form.Group>

          {/* Password */}
          <Form.Group className="mb-4">
            <Form.Label className="font-semibold">Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              required
              className="p-2 rounded"
            />
          </Form.Group>

          <Button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Create User
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default UserRegistration;


























