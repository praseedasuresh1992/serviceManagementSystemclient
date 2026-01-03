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
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  /* ================= FETCH CATEGORIES ================= */
  useEffect(() => {
    const fetchCategories = async () => {
      const res = await api.get("/service-category");
      setCategories(res.data.data);
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
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  /* ================= DOCUMENTS ================= */
  const handleDocumentChange = (e) => {
    setDocuments(e.target.files);
  };

  /* ================= VALIDATION ================= */
  const validate = () => {
    const err = {};

    if (!profileImage) err.profileImage = "Profile image is required";
    if (!formData.name) err.name = "Name is required";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email))
      err.email = "Enter a valid email";

    if (!/^[0-9]{10}$/.test(formData.contactno))
      err.contactno = "Contact number must be 10 digits";

    if (!formData.available_location)
      err.available_location = "Location is required";

    if (!formData.service_category)
      err.service_category = "Select a category";

    if (!formData.username)
      err.username = "Username is required";

    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{6,}$/;
    if (!passwordRegex.test(formData.password))
      err.password =
        "Password must include letter, number & special character";

    setErrors(err);
    return Object.keys(err).length === 0;
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

    data.append("profile_image", profileImage);

    for (let i = 0; i < documents.length; i++) {
      data.append("verification_document", documents[i]);
    }

    try {
      await api.post("/registerprovider", data);
      setMessage("Provider created successfully!");
    } catch (error) {
      if (error.response?.status === 409) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Error creating provider");
      }
    }
  };

  return (
    <div className="container mx-auto max-w-xl mt-10 p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        Create Provider
      </h2>

      {message && (
        <p className="text-center text-red-600 mb-3">{message}</p>
      )}

      <Form onSubmit={handleSubmit}>
        {/* ================= PROFILE IMAGE ================= */}
        <div
          className="border-2 border-dashed rounded-xl p-4 text-center cursor-pointer mb-2"
          onClick={() => document.getElementById("profileUpload").click()}
        >
          {imagePreview ? (
            <img
              src={imagePreview}
              className="h-28 w-28 rounded-full mx-auto object-cover"
              alt="preview"
            />
          ) : (
            <p className="text-gray-500">Click to upload profile photo</p>
          )}
        </div>

        <Form.Control
          id="profileUpload"
          type="file"
          accept="image/*"
          hidden
          onChange={handleProfileImage}
        />
        {errors.profileImage && (
          <small className="text-danger">{errors.profileImage}</small>
        )}

        {/* ================= NAME ================= */}
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control name="name" onChange={handleChange} />
          {errors.name && <small className="text-danger">{errors.name}</small>}
        </Form.Group>

        {/* ================= EMAIL ================= */}
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control name="email" onChange={handleChange} />
          {errors.email && <small className="text-danger">{errors.email}</small>}
        </Form.Group>

        {/* ================= GROUP ================= */}
        <Form.Check
          className="mb-3"
          label="Is Group?"
          type="checkbox"
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
          {errors.available_location && (
            <small className="text-danger">
              {errors.available_location}
            </small>
          )}
        </Form.Group>

        {/* ================= CATEGORY ================= */}
        <Form.Group className="mb-3">
          <Form.Label>Service Category</Form.Label>
          <Form.Select name="service_category" onChange={handleChange}>
            <option value="">-- Select Category --</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.category_name}
              </option>
            ))}
          </Form.Select>
          {errors.service_category && (
            <small className="text-danger">
              {errors.service_category}
            </small>
          )}
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
          {errors.username && (
            <small className="text-danger">{errors.username}</small>
          )}
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

        <Button type="submit" className="w-full bg-blue-600">
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default ProviderRegistration;
