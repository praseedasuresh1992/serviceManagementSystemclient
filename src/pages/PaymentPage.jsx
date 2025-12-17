import React, { useEffect, useState } from "react";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { stripePromise } from "../stripe";
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
    api.post("/create-payment-intent", {
      totalAmount
    }).then(res => {
      setClientSecret(res.data.clientSecret);
    });
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

        // ✅ Create booking AFTER payment success
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
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 border rounded">
      <h2 className="text-xl font-bold mb-4">Pay Advance (8%)</h2>

      <CardElement className="p-3 border rounded" />

      {error && <p className="text-red-600 mt-2">{error}</p>}

      <button
        type="submit"
        disabled={!stripe || loading}
        className="mt-4 w-full bg-blue-600 text-white p-2 rounded"
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
