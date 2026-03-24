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
        localStorage.removeItem("booking_payload");
        navigate("/userDashboard/ViewMyBookings");
      })
      .catch((error) => {
        console.error(error.response?.data || error);
        alert("Booking creation failed");
      });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center">
        
        <h2 className="text-2xl font-bold text-green-600 mb-3">
          Booking Successful 🎉
        </h2>

        <p className="text-gray-600 leading-relaxed">
          Your request has been submitted successfully.
          <br />
          Redirecting to your bookings...
        </p>

      </div>
    </div>
  );
};

export default BookingSuccess;