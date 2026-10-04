import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const OurFood = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFoods = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_Server_Host_Link}/foods`);
        const data = await response.json();
        setFoods(data);
      } catch (error) {
        console.error("Error fetching foods:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFoods();
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-center py-10"> Our Delicious Foods</h2>
      
      {/* Loading */}
      {loading && (
        <div className="text-center">
          <span className="loading loading-ring loading-lg"></span>
        </div>
      )}

      {/* Foods Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {foods.length > 0 ? (
          foods.slice(0, 8).map((food) => (
            <div key={food._id} className="card rounded-[20px] overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <figure className="h-44">
                <img className="w-full h-full object-cover" src={food.image || "https://via.placeholder.com/300"} alt="Food" />
              </figure>
              <div className="card-body px-4 py-4">
                <h2 className="card-title font-bold">{food.name}</h2>
                <p>{food.description.slice(0, 80)}...<Link to={`/singleFood/${food._id}`} className='font-semibold'>See more</Link></p>
                <div className="flex items-center justify-between">
                  <p className="text-gray-600"><span className="font-bold">Price:</span> ${food.price}</p>
                  <Link to={`/singleFood/${food._id}`} className="bg-yellow-700 hover:bg-yellow-800 text-white px-2 py-1 rounded-lg">
                    Details
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          !loading && <p className="text-center col-span-full">No foods found</p>
        )}
      </div>

      {/* Go to All Food Page Button */}
      <div className="flex items-center justify-center pt-10">
        <Link to={'/allFoods'} className='btn border-yellow-700 bg-white hover:bg-yellow-700 bg-transparent text-yellow-700 hover:text-white'>
          Go to All Food Page
        </Link>
      </div>
    </div>
  );
};

export default OurFood;