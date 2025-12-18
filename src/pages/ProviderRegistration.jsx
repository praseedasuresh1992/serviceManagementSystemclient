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
    service_category: "",  // ✅ Added
  });

  const [profileImage, setProfileImage] = useState(null);
  const [documents, setDocuments] = useState([]);

  const [categories, setCategories] = useState([]); //  store category list
  const [message, setMessage] = useState("");

  // Fetch categories when page loads
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/service-category");
        setCategories(res.data.data|| []);
      } catch (error) {
        console.error("Failed to load categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleDocumentChange = (e) => {
    setDocuments(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    for (let key in formData) {
    if (key === "available_location") {
      data.append("available_location", JSON.stringify([formData.available_location]));
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
      console.log("DATA SENDING:", formData);

      const res = await api.post("/registerprovider", data);
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
        <p className="mb-3 text-center text-green-600 font-semibold">
          {message}
        </p>
      )}

      <Form onSubmit={handleSubmit}>

        {/* Profile Image */}
        <Form.Group className="mb-3">
          <Form.Label>Profile Image</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={(e) => setProfileImage(e.target.files[0])}
            required
          />
        </Form.Group>

       


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
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </Form.Group>

        {/* Is Group */}
        <Form.Group className="mb-3 flex items-center gap-2">
          <Form.Check
            type="checkbox"
            label="Is Group?"
            name="is_group"
            checked={formData.is_group}
            onChange={handleChange}
          />
        </Form.Group>

        {/* Members */}
        {formData.is_group && (
          <Form.Group className="mb-3">
            <Form.Label>Members</Form.Label>
            <Form.Control
              type="number"
              name="members"
              value={formData.members}
              onChange={handleChange}
              min="1"
            />
          </Form.Group>
        )}

        {/* Address */}
        <Form.Group className="mb-3">
          <Form.Label>Address</Form.Label>
          <Form.Control
            as="textarea"
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
            type="text"
            name="contactno"
            value={formData.contactno}
            onChange={handleChange}
            required
          />
        </Form.Group>

        {/* Available Location */}
        <Form.Group className="mb-3">
          <Form.Label>Available Location</Form.Label>
          <Form.Control
            type="text"
            name="available_location"
            value={formData.available_location}
            onChange={handleChange}
            required
          />
        </Form.Group>
        
        {/* Category Dropdown */}
        <Form.Group className="mb-3">
          <Form.Label>Service Category</Form.Label>
          <Form.Select
            name="service_category"
            value={formData.service_category}
            onChange={handleChange}
            required
          >
            <option value="">-- Select a Category --</option>

            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.category_name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
 {/* Documents */}
        <Form.Group className="mb-3">
          <Form.Label>Upload Documents (Multiple)</Form.Label>
          <Form.Control
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleDocumentChange}
          />
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
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </Form.Group>

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
