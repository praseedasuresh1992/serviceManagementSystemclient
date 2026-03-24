import React, { useEffect, useState } from "react";
import api from "../../config/axiosinstance";

const UpdateUserProfile = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    username: "",
    contactno: "",
    address: ""
  });

  const [originalProfile, setOriginalProfile] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/ViewMyUserProfile");
      setProfile(res.data.data);
      setOriginalProfile(res.data.data);
    } catch (error) {
      console.error(error);
      alert("Failed to load profile");
    }
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);

      const updateData = {
        name: profile.name,
        email: profile.email,
        address: profile.address,
        contactno: profile.contactno,
        username: profile.username
      };

      await api.put("/updateMyUserProfile", updateData);

      alert("Profile updated successfully");
      setIsEditing(false);
      fetchProfile();
    } catch (error) {
      alert(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setProfile(originalProfile);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-3xl p-8">

        {/* HEADER */}
        <div className="flex items-center justify-between border-b pb-4 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <i className="bi bi-person-circle"></i>
            User Profile
          </h2>

          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              <i className="bi bi-pencil-square"></i>
              Edit Profile
            </button>
          )}
        </div>

        {/* FORM */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* NAME */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              disabled={!isEditing}
              className={`mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500
              ${isEditing ? "bg-white" : "bg-gray-100 cursor-not-allowed"}`}
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              disabled={!isEditing}
              className={`mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500
              ${isEditing ? "bg-white" : "bg-gray-100 cursor-not-allowed"}`}
            />
          </div>

          {/* USERNAME */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={profile.username}
              onChange={handleChange}
              disabled={!isEditing}
              className={`mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500
              ${isEditing ? "bg-white" : "bg-gray-100 cursor-not-allowed"}`}
            />
          </div>

          {/* CONTACT */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Contact Number
            </label>
            <input
              type="text"
              name="contactno"
              value={profile.contactno}
              onChange={handleChange}
              disabled={!isEditing}
              className={`mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500
              ${isEditing ? "bg-white" : "bg-gray-100 cursor-not-allowed"}`}
            />
          </div>

          {/* ADDRESS */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <textarea
              rows="3"
              name="address"
              value={profile.address}
              onChange={handleChange}
              disabled={!isEditing}
              className={`mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500
              ${isEditing ? "bg-white" : "bg-gray-100 cursor-not-allowed"}`}
            />
          </div>
        </div>

        {/* ACTION BUTTONS */}
        {isEditing && (
          <div className="flex justify-end gap-4 mt-8">
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 border border-gray-400 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
            >
              <i className="bi bi-x-circle"></i>
              Cancel
            </button>

            <button
              onClick={handleUpdate}
              disabled={loading}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
            >
              <i className="bi bi-check-circle"></i>
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdateUserProfile;