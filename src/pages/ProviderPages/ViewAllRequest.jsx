import React, { useEffect, useState } from "react";
import api from "../../config/axiosinstance";
import { format, differenceInDays } from "date-fns";

const ProviderBookingRequests = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH BOOKINGS ================= */
  const fetchBookings = async () => {
    try {
      const res = await api.get("/viewAllBooking");
      setBookings(res.data.data || []);
    } catch (err) {
      console.error("Fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    const interval = setInterval(fetchBookings, 60000);
    return () => clearInterval(interval);
  }, []);

  /* ================= DATE HELPERS ================= */
  const getRemainingDays = (bookingDates) => {
    if (!bookingDates?.length) return null;
    return differenceInDays(new Date(bookingDates[0].date), new Date());
  };

  /* ================= STATUS CHANGE ================= */
  const handleStatusChange = async (booking, newStatus) => {
    const remainingDays = getRemainingDays(booking.booking_dates);

    if (newStatus === "rejected") {
      if (remainingDays < 7) {
        alert(
          "You can’t reject this booking because only 7 days remain.\nPlease contact the customer.\nPenalty may apply."
        );
        return;
      }

      const reason = prompt("Why are you rejecting this request?");
      if (!reason) {
        alert("Rejection reason is required");
        return;
      }

      try {
        await api.put(
          `/updateBookingStatus/${booking._id}/status`,
          { status: "rejected", rejection_reason: reason },
          { withCredentials: true }
        );
        fetchBookings();
      } catch (err) {
        console.error("Reject failed", err);
      }
    }

    if (newStatus === "accepted") {
      try {
        await api.put(
          `/updateBookingStatus/${booking._id}/status`,
          { status: "accepted" },
          { withCredentials: true }
        );
        fetchBookings();
      } catch (err) {
        console.error("Accept failed", err);
      }
    }

    if (newStatus === "completed") {
      const confirm = window.confirm(
        "Mark this booking as COMPLETED?\nThis action cannot be undone."
      );
      if (!confirm) return;

      try {
        await api.put(
          `/updateBookingStatus/${booking._id}/status`,
          { status: "completed" },
          { withCredentials: true }
        );
        fetchBookings();
      } catch (err) {
        console.error("Complete failed", err);
      }
    }
  };

  /* ================= CHAT HANDLER ================= */
  const openChat = (booking) => {
    window.location.href = `/provider/chat/${booking.user_id._id}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center mt-16">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">
        Provider Booking Requests
      </h1>

      <div className="overflow-x-auto bg-white shadow-md rounded-2xl">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs tracking-wider">
            <tr>
              <th className="px-5 py-3 text-left">Customer</th>
              <th className="px-5 py-3 text-left">Category</th>
              <th className="px-5 py-3 text-left">Dates</th>
              <th className="px-5 py-3 text-left">Location</th>
              <th className="px-5 py-3 text-left">Amount</th>
              <th className="px-5 py-3 text-left">Status</th>
              <th className="px-5 py-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((booking) => {
              const remainingDays = getRemainingDays(
                booking.booking_dates
              );

              return (
                <tr
                  key={booking._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="px-5 py-4 font-medium">
                    {booking.user_id?.username || "N/A"}
                  </td>

                  <td className="px-5 py-4">
                    {booking.category_id?.category_name}
                  </td>

                  <td className="px-5 py-4">
                    {booking.booking_dates.map((d, i) => (
                      <div key={i}>
                        {format(new Date(d.date), "dd MMM yyyy")} (
                        {d.availability_type})
                      </div>
                    ))}
                    {remainingDays !== null && (
                      <div className="text-xs text-gray-500 mt-1">
                        {remainingDays} days remaining
                      </div>
                    )}
                  </td>

                  <td className="px-5 py-4">{booking.location}</td>

                  <td className="px-5 py-4 font-semibold text-indigo-600">
                    ₹{booking.total_amount}
                  </td>

                  <td className="px-5 py-4 capitalize">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold
                        ${
                          booking.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : booking.status === "accepted"
                            ? "bg-blue-100 text-blue-700"
                            : booking.status === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                    >
                      {booking.status}
                    </span>
                  </td>

                  {/* ================= ACTIONS ================= */}
                  <td className="px-5 py-4 space-y-2">
                    {booking.status === "pending" && (
                      <select
                        defaultValue=""
                        onChange={(e) =>
                          handleStatusChange(booking, e.target.value)
                        }
                        className="w-full border border-gray-300 rounded-lg px-2 py-1 text-sm focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="" disabled>
                          Select Action
                        </option>
                        <option value="accepted">Accept</option>
                        <option value="rejected">Reject</option>
                      </select>
                    )}

                    {booking.status === "accepted" && (
                      <select
                        defaultValue=""
                        onChange={(e) =>
                          handleStatusChange(booking, e.target.value)
                        }
                        className="w-full border border-gray-300 rounded-lg px-2 py-1 text-sm focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="" disabled>
                          Select Action
                        </option>
                        <option value="completed">Mark as Completed</option>
                        <option value="rejected">Reject</option>
                      </select>
                    )}

                    {remainingDays < 7 && (
                      <button
                        onClick={() => openChat(booking)}
                        className="w-full px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700 transition"
                      >
                        Chat with Customer
                      </button>
                    )}

                    {["rejected", "completed"].includes(
                      booking.status
                    ) && (
                      <span className="text-xs text-gray-400">
                        No actions available
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}

            {bookings.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-8 text-gray-500">
                  No booking requests found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProviderBookingRequests;