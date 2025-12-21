import React, { useEffect, useState } from "react";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import api from "../config/axiosinstance";
import { useLocation, useNavigate } from "react-router-dom";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const location = useLocation();

  const { formData, booking_dates, totalAmount } = location.state || {};

  const [clientSecret, setClientSecret] = useState("");
  const [advanceAmount, setAdvanceAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Create PaymentIntent
  useEffect(() => {
    if (!totalAmount) return;

    api
      .post("/create-payment-intent", { totalAmount })
      .then((res) => {
        setClientSecret(res.data.clientSecret);
        setAdvanceAmount(res.data.advanceAmount);
      })
      .catch(() => setError("Failed to initialize payment"));
  }, [totalAmount]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      setError("Payment not ready");
      return;
    }

    setLoading(true);

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (result.error) {
      setError(result.error.message);
      setLoading(false);
    } else if (result.paymentIntent.status === "succeeded") {
      await api.post("/create-booking-after-payment", {
        ...formData,
        booking_dates,
        total_amount: totalAmount,
        advance_paid: advanceAmount,
        remaining_amount: totalAmount - advanceAmount,
        payment_id: result.paymentIntent.id,
        payment_type: "advance",
      });

      navigate("/booking-success");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md w-full mx-auto p-6 bg-gray-900 text-white rounded-lg shadow-lg"
    >
      <h2 className="text-xl font-bold mb-4 text-center">
        Pay Advance (8%)
      </h2>

      <p className="text-center mb-4 text-gray-300">
        Advance Amount: <span className="font-semibold">₹{advanceAmount}</span>
      </p>

      <div className="p-3 border rounded mb-4">
        <CardElement
          options={{
            style: {
              base: {
                color: "#ffffff",
                fontSize: "16px",
                "::placeholder": { color: "#aaaaaa" },
              },
              invalid: { color: "#ff4d4f" },
            },
          }}
        />
      </div>

      {error && <p className="text-red-500 mb-3">{error}</p>}

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded font-semibold"
      >
        {loading ? "Processing..." : `Pay ₹${advanceAmount}`}
      </button>

      <p className="text-xs text-gray-400 text-center mt-3">
        Test Card: 4242 4242 4242 4242 | Any future date | Any CVV
      </p>
    </form>
  );
};

const PaymentPage = () => (
  <Elements stripe={stripePromise}>
    <CheckoutForm />
  </Elements>
);

export default PaymentPage;
