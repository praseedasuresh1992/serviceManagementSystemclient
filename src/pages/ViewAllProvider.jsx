import { useEffect, useState } from "react";
import { BadgeCheck, CircleX } from "lucide-react";
import api from "../config/axiosinstance";

export default function ViewAllProvider() {
  const [providers, setProviders] = useState([]);

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      const res = await api.get("/viewallproviders");
      setProviders(res.data || []);
    } catch (err) {
      console.error("Fetch providers error:", err);
    }
  };

  const toggleVerifyProvider = async (provider) => {
    try {
      await api.put(`/verifyprovider/${provider._id}`, {
        verified: !provider.verified,
      });
      fetchProviders();
    } catch (err) {
      console.error("Verify provider error:", err);
    }
  };

  const toggleProviderStatus = async (provider) => {
    try {
      await api.put(`/verifyprovider/${provider._id}`, {
        status: provider.status === "active" ? "blocked" : "active",
      });
      fetchProviders();
    } catch (err) {
      console.error("Update status error:", err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4">
      <div className="grid md:grid-cols-2 gap-6">
        {providers.map((p) => (
          <div
            key={p._id}
            className="bg-white shadow-lg rounded-2xl p-5 border"
          >
            {/* Profile */}
            <div className="flex items-center gap-4 mb-4">
              <img
                src={p.profile_image?.url || "/default-avatar.png"}
                alt="provider"
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h5 className="font-bold text-lg">{p.name}</h5>
                <p className="text-gray-500 text-sm">{p.email}</p>
                <p className="text-gray-400 text-xs">
                  <span className="font-semibold">ID:</span> {p._id}
                </p>
              </div>
            </div>

            <p className="text-sm">
              <span className="font-semibold">Contact:</span> {p.contactno}
            </p>

            <p className="text-sm">
              <span className="font-semibold">Address:</span> {p.address}
            </p>

            <p className="text-sm">
              <span className="font-semibold">Service Category:</span>{" "}
              {p.service_category?.name || "Not Assigned"}
            </p>

            <p className="text-sm">
              <span className="font-semibold">Locations:</span>{" "}
              {p.available_location?.join(", ")}
            </p>

            <p className="text-sm">
              <span className="font-semibold">Group:</span>{" "}
              {p.is_group ? "Yes" : "No"} |{" "}
              <span className="font-semibold">Members:</span> {p.members}
            </p>

            <p className="text-sm">
              <span className="font-semibold">Status:</span>{" "}
              <span
                className={`font-bold ${
                  p.status === "active"
                    ? "text-green-600"
                    : p.status === "blocked"
                    ? "text-red-600"
                    : "text-yellow-500"
                }`}
              >
                {p.status}
              </span>
            </p>

            <p className="text-sm">
              <span className="font-semibold">Verified:</span>{" "}
              {p.verified ? "Yes" : "No"}
            </p>

            {/* Docs */}
            {p.verification_document?.length > 0 && (
              <div className="mt-2">
                <p className="font-semibold text-sm">Verification Docs:</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {p.verification_document.map((doc, i) => (
                    <a
                      key={i}
                      href={doc.url}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-gray-500 text-white text-xs px-3 py-1 rounded-full hover:bg-gray-600 transition"
                    >
                      View Doc {i + 1}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => toggleVerifyProvider(p)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm transition"
              >
                {p.verified ? (
                  <>
                    <CircleX size={18} /> Unverify
                  </>
                ) : (
                  <>
                    <BadgeCheck size={18} /> Verify
                  </>
                )}
              </button>

              <button
                onClick={() => toggleProviderStatus(p)}
                className={`px-4 py-2 rounded-full text-sm text-white transition ${
                  p.status === "active"
                    ? "bg-yellow-500 hover:bg-yellow-600"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {p.status === "active" ? "Block" : "Activate"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}