import React, { useEffect, useState } from "react";
import api from "../config/axiosinstance";
import InstructionModal from "./InstructionModal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, isSameDay } from "date-fns";

const CreateBooking = () => {
  const [categories, setCategories] = useState([]);
  const [providers, setProviders] = useState([]);
  const [bookedDates, setBookedDates] = useState([]);
  const [bookingDates, setBookingDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availabilityType, setAvailabilityType] = useState("full_day");
  const [formData, setFormData] = useState({ category_id: "", provider_id: "", location: "" });
  const [totalAmount, setTotalAmount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");

  // Load service categories
  useEffect(() => {
    api.get("/service-category")
      .then(res => setCategories(res.data.data))
      .catch(() => setError("Failed to load categories"));
  }, []);

  // Fetch providers based on selected dates
  const fetchProviders = async (dates) => {
    if (!formData.category_id || !formData.location || !dates.length) return;
    try {
      const res = await api.post("/filterProviderforbooking", {
        category_id: formData.category_id,
        needs: dates,
        location: formData.location,
      });
      setProviders(res.data.data || []);
    } catch {
      setProviders([]);
    }
  };

  // Fetch already booked dates for a provider
  const fetchProviderBookings = async (providerId) => {
    if (!providerId) return;
    try {
      const res = await api.get(`/provider/${providerId}`);
      const dates = res.data.data.flatMap(b =>
        b.booking_dates.map(d => ({
          date: d.date,
          availability_type: d.availability_type
        }))
      );
      setBookedDates(dates);
    } catch {
      setBookedDates([]);
    }
  };

  // When a date is clicked, prompt for availability type
 const handleDateClick = (date) => {
  const formattedDate = format(date, "yyyy-MM-dd");

  if (!["full_day", "half_day"].includes(availabilityType)) return;

  const exists = bookingDates.some(
    d =>
      d.date === formattedDate &&
      d.availability_type === availabilityType
  );

  if (exists) return;

  const updated = [
    ...bookingDates,
    {
      date: formattedDate,
      availability_type: availabilityType,
    },
  ];

  setBookingDates(updated);
  fetchProviders(updated);
};


  // Disable dates already booked
  const isDateDisabled = (date) => {
    return bookedDates.some(b =>
      isSameDay(new Date(b.date), date) &&
      (b.availability_type === "full_day" || b.availability_type === availabilityType)
    );
  };

  // Remove selected date
  const removeDate = (index) => {
    setBookingDates(prev => prev.filter((_, i) => i !== index));
  };

  // Preview total amount
  const previewAmount = async () => {
    try {
      const res = await api.post("/calculateBookingAmount", {
        category_id: formData.category_id,
        booking_dates: bookingDates,
      });
      setTotalAmount(res.data.total_amount);
      setShowModal(true);
    } catch {
      setError("Failed to calculate amount");
    }
  };

  // Go to Stripe checkout
  const goToStripeCheckout = async () => {
    try {
      const payload = {
        provider_id: formData.provider_id,
        category_id: formData.category_id,
        booking_dates:bookingDates.map(d => ({
        date: d.date,
        availability_type: d.availability_type ,
      })),
        location: formData.location,
        total_amount: totalAmount,
      };
      localStorage.setItem("booking_payload", JSON.stringify(payload));
      const res = await api.post("/create-checkout-session", { ...payload, totalAmount });
      window.location.href = res.data.url;
    } catch {
      setError("Unable to redirect to payment");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Create Booking</h2>

      {/* Category */}
      <select
        className="w-full p-2 border mb-3"
        value={formData.category_id}
        onChange={e => setFormData({ ...formData, category_id: e.target.value })}
      >
        <option value="">Select Category</option>
        {categories.map(c => (
          <option key={c._id} value={c._id}>{c.category_name}</option>
        ))}
      </select>

      {/* Location */}
      <input
        className="w-full p-2 border mb-3"
        placeholder="Location"
        value={formData.location}
        onChange={e => setFormData({ ...formData, location: e.target.value })}
      />

      {/* Date Picker */}
      <DatePicker
        selected={selectedDate}
        onChange={handleDateClick}
        minDate={new Date()}
        inline
        filterDate={d => !isDateDisabled(d)}
      />

      {/* Selected Dates */}
     {bookingDates.map((d, i) => (
  <div key={i} className="flex justify-between border p-2 mb-2 rounded">
    <span>
      {d?.date || "Unknown date"} —{" "}
      {(d?.availability_type ?? "full_day").replace("_", " ")}
    </span>
    <button
      className="text-red-600"
      onClick={() => removeDate(i)}
    >
      Remove
    </button>
  </div>
))}


      {/* Providers */}
      <select
        className="w-full p-2 border mb-3"
        value={formData.provider_id}
        onChange={e => {
          setFormData({ ...formData, provider_id: e.target.value });
          fetchProviderBookings(e.target.value);
        }}
      >
        <option value="">Select Provider</option>
        {providers.map(p => (
          <option key={p._id} value={p._id}>
            {p.name} ({p.available_location.join(", ")})
          </option>
        ))}
      </select>

      <button
        className="w-full bg-blue-600 text-white p-2 rounded"
        disabled={!formData.provider_id || !bookingDates.length}
        onClick={previewAmount}
      >
        Preview Amount
      </button>

      {error && <p className="text-red-600 mt-2">{error}</p>}

      <InstructionModal
        isOpen={showModal}
        totalAmount={totalAmount}
        onClose={() => setShowModal(false)}
        onAgree={() => {
          setShowModal(false);
          goToStripeCheckout();
        }}
      />
    </div>
  );
};

export default CreateBooking;
