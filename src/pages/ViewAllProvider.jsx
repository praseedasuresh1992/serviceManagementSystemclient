import { useEffect, useState } from "react";
import api from "../config/axiosinstance";
import { BadgeCheck, CircleX } from "lucide-react";

export default function ViewAllProvider() {
  const [providers, setProviders] = useState([]);

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      const res = await api.get("/viewallproviders");
      setProviders(res.data.providers || []);
    } catch (err) {
      console.error("Fetch providers error:", err);
    }
  };

  // ✅ Verify / Unverify
  const toggleVerifyProvider = async (provider) => {
    try {
      await api.put(`/admin/verifyprovider/${provider._id}`, {
        verified: !provider.verified,
      });
      fetchProviders();
    } catch (err) {
      console.error("Verify provider error:", err);
    }
  };

  // ✅ Block / Activate
  const toggleProviderStatus = async (provider) => {
    try {
      await api.put(`/admin/verifyprovider/${provider._id}`, {
        status: provider.status === "active" ? "blocked" : "active",
      });
      fetchProviders();
    } catch (err) {
      console.error("Update status error:", err);
    }
  };

  return (
    <div className="container py-4">
      <div className="row g-4">
        {providers.map((p) => (
          <div className="col-md-6" key={p._id}>
            <div className="card shadow rounded-3 p-4">

              {/* Profile Image */}
              <div className="d-flex align-items-center gap-3 mb-3">
                <img
                  src={p.profile_image?.url || "/default-avatar.png"}
                  alt="provider"
                  className="rounded-circle"
                  width="70"
                  height="70"
                />
                <div>
                  <h5 className="fw-bold mb-0">{p.name}</h5>
                  <small className="text-muted">{p.email}</small>
                </div>
              </div>

              <p><strong>Contact:</strong> {p.contactno}</p>
              <p><strong>Address:</strong> {p.address}</p>

              <p>
                <strong>Service Category:</strong>{" "}
                {p.service_category?.name || "Not Assigned"}
              </p>

              <p>
                <strong>Locations:</strong>{" "}
                {p.available_location?.join(", ")}
              </p>

              <p>
                <strong>Group:</strong>{" "}
                {p.is_group ? "Yes" : "No"} |{" "}
                <strong>Members:</strong> {p.members}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={`fw-bold ${
                    p.status === "active"
                      ? "text-success"
                      : p.status === "blocked"
                      ? "text-danger"
                      : "text-warning"
                  }`}
                >
                  {p.status}
                </span>
              </p>

              <p>
                <strong>Verified:</strong>{" "}
                {p.verified ? "Yes" : "No"}
              </p>

              {/* Verification Documents */}
              {p.verification_document?.length > 0 && (
                <div className="mb-2">
                  <strong>Verification Docs:</strong>
                  <div className="d-flex gap-2 flex-wrap mt-1">
                    {p.verification_document.map((doc, i) => (
                      <a
                        key={i}
                        href={doc.url}
                        target="_blank"
                        rel="noreferrer"
                        className="badge bg-secondary text-decoration-none"
                      >
                        View Doc {i + 1}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="d-flex gap-3 mt-3">
                <button
                  onClick={() => toggleVerifyProvider(p)}
                  className="btn btn-primary rounded-pill d-flex align-items-center gap-2"
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
                  className={`btn rounded-pill ${
                    p.status === "active" ? "btn-warning" : "btn-success"
                  }`}
                >
                  {p.status === "active" ? "Block" : "Activate"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
