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

  /* -------- SAFE STATE -------- */
  const state = location.state || {};
  const {
    formData,
    booking_dates,
    totalAmount
  } = state;

  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* -------- INIT PAYMENT -------- */
  useEffect(() => {
    if (!totalAmount) {
      setError("Invalid payment amount");
      return;
    }

    api.post("/create-payment-intent", { totalAmount })
      .then(res => setClientSecret(res.data.clientSecret))
      .catch(() => setError("Failed to initialize payment"));
  }, [totalAmount]);

  /* -------- SUBMIT -------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements || !clientSecret) return;

    setLoading(true);
    setError("");

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (result.error) {
      setError(result.error.message);
      setLoading(false);
      return;
    }

    if (result.paymentIntent.status === "succeeded") {
      try {
        await api.post("/createbooking", {
          ...formData,
          booking_dates,
          payment_id: result.paymentIntent.id,
        });

        navigate("/booking-success");
      } catch {
        setError("Payment succeeded, but booking failed");
      }
    }

    setLoading(false);
  };

  if (!clientSecret) {
    return (
      <div className="text-center mt-20">
        <p className="text-gray-500">Loading payment form...</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 border rounded shadow bg-white"
    >
      <h2 className="text-xl font-bold mb-4 text-center">
        Pay Advance (8%)
      </h2>

      {/* CARD INPUT */}
      <div className="p-4 border rounded mb-4">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#32325d",
                "::placeholder": {
                  color: "#a0aec0",
                },
              },
              invalid: {
                color: "#fa755a",
              },
            },
          }}
        />
      </div>

      {error && (
        <p className="text-red-600 text-sm mb-3 text-center">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        {loading ? "Processing..." : `Pay ₹${totalAmount}`}
      </button>

      {/* TEST CARD INFO */}
      <p className="text-xs text-gray-500 mt-3 text-center">
        Test card: <b>4242 4242 4242 4242</b> | Any future date | Any CVV
      </p>
    </form>
  );
};

/* ============================
   PAYMENT PAGE WRAPPER
============================ */
const PaymentPage = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};

export default PaymentPage;
