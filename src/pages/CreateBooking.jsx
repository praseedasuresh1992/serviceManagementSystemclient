import React, { useEffect, useState } from "react";
import api from "../config/axiosinstance";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, isSameDay } from "date-fns";
import { Modal, Button, Form } from "react-bootstrap";
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

  /* ================= LOAD CATEGORIES ================= */
  useEffect(() => {
    api.get("/service-category")
      .then(res => setCategories(res.data.data))
      .catch(() => setError("Failed to load categories"));
  }, []);

  /* ================= FILTER PROVIDERS ================= */
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

  /* ================= PROVIDER BOOKINGS ================= */
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

  /* ================= DATE CLICK ================= */
  const handleDateClick = (date) => {
    setSelectedDate(date);
    setAvailabilityType("");
    setShowAvailabilityModal(true);
  };

  /* ================= SAVE DATE ================= */
  const saveDate = () => {
    if (!availabilityType || !selectedDate) return;

    const formattedDate = format(selectedDate, "yyyy-MM-dd");

    const exists = bookingDates.some(
      d =>
        d.date === formattedDate &&
        d.availability_type === availabilityType
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

  /* ================= DISABLE BOOKED DATES ================= */
  const isDateDisabled = (date) => {
    return bookedDates.some(b =>
      isSameDay(new Date(b.date), date) &&
      (b.availability_type === "full_day" ||
        b.availability_type === availabilityType)
    );
  };

  /* ================= REMOVE DATE ================= */
  const removeDate = (index) => {
    setBookingDates(prev => prev.filter((_, i) => i !== index));
  };

  /* ================= PREVIEW AMOUNT ================= */
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

  /* ================= STRIPE ================= */
  const goToStripeCheckout = async () => {
    try {
      const payload = {
        provider_id: formData.provider_id,
        category_id: formData.category_id,
        booking_dates: bookingDates,
        location: formData.location,
        total_amount: totalAmount
      };

      localStorage.setItem("booking_payload", JSON.stringify(payload));

      const res = await api.post("/create-checkout-session", payload);
      window.location.href = res.data.url;
    } catch {
      setError("Unable to redirect to payment");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-5">
      <div className="bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Create Booking
        </h2>

        {/* CATEGORY */}
        <Form.Group className="mb-3">
          <Form.Label>Service Category</Form.Label>
          <Form.Select
            value={formData.category_id}
            onChange={e =>
              setFormData({ ...formData, category_id: e.target.value })
            }
          >
            <option value="">Select Category</option>
            {categories.map(c => (
              <option key={c._id} value={c._id}>
                {c.category_name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        {/* LOCATION */}
        <Form.Group className="mb-3">
          <Form.Label>Location</Form.Label>
          <Form.Control
            placeholder="Enter location"
            value={formData.location}
            onChange={e =>
              setFormData({ ...formData, location: e.target.value })
            }
          />
        </Form.Group>

        {/* DATE PICKER */}
        <div className="border rounded p-3 mb-3">
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
            className="d-flex justify-content-between align-items-center border rounded p-2 mb-2"
          >
            <span>
              <strong>{d.date}</strong> —{" "}
              {String(d.availability_type).replace("_", " ")}
            </span>
            <Button size="sm" variant="outline-danger" onClick={() => removeDate(i)}>
              Remove
            </Button>
          </div>
        ))}

        {/* PROVIDERS */}
        <Form.Group className="mb-3 mt-3">
          <Form.Label>Available Providers</Form.Label>
          <Form.Select
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
          </Form.Select>
        </Form.Group>

        <Button
          className="w-100"
          variant="primary"
          disabled={!formData.provider_id || !bookingDates.length}
          onClick={previewAmount}
        >
          Preview Amount
        </Button>

        {error && <p className="text-danger mt-2">{error}</p>}
      </div>

      {/* AVAILABILITY MODAL */}
      <Modal show={showAvailabilityModal} centered>
        <Modal.Header>
          <Modal.Title>
            Select Availability —{" "}
            {selectedDate && format(selectedDate, "yyyy-MM-dd")}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Check
              type="radio"
              label="Full Day"
              name="availability"
              checked={availabilityType === "full_day"}
              onChange={() => setAvailabilityType("full_day")}
            />
            <Form.Check
              type="radio"
              label="Half Day"
              name="availability"
              checked={availabilityType === "half_day"}
              onChange={() => setAvailabilityType("half_day")}
            />
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAvailabilityModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={saveDate}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

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
