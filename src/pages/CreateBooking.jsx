import React, { useEffect, useState } from "react";
import api from "../config/axiosinstance";
import InstructionModal from "./InstructionModal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { isSameDay } from "date-fns";

const CreateBooking = () => {
  /* ================= STATE ================= */
  const [categories, setCategories] = useState([]);
  const [providers, setProviders] = useState([]);
  const [bookedDates, setBookedDates] = useState([]);

  const [formData, setFormData] = useState({
    category_id: "",
    provider_id: "",
    location: "",
  });

  const [selectedDate, setSelectedDate] = useState(null);
  const [slot, setSlot] = useState("full_day");
  const [bookingDates, setBookingDates] = useState([]);

  const [totalAmount, setTotalAmount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");

  /* ================= LOAD CATEGORIES ================= */
  useEffect(() => {
    api.get("/service-category")
      .then(res => setCategories(res.data.data))
      .catch(() => setError("Failed to load categories"));
  }, []);

  /* ================= FETCH PROVIDER BOOKINGS ================= */
  const fetchProviderBookings = async (providerId) => {
    try {
      const res = await api.get(`/provider/${providerId}`);

      const dates = res.data.data.flatMap(b =>
        b.booking_dates.map(d => ({
          date: new Date(d.date),
          slot: d.slot
        }))
      );

      setBookedDates(dates);
    } catch {
      setBookedDates([]);
    }
  };

  /* ================= ADD DATE ================= */
  const addBookingDate = () => {
    if (!selectedDate) return;

    const formattedDate = selectedDate.toISOString().split("T")[0];

    const exists = bookingDates.some(
      d => d.date === formattedDate && d.slot === slot
    );

    if (exists) return;

    const updated = [...bookingDates, { date: formattedDate, slot }];
    setBookingDates(updated);
    fetchProviders(updated);
    setSelectedDate(null);
  };

  /* ================= REMOVE DATE ================= */
  const removeDate = (index) => {
    setBookingDates(bookingDates.filter((_, i) => i !== index));
  };

  /* ================= FETCH PROVIDERS ================= */
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

  /* ================= CALCULATE AMOUNT ================= */
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

  /* ================= DISABLE BOOKED DATES ================= */
  const isDateDisabled = (date) => {
    return bookedDates.some(b =>
      b?.date &&
      b?.slot &&
      isSameDay(new Date(b.date), date) &&
      (b.slot === "full_day" || b.slot === slot)
    );
  };

  /* ================= STRIPE CHECKOUT ================= */
  const goToStripeCheckout = async () => {
    if (
      !formData.provider_id ||
      !formData.category_id ||
      !formData.location ||
      !bookingDates.length ||
      !totalAmount
    ) {
      setError("Complete all booking details");
      return;
    }

    /* 🔥 CONSOLE LOG BEFORE SAVING */
    console.log("Saving booking data to localStorage:", {
      provider_id: formData.provider_id,
      category_id: formData.category_id,
      booking_dates: bookingDates,
      location: formData.location,
      totalAmount,
    });

    /* 🔐 SAVE TO LOCAL STORAGE */
    localStorage.setItem("booking_provider_id", JSON.stringify(formData.provider_id));
    localStorage.setItem("booking_category_id", JSON.stringify(formData.category_id));
    localStorage.setItem("booking_dates", JSON.stringify(bookingDates));
    localStorage.setItem("booking_location", JSON.stringify(formData.location));

    try {
      const res = await api.post("/create-checkout-session", {
        totalAmount,
      });

      window.location.href = res.data.url;
    } catch {
      setError("Unable to redirect to payment");
    }
  };

  /* ================= UI ================= */
  return (
    <div className="max-w-xl mx-auto p-6 border rounded shadow bg-white">
      <h2 className="text-xl font-bold mb-4">Create Booking</h2>

      {/* CATEGORY */}
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

      {/* LOCATION */}
      <input
        className="w-full p-2 border mb-3"
        placeholder="Location"
        value={formData.location}
        onChange={e => setFormData({ ...formData, location: e.target.value })}
      />

      {/* CALENDAR */}
      <DatePicker
        selected={selectedDate}
        onChange={setSelectedDate}
        minDate={new Date()}
        filterDate={date => !isDateDisabled(date)}
        inline
      />

      <div className="flex gap-3 mt-3">
        <select value={slot} onChange={e => setSlot(e.target.value)}>
          <option value="full_day">Full Day</option>
          <option value="half_day">Half Day</option>
        </select>

        <button onClick={addBookingDate} className="bg-green-600 text-white px-4 py-2 rounded">
          Add Date
        </button>
      </div>

      {bookingDates.map((d, i) => (
        <div key={i} className="flex justify-between mt-2">
          <span>{d.date} — {d.slot.replace("_", " ")}</span>
          <button onClick={() => removeDate(i)}>Remove</button>
        </div>
      ))}

      {/* PROVIDERS */}
      <select
        className="w-full p-2 border mt-3"
        value={formData.provider_id}
        onChange={e => {
          setFormData({ ...formData, provider_id: e.target.value });
          fetchProviderBookings(e.target.value);
        }}
      >
        <option value="">Select Provider</option>
        {providers.map(p => (
          <option key={p._id} value={p._id}>
            {p.name} ({p.available_location})
          </option>
        ))}
      </select>

      <button
        className="w-full bg-blue-600 text-white p-2 mt-3"
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
