import { updateProfile } from 'firebase/auth';
import useAuth from '../../hooks/useAuth';
import GoogleSignIn from '../shared/GoogleSignIn';
import { auth } from '../../firebase/firebase.init';
import { Link, useNavigate } from 'react-router-dom';


const Register = () => {

  const navigate = useNavigate();
  const { createUser, setUser, upadteUser } = useAuth();

  const handleRegister = e => {
    e.preventDefault();

    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const password = form.password.value;
    const photo = form.photo.value;

    createUser(email, password)
    .then((res) => {
      setUser(res.user)
      updateProfile(auth.currentUser,{displayName: name, photoURL: photo})
      .then(() => {
        navigate('/')
      }).catch(err => console.log(err))
    })
    .catch((err) => console.log(err.message))

    console.log(name, email, password, photo)
  }

  return (
    <div className="card w-full max-w-md shrink-0 mx-auto min-h-screen pt-24">
      <h2 className="text-3xl text-center font-bold mt-6 text-gray-700"> Register Form </h2>
      <GoogleSignIn />
      <form onSubmit={handleRegister} className="card-body pt-0">
        <div className="grid grid-cols-1 gap-5">
          <div className="form-control">
            <label className="label">
              <span className="label-text"> Name </span>
            </label>
            <input name='name' type="text" placeholder="name" className="input input-bordered focus:outline-yellow-700 focus:border-yellow-700 border-yellow-700" required />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text"> Email </span>
            </label>
            <input name='email' type="email" placeholder="email" className="input input-bordered focus:outline-yellow-700 focus:border-yellow-700 border-yellow-700" required />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text"> Photo URL </span>
            </label>
            <input name='photo' type="url" placeholder="photo url" className="input input-bordered focus:outline-yellow-700 focus:border-yellow-700 border-yellow-700" required />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text"> Password </span>
            </label>
            <input name='password' type="password" placeholder="password" className="input input-bordered focus:outline-yellow-700 focus:border-yellow-700 border-yellow-700" required />
          </div>
        </div>
        <div className="form-control mt-6">
          <button className="btn bg-yellow-700 hover:bg-yellow-800 text-white"> Register </button>
        </div>
        <h2 className='text-center mb-5'> Already have an account? <Link to={'/logIn'} className="text-yellow-700 font-semibold"> Login Here </Link></h2>
      </form>
    </div>
  );
};

export default Register;