import React, { useEffect, useState } from "react";
import api from "../../config/axiosinstance";
import { Outlet, useNavigate, useMatch } from "react-router-dom";

function ViewProviderProfile() {
  const navigate = useNavigate();

  const isUpdatePage = useMatch(
    "/providerDashboard/viewprovider/updateprovider"
  );

  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProvider = async () => {
      try {
        const res = await api.get("/viewMyProviderProfile");
        setProvider(res.data.data);
      } catch (err) {
        console.error("Error loading provider profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProvider();
  }, []);

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-600">Loading...</p>
    );

  if (!provider)
    return (
      <p className="text-center mt-10 text-gray-600">
        No profile found
      </p>
    );

  return (
    <>
      {/* ================= VIEW PROFILE ================= */}
      {!isUpdatePage && (
        <div className="mt-10 px-4">
          <h2 className="text-2xl font-bold text-center mb-6">
            My Profile
          </h2>

          {/* Blocked Alert */}
          {provider.status === "blocked" && (
            <div className="max-w-2xl mx-auto mb-4 bg-red-100 text-red-700 px-4 py-3 rounded-lg text-center font-semibold">
              🚫 Your account is currently <strong>Blocked</strong> <br />
              Please wait for authorization from admin.
            </div>
          )}

          {/* Card */}
          <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Profile Image */}
              <div className="flex justify-center md:w-1/3">
                <img
                  src={
                    provider.profile_image?.url ||
                    "https://via.placeholder.com/150"
                  }
                  alt="Profile"
                  className="w-36 h-36 rounded-full object-cover border-4 border-indigo-500"
                />
              </div>

              {/* Details */}
              <div className="md:w-2/3">
                <h4 className="text-xl font-bold mb-2">
                  {provider.name}
                </h4>

                <p><span className="font-semibold">Email:</span> {provider.email}</p>
                <p><span className="font-semibold">Username:</span> {provider.username}</p>
                <p><span className="font-semibold">Contact No:</span> {provider.contactno}</p>
                <p><span className="font-semibold">Address:</span> {provider.address}</p>

                <p>
                  <span className="font-semibold">Available Locations:</span>{" "}
                  {provider.available_location?.join(", ") || "Not specified"}
                </p>

                <p>
                  <span className="font-semibold">Service Category:</span>{" "}
                  {provider.service_category?.category_name || "Not assigned"}
                </p>

                <p>
                  <span className="font-semibold">Group:</span>{" "}
                  {provider.is_group ? "Yes" : "No"}
                </p>

                {provider.is_group && (
                  <p>
                    <span className="font-semibold">Members:</span>{" "}
                    {provider.members}
                  </p>
                )}

                <p>
                  <span className="font-semibold">Status:</span>{" "}
                  <span
                    className={`font-bold ${
                      provider.status === "active"
                        ? "text-green-600"
                        : provider.status === "blocked"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {provider.status?.toUpperCase()}
                  </span>
                </p>

                {/* Documents */}
                <div className="mt-3">
                  <span className="font-semibold">
                    Verification Documents:
                  </span>

                  {provider.verification_document?.length > 0 ? (
                    provider.verification_document.map((doc, index) => (
                      <div key={index}>
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-indigo-600 hover:underline"
                        >
                          Document {index + 1}
                        </a>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">
                      No documents uploaded
                    </p>
                  )}
                </div>

                {/* Button */}
                <div className="mt-5">
                  <button
                    onClick={() =>
                      navigate(
                        "/providerDashboard/viewprovider/updateprovider"
                      )
                    }
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                  >
                    Update Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= UPDATE FORM ================= */}
      <Outlet />
    </>
  );
}

export default ViewProviderProfile;