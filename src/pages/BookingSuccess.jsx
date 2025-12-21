
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

    const createBooking = async () => {
      try {
        const bookingPayload = {
          provider_id: JSON.parse(localStorage.getItem("booking_provider_id")),
          category_id: JSON.parse(localStorage.getItem("booking_category_id")),
          booking_dates: JSON.parse(localStorage.getItem("booking_dates")),
          location: JSON.parse(localStorage.getItem("booking_location")),
          session_id
        };

        await api.post(
          "/createbooking",
          bookingPayload,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        navigate("ViewMyBookings");
      } catch (error) {
        console.error(error);
        alert("Booking creation failed");
      }
    };

    createBooking();
  }, []);

  return <h2>Processing your booking...</h2>;
};

export default BookingSuccess;
