import React, { useEffect, useState } from "react";
import api from "../../config/axiosinstance";

/* ⭐ Star Rating Component */
const StarRating = ({ rating, onChange }) => {
  return (
    <div className="flex gap-2 text-2xl relative z-50">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => onChange(star)}
          className={`cursor-pointer ${
            star <= rating ? "text-yellow-400" : "text-gray-300"
          }`}
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
      const res = await api.get("viewMyBookings", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setBookings(res.data.data || []);
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
          provider_id: booking.provider_id?._id,
          category_id: booking.category_id?._id,
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
    return (
      <div className="flex justify-center items-center mt-16">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto mt-10 px-4">
      <h2 className="text-2xl font-bold text-center mb-8">
        My Bookings
      </h2>

      {bookings.length === 0 ? (
        <p className="text-center text-gray-500">
          No bookings found
        </p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white shadow-lg rounded-2xl p-5 border"
            >
              <h5 className="text-lg font-semibold mb-2">
                {booking.category_id?.category_name || "N/A"}
              </h5>

              <p className="text-sm text-gray-700">
                <span className="font-semibold">Provider:</span>{" "}
                {booking.provider_id?.name || "N/A"} (
                {booking.provider_id?.available_location || "N/A"})
              </p>

              <div className="mt-2 text-sm text-gray-700">
                <span className="font-semibold">Date(s):</span>
                <ul className="list-disc list-inside ml-4">
                  {(booking.booking_dates || []).map((d, idx) => (
                    <li key={idx}>
                      {d?.date
                        ? new Date(d.date).toLocaleDateString()
                        : "Unknown date"}{" "}
                      — {String(d?.slot ?? "full_day").replace("_", " ")}
                    </li>
                  ))}
                </ul>
              </div>

              <p className="mt-2 text-sm">
                <span className="font-semibold">Amount:</span> ₹
                {booking.total_amount || 0}
              </p>

              {/* STATUS */}
              <span
                className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold text-white
                ${
                  booking.status === "completed"
                    ? "bg-green-600"
                    : booking.status === "accepted"
                    ? "bg-blue-600"
                    : booking.status === "pending"
                    ? "bg-yellow-500"
                    : "bg-gray-500"
                }`}
              >
                {booking.status}
              </span>

              {/* ❌ Rejection Reason */}
              {booking.status === "rejected" &&
                booking.rejection_reason && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700">
                      <span className="font-semibold">Reason:</span>{" "}
                      {booking.rejection_reason}
                    </p>
                  </div>
                )}

              {/* ⭐ Rating & Feedback */}
              {booking.status === "completed" &&
                !feedbackState[booking._id]?.submitted && (
                  <div className="mt-4 border-t pt-4">
                    <h6 className="font-semibold mb-2">
                      Rate this service
                    </h6>

                    <StarRating
                      rating={feedbackState[booking._id]?.rating || 0}
                      onChange={(value) =>
                        updateFeedback(booking._id, "rating", value)
                      }
                    />

                    <textarea
                      className="w-full border rounded-lg mt-3 p-2 text-sm focus:ring-2 focus:ring-blue-500"
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
                      className="w-full bg-blue-600 text-white py-2 mt-3 rounded-lg hover:bg-blue-700 transition"
                      onClick={() => submitFeedback(booking)}
                    >
                      Submit Feedback
                    </button>
                  </div>
                )}

              {feedbackState[booking._id]?.submitted && (
                <p className="text-green-600 mt-3 font-semibold text-sm">
                  ✔ Feedback submitted
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewMyBookings;