import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/common/PrivateRoute';

import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ProductList from './components/products/ProductList';
import DemandForecast from './components/forecasts/DemandForecast';
import PricingOptimization from './components/optimization/PricingOptimization';
import './styles/index.css';
import './App.css';

function Home() {
  // const { user, logout } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-800 text-white text-center flex flex-col items-center justify-center px-6 py-20 space-y-16">
      <img
        src="https://www.atlas-platform.io/img/bcgxwhiteimproved.png"
        alt="BCG X Logo"
        className="h-12"
      />

      <div className="space-y-6">
        <h1 className="text-4xl font-bold">Price Optimization Tool</h1>
        <p className="text-gray-300 max-w-2xl mx-auto">
          An intelligent assistant to help suppliers, buyers, and managers forecast product
          demand and optimize pricing for maximum profitability.
        </p>
      </div>
{/* 
      {user ? (
        <div className="space-y-4">
          <p className="text-lg">
            Welcome, <span className="font-bold">{user.username}</span>,{' '}
            <span className="italic capitalize">{user.role || 'user'}</span>
          </p>
          <button
            onClick={logout}
            className="px-6 py-2 bg-white text-black rounded-full font-semibold shadow hover:bg-gray-200 transition"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="flex space-x-6">
          <Link
            to="/login"
            className="px-6 py-2 bg-white text-black rounded-full font-semibold shadow hover:bg-gray-200 transition"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-6 py-2 bg-white text-black rounded-full font-semibold shadow hover:bg-gray-200 transition"
          >
            Register
          </Link>
        </div>
      )} */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-10">
        <Link
          to="/products"
          className="bg-white text-black rounded-xl shadow p-8 text-left hover:shadow-2xl transition space-y-4 h-96 w-full max-w-md mx-auto flex flex-col justify-between"
        >
          <div>
            <img
              src="https://cdn-icons-png.flaticon.com/128/1171/1171520.png"
              alt="Manage"
              className="h-10 mb-4"
            />
            <h2 className="text-2xl font-bold mb-1">Create and Manage Product</h2>
            <p className="text-sm text-gray-700">
              Add, edit, or remove products. View and filter your catalog by category or search
              by keyword.
            </p>
          </div>
          <img
            src="https://toppng.com/uploads/preview/download-high-resolution-black-arrow-11562894731b2btu7hel2.png"
            alt="arrow"
            className="h-4 self-end"
          />
        </Link>

        <Link
          to="/optimize"
          className="bg-white text-black rounded-xl shadow p-8 text-left hover:shadow-2xl transition space-y-4 h-96 w-full max-w-md mx-auto flex flex-col justify-between"
        >
          <div>
            <img
              src="https://th.bing.com/th/id/OIP.3uHp3kp1SWWo3L4eE54VywHaE7"
              alt="Optimize"
              className="h-10 mb-4"
            />
            <h2 className="text-2xl font-bold mb-1">Pricing Optimization</h2>
            <p className="text-sm text-gray-700">
              Use demand trends and elasticity to determine the optimal selling price for each
              product.
            </p>
          </div>
          <img
            src="https://toppng.com/uploads/preview/download-high-resolution-black-arrow-11562894731b2btu7hel2.png"
            alt="arrow"
            className="h-4 self-end"
          />
        </Link>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />

          {/* Overlay Login/Register on Home */}
          <Route
            path="/login"
            element={
              <>
                <Home />
                <Login />
              </>
            }
          />
          <Route
            path="/register"
            element={
              <>
                <Home />
                <Register />
              </>
            }
          />

          <Route
            path="/products"
            element={
              <PrivateRoute>
                <ProductList />
              </PrivateRoute>
            }
          />
          <Route
            path="/forecast"
            element={
              <PrivateRoute>
                <DemandForecast />
              </PrivateRoute>
            }
          />
          <Route
            path="/optimize"
            element={
              <PrivateRoute>
                <PricingOptimization />
              </PrivateRoute>
            }
          />

          <Route path="*" element={<Home />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
