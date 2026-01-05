import React, { useEffect, useState } from "react";
import { Table, Button, Container, Badge } from "react-bootstrap";
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
      fetchComplaints(); // refresh list
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  return (
    <Container className="mt-4">
      <h3>All Complaints</h3>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>User</th>
            <th>Provider</th>
            <th>Complaint</th>
            <th>Status</th>
            <th>Created</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {complaints.map((c) => (
            <tr key={c._id}>
              <td>{c.user_id?.name || "N/A"}</td>
              <td>{c.provider_id?.name || "N/A"}</td>
              <td>{c.complaints_text}</td>
              <td>
                <Badge bg={
                  c.status === "resolved"
                    ? "success"
                    : c.status === "rejected"
                    ? "danger"
                    : "warning"
                }>
                  {c.status}
                </Badge>
              </td>
              <td>{new Date(c.createdAt).toLocaleDateString()}</td>

              <td>
                {c.status === "pending" && (
                  <>
                    <Button
                      size="sm"
                      variant="success"
                      className="me-2"
                      onClick={() => updateStatus(c._id, "resolved")}
                    >
                      Resolve
                    </Button>

                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => updateStatus(c._id, "rejected")}
                    >
                      Reject
                    </Button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default ViewAllComplaints;
