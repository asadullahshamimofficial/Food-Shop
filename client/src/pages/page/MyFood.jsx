import React, { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import { Link } from 'react-router-dom';

const MyFood = () => {
  const [myFoods, setMyFoods] = useState([]);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyFoods = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_Server_Host_Link}/foods?email=${user?.email}`,
          { credentials: 'include' }
        );
        const data = await response.json();
        // Guard: ensure data is an array before setting state
        setMyFoods(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching foods:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) {
      fetchMyFoods();
    }
  }, [user?.email]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-ring loading-lg"></span>
      </div>
    );
  }

  return (
    <div className='pt-28 px-10 min-h-screen'>
      <h1 className="text-3xl font-bold text-center mb-6">My Foods</h1>
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Origin</th>
              <th>Quantity</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {myFoods.length > 0 ? (
              myFoods.map((food) => (
                <tr key={food._id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle h-12 w-12">
                          <img src={food.image} alt={food.name} />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold">{food.name}</div>
                        <div className="text-sm opacity-50">{food.category}</div>
                      </div>
                    </div>
                  </td>
                  <td>{food.origin}</td>
                  <td>{food.quantity}</td>
                  <th>
                    <Link
                      to={`/singleFood/${food._id}`}
                      className="btn bg-yellow-700 hover:bg-yellow-800 text-white btn-ghost btn-xs"
                    >
                      Details
                    </Link>
                  </th>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-8">
                  No foods found. You haven't added any foods yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyFood;