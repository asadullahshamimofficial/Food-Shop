import React from 'react';
import useAuth from '../../hooks/useAuth';

const UpdateFood = () => {

  const { user } = useAuth();

  return (
    <div className='container mx-auto'>
      <h2 className="text-3xl mt-5 font-bold text-center"> Update Food Form </h2>
      <div className="card w-full">
        <form className="card-body grid grid-cols-2 w-full">
          <div className="form-control">
            <label className="label">
              <span className="label-text"> Food Name </span>
            </label>
            <input type="text" name='foodName' placeholder="Food Name" className="input input-bordered" required />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text"> Food Image </span>
            </label>
            <input type="url" name='foodImage' placeholder="Food Image" className="input input-bordered" required />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text"> Food Category </span>
            </label>
            <input type="text" name='foodCategory' placeholder="Food Category" className="input input-bordered" required />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text"> Quantity </span>
            </label>
            <input type="text" name='quantity' placeholder="Quantity" className="input input-bordered" required />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text"> Price </span>
            </label>
            <input type="number" name='price' placeholder="Price" className="input input-bordered" required />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text"> Food Origin (Country) </span>
            </label>
            <input type="text" name='foodOrigin' placeholder="Food Origin" className="input input-bordered" required />
          </div>
          <div className="form-control col-span-2">
            <label className="label">
              <span className="label-text"> Description </span>
            </label>
            <input type="text" name='description' placeholder="Description" className="input input-bordered" required />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text"> User Name </span>
            </label>
            <input defaultValue={user?.name} readOnly type="text" name='username' placeholder="User Name" className="input input-bordered" required />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text"> User Email </span>
            </label>
            <input defaultValue={user?.email} readOnly type="email" name='useremail' placeholder="User Email" className="input input-bordered" required />
          </div>
          <div className="form-control mt-6 col-span-2">
            <button className="btn btn-primary"> Update Food </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateFood;