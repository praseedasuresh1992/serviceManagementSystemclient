import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../config/axiosinstance";

const BookingSuccess = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const session_id = params.get("session_id");
    const stored = localStorage.getItem("booking_payload");

    if (!session_id || !stored) {
      alert("Invalid or missing booking data");
      return;
    }

    const bookingPayload = {
      ...JSON.parse(stored),
      session_id,
    };

    api.post("/createbooking", bookingPayload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(() => {
        // ✅ CLEANUP
        localStorage.removeItem("booking_payload");
        navigate("/userDashboard/ViewMyBookings");
      })
      .catch((error) => {
        console.error(error.response?.data || error);
        alert("Booking creation failed");
      });
  }, []);

  return <h2>Your request submitted successfully.. Thank You</h2>;
};

export default BookingSuccess;
