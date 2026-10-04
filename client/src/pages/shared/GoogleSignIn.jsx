import React from 'react';
import useAuth from '../../hooks/useAuth';

const GoogleSignIn = () => {

  const { signInWithGoogle } = useAuth();

  return (
    <div className='flex mt-7 flex-col w-full items-center justify-center'>
      <button onClick={signInWithGoogle} className='btn w-96 border-yellow-700 text-yellow-700 hover:text-white hover:bg-yellow-800 bg-white'> Continue With Google </button>
      <div className="">
        <div className="divider text-yellow-700 w-96 mb-0 flex items-center justify-center"> OR </div>
      </div>
    </div>
  );
}; 

export default GoogleSignIn;