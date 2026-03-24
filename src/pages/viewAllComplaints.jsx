import { useEffect, useState } from "react";
import api from "../config/axiosinstance";

const ViewAllComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchComplaints();
  }, []);

  useEffect(() => {
    applyFilter();
  }, [statusFilter, complaints]);

  const fetchComplaints = async () => {
    try {
      const res = await api.get("/viewAllcomplaints");
      const complaintsArray = res.data.data || [];
      setComplaints(complaintsArray);
      setFilteredComplaints(complaintsArray);
    } catch (err) {
      setError("Failed to load complaints");
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = () => {
    if (statusFilter === "all") {
      setFilteredComplaints(complaints);
    } else {
      setFilteredComplaints(
        complaints.filter((c) => c.status === statusFilter)
      );
    }
  };

  const updateStatus = async (id, status) => {
    try {
      setUpdatingId(id);
      await api.put(`/complaints/${id}/status`, { status });

      setComplaints((prev) =>
        prev.map((c) =>
          c._id === id
            ? {
                ...c,
                status,
                resolvedAt: status === "resolved" ? new Date() : null,
              }
            : c
        )
      );
    } catch (err) {
      alert("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "resolved":
        return "bg-green-500";
      case "rejected":
        return "bg-red-500";
      default:
        return "bg-yellow-500";
    }
  };

  if (loading) return <p className="text-center mt-5">Loading...</p>;
  if (error) return <p className="text-center text-red-500 mt-5">{error}</p>;

  return (
    <div className="max-w-7xl mx-auto mt-6 px-4">

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Complaints Management</h2>

        <select
          className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="resolved">Resolved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full border border-gray-200">

          {/* Head */}
          <thead className="bg-gray-800 text-white text-sm">
            <tr>
              <th className="px-3 py-2 border">#</th>
              <th className="px-3 py-2 border">Id</th>
              <th className="px-3 py-2 border">User</th>
              <th className="px-3 py-2 border">Provider</th>
              <th className="px-3 py-2 border">Complaint</th>
              <th className="px-3 py-2 border">Status</th>
              <th className="px-3 py-2 border">Created At</th>
              <th className="px-3 py-2 border">Resolved At</th>
              <th className="px-3 py-2 border">Update</th>
            </tr>
          </thead>

          {/* Body */}
          <tbody className="text-sm">
            {filteredComplaints.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center py-4">
                  No complaints found
                </td>
              </tr>
            ) : (
              filteredComplaints.map((complaint, index) => (
                <tr key={complaint._id} className="hover:bg-gray-50">

                  <td className="px-3 py-2 border">{index + 1}</td>

                  <td className="px-3 py-2 border break-all">
                    {complaint._id}
                  </td>

                  <td className="px-3 py-2 border">
                    {complaint.user_id?.name || "N/A"}
                    <br />
                    <span className="text-gray-500 text-xs">
                      {complaint.user_id?.email}
                    </span>
                  </td>

                  <td className="px-3 py-2 border">
                    {complaint.provider_id?.name || "N/A"}
                    <br />
                    <span className="text-gray-500 text-xs">
                      {complaint.provider_id?.email}
                    </span>
                  </td>

                  <td className="px-3 py-2 border max-w-xs break-words">
                    {complaint.complaints_text}
                  </td>

                  <td className="px-3 py-2 border">
                    <span
                      className={`text-white px-3 py-1 rounded-full text-xs ${getStatusBadge(
                        complaint.status
                      )}`}
                    >
                      {complaint.status}
                    </span>
                  </td>

                  <td className="px-3 py-2 border">
                    {new Date(complaint.createdAt).toLocaleDateString()}
                  </td>

                  <td className="px-3 py-2 border">
                    {complaint.resolvedAt
                      ? new Date(complaint.resolvedAt).toLocaleDateString()
                      : "—"}
                  </td>

                  <td className="px-3 py-2 border">
                    <select
                      className="border rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                      disabled={updatingId === complaint._id}
                      value={complaint.status}
                      onChange={(e) =>
                        updateStatus(complaint._id, e.target.value)
                      }
                    >
                      <option value="pending">Pending</option>
                      <option value="resolved">Resolved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewAllComplaints;