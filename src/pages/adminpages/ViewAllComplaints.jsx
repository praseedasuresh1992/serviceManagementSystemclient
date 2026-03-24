import React, { useEffect, useState } from "react";
import api from "../../config/axiosinstance";

const ViewAllComplaints = () => {
  const [complaints, setComplaints] = useState([]);

  const fetchComplaints = async () => {
    try {
      const res = await api.get("/viewAllcomplaints");
      setComplaints(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/complaints/${id}/status`, { status });
      fetchComplaints();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  return (
    <div className="max-w-6xl mx-auto mt-6 px-4">
      <h3 className="text-2xl font-semibold mb-4">All Complaints</h3>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">User</th>
              <th className="px-4 py-2 text-left">Provider</th>
              <th className="px-4 py-2 text-left">Complaint</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Created</th>
              <th className="px-4 py-2 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {complaints.map((c) => (
              <tr key={c._id} className="border-t">
                <td className="px-4 py-2">
                  {c.user_id?.name || "N/A"}
                </td>
                <td className="px-4 py-2">
                  {c.provider_id?.name || "N/A"}
                </td>
                <td className="px-4 py-2">
                  {c.complaints_text}
                </td>

                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded text-white text-sm ${
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

                <td className="px-4 py-2">
                  {new Date(c.createdAt).toLocaleDateString()}
                </td>

                <td className="px-4 py-2">
                  {c.status === "pending" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateStatus(c._id, "resolved")}
                        className="px-3 py-1 text-sm bg-green-600 hover:bg-green-700 text-white rounded"
                      >
                        Resolve
                      </button>

                      <button
                        onClick={() => updateStatus(c._id, "rejected")}
                        className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewAllComplaints;