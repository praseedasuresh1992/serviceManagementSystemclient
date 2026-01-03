import React, { useEffect, useState } from "react";
import api from "../../config/axiosinstance";

const ProviderRating = ({ providerId }) => {
  const [ratings, setRatings] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRatings();
  }, [providerId]);

  const fetchRatings = async () => {
    try {
      console.log("pid:",providerId)
      const res = await api.get(`/providerrating/${providerId}`);
      console.log("FULL RESPONSE 👉", res.data);
    console.log("FIRST RATING 👉", res.data.data?.[0])
      setRatings(res.data.data || []);
setAvgRating(Number(res.data.averageRating) || 0);
      setTotalReviews(res.data.totalReviews);
      console.log("..",totalReviews)
            console.log(avgRating)

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="text-center mt-4">Loading ratings...</p>;
  }

  return (
    <div className="container mt-4">
      <h3 className="text-xl font-bold mb-2">Customer Reviews</h3>

      <div className="mb-4">
        <span className="text-lg font-semibold">
         ⭐ {avgRating.toFixed(1)} / 5

        </span>
        <span className="ml-2 text-gray-500">
          ({totalReviews} reviews)
        </span>
      </div>

      {ratings.length === 0 ? (
        <p className="text-gray-500">No reviews yet</p>
      ) : (
        ratings.map((r) => (
          <div
            key={r._id}
            className="border rounded p-3 mb-3 shadow-sm"
          >
            <div className="flex justify-between">
              <strong>{r.user_id?.name || "Anonymous"}</strong>
              <span className="text-sm text-gray-500">
                {new Date(r.createdAt).toLocaleDateString()}
              </span>
            </div>

            <p className="text-sm text-gray-600">
              Category: {r.category_id?.category_name}
            </p>

            <div className="text-yellow-500 text-lg">
              {"★".repeat(r.rating)}
              {"☆".repeat(5 - r.rating)}rating displays
            </div>
            <p>DEBUG RATING: {JSON.stringify(r.rating)}</p>

            <p className="mt-2">{r.feedback}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default ProviderRating;
