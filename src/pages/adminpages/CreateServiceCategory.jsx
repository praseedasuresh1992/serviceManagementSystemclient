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
    <div className="max-w-xl mx-auto mt-10 bg-white shadow-lg p-6 rounded-xl">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Create Service Category
      </h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          name="category_name"
          placeholder="Category Name"
          value={formData.category_name}
          onChange={handleChange}
          required
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="number"
          name="full_day"
          placeholder="Full Day Amount"
          value={formData.full_day}
          onChange={handleChange}
          required
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="number"
          name="half_day"
          placeholder="Half Day Amount"
          value={formData.half_day}
          onChange={handleChange}
          required
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition"
        >
          Create
        </button>
      </form>
    </div>
  );
};

export default CreateServiceCategory;