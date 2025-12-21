import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../config/axiosinstance";

const BookingSuccess = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const session_id = params.get("session_id");
    if (!session_id) {
      alert("Invalid payment session");
      return;
    }

    const bookingPayload = {
      provider_id: JSON.parse(localStorage.getItem("booking_provider_id")),
      category_id: JSON.parse(localStorage.getItem("booking_category_id")),
      booking_dates: JSON.parse(localStorage.getItem("booking_dates")),
      location: JSON.parse(localStorage.getItem("booking_location")),
      session_id,
    };

    if (
      !bookingPayload.provider_id ||
      !bookingPayload.category_id ||
      !bookingPayload.booking_dates?.length ||
      !bookingPayload.location
    ) {
      alert("Booking details missing");
      return;
    }

    api.post("/createbooking", bookingPayload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    .then(() => {
      localStorage.removeItem("booking_provider_id");
      localStorage.removeItem("booking_category_id");
      localStorage.removeItem("booking_dates");
      localStorage.removeItem("booking_location");

      navigate("/userDashboard/ViewMyBookings");
    })
    .catch((error) => {
      console.error(error.response?.data || error);
      alert("Booking creation failed");
    });
  }, []);

  return <h2>Processing your booking...</h2>;
};

export default BookingSuccess;
