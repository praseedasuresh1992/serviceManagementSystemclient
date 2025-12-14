import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

const ViewComplaintsById = () => {
  const { id } = useParams(); 
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await axiosInstance.get(
          `/viewcomplaintsById/${id}`
        );

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

  if (loading) return <p className="p-4">Loading complaints...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">
        Complaints for Provider ID: {id}
      </h2>

      {complaints.length === 0 ? (
        <p>No complaints found for this provider.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">#</th>
              <th className="border p-2">User</th>
              <th className="border p-2">Complaint</th>
              <th className="border p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((c, idx) => (
              <tr key={c._id}>
                <td className="border p-2">{idx + 1}</td>
                <td className="border p-2">
                  {c.user_id?.name || "N/A"}
                </td>
                <td className="border p-2">
                  {c.message}
                </td>
                <td className="border p-2">
                  {c.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ViewComplaintsById;
