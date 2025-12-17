import React, { useState, useEffect } from "react";
import api from "../config/axiosinstance";
import { useNavigate } from "react-router-dom";
import InstructionModal from "./InstructionModal";

const CreateBooking = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    category_id: "",
    provider_id: "",
    location: ""
  });

  const [categories, setCategories] = useState([]);
  const [providers, setProviders] = useState([]);
  const [selectedDates, setSelectedDates] = useState([]);
  const [previewAmount, setPreviewAmount] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");

  // Load categories
  useEffect(() => {
    api.get("/viewAllcategory").then(res => {
      setCategories(res.data.data);
    });
  }, []);

  // Fetch providers
  const fetchProviders = async (needs) => {
    if (!formData.category_id || !formData.location || needs.length === 0) return;

    const res = await api.post("/filterProviderforbooking", {
      category_id: formData.category_id,
      needs,
      location: formData.location
    });

    setProviders(res.data.data || []);
  };

  // Add date
  const addDate = (date, availability_type) => {
    const exists = selectedDates.some(
      d => d.date === date && d.availability_type === availability_type
    );
    if (exists) return;

    const updated = [...selectedDates, { date, availability_type }];
    setSelectedDates(updated);
    fetchProviders(updated);
  };

  // Calculate amount
  const calculateAmount = async () => {
    try {
      const res = await api.post("/calculateBookingAmount", {
        category_id: formData.category_id,
        booking_dates: selectedDates
      });

      setPreviewAmount(res.data.total_amount);
      setShowModal(true);
    } catch {
      setError("Amount calculation failed");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">Create Booking</h2>

      {/* Category */}
      <select
        className="w-full p-2 border mb-2"
        onChange={e => setFormData({ ...formData, category_id: e.target.value })}
      >
        <option value="">Select Category</option>
        {categories.map(c => (
          <option key={c._id} value={c._id}>{c.category_name}</option>
        ))}
      </select>

      {/* Location */}
      <input
        placeholder="Location"
        className="w-full p-2 border mb-2"
        onChange={e => setFormData({ ...formData, location: e.target.value })}
      />

      {/* Sample Date Add (replace with date picker later) */}
      <button
        onClick={() => addDate("2025-01-20", "full_day")}
        className="bg-green-600 text-white px-3 py-1 rounded"
      >
        Add Sample Full Day
      </button>

      {/* Providers */}
      <select
        className="w-full p-2 border mt-3"
        onChange={e => setFormData({ ...formData, provider_id: e.target.value })}
      >
        <option value="">Select Provider</option>
        {providers.map(p => (
          <option key={p._id} value={p._id}>{p.name}</option>
        ))}
      </select>

      {/* Preview */}
      <button
        onClick={calculateAmount}
        className="mt-4 w-full bg-blue-600 text-white p-2 rounded"
        disabled={!formData.provider_id || selectedDates.length === 0}
      >
        Preview Amount
      </button>

      {error && <p className="text-red-600 mt-2">{error}</p>}

      {/* Instruction Modal */}
      <InstructionModal
        isOpen={showModal}
        totalAmount={previewAmount}
        onClose={() => setShowModal(false)}
        onAgree={() => {
          setShowModal(false);
          navigate("/userDashboard/payment", {
            state: {
              formData,
              booking_dates: selectedDates,
              totalAmount: previewAmount,
              advanceAmount: previewAmount * 0.08
            }
          });
        }}
      />
    </div>
  );
};

export default CreateBooking;
