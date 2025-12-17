import React, { useEffect, useState } from "react";
import api from "../../config/axiosinstance";

/* ⭐ Star Rating Component */
const StarRating = ({ rating, onChange }) => {
  return (
    <div className="flex gap-1 text-xl cursor-pointer">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={star <= rating ? "text-yellow-400" : "text-gray-300"}
          onClick={() => onChange(star)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

const ViewMyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedbackState, setFeedbackState] = useState({});

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await api.get(
        "viewMyBookings",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setBookings(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateFeedback = (bookingId, field, value) => {
    setFeedbackState((prev) => ({
      ...prev,
      [bookingId]: {
        ...prev[bookingId],
        [field]: value,
      },
    }));
  };

  const submitFeedback = async (booking) => {
    const data = feedbackState[booking._id];

    if (!data?.rating || !data?.feedback) {
      alert("Please give star rating and feedback");
      return;
    }

    try {
      await api.post(
        "/createrating",
        {
          booking_id: booking._id,
          provider_id: booking.provider_id._id, // 🔗 linked to provider profile
          rating: data.rating,
          feedback: data.feedback,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("⭐ Feedback submitted successfully");

      // Optional: disable feedback after submit
      setFeedbackState((prev) => ({
        ...prev,
        [booking._id]: { submitted: true },
      }));
    } catch (error) {
      console.error(error);
      alert("Failed to submit feedback");
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Loading bookings...</div>;
  }

  return (
    <div className="container mx-auto mt-10 px-4">
      <h2 className="text-2xl font-bold text-center mb-6">My Bookings</h2>

      {bookings.length === 0 ? (
        <p className="text-center text-gray-500">No bookings found</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {bookings.map((booking) => (
            <div key={booking._id} className="card shadow-lg">
              <div className="card-body">
                <h5 className="card-title font-semibold">
                  {booking.category_id?.category_name}
                </h5>

                <p>
                  <strong>Provider:</strong> {booking.provider_id?.name}
                </p>

                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(booking.booking_date).toLocaleDateString()}
                </p>

                <p>
                  <strong>Amount:</strong> ₹{booking.amount}
                </p>

                <span
                  className={`badge ${
                    booking.status === "completed"
                      ? "bg-success"
                      : "bg-warning"
                  }`}
                >
                  {booking.status}
                </span>

                {/* ⭐ Rating & Feedback */}
                {booking.status === "completed" &&
                  !feedbackState[booking._id]?.submitted && (
                    <div className="mt-4 border-t pt-3">
                      <h6 className="font-semibold mb-2">
                        Rate this service
                      </h6>

                      <StarRating
                        rating={feedbackState[booking._id]?.rating || 0}
                        onChange={(value) =>
                          updateFeedback(
                            booking._id,
                            "rating",
                            value
                          )
                        }
                      />

                      <textarea
                        className="form-control mt-3"
                        rows="3"
                        placeholder="Write your feedback..."
                        onChange={(e) =>
                          updateFeedback(
                            booking._id,
                            "feedback",
                            e.target.value
                          )
                        }
                      />

                      <button
                        className="btn btn-primary w-full mt-3"
                        onClick={() => submitFeedback(booking)}
                      >
                        Submit Feedback
                      </button>
                    </div>
                  )}

                {feedbackState[booking._id]?.submitted && (
                  <p className="text-success mt-3 font-semibold">
                    ✔ Feedback submitted
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewMyBookings;
