import React, { useEffect, useState } from "react";
import api from "../config/axiosinstance";
import { useNavigate } from "react-router-dom";
import InstructionModal from "./InstructionModal";

const CreateBooking = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [providers, setProviders] = useState([]);
  const [bookingDates, setBookingDates] = useState([]);

  const [formData, setFormData] = useState({
    category_id: "",
    provider_id: "",
    location: ""
  });

  const [totalAmount, setTotalAmount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");

  /* ================= LOAD CATEGORIES ================= */
  useEffect(() => {
    api.get("/service-category")
      .then(res => setCategories(res.data.data))
      .catch(() => setError("Failed to load categories"));
  }, []);

  /* ================= ADD BOOKING DATE ================= */
  const addBookingDate = (date, slot) => {
    const exists = bookingDates.some(
      d => d.date === date && d.slot === slot
    );
    if (exists) return;

    const updated = [...bookingDates, { date, slot }];
    setBookingDates(updated);
    fetchProviders(updated);
  };

  /* ================= FETCH PROVIDERS ================= */
  const fetchProviders = async (dates) => {
    if (!formData.category_id || !formData.location || dates.length === 0) return;

    try {
      const res = await api.post("/filterProviderforbooking", {
        category_id: formData.category_id,
        needs: dates.map(d => ({
          date: d.date,
          availability_type: d.slot
        })),
        location: formData.location
      });

      setProviders(res.data.data || []);
    } catch {
      setProviders([]);
    }
  };

  /* ================= CALCULATE AMOUNT ================= */
  const previewAmount = async () => {
    try {
      const res = await api.post("/calculateBookingAmount", {
        category_id: formData.category_id,
        booking_dates: bookingDates
      });

      setTotalAmount(res.data.total_amount);
      setShowModal(true);
    } catch {
      setError("Failed to calculate amount");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">Create Booking</h2>

      {/* CATEGORY */}
      <select
        className="w-full p-2 border mb-3"
        value={formData.category_id}
        onChange={e =>
          setFormData({ ...formData, category_id: e.target.value })
        }
      >
        <option value="">Select Category</option>
        {categories.map(cat => (
          <option key={cat._id} value={cat._id}>
            {cat.category_name}
          </option>
        ))}
      </select>

      {/* LOCATION */}
      <input
        className="w-full p-2 border mb-3"
        placeholder="Location"
        value={formData.location}
        onChange={e =>
          setFormData({ ...formData, location: e.target.value })
        }
      />

      {/* SAMPLE DATE (replace with DatePicker later) */}
      <button
        className="bg-green-600 text-white px-4 py-2 rounded mb-3"
        onClick={() => addBookingDate("2025-01-20", "full_day")}
      >
        Add Full Day (Sample)
      </button>

      {/* PROVIDERS */}
      <select
        className="w-full p-2 border mb-3"
        value={formData.provider_id}
        onChange={e =>
          setFormData({ ...formData, provider_id: e.target.value })
        }
      >
        <option value="">Select Provider</option>
        {providers.map(p => (
          <option key={p._id} value={p._id}>
            {p.name} - {p.available_location}
          </option>
        ))}
      </select>

      {/* PREVIEW AMOUNT */}
      <button
        className="w-full bg-blue-600 text-white p-2 rounded"
        disabled={!formData.provider_id || bookingDates.length === 0}
        onClick={previewAmount}
      >
        Preview Amount
      </button>

      {error && <p className="text-red-600 mt-2">{error}</p>}

      {/* MODAL */}
      <InstructionModal
        isOpen={showModal}
        totalAmount={totalAmount}
        onClose={() => setShowModal(false)}
        onAgree={() => {
          setShowModal(false);
          navigate("/userDashboard/payment", {
            state: {
              provider_id: formData.provider_id,
              category_id: formData.category_id,
              booking_dates: bookingDates,
              location: formData.location,
              totalAmount,
              advanceAmount: totalAmount * 0.08
            }
          });
        }}
      />
    </div>
  );
};

export default CreateBooking;
