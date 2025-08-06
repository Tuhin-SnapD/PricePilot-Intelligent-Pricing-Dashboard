import React, { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { FiSettings, FiLogOut, FiUser, FiChevronDown, FiMenu, FiX } from "react-icons/fi";
import { FaRocket } from "react-icons/fa";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const location = useLocation();

  const navigationItems = [
    { path: "/products", label: "Products", icon: "📦" },
    { path: "/optimize", label: "Optimize", icon: "📈" },
    { path: "/analytics", label: "Analytics", icon: "📊" }
  ];

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    setShowProfileDropdown(false);
    logout();
  };

  return (
    <header className="w-full bg-black text-white px-6 py-3 flex justify-between items-center shadow-lg border-b border-gray-800">
      {/* Logo and Brand */}
      <Link
        to="/"
        className="text-2xl font-bold text-teal-400 hover:text-teal-300 flex items-center space-x-3 transition-colors"
      >
        <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg shadow-lg">
          <FaRocket className="text-white text-xl" />
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-bold">PricePilot</span>
          <span className="text-xs text-gray-400 font-normal">Intelligent Pricing Dashboard</span>
        </div>
      </Link>

      {/* Desktop Navigation */}
      {user && (
        <nav className="hidden md:flex items-center space-x-1">
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                isActiveRoute(item.path)
                  ? "bg-teal-500 text-white shadow-lg"
                  : "text-gray-300 hover:text-white hover:bg-gray-800"
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      )}

      {/* User Section */}
      {user ? (
        <div className="flex items-center space-x-4">
          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="hidden lg:block text-left">
                  <div className="text-sm font-medium text-white">{user.username}</div>
                  <div className="text-xs text-gray-400 capitalize">{user.role}</div>
                </div>
                <FiChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${
                  showProfileDropdown ? 'rotate-180' : ''
                }`} />
              </div>
            </button>

            {/* Profile Dropdown Menu */}
            {showProfileDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-gray-900 rounded-xl shadow-2xl border border-gray-700 py-2 z-50">
                <div className="px-4 py-3 border-b border-gray-700">
                  <div className="text-sm font-medium text-white">{user.username}</div>
                  <div className="text-xs text-gray-400 capitalize">{user.role}</div>
                </div>
                
                <div className="py-2">
                  <Link
                    to="/profile"
                    className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                    onClick={() => setShowProfileDropdown(false)}
                  >
                    <FiUser className="w-4 h-4" />
                    <span>Profile</span>
                  </Link>
                  <button className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 transition-colors">
                    <FiSettings className="w-4 h-4" />
                    <span>Settings</span>
                  </button>
                </div>
                
                <div className="border-t border-gray-700 pt-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-colors"
                  >
                    <FiLogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            {showMobileMenu ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
          </button>
        </div>
      ) : (
        <div className="flex items-center space-x-6">
          <Link
            to="/login"
            className="text-sm text-gray-300 hover:text-teal-400 transition-colors font-medium"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="text-sm bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
          >
            Register
          </Link>
        </div>
      )}

      {/* Mobile Menu */}
      {showMobileMenu && user && (
        <div className="absolute top-full left-0 right-0 bg-gray-900 border-b border-gray-800 md:hidden z-50">
          <nav className="px-6 py-4 space-y-2">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-3 ${
                  isActiveRoute(item.path)
                    ? "bg-teal-500 text-white"
                    : "text-gray-300 hover:text-white hover:bg-gray-800"
                }`}
                onClick={() => setShowMobileMenu(false)}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
            
            <div className="border-t border-gray-700 pt-4 mt-4">
              <div className="px-4 py-2 text-xs text-gray-400 uppercase tracking-wider">
                Account
              </div>
              <Link
                to="/profile"
                className="block px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                onClick={() => setShowMobileMenu(false)}
              >
                Profile Settings
              </Link>
              <button
                onClick={() => {
                  setShowMobileMenu(false);
                  logout();
                }}
                className="w-full text-left px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
