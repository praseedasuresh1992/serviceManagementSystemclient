import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../config/axiosinstance";

const ViewComplaintsById = () => {
  const { id } = useParams();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await api.get(`/viewcomplaintsById/${id}`);
        setComplaints(response.data.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch complaints");
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [id]);

  if (loading)
    return <p className="p-4 text-center">Loading complaints...</p>;

  if (error)
    return <p className="p-4 text-center text-red-500">{error}</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-5 text-center">
        Complaints for Provider ID: {id}
      </h2>

      {complaints.length === 0 ? (
        <p className="text-center text-gray-500">
          No complaints found for this provider.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow">
          <table className="min-w-full border border-gray-200">

            {/* Head */}
            <thead className="bg-gray-800 text-white text-sm">
              <tr>
                <th className="px-4 py-2 border">#</th>
                <th className="px-4 py-2 border">User</th>
                <th className="px-4 py-2 border">Complaint</th>
                <th className="px-4 py-2 border">Status</th>
              </tr>
            </thead>

            {/* Body */}
            <tbody className="text-sm">
              {complaints.map((c, idx) => (
                <tr key={c._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{idx + 1}</td>

                  <td className="px-4 py-2 border">
                    {c.user_id?.name || "N/A"}
                  </td>

                  <td className="px-4 py-2 border max-w-xs break-words">
                    {c.message}
                  </td>

                  <td className="px-4 py-2 border">
                    <span
                      className={`px-3 py-1 rounded-full text-white text-xs ${
                        c.status === "resolved"
                          ? "bg-green-500"
                          : c.status === "rejected"
                          ? "bg-red-500"
                          : "bg-yellow-500"
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}
    </div>
  );
};

export default ViewComplaintsById;