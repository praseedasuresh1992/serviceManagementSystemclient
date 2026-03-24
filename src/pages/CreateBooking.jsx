import React, { useEffect, useState } from "react";
import api from "../config/axiosinstance";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, isSameDay } from "date-fns";
import InstructionModal from "./InstructionModal";

const CreateBooking = () => {
  const [categories, setCategories] = useState([]);
  const [providers, setProviders] = useState([]);
  const [bookedDates, setBookedDates] = useState([]);
  const [bookingDates, setBookingDates] = useState([]);

  const [selectedDate, setSelectedDate] = useState(null);
  const [availabilityType, setAvailabilityType] = useState("");
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);

  const [formData, setFormData] = useState({
    category_id: "",
    provider_id: "",
    location: ""
  });

  const [totalAmount, setTotalAmount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/service-category")
      .then(res => setCategories(res.data.data))
      .catch(() => setError("Failed to load categories"));
  }, []);

  const fetchProviders = async (dates) => {
    if (!formData.category_id || !formData.location || !dates.length) return;
    try {
      const res = await api.post("/filterProviderforbooking", {
        category_id: formData.category_id,
        needs: dates,
        location: formData.location
      });
      setProviders(res.data.data || []);
    } catch {
      setProviders([]);
    }
  };

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

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setAvailabilityType("");
    setShowAvailabilityModal(true);
  };

  const saveDate = () => {
    if (!availabilityType || !selectedDate) return;

    const formattedDate = format(selectedDate, "yyyy-MM-dd");

    const exists = bookingDates.some(
      d => d.date === formattedDate && d.availability_type === availabilityType
    );

    if (exists) {
      alert("This availability already added");
      return;
    }

    const updated = [
      ...bookingDates,
      { date: formattedDate, availability_type: availabilityType }
    ];

    setBookingDates(updated);
    fetchProviders(updated);
    setShowAvailabilityModal(false);
  };

  const isDateDisabled = (date) => {
    return bookedDates.some(b =>
      isSameDay(new Date(b.date), date) &&
      (b.availability_type === "full_day" ||
        b.availability_type === availabilityType)
    );
  };

  const removeDate = (index) => {
    setBookingDates(prev => prev.filter((_, i) => i !== index));
  };

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

  const goToStripeCheckout = async () => {
    try {
      const payload = {
        provider_id: formData.provider_id,
        category_id: formData.category_id,
        booking_dates: bookingDates,
        location: formData.location,
        totalAmount: totalAmount
      };

      localStorage.setItem("booking_payload", JSON.stringify(payload));

      const res = await api.post("/create-checkout-session", payload);
      window.location.href = res.data.url;
    } catch {
      setError("Unable to redirect to payment");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-6">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Create Booking
        </h2>

        {/* CATEGORY */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Service Category</label>
          <select
            value={formData.category_id}
            onChange={e =>
              setFormData({ ...formData, category_id: e.target.value })
            }
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select Category</option>
            {categories.map(c => (
              <option key={c._id} value={c._id}>
                {c.category_name}
              </option>
            ))}
          </select>
        </div>

        {/* LOCATION */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Location</label>
          <input
            placeholder="Enter location"
            value={formData.location}
            onChange={e =>
              setFormData({ ...formData, location: e.target.value })
            }
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* DATE PICKER */}
        <div className="border rounded-lg p-3 mb-4">
          <DatePicker
            inline
            minDate={new Date()}
            onChange={handleDateClick}
            filterDate={d => !isDateDisabled(d)}
          />
        </div>

        {/* SELECTED DATES */}
        {bookingDates.map((d, i) => (
          <div
            key={i}
            className="flex justify-between items-center border rounded-lg p-2 mb-2"
          >
            <span>
              <strong>{d.date}</strong> —{" "}
              {String(d.availability_type).replace("_", " ")}
            </span>
            <button
              onClick={() => removeDate(i)}
              className="text-red-500 border border-red-300 px-2 py-1 rounded hover:bg-red-50"
            >
              Remove
            </button>
          </div>
        ))}

        {/* PROVIDERS */}
        <div className="mb-4 mt-4">
          <label className="block mb-1 font-medium">Available Providers</label>
          <select
            value={formData.provider_id}
            onChange={e => {
              setFormData({ ...formData, provider_id: e.target.value });
              fetchProviderBookings(e.target.value);
            }}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select Provider</option>
            {providers.map(p => (
              <option key={p._id} value={p._id}>
                {p.name} ({p.available_location.join(", ")})
              </option>
            ))}
          </select>
        </div>

        <button
          disabled={!formData.provider_id || !bookingDates.length}
          onClick={previewAmount}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
        >
          Preview Amount
        </button>

        {error && (
          <p className="text-red-500 mt-2 text-sm">{error}</p>
        )}
      </div>

      {/* AVAILABILITY MODAL */}
      {showAvailabilityModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              Select Availability —{" "}
              {selectedDate && format(selectedDate, "yyyy-MM-dd")}
            </h3>

            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={availabilityType === "full_day"}
                  onChange={() => setAvailabilityType("full_day")}
                />
                Full Day
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={availabilityType === "half_day"}
                  onChange={() => setAvailabilityType("half_day")}
                />
                Half Day
              </label>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAvailabilityModal(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={saveDate}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AMOUNT MODAL */}
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