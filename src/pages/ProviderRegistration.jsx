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
  const [imagePreview, setImagePreview] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  /* ================= FETCH CATEGORIES ================= */
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

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  /* ================= PROFILE IMAGE ================= */
  const handleProfileImage = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);

    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  /* ================= DOCUMENTS ================= */
  const handleDocumentChange = (e) => {
    setDocuments(e.target.files);
  };

  /* ================= VALIDATION ================= */
  const validate = () => {
    const newErrors = {};

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    // Contact number (10 digits)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.contactno)) {
      newErrors.contactno = "Contact number must be 10 digits";
    }

    // Password
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;
    if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        "Password must include a letter, a number & a special character";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!validate()) return;

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

    for (let i = 0; i < documents.length; i++) {
      data.append("verification_document", documents[i]);
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
        <p className="mb-3 text-center text-green-600 font-semibold">
          {message}
        </p>
      )}

      <Form onSubmit={handleSubmit}>

        {/* ================= PROFILE IMAGE (MODERN UI) ================= */}
        <Form.Group className="mb-4 text-center">
          <div
            className="border-2 border-dashed rounded-xl p-4 cursor-pointer hover:bg-gray-50"
            onClick={() => document.getElementById("profileUpload").click()}
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="mx-auto h-32 w-32 rounded-full object-cover"
              />
            ) : (
              <p className="text-gray-500">
                Click to upload profile photo
              </p>
            )}
          </div>
          <Form.Control
            id="profileUpload"
            type="file"
            accept="image/*"
            onChange={handleProfileImage}
            hidden
            required
          />
        </Form.Group>

        {/* ================= NAME ================= */}
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control name="name" onChange={handleChange} required />
        </Form.Group>

        {/* ================= EMAIL ================= */}
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control name="email" onChange={handleChange} required />
          {errors.email && (
            <small className="text-danger">{errors.email}</small>
          )}
        </Form.Group>

        {/* ================= GROUP ================= */}
        <Form.Check
          className="mb-3"
          type="checkbox"
          label="Is Group?"
          name="is_group"
          onChange={handleChange}
        />

        {formData.is_group && (
          <Form.Group className="mb-3">
            <Form.Label>Members</Form.Label>
            <Form.Control
              type="number"
              name="members"
              min="1"
              onChange={handleChange}
            />
          </Form.Group>
        )}

        {/* ================= ADDRESS ================= */}
        <Form.Group className="mb-3">
          <Form.Label>Address</Form.Label>
          <Form.Control as="textarea" name="address" onChange={handleChange} />
        </Form.Group>

        {/* ================= CONTACT ================= */}
        <Form.Group className="mb-3">
          <Form.Label>Contact Number</Form.Label>
          <Form.Control name="contactno" onChange={handleChange} />
          {errors.contactno && (
            <small className="text-danger">{errors.contactno}</small>
          )}
        </Form.Group>

        {/* ================= LOCATION ================= */}
        <Form.Group className="mb-3">
          <Form.Label>Available Location</Form.Label>
          <Form.Control
            name="available_location"
            onChange={handleChange}
          />
        </Form.Group>

        {/* ================= CATEGORY ================= */}
        <Form.Group className="mb-3">
          <Form.Label>Service Category</Form.Label>
          <Form.Select name="service_category" onChange={handleChange} required>
            <option value="">-- Select Category --</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.category_name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        {/* ================= DOCUMENTS (MULTIPLE) ================= */}
        <Form.Group className="mb-3">
          <Form.Label>Verification Documents</Form.Label>
          <Form.Control
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleDocumentChange}
          />
        </Form.Group>

        {/* ================= USERNAME ================= */}
        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control name="username" onChange={handleChange} />
        </Form.Group>

        {/* ================= PASSWORD ================= */}
        <Form.Group className="mb-4">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            onChange={handleChange}
          />
          {errors.password && (
            <small className="text-danger">{errors.password}</small>
          )}
        </Form.Group>

        <Button className="w-full bg-blue-600 hover:bg-blue-700" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default ProviderRegistration;
