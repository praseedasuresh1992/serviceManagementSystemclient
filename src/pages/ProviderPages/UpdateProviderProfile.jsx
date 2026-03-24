import React, { useEffect, useState } from "react";
import api from "../../config/axiosinstance";
import { useNavigate } from "react-router-dom";

function UpdateProviderProfile() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    username: "",
    contactno: "",
    address: "",
    available_location: "",
    is_group: false,
    members: 1
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // ================= FETCH EXISTING PROFILE =================
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/viewMyProviderProfile");
        const p = res.data.data;

        setForm({
          name: p.name || "",
          email: p.email || "",
          username: p.username || "",
          contactno: p.contactno || "",
          address: p.address || "",
          available_location: p.available_location?.join(", ") || "",
          is_group: p.is_group || false,
          members: p.members || 1
        });
      } catch (err) {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });
  };

  // ================= SUBMIT UPDATE =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = {
        ...form,
        available_location: form.available_location
          .split(",")
          .map((loc) => loc.trim())
      };

      await api.post("/updateprovider", payload);

      navigate("/providerDashboard/viewprovider", {
        state: { refresh: true }
      });

    } catch (err) {
      setError("Update failed. Please check your details.");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center mt-10">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="mt-10 px-4">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-2xl p-6">
        <h3 className="text-2xl font-bold text-center mb-6">
          Update Profile
        </h3>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="mb-4">
            <label className="block mb-1 font-medium">Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block mb-1 font-medium">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Username */}
          <div className="mb-4">
            <label className="block mb-1 font-medium">Username</label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Contact */}
          <div className="mb-4">
            <label className="block mb-1 font-medium">Contact Number</label>
            <input
              name="contactno"
              value={form.contactno}
              onChange={handleChange}
              pattern="[0-9]{10}"
              required
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-sm text-gray-500 mt-1">
              Enter 10-digit mobile number
            </p>
          </div>

          {/* Address */}
          <div className="mb-4">
            <label className="block mb-1 font-medium">Address</label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Locations */}
          <div className="mb-4">
            <label className="block mb-1 font-medium">
              Available Locations
            </label>
            <input
              name="available_location"
              value={form.available_location}
              onChange={handleChange}
              placeholder="Kochi, Trivandrum, Thrissur"
              required
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Checkbox */}
          <div className="mb-4 flex items-center gap-2">
            <input
              type="checkbox"
              name="is_group"
              checked={form.is_group}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <label className="font-medium">Is Group?</label>
          </div>

          {/* Members */}
          {form.is_group && (
            <div className="mb-4">
              <label className="block mb-1 font-medium">Members</label>
              <input
                type="number"
                min="1"
                name="members"
                value={form.members}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Update Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateProviderProfile;