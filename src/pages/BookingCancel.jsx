import { useNavigate } from "react-router-dom";

const BookingCancel = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center">
        
        <h1 className="text-2xl font-bold text-red-600 mb-3">
          Payment Cancelled
        </h1>

        <p className="text-gray-600 mb-6 leading-relaxed">
          Your payment was not completed.  
          No money has been deducted from your account.
        </p>

        {/* ACTION BUTTONS (kept commented as-is) */}
        {/*
        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate("/create-booking")}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
          >
            Try Booking Again
          </button>

          <button
            onClick={() => navigate("/")}
            className="border border-gray-300 hover:bg-gray-100 py-2 rounded-lg transition"
          >
            Go to Home
          </button>
        </div>
        */}

      </div>
    </div>
  );
};

export default BookingCancel;