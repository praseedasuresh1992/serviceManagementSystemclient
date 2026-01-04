import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import api from "../config/axiosinstance";

const UserRegistration = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    contactno: "",
    username: "",
    password: ""
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  // 👉 refs for cursor focus
  const emailRef = useRef(null);
  const phoneRef = useRef(null);
  const passwordRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" }); // clear error while typing
  };

  /* ================= VALIDATION ================= */
  const validate = () => {
    let newErrors = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    // Phone validation (10 digits)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.contactno)) {
      newErrors.contactno = "Phone number must be 10 digits";
    }

    // Password validation
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{6,}$/;
    if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        "Password must be at least 6 characters and include a letter, number & special character";
    }

    setErrors(newErrors);

    // 👉 Focus on first error
    if (newErrors.email) {
      emailRef.current.focus();
      return false;
    }
    if (newErrors.contactno) {
      phoneRef.current.focus();
      return false;
    }
    if (newErrors.password) {
      passwordRef.current.focus();
      return false;
    }

    return true;
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      await api.post("registeruser", formData);

      setMessage("Your account created successfully!");
      navigate("/login");

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
      setMessage("Error creating user account");
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
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* Email */}
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              ref={emailRef}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && (
              <small className="text-danger">{errors.email}</small>
            )}
          </Form.Group>

          {/* Address */}
          <Form.Group className="mb-3">
            <Form.Label>Address</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* Contact Number */}
          <Form.Group className="mb-3">
            <Form.Label>Contact Number</Form.Label>
            <Form.Control
              ref={phoneRef}
              type="text"
              name="contactno"
              value={formData.contactno}
              onChange={handleChange}
            />
            {errors.contactno && (
              <small className="text-danger">{errors.contactno}</small>
            )}
          </Form.Group>

          {/* Username */}
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* Password */}
          <Form.Group className="mb-4">
            <Form.Label>Password</Form.Label>
            <Form.Control
              ref={passwordRef}
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && (
              <small className="text-danger">{errors.password}</small>
            )}
          </Form.Group>

          <Button type="submit" className="w-full">
            Register
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default UserRegistration;
