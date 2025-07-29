import React, { useState } from 'react';
import { FiBarChart2, FiPackage, FiTrendingUp, FiGrid, FiLoader, FiRefreshCw, FiDownload, FiShare2, FiSettings } from 'react-icons/fi';
import { FaBrain, FaRocket } from 'react-icons/fa';
import { HiArrowLeft } from 'react-icons/hi2';
import Navbar from '../common/Navbar';
import ElasticityHeatmap from './ElasticityHeatmap';
import MLOptimization from './MLOptimization';
import ABTestingSimulator from './ABTestingSimulator';
import InventoryAnalysis from './InventoryAnalysis';

// Loading Skeleton Component
const LoadingSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gray-700 rounded-lg mr-4"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-700 rounded mb-2"></div>
              <div className="h-3 bg-gray-700 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="h-64 bg-gray-700 rounded"></div>
    </div>
  </div>
);

const AnalyticsDashboard = () => {
  const [activeTab, setActiveTab] = useState('elasticity');
  const [isLoading, setIsLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const tabs = [
    {
      id: 'elasticity',
      name: 'Elasticity Heatmap',
      icon: FiTrendingUp,
      description: 'Price sensitivity analysis by category',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30'
    },
    {
      id: 'ml-optimization',
      name: 'ML Optimization',
      icon: FaBrain,
      description: 'AI-powered pricing recommendations',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30'
    },
    {
      id: 'ab-testing',
      name: 'A/B Testing',
      icon: FiBarChart2,
      description: 'Compare pricing strategies',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30'
    },
    {
      id: 'inventory',
      name: 'Inventory Analysis',
      icon: FiPackage,
      description: 'Stock level optimization',
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/30'
    }
  ];

  const handleRefresh = async () => {
    setIsLoading(true);
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLastRefresh(new Date());
    setIsLoading(false);
  };

  const renderTabContent = () => {
    if (isLoading) {
      return <LoadingSkeleton />;
    }

    switch (activeTab) {
      case 'elasticity':
        return <ElasticityHeatmap />;
      case 'ml-optimization':
        return <MLOptimization />;
      case 'ab-testing':
        return <ABTestingSimulator />;
      case 'inventory':
        return <InventoryAnalysis />;
      default:
        return <ElasticityHeatmap />;
    }
  };

  const activeTabData = tabs.find(tab => tab.id === activeTab);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-black to-gray-800 text-white">
      <Navbar />
      
      {/* Enhanced Header */}
      <div className="mx-4 mt-4 mb-2 bg-gray-900 rounded-xl px-6 py-4 flex items-center shadow-lg border border-gray-700">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => window.history.back()}
            className="flex items-center text-gray-300 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-800"
          >
            <HiArrowLeft className="w-5 h-5" />
          </button>
                      <div className="flex items-center space-x-3">
              <div className={`flex items-center justify-center w-10 h-10 bg-gradient-to-r ${activeTabData?.color} rounded-xl`}>
                {activeTabData?.icon && <activeTabData.icon className="text-white text-lg" />}
              </div>
            <div>
              <h1 className="text-xl font-bold text-white">
                Advanced Analytics Dashboard
              </h1>
              <p className="text-sm text-gray-400">
                Last updated: {lastRefresh.toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex-1 flex justify-center items-center">
          <div className="flex flex-col items-center space-y-2 text-center">
            <div className="flex items-center space-x-3">
              <FaRocket className="text-teal-400 text-xl" />
              <span className="text-sm text-gray-300">AI-Powered Insights</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center space-x-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <FiLoader className="w-4 h-4 animate-spin" />
            ) : (
              <FiRefreshCw className="w-4 h-4" />
            )}
            <span className="text-sm">Refresh</span>
          </button>
          <button className="flex items-center space-x-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
            <FiDownload className="w-4 h-4" />
            <span className="text-sm">Export</span>
          </button>
          <button className="flex items-center space-x-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
            <FiShare2 className="w-4 h-4" />
            <span className="text-sm">Share</span>
          </button>
          <button className="flex items-center space-x-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
            <FiSettings className="w-4 h-4" />
            <span className="text-sm">Settings</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* Enhanced Navigation Tabs */}
        <div className="mb-8">
          <div className="bg-gray-900 rounded-xl p-2 border border-gray-700">
            <nav className="flex space-x-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm flex items-center justify-center space-x-2 transition-all duration-300 ${
                      isActive
                        ? `bg-gradient-to-r ${tab.color} text-white shadow-lg transform scale-105`
                        : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'animate-pulse' : ''}`} />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Enhanced Tab Description */}
        <div className="mb-6">
          {activeTabData && (
            <div className={`${activeTabData.bgColor} ${activeTabData.borderColor} border rounded-xl p-6 backdrop-blur-sm`}>
              <div className="flex items-center space-x-3 mb-3">
                <div className={`flex items-center justify-center w-8 h-8 bg-gradient-to-r ${activeTabData.color} rounded-lg`}>
                  <activeTabData.icon className="text-white text-sm" />
                </div>
                <h3 className="text-lg font-semibold text-white">{activeTabData.name}</h3>
              </div>
              <p className="text-gray-300 leading-relaxed">
                {activeTabData.description}
              </p>
            </div>
          )}
        </div>

        {/* Tab Content with Loading State */}
        <div className="space-y-6">
          {renderTabContent()}
        </div>

        {/* Enhanced Quick Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <div
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`bg-gray-800 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl border ${
                  isActive ? `${tab.borderColor} ${tab.bgColor}` : 'border-gray-700 hover:border-gray-600'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`flex items-center justify-center w-12 h-12 bg-gradient-to-r ${tab.color} rounded-xl`}>
                    <Icon className="text-white text-xl" />
                  </div>
                  {isActive && (
                    <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></div>
                  )}
                </div>
                <div>
                  <div className="text-white font-semibold text-lg mb-1">{tab.name}</div>
                  <div className="text-sm text-gray-400 mb-3">{tab.description}</div>
                  <div className="flex items-center text-teal-400 text-sm font-medium">
                    <span>View Details</span>
                    <FiTrendingUp className="ml-2 w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Enhanced Feature Highlights */}
        <div className="mt-8 bg-gray-900 rounded-xl p-8 border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white flex items-center">
              <FaBrain className="w-6 h-6 mr-3 text-teal-400" />
              Advanced Features
            </h3>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></div>
              <span>AI-Powered</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Price Elasticity Heatmap",
                description: "Visualize price sensitivity across product categories with interactive heatmaps",
                icon: FiTrendingUp,
                color: "from-blue-500 to-cyan-500"
              },
              {
                title: "ML-Based Auto-Repricing",
                description: "Machine learning algorithms analyze patterns to suggest optimal pricing",
                icon: FaBrain,
                color: "from-purple-500 to-pink-500"
              },
              {
                title: "Inventory-Aware Recommendations",
                description: "Smart pricing that considers stock levels and demand forecasts",
                icon: FiPackage,
                color: "from-orange-500 to-red-500"
              },
              {
                title: "A/B Testing Simulator",
                description: "Compare different pricing strategies and their potential outcomes",
                icon: FiBarChart2,
                color: "from-green-500 to-emerald-500"
              },
              {
                title: "Transparent Justification Engine",
                description: "Understand why each pricing recommendation is made with detailed explanations",
                icon: FiGrid,
                color: "from-indigo-500 to-purple-500"
              },
              {
                title: "Real-time Analytics",
                description: "Live updates and insights based on current market conditions",
                icon: FiTrendingUp,
                color: "from-teal-500 to-blue-500"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition-all duration-300 hover:scale-105 border border-gray-700 hover:border-gray-600 group"
              >
                <div className={`flex items-center justify-center w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="text-white text-xl" />
                </div>
                <h4 className="text-white font-semibold mb-3 group-hover:text-teal-400 transition-colors">
                  {feature.title}
                </h4>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold">Optimization Success Rate</h4>
              <FiTrendingUp className="w-6 h-6" />
            </div>
            <div className="text-3xl font-bold mb-2">94.2%</div>
            <p className="text-teal-100 text-sm">+2.1% from last month</p>
          </div>
          
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold">Revenue Impact</h4>
              <FiBarChart2 className="w-6 h-6" />
            </div>
            <div className="text-3xl font-bold mb-2">+18.7%</div>
            <p className="text-blue-100 text-sm">Average increase in profit</p>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold">AI Confidence</h4>
              <FaBrain className="w-6 h-6" />
            </div>
            <div className="text-3xl font-bold mb-2">87.3%</div>
            <p className="text-purple-100 text-sm">Model accuracy score</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard; 