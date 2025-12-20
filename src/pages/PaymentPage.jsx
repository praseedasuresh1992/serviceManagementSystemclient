import React, { useEffect, useState } from "react";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { stripePromise } from "../Stripe";
import api from "../config/axiosinstance";
import { useLocation, useNavigate } from "react-router-dom";

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const location = useLocation();

  const { formData, booking_dates, totalAmount } = location.state;

  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Create PaymentIntent
    api.post("/create-payment-intent", { totalAmount })
      .then(res => setClientSecret(res.data.clientSecret))
      .catch(err => setError("Failed to initialize payment"));
  }, [totalAmount]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (result.error) {
      setError(result.error.message);
      setLoading(false);
    } else {
      if (result.paymentIntent.status === "succeeded") {
        // Booking creation after successful payment
        await api.post("/create-booking-after-payment", {
          ...formData,
          booking_dates,
          payment_id: result.paymentIntent.id
        });
        navigate("/booking-success");
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg w-full mx-auto p-6 rounded-lg shadow-lg bg-gray-900 text-white"
    >
      <h2 className="text-2xl font-bold mb-6 text-center">Pay Advance (8%)</h2>

      <div className="mb-4">
        <CardElement
          options={{
            style: {
              base: {
                color: "#fff",
                fontSize: "16px",
                fontFamily: "sans-serif",
                "::placeholder": { color: "#aaa" },
                padding: "12px 14px",
              },
              invalid: { color: "#ff4d4f" },
            },
          }}
        />
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-blue-600 hover:bg-blue-700 transition-colors p-3 rounded-lg text-white font-semibold"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
};

const PaymentPage = () => (
  <Elements stripe={stripePromise}>
    <CheckoutForm />
  </Elements>
);

export default PaymentPage;
