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

    // auto refresh every 1 min (recommended)
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
    if (newStatus === "rejected") {
      const remainingDays = getRemainingDays(booking.booking_dates);

      // < 7 days → penalty rule
      if (remainingDays < 7) {
        alert(
          "You can’t reject this booking because only 7 days remain.\nPlease contact the customer through chat.\nPenalty fees may apply."
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
  };

  /* ================= CHAT HANDLER ================= */
  const openChat = (booking) => {
    // Example route — adjust to your chat implementation
    window.location.href = `/provider/chat/${booking.user_id._id}`;
  };

  if (loading) {
    return <div className="text-center mt-10">Loading bookings...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        Provider Booking Requests
      </h1>

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Dates</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
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
                  className="border-b hover:bg-gray-50"
                >
                  <td className="px-4 py-3">
                    {booking.user_id?.username || "N/A"}
                  </td>

                  <td className="px-4 py-3">
                    {booking.category_id?.category_name}
                  </td>

                  <td className="px-4 py-3">
                    {booking.booking_dates.map((d, i) => (
                      <div key={i}>
                        {format(new Date(d.date), "dd MMM yyyy")} (
                        {d.availability_type})
                      </div>
                    ))}
                    {remainingDays !== null && (
                      <div className="text-xs text-gray-500">
                        {remainingDays} days remaining
                      </div>
                    )}
                  </td>

                  <td className="px-4 py-3">{booking.location}</td>

                  <td className="px-4 py-3 font-semibold">
                    ₹{booking.total_amount}
                  </td>

                  <td className="px-4 py-3 capitalize">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium
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
                  <td className="px-4 py-3 space-y-2">
                    {/* Dropdown */}
                    {booking.status === "pending" && (
                      <select
                        defaultValue=""
                        onChange={(e) =>
                          handleStatusChange(
                            booking,
                            e.target.value
                          )
                        }
                        className="border rounded px-2 py-1 text-sm w-full"
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
                          handleStatusChange(
                            booking,
                            e.target.value
                          )
                        }
                        className="border rounded px-2 py-1 text-sm w-full"
                      >
                        <option value="" disabled>
                          Select Action
                        </option>
                        <option value="rejected">Reject</option>
                      </select>
                    )}

                    {/* Chat Button auto-enabled < 7 days */}
                    {remainingDays < 7 && (
                      <button
                        onClick={() => openChat(booking)}
                        className="w-full px-3 py-1 bg-indigo-600 text-white rounded text-xs hover:bg-indigo-700"
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
                <td
                  colSpan="7"
                  className="text-center py-6 text-gray-500"
                >
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
