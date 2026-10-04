import React from 'react';
import useAuth from '../../hooks/useAuth';
import GoogleSignIn from '../shared/GoogleSignIn';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const LogIn = () => {

  const { logInUser } = useAuth();
  const navigate = useNavigate();

  const handleLogIn = e => {
    e.preventDefault();

    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;
    console.log(email, password);

    logInUser(email, password)
    .then(res => {
      console.log(res.user)
      toast.success("SUCCESS:", res.user)
      // fetch(`${import.meta.env.VITE_Server_Host_Link}/login`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   credentials: 'include',
      //   body: JSON.stringify(email, password),
      // })
      //   .then(res => res.json())
      //   .then(data => {
      //     toast("SUCCESS:", data)
      //     console.log(data)
      //   })
      //   .catch(err => console.log(err));
    })
    .catch(err => {
      toast.error("ERROR:", err)
      console.log(err)
    })
  }

  return (
    <div className="card w-full max-w-md gap-2 shrink-0 mx-auto min-h-screen pt-24">
      <h2 className="text-3xl text-center font-bold"> Log In Form </h2>
      <GoogleSignIn />
      <form onSubmit={handleLogIn} className="card-body pt-0">
        <div className="form-control">
          <label className="label">
            <span className="label-text"> Email </span>
          </label>
          <input name='email' type="email" placeholder="email" className="input input-bordered focus:outline-yellow-700 focus:border-yellow-700 border-yellow-700" required />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text"> Password </span>
          </label>
          <input name='password' type="password" placeholder="password" className="input input-bordered focus:outline-yellow-700 focus:border-yellow-700 border-yellow-700" required />
          <label className="label">
            <a href="#" className="label-text-alt link link-hover">Forgot password?</a>
          </label>
        </div>
        <div className="form-control mt-6">
          <button className="btn bg-yellow-700 hover:bg-yellow-800 text-white"> Log In </button>
        </div>
        <h2 className='text-center'> New user? <Link to={'/register'} className="text-yellow-700 font-semibold"> Register Here </Link></h2>
      </form>
    </div>
  );
};

export default LogIn;