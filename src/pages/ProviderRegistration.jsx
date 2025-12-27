import React, { useState, useEffect } from "react";
import api from "../config/axiosinstance";
import { Form, Button } from "react-bootstrap";

const ProviderRegistration = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    is_group: false,
    members: 1,
    address: "",
    contactno: "",
    available_location: "",
    username: "",
    password: "",
    service_category: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");

  // 🔴 validation errors
  const [errors, setErrors] = useState({
    contactno: "",
    password: "",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/service-category");
        setCategories(res.data.data);
      } catch (error) {
        console.error("Failed to load categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const validateField = (name, value) => {
    let error = "";

    if (name === "contactno") {
      if (!/^[0-9]{10}$/.test(value)) {
        error = "Phone number must be exactly 10 digits.";
      }
    }

    if (name === "password") {
      if (
        !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{6,}$/.test(value)
      ) {
        error =
          "Password must be 6+ characters and include letter, number & symbol.";
      }
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    if (name === "contactno" || name === "password") {
      validateField(name, value);
    }
  };

  const handleDocumentChange = (e) => {
    setDocuments(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ❌ stop submit if validation errors exist
    if (errors.contactno || errors.password) {
      setMessage("Please fix validation errors before submitting.");
      return;
    }

    const data = new FormData();

    for (let key in formData) {
      if (key === "available_location") {
        data.append(
          "available_location",
          JSON.stringify([formData.available_location])
        );
      } else {
        data.append(key, formData[key]);
      }
    }

    if (profileImage) {
      data.append("profile_image", profileImage);
    }

    if (documents.length > 0) {
      for (let i = 0; i < documents.length; i++) {
        data.append("verification_document", documents[i]);
      }
    }

    try {
      await api.post("/registerprovider", data);
      setMessage("Provider created successfully!");
    } catch (error) {
      console.error(error);
      setMessage("Error creating provider.");
    }
  };

  return (
    <div className="container mx-auto max-w-xl mt-10 p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        Create Provider
      </h2>

      {message && (
        <p className="mb-3 text-center text-danger fw-semibold">
          {message}
        </p>
      )}

      <Form onSubmit={handleSubmit}>
        {/* Contact Number */}
        <Form.Group className="mb-3">
          <Form.Label>Contact Number</Form.Label>
          <Form.Control
            type="text"
            name="contactno"
            value={formData.contactno}
            onChange={handleChange}
            isInvalid={!!errors.contactno}
            required
          />
          <Form.Control.Feedback type="invalid">
            {errors.contactno}
          </Form.Control.Feedback>
        </Form.Group>

        {/* Password */}
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            isInvalid={!!errors.password}
            required
          />
          <Form.Control.Feedback type="invalid">
            {errors.password}
          </Form.Control.Feedback>
        </Form.Group>

        {/* everything else remains unchanged */}

        <Button
          type="submit"
          className="w-full mt-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default ProviderRegistration;
