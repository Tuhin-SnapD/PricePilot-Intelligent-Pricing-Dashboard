import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/common/PrivateRoute';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ProductList from './components/products/ProductList';
import DemandForecast from './components/forecasts/DemandForecast';
import PricingOptimization from './components/optimization/PricingOptimization';
import './App.css';

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-800 text-white flex flex-col items-center justify-center px-6 py-20 space-y-16 text-center">
      <img
        src="https://www.atlas-platform.io/img/bcgxwhiteimproved.png"
        alt="BCG X Logo"
        className="h-12 mb-8"
      />

      <div className="space-y-4">
        <h1 className="text-5xl font-bold hover:text-teal-400 transition-colors">
          Price Optimization Tool
        </h1>
        <p className="text-gray-300 max-w-2xl mx-auto">
          An intelligent assistant to help suppliers, buyers, and managers forecast product
          demand and optimize pricing for maximum profitability.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-10">
        <Link
          to="/products"
          className="group relative bg-white text-black rounded-xl shadow px-8 pt-16 pb-8 hover:shadow-2xl transition-transform transform hover:scale-105 min-h-[30rem] max-w-sm mx-auto flex flex-col justify-between text-left"
        >
          <div className="space-y-16">
            <img
              src="https://cdn-icons-png.flaticon.com/128/1171/1171520.png"
              alt="Manage"
              className="h-20 mb-16"
            />
            <div>
              <h2 className="text-2xl font-bold mb-2 transition-colors group-hover:text-teal-400">
                Create and Manage Product
              </h2>
              <p className="text-sm text-gray-700">
                Add, edit, or remove products. View and filter your catalog by category or keyword.
                Easily manage inventory levels and monitor sales performance.
              </p>
            </div>
          </div>
          <img
            src="https://png.pngtree.com/png-clipart/20190619/original/pngtree-right-arrow-glyph-black-icon-png-image_4008260.png"
            alt="arrow"
            className="h-8 self-start mt-8"
          />
        </Link>

        <Link
          to="/optimize"
          className="group relative bg-white text-black rounded-xl shadow px-8 pt-16 pb-8 hover:shadow-2xl transition-transform transform hover:scale-105 min-h-[30rem] max-w-sm mx-auto flex flex-col justify-between text-left"
        >
          <div className="space-y-16">
            <img
              src="https://cdn-icons-png.flaticon.com/512/559/559678.png"
              alt="Optimize"
              className="h-20 mb-16"
            />
            <div>
              <h2 className="text-2xl font-bold mb-2 transition-colors group-hover:text-teal-400">
                Pricing Optimization
              </h2>
              <p className="text-sm text-gray-700">
                Use demand trends and elasticity to determine the optimal selling price for each product.
                Improve margins and maximize profitability with data-driven insights.
              </p>
            </div>
          </div>
          <img
            src="https://png.pngtree.com/png-clipart/20190619/original/pngtree-right-arrow-glyph-black-icon-png-image_4008260.png"
            alt="arrow"
            className="h-8 self-start mt-8"
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
