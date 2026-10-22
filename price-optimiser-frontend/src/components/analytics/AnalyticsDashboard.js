import React, { useState } from "react";
import { FiBarChart2, FiPackage, FiTrendingUp, FiRefreshCw } from "react-icons/fi";
import { FaBrain, FaRocket } from "react-icons/fa";
import { HiArrowLeft } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import Navbar from "../common/Navbar";
import ElasticityHeatmap from "./ElasticityHeatmap";
import MLOptimization from "./MLOptimization";
import ABTestingSimulator from "./ABTestingSimulator";
import InventoryAnalysis from "./InventoryAnalysis";

const AnalyticsDashboard = () => {
  const [activeTab, setActiveTab] = useState("elasticity");
  const [refreshKey, setRefreshKey] = useState(0);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const navigate = useNavigate();

  const tabs = [
    {
      id: "elasticity",
      name: "Elasticity Heatmap",
      icon: FiTrendingUp,
      description: "Price sensitivity analysis by category",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/30",
    },
    {
      id: "ml-optimization",
      name: "ML Optimization",
      icon: FaBrain,
      description: "AI-powered pricing recommendations",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/30",
    },
    {
      id: "ab-testing",
      name: "A/B Testing",
      icon: FiBarChart2,
      description: "Compare pricing strategies",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/30",
    },
    {
      id: "inventory",
      name: "Inventory Analysis",
      icon: FiPackage,
      description: "Stock level optimization",
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/30",
    },
  ];

  const handleRefresh = () => {
    setLastRefresh(new Date());
    setRefreshKey((key) => key + 1);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "elasticity":
        return <ElasticityHeatmap />;
      case "ml-optimization":
        return <MLOptimization />;
      case "ab-testing":
        return <ABTestingSimulator />;
      case "inventory":
        return <InventoryAnalysis />;
      default:
        return <ElasticityHeatmap />;
    }
  };

  const activeTabData = tabs.find((tab) => tab.id === activeTab);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-black to-gray-800 text-white">
      <Navbar />

      <div className="mx-4 mt-4 mb-2 bg-gray-900 rounded-xl px-4 sm:px-6 py-4 flex flex-wrap items-center gap-4 shadow-lg border border-gray-700">
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={() => navigate("/")}
            aria-label="Back to dashboard"
            className="flex items-center text-gray-300 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-800"
          >
            <HiArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-3">
            <div
              className={`flex items-center justify-center w-10 h-10 bg-gradient-to-r ${activeTabData?.color} rounded-xl`}
            >
              {activeTabData?.icon && <activeTabData.icon className="text-white text-lg" />}
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Advanced Analytics Dashboard</h1>
              <p className="text-sm text-gray-400">
                Last updated: {lastRefresh.toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>

        <div className="hidden md:flex flex-1 justify-center items-center">
          <div className="flex items-center space-x-3">
            <FaRocket className="text-teal-400 text-xl" />
            <span className="text-sm text-gray-300">AI-Powered Insights</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          className="flex items-center space-x-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors ml-auto"
        >
          <FiRefreshCw className="w-4 h-4" />
          <span className="text-sm">Refresh</span>
        </button>
      </div>

      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <div className="bg-gray-900 rounded-xl p-2 border border-gray-700">
            <nav className="flex flex-wrap gap-2" aria-label="Analytics sections">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    aria-pressed={isActive}
                    className={`flex-1 min-w-[150px] py-3 px-4 rounded-lg font-medium text-sm flex items-center justify-center space-x-2 transition-all duration-200 ${
                      isActive
                        ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                        : "text-gray-400 hover:text-gray-300 hover:bg-gray-800"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {activeTabData && (
          <div
            className={`mb-6 ${activeTabData.bgColor} ${activeTabData.borderColor} border rounded-xl p-6`}
          >
            <div className="flex items-center space-x-3 mb-3">
              <div
                className={`flex items-center justify-center w-8 h-8 bg-gradient-to-r ${activeTabData.color} rounded-lg`}
              >
                <activeTabData.icon className="text-white text-sm" />
              </div>
              <h3 className="text-lg font-semibold text-white">{activeTabData.name}</h3>
            </div>
            <p className="text-gray-300 leading-relaxed">{activeTabData.description}</p>
          </div>
        )}

        <div key={`${activeTab}-${refreshKey}`} className="space-y-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
