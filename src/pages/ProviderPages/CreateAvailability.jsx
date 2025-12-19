import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Button, Modal, Form } from "react-bootstrap";
import api from "../../config/axiosinstance";

export default function CreateAvailability() {
  const [availability, setAvailability] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentDate, setCurrentDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");

  // ===============================
  // Date click
  // ===============================
  const handleDateClick = (date) => {
    const formatted = date.toISOString().split("T")[0];
    setCurrentDate(formatted);
    setSelectedSlot("");
    setShowModal(true);
  };

  // ===============================
  // Save slot for date
  // ===============================
  const saveSlot = () => {
    if (!selectedSlot) {
      alert("Please select a slot");
      return;
    }

    const exists = availability.some(
      (a) => a.date === currentDate && a.slot === selectedSlot
    );

    if (exists) {
      alert("This slot already exists for selected date");
      return;
    }

    setAvailability([
      ...availability,
      { date: currentDate, slot: selectedSlot }
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
  // Highlight calendar dates
  // ===============================
  const tileClassName = ({ date }) => {
    const formatted = date.toISOString().split("T")[0];
    return availability.some((a) => a.date === formatted)
      ? "bg-success text-white rounded-circle"
      : "";
  };

  // ===============================
  // Submit to backend
  // ===============================
  const submitHandler = async () => {
    if (availability.length === 0) {
      alert("Select at least one availability");
      return;
    }

    try {
      const res = await api.post("/addProviderAvailability", {
        availability
      });

      alert(res.data.message || "Availability saved");
      setAvailability([]);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error saving availability");
    }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow p-4">
        <h3 className="text-center mb-3">Create Availability</h3>

        {/* Calendar */}
        <Calendar
          onClickDay={handleDateClick}
          tileClassName={tileClassName}
          minDate={new Date()}
        />

        {/* Selected availability */}
        <div className="mt-4">
          <h5>Selected Availability</h5>

          {availability.length === 0 && (
            <p className="text-muted">No availability selected</p>
          )}

          {availability.map((item, index) => (
            <div
              key={index}
              className="d-flex justify-content-between align-items-center border rounded p-2 mb-2"
            >
              <span>
                <strong>{item.date}</strong> — {item.slot}
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
          className="w-100 mt-3"
          variant="success"
          onClick={submitHandler}
        >
          Submit Availability
        </Button>
      </div>

      {/* SLOT MODAL */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Select Slot for {currentDate}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Check
              type="radio"
              name="slot"
              label="Day"
              checked={selectedSlot === "day"}
              onChange={() => setSelectedSlot("day")}
            />
            <Form.Check
              type="radio"
              name="slot"
              label="Evening"
              checked={selectedSlot === "evening"}
              onChange={() => setSelectedSlot("evening")}
            />
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={saveSlot}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
