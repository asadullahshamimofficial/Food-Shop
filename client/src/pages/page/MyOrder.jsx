import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import moment from "moment";
import useAuth from "../../hooks/useAuth";

const MyOrders = () => {
  const { user } = useAuth(); // Get logged-in user's info
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch orders for the logged-in user
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_Server_Host_Link}/orders?email=${user.email}`);
        console.log(response)
        const data = await response.json();
        setOrders(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Failed to load orders.");
        setLoading(false);
      }
    };

    if (user?.email) {
      fetchOrders();
    }
  }, [user?.email]);

  // Handle order deletion
  const handleDelete = async (orderId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this order?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_Server_Host_Link}/orders/${orderId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setOrders(orders.filter((order) => order._id !== orderId));
        toast.success("Order deleted successfully.");
      } else {
        toast.error("Failed to delete the order.");
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Error occurred while deleting the order.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-ring loading-lg"></span>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center pt-28 min-h-screen">
        <h1 className="text-2xl font-semibold">You have no orders yet.</h1>
      </div>
    );
  }

  console.log(orders)

  return (
    <div className="container mx-auto h-dvh px-4 pt-20">
      <h1 className="text-3xl font-bold text-center my-6">My Orders</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders?.map((order) => (
          <div key={order._id} className="border rounded-lg shadow-lg p-4">
            {/* Food Info */}
            <img
              src={order.foodImage}
              alt={order.foodName}
              className="w-full h-60 object-cover rounded-md mb-4"
            />
            <h2 className="text-xl font-bold">{order.foodName}</h2>
            <div className="flex gap-5 mt-1">
              <p className="text-gray-600">
                <span className="font-bold">Quantity:</span> {order.quantity}
              </p>
              <p className="text-gray-600">
                <span className="font-bold">Total:</span> ${order.price * order.quantity}
              </p>
            </div>
            <p className="text-gray-600 mt-1">
              <span className="font-bold">Ordered On:</span>{" "}
              {moment(order.buyingDate).format("MMMM Do YYYY, h:mm:ss a")}
            </p>

            {/* Delete Button */}
            <button
              onClick={() => handleDelete(order._id)}
              className="btn bg-red-600 hover:bg-red-700 text-white w-full mt-4"
            >
              Delete Order
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;