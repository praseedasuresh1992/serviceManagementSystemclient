import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import api from "../config/axiosinstance";

const CreateBooking = () => {
  const [categories, setCategories] = useState([]);
  const [providers, setProviders] = useState([]);
  const [bookedDates, setBookedDates] = useState([]);
  const [bookingDates, setBookingDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availabilityType, setAvailabilityType] = useState("full_day");

  const [formData, setFormData] = useState({
    category_id: "",
    provider_id: "",
    location: ""
  });

  /* LOAD CATEGORIES */
  useEffect(() => {
    api.get("/service-category")
      .then(res => setCategories(res.data.data))
      .catch(console.error);
  }, []);

  /* ADD DATE */
  const addBookingDate = () => {
    if (!selectedDate) return;

    const date = format(selectedDate, "yyyy-MM-dd");

    const exists = bookingDates.some(
      d => d.date === date && d.availability_type === availabilityType
    );
    if (exists) return;

    const updated = [
      ...bookingDates,
      { date, availability_type: availabilityType }
    ];

    setBookingDates(updated);
    fetchProviders(updated);
    setSelectedDate(null);
  };

  /* FETCH PROVIDERS */
  const fetchProviders = async (needs) => {
    if (!formData.category_id || !formData.location) return;

    const res = await api.post("/filterProviderforbooking", {
      category_id: formData.category_id,
      needs,
      location: formData.location
    });

    setProviders(res.data.data || []);
  };

  /* FETCH PROVIDER BOOKINGS */
  const fetchProviderBookings = async (providerId) => {
    if (!providerId) return;

    const res = await api.get(`/provider/${providerId}`);
    const dates = res.data.data.flatMap(b =>
      b.booking_dates.map(d => ({
        date: d.date,
        availability_type: d.availability_type
      }))
    );

    setBookedDates(dates);
  };

  /* DISABLE DATES */
  const isDateDisabled = (dateObj) => {
    const date = format(dateObj, "yyyy-MM-dd");

    return bookedDates.some(b =>
      b.date === date &&
      (b.availability_type === "full_day" ||
        b.availability_type === availabilityType)
    );
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Create Booking</h2>

      <select
        className="w-full p-2 border mb-3"
        onChange={e => setFormData({ ...formData, category_id: e.target.value })}
      >
        <option value="">Select Category</option>
        {categories.map(c => (
          <option key={c._id} value={c._id}>
            {c.category_name}
          </option>
        ))}
      </select>

      <input
        className="w-full p-2 border mb-3"
        placeholder="Location"
        onChange={e => setFormData({ ...formData, location: e.target.value })}
      />

      <DatePicker
        selected={selectedDate}
        onChange={setSelectedDate}
        filterDate={d => !isDateDisabled(d)}
        minDate={new Date()}
        inline
      />

      <select
        className="p-2 border mt-3"
        value={availabilityType}
        onChange={e => setAvailabilityType(e.target.value)}
      >
        <option value="full_day">Full Day</option>
        <option value="half_day">Half Day</option>
      </select>

      <button
        className="w-full bg-green-600 text-white p-2 mt-3"
        onClick={addBookingDate}
      >
        Add Date
      </button>

      <select
        className="w-full p-2 border mt-4"
        onChange={e => {
          setFormData({ ...formData, provider_id: e.target.value });
          fetchProviderBookings(e.target.value);
        }}
      >
        <option value="">Select Provider</option>
        {providers.map(p => (
          <option key={p._id} value={p._id}>
            {p.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CreateBooking;
