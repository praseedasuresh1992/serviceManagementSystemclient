import React, { useState, useEffect } from "react";
import api from "../config/axiosinstance";
import { useNavigate } from "react-router-dom";

const ProviderRegistration = () => {
  const navigate = useNavigate();

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

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await api.get("/service-category");
      setCategories(res.data.data);
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

  const handleProfileImage = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  const handleDocumentChange = (e) => {
    setDocuments(e.target.files);
  };

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
      navigate("/login");
    } catch (error) {
      if (error.response?.status === 409) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Error creating provider");
      }
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        Create Provider
      </h2>

      {message && (
        <p className="text-center text-red-600 mb-3">{message}</p>
      )}

      <form onSubmit={handleSubmit}>
        {/* PROFILE IMAGE */}
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

        <input
          id="profileUpload"
          type="file"
          accept="image/*"
          hidden
          onChange={handleProfileImage}
        />
        {errors.profileImage && (
          <small className="text-red-500">{errors.profileImage}</small>
        )}

        {/* NAME */}
        <div className="mb-3">
          <label className="block mb-1 font-medium">Name</label>
          <input
            name="name"
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          {errors.name && (
            <small className="text-red-500">{errors.name}</small>
          )}
        </div>

        {/* EMAIL */}
        <div className="mb-3">
          <label className="block mb-1 font-medium">Email</label>
          <input
            name="email"
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          {errors.email && (
            <small className="text-red-500">{errors.email}</small>
          )}
        </div>

        {/* GROUP */}
        <div className="mb-3 flex items-center gap-2">
          <input
            type="checkbox"
            name="is_group"
            onChange={handleChange}
          />
          <label>Is Group?</label>
        </div>

        {formData.is_group && (
          <div className="mb-3">
            <label className="block mb-1 font-medium">Members</label>
            <input
              type="number"
              name="members"
              min="1"
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        )}

        {/* ADDRESS */}
        <div className="mb-3">
          <label className="block mb-1 font-medium">Address</label>
          <textarea
            name="address"
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* CONTACT */}
        <div className="mb-3">
          <label className="block mb-1 font-medium">Contact Number</label>
          <input
            name="contactno"
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          {errors.contactno && (
            <small className="text-red-500">{errors.contactno}</small>
          )}
        </div>

        {/* LOCATION */}
        <div className="mb-3">
          <label className="block mb-1 font-medium">Available Location</label>
          <input
            name="available_location"
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          {errors.available_location && (
            <small className="text-red-500">
              {errors.available_location}
            </small>
          )}
        </div>

        {/* CATEGORY */}
        <div className="mb-3">
          <label className="block mb-1 font-medium">Service Category</label>
          <select
            name="service_category"
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">-- Select Category --</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.category_name}
              </option>
            ))}
          </select>
          {errors.service_category && (
            <small className="text-red-500">
              {errors.service_category}
            </small>
          )}
        </div>

        {/* DOCUMENTS */}
        <div className="mb-3">
          <label className="block mb-1 font-medium">
            Verification Documents
          </label>
          <input
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleDocumentChange}
            className="w-full"
          />
        </div>

        {/* USERNAME */}
        <div className="mb-3">
          <label className="block mb-1 font-medium">Username</label>
          <input
            name="username"
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          {errors.username && (
            <small className="text-red-500">{errors.username}</small>
          )}
        </div>

        {/* PASSWORD */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            name="password"
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          {errors.password && (
            <small className="text-red-500">{errors.password}</small>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ProviderRegistration;