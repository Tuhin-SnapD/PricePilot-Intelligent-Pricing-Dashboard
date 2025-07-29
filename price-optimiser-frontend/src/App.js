import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/common/PrivateRoute';
import ErrorBoundary from './components/common/ErrorBoundary';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ProductList from './components/products/ProductList';
import DemandForecast from './components/forecasts/DemandForecast';
import PricingOptimization from './components/optimization/PricingOptimization';
import AnalyticsDashboard from './components/analytics/AnalyticsDashboard';
import { FiPackage, FiTrendingUp, FiBarChart2, FiArrowRight, FiZap, FiTarget, FiShield } from 'react-icons/fi';
import { FaRocket, FaBrain } from 'react-icons/fa';
import './App.css';

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-blue-500/10"></div>
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        <div className="relative z-10 px-6 py-20 text-center">
          {/* Header Logo */}
          <div className="flex items-center justify-center mb-12">
            <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-teal-400 to-teal-600 rounded-2xl shadow-2xl">
              <FaRocket className="text-white text-3xl" />
            </div>
            <div className="ml-6 text-left">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">
                PricePilot
              </h1>
              <p className="text-lg text-gray-300 font-medium">Intelligent Pricing Dashboard</p>
            </div>
          </div>

          {/* Hero Content */}
          <div className="max-w-4xl mx-auto mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">
                AI-Powered
              </span>
              <br />
              <span className="text-white">Price Optimization</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Transform your pricing strategy with advanced machine learning, real-time elasticity analysis, 
              and intelligent inventory management. Maximize profitability through data-driven insights.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Product Management Card */}
            <Link
              to="/products"
              className="group relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 hover:from-gray-800 hover:to-gray-700 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl border border-gray-700 hover:border-teal-500/50"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300">
                <FiPackage className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-teal-400 transition-colors">
                Product Management
              </h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Comprehensive product catalog management with advanced filtering, inventory tracking, 
                and performance analytics. Streamline your product operations with intuitive controls.
              </p>
              <div className="flex items-center text-teal-400 font-semibold group-hover:text-teal-300 transition-colors">
                <span>Explore Products</span>
                <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Pricing Optimization Card */}
            <Link
              to="/optimize"
              className="group relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 hover:from-gray-800 hover:to-gray-700 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl border border-gray-700 hover:border-teal-500/50"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300">
                <FiTrendingUp className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-teal-400 transition-colors">
                Smart Pricing
              </h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                AI-driven pricing optimization using demand elasticity, market trends, and competitive analysis. 
                Maximize revenue with intelligent price recommendations and real-time adjustments.
              </p>
              <div className="flex items-center text-teal-400 font-semibold group-hover:text-teal-300 transition-colors">
                <span>Optimize Prices</span>
                <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Advanced Analytics Card */}
            <Link
              to="/analytics"
              className="group relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 hover:from-gray-800 hover:to-gray-700 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl border border-gray-700 hover:border-teal-500/50"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300">
                <FiBarChart2 className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-teal-400 transition-colors">
                Advanced Analytics
              </h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Comprehensive analytics suite featuring elasticity heatmaps, ML optimization, A/B testing, 
                and inventory analysis. Get actionable insights with transparent AI explanations.
              </p>
              <div className="flex items-center text-teal-400 font-semibold group-hover:text-teal-300 transition-colors">
                <span>View Analytics</span>
                <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>

          {/* Features Grid */}
          <div className="mt-20 max-w-5xl mx-auto">
            <h3 className="text-3xl font-bold mb-12 text-center">
              <span className="bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">
                Powerful Features
              </span>
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center group">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <FiZap className="text-white text-xl" />
                </div>
                <h4 className="font-semibold text-white mb-2">Real-time Analysis</h4>
                <p className="text-sm text-gray-400">Live data processing and instant insights</p>
              </div>
              
              <div className="text-center group">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <FaBrain className="text-white text-xl" />
                </div>
                <h4 className="font-semibold text-white mb-2">AI-Powered</h4>
                <p className="text-sm text-gray-400">Machine learning optimization algorithms</p>
              </div>
              
              <div className="text-center group">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <FiTarget className="text-white text-xl" />
                </div>
                <h4 className="font-semibold text-white mb-2">Precision Pricing</h4>
                <p className="text-sm text-gray-400">Accurate price recommendations</p>
              </div>
              
              <div className="text-center group">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <FiShield className="text-white text-xl" />
                </div>
                <h4 className="font-semibold text-white mb-2">Secure & Reliable</h4>
                <p className="text-sm text-gray-400">Enterprise-grade security</p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-20 text-center">
            <div className="bg-gradient-to-r from-teal-500/20 to-blue-500/20 rounded-2xl p-8 border border-teal-500/30">
              <h3 className="text-2xl font-bold mb-4 text-white">
                Ready to Transform Your Pricing Strategy?
              </h3>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                Join thousands of businesses using PricePilot to optimize their pricing and maximize profitability. 
                Start your free trial today and see the difference AI-powered pricing can make.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-teal-400 to-teal-600 text-white font-semibold rounded-lg hover:from-teal-500 hover:to-teal-700 transition-all duration-300 transform hover:scale-105"
                >
                  <FaRocket className="mr-2" />
                  Get Started Now
                </Link>
                <Link
                  to="/analytics"
                  className="inline-flex items-center justify-center px-8 py-3 border border-teal-400 text-teal-400 font-semibold rounded-lg hover:bg-teal-400 hover:text-white transition-all duration-300"
                >
                  View Demo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
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
            <Route
              path="/analytics"
              element={
                <PrivateRoute>
                  <AnalyticsDashboard />
                </PrivateRoute>
              }
            />

            <Route path="*" element={<Home />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
