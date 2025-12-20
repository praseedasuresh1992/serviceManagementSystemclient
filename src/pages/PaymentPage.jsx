import React, { useEffect, useState } from "react";
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import { stripePromise } from "../Stripe";
import api from "../config/axiosinstance";
import { useLocation, useNavigate } from "react-router-dom";

/* ============================
   CHECKOUT FORM
============================ */
const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state || {};
  const { formData = {}, booking_dates = [], totalAmount = 0 } = state;

  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!totalAmount || totalAmount <= 0) {
      setError("Invalid payment amount");
      return;
    }

    const createPaymentIntent = async () => {
      try {
        const res = await api.post("/create-payment-intent", { totalAmount });
        setClientSecret(res.data.clientSecret);
      } catch {
        setError("Failed to initialize payment");
      }
    };

    createPaymentIntent();
  }, [totalAmount]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    setLoading(true);
    setError("");

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setError("Card element not found");
      setLoading(false);
      return;
    }

    try {
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      });

      if (result.error) {
        setError(result.error.message);
      } else if (result.paymentIntent?.status === "succeeded") {
        await api.post("/createbooking", {
          ...formData,
          booking_dates,
          payment_id: result.paymentIntent.id,
        });
        navigate("/booking-success");
      } else {
        setError("Payment failed. Please try again.");
      }
    } catch {
      setError("Payment succeeded, but booking failed");
    }

    setLoading(false);
  };

  if (!clientSecret) {
    return (
      <div className="text-center mt-20 text-gray-300">
        Loading payment form...
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 rounded-lg shadow-lg bg-gray-900 text-white"
    >
      <h2 className="text-xl font-bold mb-4 text-center">
        Pay Advance (8%)
      </h2>

      {/* CARD INPUT */}
      <div className="p-4 border rounded mb-4 bg-gray-800">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#f9fafb",
                "::placeholder": { color: "#9ca3af" },
                backgroundColor: "#1f2937",
              },
              invalid: { color: "#f87171" },
            },
          }}
        />
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <p className="text-red-500 text-sm mb-3 text-center">{error}</p>
      )}

      {/* SUBMIT BUTTON */}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-blue-600 py-2 rounded hover:bg-blue-700 transition font-semibold"
      >
        {loading ? "Processing..." : `Pay ₹${totalAmount}`}
      </button>

      {/* TEST CARD INFO */}
      <p className="text-xs text-gray-400 mt-3 text-center">
        Test card: <b>4242 4242 4242 4242</b> | Any future date | Any CVV
      </p>
    </form>
  );
};

/* ============================
   PAYMENT PAGE WRAPPER
============================ */
const PaymentPage = () => (
  <Elements stripe={stripePromise}>
    <CheckoutForm />
  </Elements>
);

export default PaymentPage;
