import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Button, Modal, Form } from "react-bootstrap";
import api from "../../config/axiosinstance";

export default function CreateAvailability() {
  const [availability, setAvailability] = useState([]); 
  const [showModal, setShowModal] = useState(false);
  const [currentDate, setCurrentDate] = useState("");
  const [selectedSlots, setSelectedSlots] = useState([]);

  // when a date is clicked
  const handleDateClick = (date) => {
    const formatted = date.toISOString().split("T")[0];
    setCurrentDate(formatted);

    const existing = availability.find((a) => a.date === formatted);

    if (existing) {
      setSelectedSlots(existing.slots);
    } else {
      setSelectedSlots([]);
    }

    setShowModal(true);
  };

  // toggle slots
  const toggleSlot = (slot) => {
    if (selectedSlots.includes(slot)) {
      setSelectedSlots(selectedSlots.filter((s) => s !== slot));
    } else {
      setSelectedSlots([...selectedSlots, slot]);
    }
  };

  // save slot selection for the date
  const saveSlotSelection = () => {
    let updated = [...availability];

    updated = updated.filter((a) => a.date !== currentDate);

    if (selectedSlots.length > 0) {
      updated.push({
        date: currentDate,
        slots: selectedSlots,
      });
    }

    setAvailability(updated);
    setShowModal(false);
  };

  // highlight selected dates
  const tileClassName = ({ date }) => {
    const formatted = date.toISOString().split("T")[0];
    return availability.find((a) => a.date === formatted)
      ? "bg-blue-500 text-white rounded-full"
      : "";
  };

  const submitHandler = async () => {
    if (availability.length === 0) {
      alert("Please select atleast one date");
      return;
    }

    try {
      const res = await api.post("/addProviderAvailability", {
        availability,
      });

      alert("Availability Saved!");
      console.log(res.data);
    } catch (err) {
      alert("Error submitting");
      console.error(err);
    }
  };

  return (
    <div className="flex justify-center mt-10 px-4">
      <div className="w-full max-w-xl bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-center mb-4">
          Multi-Slot Availability
        </h2>

        {/* Calendar */}
        <Calendar
          onClickDay={handleDateClick}
          tileClassName={tileClassName}
          minDate={new Date()}
        />

        {/* Selected List */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold">Selected Availability</h3>
          <div className="space-y-3 mt-3">
            {availability.map((item, index) => (
              <div
                key={index}
                className="flex justify-between p-3 bg-gray-100 rounded-xl"
              >
                <span>{item.date}</span>
                <span className="font-semibold">{item.slots.join(", ")}</span>

                <button
                  className="bg-red-500 text-white px-3 py-1 rounded"
                  onClick={() =>
                    setAvailability(availability.filter((a) => a.date !== item.date))
                  }
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        <Button
          className="w-full mt-5 py-2 text-lg rounded-xl"
          variant="success"
          onClick={submitHandler}
        >
          Submit
        </Button>

        {/* SLOT SELECT MODAL */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Select Slot(s) for {currentDate}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form>
              <Form.Check
                type="checkbox"
                label="Day"
                checked={selectedSlots.includes("day")}
                onChange={() => toggleSlot("day")}
              />
              <Form.Check
                type="checkbox"
                label="Evening"
                checked={selectedSlots.includes("evening")}
                onChange={() => toggleSlot("evening")}
              />
            </Form>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>

            <Button variant="primary" onClick={saveSlotSelection}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}
