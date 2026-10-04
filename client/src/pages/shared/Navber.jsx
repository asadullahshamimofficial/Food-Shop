import { Link, NavLink } from 'react-router-dom';
import '../../index.css'
import useAuth from '../../hooks/useAuth';
import useTheme from '../../hooks/useTheme';
import '../../index.css';
import { CiDark, CiLight } from 'react-icons/ci';

const Navber = () => {

  const { user, signOutUser } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleSignOutUser = () => {
    signOutUser()
    .then(res => {
      console.log(res);
    })
    .catch(err => {
      console.log(err);
    })
  };

  const links = <>
    <li className='text-white'><NavLink className={({ isActive }) => isActive ? "text-black bg-white hover:bg-gray-100" : ""} to={'/'}> Home </NavLink></li>
    <li className='text-white'><NavLink className={({ isActive }) => isActive ? "text-black bg-white hover:bg-gray-100" : ""} to={'/allFoods'}> All Foods </NavLink></li>
    <li className='text-white'><NavLink className={({ isActive }) => isActive ? "text-black bg-white hover:bg-gray-100" : ""} to={'/gallery'}> Gallery </NavLink></li>
    { user ? <>
      <li className='text-white'><NavLink className={({ isActive }) => isActive ? "text-black bg-white hover:bg-gray-100" : ""} to={'/myOrder'}> My Orders </NavLink></li>
      <li className='text-white'><NavLink className={({ isActive }) => isActive ? "text-black bg-white hover:bg-gray-100" : ""} to={'/myFood'}> My Foods </NavLink></li>
      <li className='text-white'><NavLink className={({ isActive }) => isActive ? "text-black bg-white hover:bg-gray-100" : ""} to={'/addFood'}> Add Food </NavLink></li>
      </> : <></>
    }
  </>

  return (
    <div className="navbar fixed bg-black bg-opacity-35 px-3 md:px-10 z-10">
      <div className="navbar-start">
        <div className="dropdown text-white ">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content rounded-box z-[1] mt-3 w-52 p-2 shadow bg-black bg-opacity-50 gap-2">
            { links }
          </ul>
        </div>
        <Link to={'/'} className="flex items-center gap-1 text-2xl w-56">
          <img className='w-10' src="../../../src/assets/food-drink-logo-white-background_1277164-19895-removebg-preview.png" alt="" />
          <span className="font-roboto dark:text-white font-semibold text-2xl"> Food Shop </span>
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal gap-2 px-1">
          {links}
        </ul>
      </div>
      <div className="navbar-end gap-3">
        <button
          className={`border rounded-full text-xl p-3 cursor-pointer`}
          onClick={toggleTheme}
          style={{
            background: theme === "dark" ? "#333" : "#fff",
            color: theme === "dark" ? "#fff" : "#333",
          }}
        >
          {theme === "light" ? <CiDark /> : <CiLight />}
        </button>
        {
          user ? <>

            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-circle">
                <img className='w-14 rounded-full' src={user.photoURL} alt="" />
              </div>
              <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow ">
                <li onClick={handleSignOutUser} className="btn bg-yellow-600 hover:bg-yellow-700 text-white"> Log Out </li>
              </ul>
            </div>
          </> : <>
            <Link to={'/logIn'} className="btn bg-yellow-600 border-none hover:bg-yellow-700 text-white"> Log In </Link>
          </>
        }
      </div>
    </div>
  );
};

export default Navber;