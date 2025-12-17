import React, { useState } from "react";
import api from "../../config/axiosinstance";

const CreateServiceCategory = () => {
  const [formData, setFormData] = useState({
    category_name: "",
    description: "",
    full_day: "",
    half_day: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/service-category", {
        category_name: formData.category_name,
        description: formData.description,
        basic_amount: {
          full_day: formData.full_day,
          half_day: formData.half_day,
        },
      });
      alert("Service Category Created");
      setFormData({
        category_name: "",
        description: "",
        full_day: "",
        half_day: "",
      });
    } catch (err) {
      console.error(err);
      alert("Error creating category");
    }
  };

  return (
    <div className="container mt-5 max-w-xl bg-white shadow-lg p-6 rounded">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Create Service Category
      </h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          name="category_name"
          placeholder="Category Name"
          className="form-control"
          value={formData.category_name}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          className="form-control"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="full_day"
          placeholder="Full Day Amount"
          className="form-control"
          value={formData.full_day}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="half_day"
          placeholder="Half Day Amount"
          className="form-control"
          value={formData.half_day}
          onChange={handleChange}
          required
        />

        <button className="btn btn-primary w-full mt-3">
          Create
        </button>
      </form>
    </div>
  );
};

export default CreateServiceCategory;
