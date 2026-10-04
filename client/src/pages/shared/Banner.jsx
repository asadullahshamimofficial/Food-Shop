import React from 'react';
import { NavLink } from 'react-router-dom';

const Banner = ({ backgroundImage, title, links }) => {
  return (
    <div className="hero h-96 pt-10 mb-6" style={{ backgroundImage: `url(${backgroundImage})`}}>
      <div className="hero-overlay bg-opacity-60"></div>
      <div className="hero-content text-neutral-content text-center">
        <div className="max-w-md flex flex-col items-center text-white">
          <h1 className="mb-5 text-6xl font-bold"> {title} </h1>
          <div className="flex text-xl gap-3">
            {
              links.map((link, idx) => (
                <NavLink
                  key={idx} 
                  to={link.path} 
                  className={`font-bold ${idx !== links.length - 1 ? 'border-r-2 pr-2' : ''}`}
                > 
                  {link.name} 
                </NavLink>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;