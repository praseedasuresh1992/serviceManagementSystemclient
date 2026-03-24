import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import api from "../../config/axiosinstance";

export default function CreateAvailability() {
  const [availability, setAvailability] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentDate, setCurrentDate] = useState("");
  const [availabilityType, setAvailabilityType] = useState("");

  const handleDateClick = (date) => {
    const formatted = date.toLocaleDateString("en-CA");
    setCurrentDate(formatted);
    setAvailabilityType("");
    setShowModal(true);
  };

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

    setAvailability((prev) => [
      ...prev,
      {
        date: currentDate,
        availability_type: availabilityType,
        is_available: true
      }
    ]);

    setShowModal(false);
  };

  const removeAvailability = (index) => {
    setAvailability((prev) => prev.filter((_, i) => i !== index));
  };

  const tileClassName = ({ date }) => {
    const formatted = date.toLocaleDateString("en-CA");
    return availability.some((a) => a.date === formatted)
      ? "bg-green-500 text-white rounded-full"
      : "";
  };

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
    <div className="max-w-2xl mx-auto mt-6 px-4">
      <div className="bg-white shadow-lg p-6 rounded-xl">
        <h3 className="text-xl font-semibold text-center mb-4">
          Provider Availability
        </h3>

        <Calendar
          onClickDay={handleDateClick}
          tileClassName={tileClassName}
          minDate={new Date()}
        />

        <div className="mt-4">
          <h5 className="font-medium mb-2">Selected Availability</h5>

          {availability.length === 0 && (
            <p className="text-gray-500">No availability added</p>
          )}

          {availability.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center border rounded-lg p-2 mb-2"
            >
              <span>
                <strong>{item.date}</strong> —{" "}
                {String(item.availability_type ?? "full_day").replace("_", " ")}
              </span>

              <button
                onClick={() => removeAvailability(index)}
                className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={submitHandler}
          className="w-full mt-3 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold"
        >
          Submit Availability
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
            
            <h3 className="text-lg font-semibold mb-4">
              Select Availability for {currentDate}
            </h3>

            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="availability"
                  checked={availabilityType === "full_day"}
                  onChange={() => setAvailabilityType("full_day")}
                />
                Full Day
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="availability"
                  checked={availabilityType === "half_day"}
                  onChange={() => setAvailabilityType("half_day")}
                />
                Half Day
              </label>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded"
              >
                Cancel
              </button>

              <button
                onClick={saveAvailability}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}