import React, { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth'
import { Link } from 'react-router-dom';

const MyFood = () => {

  const [myFoods, setMyFoods] = useState([]);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_Server_Host_Link}/foods?email=${user?.email}`)
      .then((res) => res.json())
      .then((data) => setMyFoods(data));
  }, [user?.email]);

  useEffect(() => {
    const fetchMyFoods = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_Server_Host_Link}/foods?email=${user?.email}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${document.cookie.split('=')[1]}`,
          }
        });
        const data = await response.json();
        setMyFoods(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching foods:', error);
        setLoading(false);
      }
    };

    if (user?.email) {
      fetchMyFoods();
    }
  }, [user?.email]);

  // if (loading) {
  //   return <div>Loading...</div>;
  // } 

  // if (!myFoods.length) {
  //   return <div className="text-center">No foods found. You haven't added any foods yet.</div>;
  // }

  return (
    <div className='pt-28 px-10 min-h-screen'>
      <h1 className="text-3xl font-bold text-center mb-6 "> My Foods </h1>
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th> Name </th>
              <th> Origin </th>
              <th> Quantity </th>
              <th> Details </th>
            </tr>
          </thead>
          <tbody>
            {
              myFoods.map((food) => (
                <tr key={food._id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle h-12 w-12">
                          <img
                            src={food.image}
                            alt="Avatar Tailwind CSS Component" />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold"> {food.name} </div>
                        <div className="text-sm opacity-50"> {food.category} </div>
                      </div>
                    </div>
                  </td>
                  <td> {food.origin} </td>
                  <td> {food.quantity} </td>
                  <th>
                    <Link food={food} to={`/singaleFood/${food._id}`} className="btn bg-yellow-700 hover:bg-yellow-800 text-white btn-ghost btn-xs"> Details </Link>
                  </th>
                </tr>
              ))
            }
          </tbody>
        </table>

        <div className="container mx-auto text-center pt-5">
          {loading && <span className="loading loading-ring loading-lg"></span>}
        </div>
        <div className="container mx-auto text-center pt-5">
          {!myFoods.length && <span className="text-center"> No foods found. You haven't added any foods yet. </span>}
        </div>
      </div>
    </div>
  );
};

export default MyFood;