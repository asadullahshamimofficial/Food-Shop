import React from 'react';
import { Link } from 'react-router-dom';

const Error = () => {
  return (
    <div className='flex flex-col gap-7 text-center items-center min-h-screen justify-center pt-28 px-10'>
      <h1 className="text-5xl"> Ooops! </h1>
      <img src="../../../src/assets/404.png" alt="" />
      <p className="text-xl"> The page does not found, something went wrong. Go to Homepage </p>
      <Link to={'/'} className="btn bg-[#BF9444] text-white hover:bg-yellow-600"> Home Page </Link>
    </div>
  );
};

export default Error;