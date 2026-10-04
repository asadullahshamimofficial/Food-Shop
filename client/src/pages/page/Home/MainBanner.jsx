import React from 'react';
import { Link } from 'react-router-dom';

const MainBanner = () => {
  return (
    <div>
      <div className="hero min-h-screen">
        <div className="absolate w-full h-full object-cover">
          <img className='w-full h-full' src="https://i.ibb.co.com/4MLKv0C/pexels-chanwalrus-941861.jpg" alt="" />
        </div>
        <div className="hero-overlay bg-opacity-60"></div>
        <div className="hero-content text-neutral-content text-center">
          <div className="max-w-3xl space-y-4">
            <div className="flex gap-3 items-center justify-center">
              <img src="https://i.ibb.co.com/XWbnv9G/h3-sub-title-vec.png" alt="" />
              <h1> Welcome To Our Food Shop </h1>
              <img src="https://i.ibb.co.com/XWbnv9G/h3-sub-title-vec.png" alt="" />
            </div>
            <h1 className="text-7xl font-bold"> Find Your Best Healthy & Tasty Food. </h1>
            <p className="mb-5">
            Welcome to our food shop, where healthy meets tasty discover the best meals crafted just for you!
            </p>
            <Link to={'/allFoods'} className="btn bg-yellow-700 border-none hover:bg-yellow-800 text-white"> All Foods </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainBanner;