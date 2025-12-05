import React, { useState, useEffect } from "react";
import api from "../config/axiosinstance";

const CreateBooking = () => {
  const [formData, setFormData] = useState({
    user_id: "",
    category_id: "",
    provider_id: "",
    location: "",
    amount: "",
    booking_date: "",
    slot: "",
  });

  const [categories, setCategories] = useState([]);
  const [providers, setProviders] = useState([]);
  const [selectedDateSlots, setSelectedDateSlots] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showSlot, setShowSlot] = useState(false);

  // =============================
  // 1️⃣ Set user ID from Token
  // =============================
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("token from createbokking",token)
    if (token) {

      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        setFormData((prev) => ({ ...prev, user_id: decoded.id }));
      } catch (e) {
        console.log("Invalid token");
      }
    }
  }, []);

  // =============================
  // 2️⃣ Load Categories
  // =============================
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await api.get("viewcategory");
        setCategories(res.data.data);
      } catch (err) {
        console.log("Category fetch error", err);
      }
    };
    loadCategories();
  }, []);

  // =============================
  // 3️⃣ Fetch Providers Based on Availability
  // =============================
  const fetchAvailableProviders = async (dateSlotsArray) => {
    if (!formData.category_id || dateSlotsArray.length === 0) return;

    try {
      const res = await api.post("/filterProviderforbooking", {
  category_id: formData.category_id,
  needs: dateSlotsArray,  // ✔ correct name
  location: formData.location, // ✔ add location also (backend supports)
});

      setProviders(res.data.data);
    } catch (err) {
      console.log("Provider fetch error", err);
    }
  };

  // =============================
  // 4️⃣ Handle Change
  // =============================
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    if (e.target.name === "booking_date") {
      setShowSlot(true);
    }
  };

  // =============================
  // 5️⃣ Add Date + Slot
  // =============================
  const addDateSlot = () => {
    setError("");

    const date = formData.booking_date;
    const slot = formData.slot;

    if (!date || !slot) {
      setError("Please select both date and slot.");
      return;
    }

    // Prevent duplicates
    const exists = selectedDateSlots.some(
      (item) => item.date === date && item.slot === slot
    );

    if (exists) {
      setError("This date & slot already added.");
      return;
    }

    const updated = [...selectedDateSlots, { date, slot }];
    setSelectedDateSlots(updated);
    setShowSlot(false);
    setFormData({ ...formData, slot: "" });

    fetchAvailableProviders(updated);
  };

  // =============================
  // 6️⃣ Submit Booking to Backend
  // =============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedDateSlots.length === 0) {
      setMessage("Please select at least one date slot.");
      return;
    }

   const payload = {
  ...formData,
  needs: selectedDateSlots,
};


    try {
      await api.post("createbooking", payload);

      setMessage("Booking added successfully!");
      setSelectedDateSlots([]);
      setProviders([]);

      setFormData({
        ...formData,
        provider_id: "",
        category_id: "",
        location: "",
        amount: "",
        booking_date: "",
        slot: "",
      });
    } catch (err) {
      console.log(err);
      setMessage("Failed to add booking.");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-8 p-6 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">Create Booking</h2>

      {message && <p className="text-green-600 mb-3">{message}</p>}
      {error && <p className="text-red-600 mb-3">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Category Dropdown */}
        <div>
          <label>Service Category:</label>
          <select
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">-- Select Category --</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.category_name}
              </option>
            ))}
          </select>
        </div>

        {/* Location */}
        <input
          type="text"
          name="location"
          placeholder="Enter Location"
          value={formData.location}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        {/* Date Selector */}
        <div>
          <label>Select Date:</label>
          <input
            type="date"
            name="booking_date"
            value={formData.booking_date}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Slot Selector */}
        {showSlot && (
          <div>
            <label>Select Slot:</label>
            <select
              name="slot"
              value={formData.slot}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="">-- Select Slot --</option>
              <option value="day">Day</option>
              <option value="evening">Evening</option>
            </select>

            <button
              type="button"
              onClick={addDateSlot}
              className="mt-2 bg-green-600 text-white px-3 py-1 rounded"
            >
              Add Slot
            </button>
          </div>
        )}

        {/* Date Slot List */}
        <div className="p-3 border rounded bg-gray-100">
          <h4 className="font-bold mb-2">Selected Date-Slots:</h4>

          {selectedDateSlots.length === 0 && <p>No slots added yet.</p>}

          {selectedDateSlots.map((item, index) => (
            <div key={index} className="flex justify-between items-center mb-1">
              <span>
                ✔ {item.date} — {item.slot.toUpperCase()}
              </span>
              <button
                type="button"
                className="text-red-600"
                onClick={() => {
                  const updated = selectedDateSlots.filter(
                    (_, i) => i !== index
                  );
                  setSelectedDateSlots(updated);
                  fetchAvailableProviders(updated);
                }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* Provider Dropdown */}
        <div>
          <label>Available Providers:</label>
          <select
            name="provider_id"
            value={formData.provider_id}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">-- Select Provider --</option>
            {providers.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}

            {providers.length === 0 && (
              <option disabled>No providers available</option>
            )}
          </select>
        </div>

        {/* Amount */}
        <input
          type="number"
          name="amount"
          placeholder="Enter Amount"
          value={formData.amount}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700"
        >
          Submit Booking
        </button>
      </form>
    </div>
  );
};

export default CreateBooking;
