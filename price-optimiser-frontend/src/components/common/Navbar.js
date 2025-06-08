import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { UserCircleIcon } from "@heroicons/react/solid";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="w-full bg-black text-white px-6 py-3 flex justify-between items-center shadow-md">
      <Link
        to="/"
        className="text-2xl font-bold text-teal-400 hover:text-teal-300"
      >
        Price Optimization Tool
      </Link>

      {user ? (
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-300">
            Welcome,&nbsp;
            <span className="text-teal-400 font-medium">
              {user.username}, {user.role}
            </span>
          </span>
          <UserCircleIcon className="h-8 w-8 text-gray-300" />
          <button
            onClick={logout}
            className="text-sm text-gray-400 hover:text-gray-200"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="flex items-center space-x-6">
          <Link
            to="/login"
            className="text-sm text-gray-300 hover:text-teal-400 transition"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="text-sm text-gray-300 hover:text-teal-400 transition"
          >
            Register
          </Link>
        </div>
      )}
    </header>
  );
};

export default Navbar;
