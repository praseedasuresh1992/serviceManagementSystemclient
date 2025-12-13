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
    // Use res.data.data instead of res.data
    setComplaints(res.data.data || []);
    setFilteredComplaints(res.data.data || []);
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

      await api.patch(`/api/complaints/${id}/status`, { status });

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
  if (error) return <p className="text-center text-danger mt-5">{error}</p>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="fw-bold">Complaints Management</h2>

        {/* 🔍 Status Filter */}
        <select
          className="form-select w-auto"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="resolved">Resolved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="table-responsive shadow rounded">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>User</th>
              <th>Provider</th>
              <th>Complaint</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Resolved At</th>
              <th>Update</th>
            </tr>
          </thead>

          <tbody>
            {filteredComplaints.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center">
                  No complaints found
                </td>
              </tr>
            ) : (
              filteredComplaints.map((complaint, index) => (
                <tr key={complaint._id}>
                  <td>{index + 1}</td>

                  <td>
                    {complaint.user_id?.name || "N/A"}
                    <br />
                    <small className="text-muted">
                      {complaint.user_id?.email}
                    </small>
                  </td>

                  <td>
                    {complaint.provider_id?.name || "N/A"}
                    <br />
                    <small className="text-muted">
                      {complaint.provider_id?.email}
                    </small>
                  </td>

                  <td className="max-w-xs break-words">
                    {complaint.complaints_text}
                  </td>

                  <td>
                    <span
                      className={`text-white px-3 py-1 rounded-full text-sm ${getStatusBadge(
                        complaint.status
                      )}`}
                    >
                      {complaint.status}
                    </span>
                  </td>

                  <td>
                    {new Date(complaint.createdAt).toLocaleDateString()}
                  </td>

                  <td>
                    {complaint.resolvedAt
                      ? new Date(complaint.resolvedAt).toLocaleDateString()
                      : "—"}
                  </td>

                  <td>
                    <select
                      className="form-select form-select-sm"
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
