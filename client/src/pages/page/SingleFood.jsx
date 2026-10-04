import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

const SingleFood = () => {
  const { id } = useParams(); // Get food ID from the URL
  const navigate = useNavigate(); // For navigation to the purchase page
  const [food, setFood] = useState(null); // Store food data
  const [loading, setLoading] = useState(true); // Loading state
  const [purchaseCount, setPurchaseCount] = useState(0); // Purchase count

  useEffect(() => {
    // Fetch single food details from the server
    const fetchFoodDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_Server_Host_Link}/foods/${id}`);
        const data = await response.json();
        setFood(data);
        setPurchaseCount(data.purchaseCount || 0);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching food details:", error);
        setLoading(false);
      }
    };

    fetchFoodDetails();
  }, [id]);

  const handlePurchase = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_Server_Host_Link}/foods/${id}/purchase`, {
        method: "POST",
      });
      if (response.ok) {
        setPurchaseCount((prevCount) => prevCount + 1);
        navigate(`/purchase/${id}`);
      } else {
        console.error("Failed to purchase the food.");
      }
    } catch (error) {
      console.error("Error handling purchase:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-ring loading-lg"></span>
      </div>
    );
  }

  if (!food) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Food not found!</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto min-h-screen px-4 pt-28">
      <h1 className="text-3xl text-center pb-5 font-bold mb-4">{food.name}</h1>
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Food Image */}
        <div className="w-full md:w-1/2">
          <img
            src={food.image}
            alt={food.name}
            className="rounded-lg shadow-lg max-h-96 w-full object-cover"
          />
        </div>

        {/* Food Details */}
        <div className="w-full md:w-1/2">
          <p className="text-lg text-gray-600 mb-4">{food.description}</p>
          <p className="text-lg font-semibold mb-4">
            <span className="text-gray-700">Price:</span> ${food.price}
          </p>
          <p className="text-lg font-semibold mb-4">
            <span className="text-gray-700">Category:</span> {food.category}
          </p>
          <p className="text-lg font-semibold mb-4">
            <span className="text-gray-700">Purchase Count:</span>{" "}
            {purchaseCount}
          </p>
          <button
            className="btn bg-yellow-700 hover:bg-yellow-800 text-white px-6 py-2 rounded-lg"
            onClick={handlePurchase}
          >
            Purchase Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default SingleFood;