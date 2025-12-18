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

  // ================= FETCH PROFILE =================
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

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // ================= UPDATE PROFILE =================
 
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


  // ================= CANCEL EDIT =================
  const handleCancel = () => {
    setProfile(originalProfile);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-xl rounded-xl w-full max-w-3xl p-8">

        {/* HEADER */}
        <div className="flex items-center justify-between border-b pb-4 mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            <i className="bi bi-person-circle mr-2"></i>
            User Profile
          </h2>

          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="btn btn-primary flex items-center gap-2"
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
              className={`mt-1 w-full rounded-lg border px-3 py-2 
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
              className={`mt-1 w-full rounded-lg border px-3 py-2 
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
              className={`mt-1 w-full rounded-lg border px-3 py-2 
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
              className={`mt-1 w-full rounded-lg border px-3 py-2 
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
              className={`mt-1 w-full rounded-lg border px-3 py-2 
              ${isEditing ? "bg-white" : "bg-gray-100 cursor-not-allowed"}`}
            />
          </div>
        </div>

        {/* ACTION BUTTONS */}
        {isEditing && (
          <div className="flex justify-end gap-4 mt-8">
            <button
              onClick={handleCancel}
              className="btn btn-outline-secondary flex items-center gap-2"
            >
              <i className="bi bi-x-circle"></i>
              Cancel
            </button>

            <button
              onClick={handleUpdate}
              disabled={loading}
              className="btn btn-success flex items-center gap-2"
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
