// src/components/forecasts/DemandForecast.js
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { FiX, FiTrendingUp, FiTrendingDown, FiTarget, FiInfo } from "react-icons/fi";
import { FaBrain, FaChartLine } from "react-icons/fa";
import api from "../../api";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function DemandForecastChartModal({ selectedIds, onClose }) {
  const [forecastData, setForecastData] = useState([]);
  const [advancedForecastData, setAdvancedForecastData] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [methodComparisonData, setMethodComparisonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('basic'); // 'basic' or 'advanced'

  useEffect(() => {
    if (!selectedIds.length) {
      setLoading(false);
      return;
    }

    const fetchForecastData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log("Fetching forecast data for selected IDs:", selectedIds);
        
        // Get basic forecast data
        const forecastResponse = await api.get("/products/forecast/");
        const forecastsArray = forecastResponse.data.success ? forecastResponse.data.data : forecastResponse.data;
        
        // Get advanced forecast data
        const advancedResponse = await api.get("/products/advanced-forecast/");
        const advancedData = advancedResponse.data.success ? advancedResponse.data.data : advancedResponse.data;
        
        // Filter for selected products and ensure data structure
        const filteredBasic = forecastsArray
          .filter(f => selectedIds.includes(f.product_id))
          .map(f => ({
            product_id: f.product_id,
            name: f.name,
            stock_available: parseInt(f.stock_available) || 0,
            units_sold: parseInt(f.units_sold) || 0,
            forecast: parseInt(f.forecast) || 0
          }));
        
        const filteredAdvanced = advancedData
          .filter(f => selectedIds.includes(f.product_id))
          .map(f => ({
            ...f,
            forecast_summary: {
              ensemble_forecast: parseInt(f.forecast_summary?.ensemble_forecast) || 0,
              confidence: parseFloat(f.forecast_summary?.confidence) || 0.5,
              growth_rate: parseFloat(f.forecast_summary?.growth_rate) || 0,
              volatility: parseFloat(f.forecast_summary?.volatility) || 0
            },
            forecast_methods: {
              linear_regression: {
                forecast: parseInt(f.forecast_methods?.linear_regression?.forecast) || 0,
                description: f.forecast_methods?.linear_regression?.description || 'Linear trend projection'
              },
              exponential_smoothing: {
                forecast: parseInt(f.forecast_methods?.exponential_smoothing?.forecast) || 0,
                description: f.forecast_methods?.exponential_smoothing?.description || 'Weighted average with trend adjustment'
              },
              moving_average: {
                forecast: parseInt(f.forecast_methods?.moving_average?.forecast) || 0,
                description: f.forecast_methods?.moving_average?.description || 'Smooth trend with window averaging'
              },
              seasonal_decomposition: {
                forecast: parseInt(f.forecast_methods?.seasonal_decomposition?.forecast) || 0,
                description: f.forecast_methods?.seasonal_decomposition?.description || 'Trend + seasonal component analysis'
              }
            },
            recommendations: f.recommendations || []
          }));
        
        setForecastData(filteredBasic);
        setAdvancedForecastData(filteredAdvanced);
        
        // Create basic chart data
        const chartConfig = {
          labels: filteredBasic.map((d) => d.name),
          datasets: [
            {
              label: "Demand Forecast",
              data: filteredBasic.map((d) => d.forecast),
              borderColor: "#10b981",
              backgroundColor: "rgba(16, 185, 129, 0.1)",
              borderWidth: 3,
              tension: 0.2,
              fill: false,
            },
            {
              label: "Available Stock",
              data: filteredBasic.map((d) => d.stock_available),
              borderColor: "#3b82f6",
              backgroundColor: "rgba(59, 130, 246, 0.1)",
              borderWidth: 2,
              tension: 0.1,
              fill: false,
            },
            {
              label: "Units Sold",
              data: filteredBasic.map((d) => d.units_sold),
              borderColor: "#f59e0b",
              backgroundColor: "rgba(245, 158, 11, 0.1)",
              borderWidth: 2,
              tension: 0.1,
              fill: false,
            },
          ],
        };
        
        setChartData(chartConfig);
        
        // Create method comparison chart
        if (filteredAdvanced.length > 0) {
          const methodData = {
            labels: filteredAdvanced.map(d => d.name),
            datasets: [
              {
                label: "Linear Regression",
                data: filteredAdvanced.map(d => d.forecast_methods.linear_regression.forecast),
                backgroundColor: "rgba(59, 130, 246, 0.8)",
                borderColor: "#3b82f6",
                borderWidth: 1,
              },
              {
                label: "Exponential Smoothing",
                data: filteredAdvanced.map(d => d.forecast_methods.exponential_smoothing.forecast),
                backgroundColor: "rgba(16, 185, 129, 0.8)",
                borderColor: "#10b981",
                borderWidth: 1,
              },
              {
                label: "Moving Average",
                data: filteredAdvanced.map(d => d.forecast_methods.moving_average.forecast),
                backgroundColor: "rgba(245, 158, 11, 0.8)",
                borderColor: "#f59e0b",
                borderWidth: 1,
              },
              {
                label: "Seasonal Decomposition",
                data: filteredAdvanced.map(d => d.forecast_methods.seasonal_decomposition.forecast),
                backgroundColor: "rgba(139, 92, 246, 0.8)",
                borderColor: "#8b5cf6",
                borderWidth: 1,
              },
              {
                label: "Ensemble (Recommended)",
                data: filteredAdvanced.map(d => d.forecast_summary.ensemble_forecast),
                backgroundColor: "rgba(239, 68, 68, 0.8)",
                borderColor: "#ef4444",
                borderWidth: 2,
              },
            ],
          };
          setMethodComparisonData(methodData);
        }
        
      } catch (err) {
        console.error("Error fetching forecast data:", err);
        setError("Failed to load forecast data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchForecastData();
  }, [selectedIds]);

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return "text-green-400";
    if (confidence >= 0.6) return "text-yellow-400";
    return "text-red-400";
  };

  const getGrowthIcon = (growthRate) => {
    if (growthRate > 10) return <FiTrendingUp className="text-green-400" />;
    if (growthRate < -10) return <FiTrendingDown className="text-red-400" />;
    return <FiTarget className="text-gray-400" />;
  };

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
      <div className="w-full max-w-6xl mx-4 rounded-xl overflow-hidden shadow-xl bg-gray-900 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 bg-gray-800">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg">
              <FaChartLine className="text-white text-lg" />
            </div>
            <h2 className="text-xl font-semibold text-white">
              Advanced Demand Forecast Analysis
          </h2>
            <span className="text-sm text-gray-400">({selectedIds.length} products selected)</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode('basic')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  viewMode === 'basic'
                    ? 'bg-teal-500 text-black'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Basic View
              </button>
              <button
                onClick={() => setViewMode('advanced')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  viewMode === 'advanced'
                    ? 'bg-teal-500 text-black'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Advanced Analysis
              </button>
            </div>
            <FiX
              size={24}
            onClick={onClose}
            className="text-red-500 hover:text-red-600 cursor-pointer"
          />
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-400 mx-auto mb-4"></div>
                <p className="text-gray-400">Loading advanced forecast data...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <p className="text-red-400 mb-4">{error}</p>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-teal-500 text-black rounded hover:bg-teal-600"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 space-y-6">
              {/* Chart Section */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                  <div className="flex items-center justify-center w-6 h-6 bg-gradient-to-br from-teal-400 to-teal-600 rounded mr-2">
                    <FaBrain className="text-white text-sm" />
                  </div>
                  {viewMode === 'basic' ? 'Demand Forecast Overview' : 'Forecasting Method Comparison'}
                </h3>
                <div className="h-80">
                  {viewMode === 'basic' && chartData ? (
              <Line
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { 
                            position: "top", 
                            labels: { 
                              color: "#ddd",
                              usePointStyle: true,
                              padding: 20
                            } 
                          },
                          tooltip: {
                            backgroundColor: "rgba(0, 0, 0, 0.9)",
                            titleColor: "#fff",
                            bodyColor: "#fff",
                            borderColor: "#333",
                            borderWidth: 1
                          }
                        },
                        scales: {
                          x: {
                            ticks: { 
                              color: "#ddd", 
                              maxRotation: 45, 
                              minRotation: 45 
                            },
                            grid: { color: "rgba(255, 255, 255, 0.1)" },
                          },
                          y: { 
                            ticks: { color: "#ddd" }, 
                            grid: { color: "rgba(255, 255, 255, 0.1)" } 
                          },
                        },
                      }}
                    />
                  ) : viewMode === 'advanced' && methodComparisonData ? (
                    <Bar
                      data={methodComparisonData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { 
                            position: "top", 
                      labels: { 
                        color: "#ddd",
                        usePointStyle: true,
                        padding: 20
                      } 
                    },
                    tooltip: {
                            backgroundColor: "rgba(0, 0, 0, 0.9)",
                      titleColor: "#fff",
                      bodyColor: "#fff",
                      borderColor: "#333",
                      borderWidth: 1
                    }
                  },
                  scales: {
                    x: {
                      ticks: { 
                        color: "#ddd", 
                        maxRotation: 45, 
                        minRotation: 45 
                      },
                      grid: { color: "rgba(255, 255, 255, 0.1)" },
                    },
                    y: { 
                      ticks: { color: "#ddd" }, 
                      grid: { color: "rgba(255, 255, 255, 0.1)" } 
                    },
                  },
                }}
              />
          ) : (
                    <div className="flex items-center justify-center h-full">
              <p className="text-gray-400">No chart data available</p>
            </div>
          )}
                </div>
        </div>

              {/* Advanced Analysis Table */}
              {viewMode === 'advanced' && advancedForecastData.length > 0 && (
                <div className="bg-gray-800 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-white mb-4">Detailed Forecast Analysis</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="text-left py-3 px-4 text-gray-300">Product</th>
                          <th className="text-center py-3 px-4 text-gray-300">Ensemble Forecast</th>
                          <th className="text-center py-3 px-4 text-gray-300">Confidence</th>
                          <th className="text-center py-3 px-4 text-gray-300">Growth Rate</th>
                          <th className="text-center py-3 px-4 text-gray-300">Volatility</th>
                          <th className="text-center py-3 px-4 text-gray-300">Recommendations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                        {advancedForecastData.map((item, index) => (
                          <tr key={item.product_id} className={index % 2 ? "bg-gray-700" : "bg-gray-800"}>
                            <td className="py-3 px-4 text-white font-medium">{item.name}</td>
                            <td className="py-3 px-4 text-center">
                              <span className="text-2xl font-bold text-teal-400">
                                {item.forecast_summary.ensemble_forecast.toLocaleString()}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span className={`font-bold ${getConfidenceColor(item.forecast_summary.confidence)}`}>
                                {(item.forecast_summary.confidence * 100).toFixed(0)}%
                              </span>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <div className="flex items-center justify-center space-x-1">
                                {getGrowthIcon(item.forecast_summary.growth_rate)}
                                <span className={`font-medium ${
                                  item.forecast_summary.growth_rate > 10 ? 'text-green-400' :
                                  item.forecast_summary.growth_rate < -10 ? 'text-red-400' : 'text-gray-400'
                                }`}>
                                  {item.forecast_summary.growth_rate > 0 ? '+' : ''}{item.forecast_summary.growth_rate}%
                                </span>
                              </div>
                    </td>
                            <td className="py-3 px-4 text-center">
                              <span className={`font-medium ${
                                item.forecast_summary.volatility > 30 ? 'text-red-400' :
                                item.forecast_summary.volatility > 15 ? 'text-yellow-400' : 'text-green-400'
                              }`}>
                                {item.forecast_summary.volatility}%
                              </span>
                    </td>
                            <td className="py-3 px-4">
                              <div className="space-y-1">
                                {item.recommendations.slice(0, 2).map((rec, idx) => (
                                  <div key={idx} className="text-xs text-gray-300">
                                    • {rec.message}
                                  </div>
                                ))}
                              </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
                  </div>
                </div>
              )}

              {/* Basic Forecast Table */}
              {viewMode === 'basic' && forecastData.length > 0 && (
                <div className="bg-gray-800 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-white mb-4">Forecast Summary</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="text-left py-3 px-4 text-gray-300">Product Name</th>
                          <th className="text-center py-3 px-4 text-gray-300">Available Stock</th>
                          <th className="text-center py-3 px-4 text-gray-300">Units Sold</th>
                          <th className="text-center py-3 px-4 text-gray-300">Demand Forecast</th>
                          <th className="text-center py-3 px-4 text-gray-300">Stock Gap</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700">
                        {forecastData.map((d, i) => {
                          const stockGap = d.forecast - d.stock_available;
                          return (
                            <tr key={d.product_id} className={i % 2 ? "bg-gray-700" : "bg-gray-800"}>
                              <td className="py-3 px-4 text-white font-medium">{d.name}</td>
                              <td className="py-3 px-4 text-center text-gray-200">
                                {d.stock_available.toLocaleString()}
                              </td>
                              <td className="py-3 px-4 text-center text-gray-200">
                                {d.units_sold.toLocaleString()}
                              </td>
                              <td className="py-3 px-4 text-center">
                                <span className="text-xl font-bold text-teal-400">
                                  {d.forecast.toLocaleString()}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-center">
                                <span className={`font-bold ${
                                  stockGap > 0 ? 'text-red-400' : 'text-green-400'
                                }`}>
                                  {stockGap > 0 ? '+' : ''}{stockGap.toLocaleString()}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
          </div>
        )}
        </div>
      </div>
    </div>
  );

  if (!selectedIds.length) {
    return ReactDOM.createPortal(
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
        <div className="p-8 text-center text-gray-300 bg-gray-900 rounded-xl shadow-lg">
          <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl mx-auto mb-4">
            <FaChartLine className="text-white text-2xl" />
          </div>
          <p className="mb-4 text-lg font-medium">No products selected for forecast.</p>
          <p className="text-sm text-gray-400 mb-6">Please select one or more products to view their demand forecast analysis.</p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-teal-500 text-black rounded-lg hover:bg-teal-600 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>,
      document.body
    );
  }

  return ReactDOM.createPortal(modalContent, document.body);
}
