import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-toastify";

const FoodPurchase = () => {
  const { id } = useParams();
  const [food, setFood] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Check if user is logged in
  useEffect(() => {
    if (!user) {
      toast.error("You need to log in to purchase food.");
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    // Fetch food details
    const fetchFoodDetails = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_Server_Host_Link}/foods/${id}`);
        const data = await response.json();
        setFood(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching food details:", error);
        setLoading(false);
      }
    };
    fetchFoodDetails();
  }, [id]);

  const handlePurchase = async () => {
    if (user.email === food.owner_email) {
      toast.error("You cannot purchase your own food item!");
      return;
    }

    const purchaseData = {
      foodId: food._id,
      foodName: food.name,
      foodImage: food.image,
      price: food.price,
      quantity,
      buyerName: user.name,
      buyerEmail: user.email,
      buyingDate: Date.now(),
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_Server_Host_Link}/purchase`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(purchaseData),
      });

      if (response.ok) {
        const res = await fetch(`${import.meta.env.VITE_Server_Host_Link}/foods/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ availableQuantity: food.quantity - quantity }),
        });
        console.log(res)
        toast.success("Purchase successful!");
        navigate("/myOrder");
      } else {
        toast.error("Failed to complete the purchase.");
      }
    } catch (error) {
      console.error("Error making purchase:", error);
      toast.error("Error completing the purchase.");
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
        <p> Food not found! </p>
      </div>
    );
  }

  const isOutOfStock = food.quantity === 0;

  return (
    <div className="container mx-auto px-4 pt-20">
      <div className="max-w-2xl mx-auto p-6 shadow-lg rounded-lg">
        <img
          src={food.image}
          alt={food.name}
          className="rounded-lg w-full max-h-96 object-cover mb-6"
        />
        <h1 className="text-3xl font-bold">{food.name}</h1>
        <p className="text-gray-600 mt-4">{food.description}</p>
        <p className="text-lg font-semibold mt-4">
          Price: <span className="font-bold">${food.price}</span>
        </p>
        <p className="text-lg font-semibold mt-4">
          Available Quantity: <span className="font-bold">{food.quantity}</span>
        </p>

        <div className="mt-6">
          <label htmlFor="quantity" className="block font-semibold">
            Quantity:
          </label>
          <input
            id="quantity"
            type="number"
            min="1"
            max={food.quantity}
            value={quantity}
            onChange={(e) =>
              setQuantity(Math.min(Number(e.target.value), food.quantity))
            }
            disabled={isOutOfStock}
            className="input input-bordered w-full mt-2"
          />
        </div>

        <p className="text-lg font-bold mt-4">
          Total: <span className="text-green-600">${food.price * quantity}</span>
        </p>

        {isOutOfStock ? (
          <p className="text-red-600 font-semibold mt-4">
            This item is out of stock. You cannot purchase it.
          </p>
        ) : (
          <button
            onClick={handlePurchase}
            disabled={user.email === food.owner_email}
            className={`btn mt-6 w-full ${
              user.email === food.owner_email
                ? "cursor-not-allowed bg-gray-400"
                : "bg-yellow-700 hover:bg-yellow-800 text-white"
            }`}
          >
            Confirm Purchase
          </button>
        )}
      </div>
    </div>
  );
};

export default FoodPurchase;