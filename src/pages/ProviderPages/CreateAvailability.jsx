import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Modal, Button, Form } from "react-bootstrap";
import api from "../../config/axiosinstance";

export default function CreateAvailability() {
  const [availability, setAvailability] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentDate, setCurrentDate] = useState("");
  const [availabilityType, setAvailabilityType] = useState("");

  // ===============================
  // Handle date click
  // ===============================
  const handleDateClick = (date) => {
const formatted = date.toLocaleDateString("en-CA");
    setCurrentDate(formatted);
    setAvailabilityType("");
    setShowModal(true);
  };

  // ===============================
  // Save availability for date
  // ===============================
  const saveAvailability = () => {
    if (!availabilityType) {
      alert("Please select availability type");
      return;
    }

    const exists = availability.some(
      (a) =>
        a.date === currentDate &&
        a.availability_type === availabilityType
    );

    if (exists) {
      alert("Availability already exists for this date");
      return;
    }

    setAvailability([
      ...availability,
      {
        date: currentDate,
        availability_type: availabilityType,
        is_available: true
      }
    ]);

    setShowModal(false);
  };

  // ===============================
  // Remove availability
  // ===============================
  const removeAvailability = (index) => {
    setAvailability(availability.filter((_, i) => i !== index));
  };

  // ===============================
  // Highlight selected dates
  // ===============================
  const tileClassName = ({ date }) => {
const formatted = date.toLocaleDateString("en-CA");
    return availability.some((a) => a.date === formatted)
      ? "bg-success text-white rounded-circle"
      : "";
  };

  // ===============================
  // Submit to backend
  // ===============================
  const submitHandler = async () => {
    if (availability.length === 0) {
      alert("Please select at least one availability");
      return;
    }

    try {
      const res = await api.post("/addProviderAvailability", {
        availability
      });

      alert(res.data.message || "Availability saved successfully");
      setAvailability([]);
    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.message ||
          "Error saving availability"
      );
    }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow p-4">
        <h3 className="text-center mb-3">Provider Availability</h3>

        <Calendar
          onClickDay={handleDateClick}
          tileClassName={tileClassName}
          minDate={new Date()}
        />

        <div className="mt-4">
          <h5>Selected Availability</h5>

          {availability.length === 0 && (
            <p className="text-muted">No availability added</p>
          )}

          {availability.map((item, index) => (
            <div
              key={index}
              className="d-flex justify-content-between align-items-center border rounded p-2 mb-2"
            >
              <span>
                <strong>{item.date}</strong> —{" "}
                {item.availability_type.replace("_", " ")}
              </span>

              <Button
                size="sm"
                variant="danger"
                onClick={() => removeAvailability(index)}
              >
                Remove
              </Button>
            </div>
          ))}
        </div>

        <Button
          variant="success"
          className="w-100 mt-3"
          onClick={submitHandler}
        >
          Submit Availability
        </Button>
      </div>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            Select Availability for {currentDate}
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
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={saveAvailability}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
