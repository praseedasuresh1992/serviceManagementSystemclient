import React, { useState } from "react";
import api from "../config/axiosinstance";

const AddComplaint = () => {
  const [complaintType, setComplaintType] = useState("system");
  const [providerId, setProviderId] = useState("");
  const [complaintText, setComplaintText] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const payload = {
        complaints_text: complaintText
      };

      if (complaintType === "provider") {
        payload.provider_id = providerId;
      }

      await api.post("/addcomplaints", payload);

      setSuccess("Complaint submitted successfully");
      setComplaintText("");
      setProviderId("");
      setComplaintType("system");

    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 px-4">
      <h3 className="text-2xl font-bold mb-4">Add Complaint</h3>

      {/* SUCCESS */}
      {success && (
        <div className="mb-4 p-3 rounded-lg bg-green-100 text-green-700">
          {success}
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-xl p-6 space-y-4"
      >

        {/* Complaint Type */}
        <div>
          <label className="block mb-1 font-medium">
            Complaint Type
          </label>
          <select
            value={complaintType}
            onChange={(e) => setComplaintType(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="system">System / App Issue</option>
            <option value="provider">Service Provider</option>
          </select>
        </div>

        {/* Provider ID */}
        {complaintType === "provider" && (
          <div>
            <label className="block mb-1 font-medium">
              Provider ID
            </label>
            <input
              type="text"
              value={providerId}
              onChange={(e) => setProviderId(e.target.value)}
              required
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        )}

        {/* Complaint Text */}
        <div>
          <label className="block mb-1 font-medium">
            Complaint
          </label>
          <textarea
            rows={4}
            value={complaintText}
            onChange={(e) => setComplaintText(e.target.value)}
            required
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          Submit Complaint
        </button>
      </form>
    </div>
  );
};

export default AddComplaint;