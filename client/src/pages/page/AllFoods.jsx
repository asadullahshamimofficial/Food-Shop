import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GrLinkNext, GrLinkPrevious } from "react-icons/gr";
import Banner from '../shared/Banner';

const AllFoods = () => {
  const [foods, setFoods] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [itemsPerPage] = useState(9);
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    const fetchFoods = async () => {
      setLoading(true);
      const endpoint = search
        ? `${import.meta.env.VITE_Server_Host_Link}/foods?search=${search}`
        : `${import.meta.env.VITE_Server_Host_Link}/foods`;
      try {
        const response = await fetch(endpoint);
        const data = await response.json();
        // Guard: ensure data is an array before setting state
        setFoods(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching foods:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, [search]);

  const handleSortChange = (order) => {
    setSortOrder(order);
  };

  const sortedFoods = [...foods].sort((a, b) => {
    return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFoods = sortedFoods.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(foods.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      {/* Banner */}
      <Banner
        backgroundImage={ "https://i.ibb.co.com/YTGgtDN/download-1.jpg" || "https://via.placeholder.com/1500x500" }
        title={"All Foods"}
        links={[
          { name: 'Home', path: '/' },
          { name: 'All Foods', path: '/allFoods' },
        ]}
      />

      {/* Search */}
      <div className="container mx-auto flex items-center justify-between my-4 mb-6 px-10">
        <h1 className="text-3xl font-bold"> All Foods </h1>
        <div className="flex gap-5 items-center">
          <div className="">
            <input
              type="text"
              placeholder="Search for foods..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border rounded-full  px-3 py-2 w-64"
            />
          </div>
          <div>
            <select
              value={sortOrder}
              onChange={(e) => handleSortChange(e.target.value)}
              className="border rounded-full  px-3 py-2"
            >
              <option value="asc">Low to High</option>
              <option value="desc">High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading */}
      <div className="container mx-auto text-center">
        {loading && <span className="loading loading-ring loading-lg"></span>}
      </div>

      {/* Foods */}
      <div className="container mx-auto px-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {foods.length > 0 ? (
          currentFoods.map((food) => (
            <div key={food._id} className="card rounded-[50px] overflow-hidden">
              <figure className='h-44'>
                <img
                  className='w-full h-full object-cover'
                  src={food.image || "https://via.placeholder.com/300"}
                  alt="Foods" />
              </figure>
              <div className="card-body px-2 py-4">
                <h2 className="card-title font-bold"> {food.name} </h2>
                <p> {food.description} </p>
                <div className="flex items-center justify-between">
                  <p className="text-start text-gray-600"><span className='font-bold'> Price: </span> ${food.price}</p>
                  <Link to={`/singleFood/${food._id}`} className="btn bg-yellow-700 hover:bg-yellow-800 text-white"> Details </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center col-span-full">No foods found</p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex flex-wrap justify-center my-6 gap-2 px-10">
        <button
          className="btn rounded-full bg-yellow-700 hover:bg-yellow-800 text-white"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <GrLinkPrevious />
          {/* Previous */}
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`btn px-5 rounded-full ${currentPage === index + 1
              ? 'bg-yellow-700 hover:bg-yellow-800 text-white'
              : 'bg-gray-300 hover:bg-gray-400 text-gray-800'
              }`}
          >
            {index + 1}
          </button>
        ))}
        <button
          className="btn rounded-full bg-yellow-700 hover:bg-yellow-800 text-white"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <GrLinkNext />
        </button>
      </div>
    </div>
  );
};

export default AllFoods;