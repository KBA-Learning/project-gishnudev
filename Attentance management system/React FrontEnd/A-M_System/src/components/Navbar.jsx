import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div >

      {/* Navbar content */}
      <div className="relative z-10 flex items-center justify-end p-4 bg-black shadow-orange-800 shadow-sm ">
        {/* Logo */}
        <img
          className="w-18 h-16 mr-auto"
          src="/src/assets/images/logo1.png"
          alt="Logo"
        />

        {/* Navigation Links */}
        <nav className="flex space-x-6">
          <Link
            to="/"
            className="text-white font-bold text-xl hover:text-yellow-600 transition hover:bg-slate-600 p-3 rounded-lg hover:shadow-orange-300 hover:shadow-2xl"
          >
            Home
          </Link>
          <Link
            to="/SignUp"
            className="text-white font-bold text-xl hover:text-yellow-600 transition  hover:bg-slate-600 p-3 rounded-lg hover:shadow-orange-300 hover:shadow-2xl"
          >
            SignUp
          </Link>
          <Link
            to="/login"
            className="text-lg text-white border-2 font-bold border-white px-4 py-1 rounded-lg hover:text-yellow-600 hover:border-yellow-600 transition  hover:bg-slate-600 p-3 rounded-lg hover:shadow-orange-300 hover:shadow-2xl"
          >
            Login
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
