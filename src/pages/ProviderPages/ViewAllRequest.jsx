import React, { useEffect, useState } from "react";
import api from "../../config/axiosinstance"
import { format, differenceInDays } from "date-fns";

const ViewAllRequest = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH PROVIDER BOOKINGS ================= */
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await api.get("/viewAllBooking"); // provider route
      setBookings(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch bookings", error);
    } finally {
      setLoading(false);
    }
  };

  /* ================= STATUS UPDATE ================= */
  const updateStatus = async (bookingId, status) => {
    try {
      await api.put(`/updateBookingStatus/${bookingId}`, { status });
      fetchBookings();
    } catch (error) {
      console.error("Status update failed", error);
    }
  };

  /* ================= DATE RULE ================= */
  const canCancelAccepted = (bookingDates) => {
    if (!bookingDates?.length) return false;
    const firstDate = new Date(bookingDates[0].date);
    const today = new Date();
    return differenceInDays(firstDate, today) >= 7;
  };

  if (loading) {
    return <div className="text-center mt-10">Loading bookings...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Booking Requests</h1>

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-6 py-3">Customer</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">Dates</th>
              <th className="px-6 py-3">Location</th>
              <th className="px-6 py-3">Amount</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((booking) => (
              <tr key={booking._id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">
                  {booking.user_id?.username || "N/A"}
                </td>

                <td className="px-6 py-4">
                  {booking.category_id?.category_name || "N/A"}
                </td>

                <td className="px-6 py-4">
                  {booking.booking_dates.map((d, i) => (
                    <div key={i}>
                      {format(new Date(d.date), "dd MMM yyyy")} ({d.slot})
                    </div>
                  ))}
                </td>

                <td className="px-6 py-4">{booking.location}</td>

                <td className="px-6 py-4 font-semibold">
                  ₹{booking.total_amount}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium
                      ${
                        booking.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : booking.status === "accepted"
                          ? "bg-blue-100 text-blue-700"
                          : booking.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                  >
                    {booking.status}
                  </span>
                </td>

                {/* ================= ACTIONS ================= */}
                <td className="px-6 py-4 space-x-2">
                  {booking.status === "pending" && (
                    <>
                      <button
                        onClick={() =>
                          updateStatus(booking._id, "accepted")
                        }
                        className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                      >
                        Accept
                      </button>

                      <button
                        onClick={() =>
                          updateStatus(booking._id, "cancelled")
                        }
                        className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                      >
                        Cancel
                      </button>
                    </>
                  )}

                  {booking.status === "accepted" &&
                    canCancelAccepted(booking.booking_dates) && (
                      <button
                        onClick={() =>
                          updateStatus(booking._id, "cancelled")
                        }
                        className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                      >
                        Cancel
                      </button>
                    )}
                </td>
              </tr>
            ))}

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

export default ViewAllRequest;
