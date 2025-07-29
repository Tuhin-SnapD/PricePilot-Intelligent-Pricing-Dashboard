import React, { useEffect, useState, useContext } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import Navbar from "../common/Navbar";
import { FaChevronLeft, FaSearch, FaSpinner, FaFilter, FaDownload, FaSort, FaCheck, FaTimes, FaExclamationTriangle, FaChartLine, FaLayerGroup } from "react-icons/fa";
import { FiTrendingUp, FiTrendingDown, FiMinus, FiEye, FiEdit, FiTrash2, FiRefreshCw } from "react-icons/fi";
import { AuthContext } from "../../contexts/AuthContext";

const PricingOptimization = () => {
  const { user } = useContext(AuthContext);
  const [optData, setOptData] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [withForecast, setWithForecast] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const navigate = useNavigate();

  // All available categories from the backend
  const categories = [
    "Electronics",
    "Outdoor", 
    "Sustainable",
    "Home",
    "Fitness",
    "Stationary",
    "Apparel"
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");
        
        const { data: productsResponse } = await api.get("/products/");
        const products = productsResponse.success ? productsResponse.data : productsResponse;
        
        let merged;
        if (withForecast) {
          try {
            const { data: optimizationResponse } = await api.get("/products/optimize/");
            const optimization = optimizationResponse.success ? optimizationResponse.data : optimizationResponse;
            const optMap = optimization.reduce(
              (acc, { product_id, optimized_price, optimized_profit, current_price, price_change }) => {
                acc[product_id] = { optimized_price, optimized_profit, current_price, price_change };
                return acc;
              },
              {}
            );
            merged = products.map((p) => ({
              ...p,
              ...optMap[p.id],
            }));
          } catch (optimizationError) {
            console.error("Optimization loading error:", optimizationError);
            merged = products.map((p) => ({ 
              ...p, 
              optimized_price: null,
              optimized_profit: null,
              price_change: null
            }));
          }
        } else {
          merged = products.map((p) => ({ 
            ...p, 
            optimized_price: null,
            optimized_profit: null,
            price_change: null
          }));
        }
        setOptData(merged);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load optimization data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [withForecast]);

  const filtered = optData.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) &&
      (category === "All" || d.category === category)
  );

  const showPrices = user.role !== "buyer";

  // Sorting functionality
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return filtered;

    return [...filtered].sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];

      // Handle numeric values
      if (typeof aVal === 'string' && !isNaN(aVal)) {
        aVal = parseFloat(aVal);
        bVal = parseFloat(bVal);
      }

      if (aVal < bVal) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aVal > bVal) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filtered, sortConfig]);

  // Bulk selection
  const handleSelectAll = () => {
    if (selectedProducts.length === sortedData.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(sortedData.map(item => item.id));
    }
  };

  const handleSelectProduct = (productId) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  // Export functionality
  const handleExport = async () => {
    setIsExporting(true);
    try {
      const selectedData = sortedData.filter(item => selectedProducts.includes(item.id));
      const csvContent = generateCSV(selectedData);
      downloadCSV(csvContent, 'pricing-optimization-data.csv');
    } catch (error) {
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const generateCSV = (data) => {
    const headers = ['Product Name', 'Category', 'Current Price', 'Optimized Price', 'Price Change', 'Expected Profit'];
    const rows = data.map(item => [
      item.name,
      item.category,
      `$${parseFloat(item.selling_price || 0).toFixed(2)}`,
      item.optimized_price ? `$${item.optimized_price.toFixed(2)}` : 'N/A',
      item.price_change ? `$${item.price_change.toFixed(2)}` : 'N/A',
      item.optimized_profit ? `$${item.optimized_profit.toFixed(2)}` : 'N/A'
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const downloadCSV = (content, filename) => {
    const blob = new Blob([content], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Price change indicator component
  const PriceChangeIndicator = ({ change }) => {
    if (change === null || change === undefined) return <span className="text-gray-500">—</span>;
    
    const isPositive = change > 0;
    const isNegative = change < 0;
    const isNeutral = change === 0;
    
    return (
      <div className="flex items-center space-x-1">
        {isPositive && <FiTrendingUp className="w-4 h-4 text-red-500" />}
        {isNegative && <FiTrendingDown className="w-4 h-4 text-green-500" />}
        {isNeutral && <FiMinus className="w-4 h-4 text-gray-500" />}
        <span className={`font-semibold ${
          isPositive ? 'text-red-500' : 
          isNegative ? 'text-green-500' : 'text-gray-500'
        }`}>
          {isPositive ? '+' : ''}${change.toFixed(2)}
        </span>
      </div>
    );
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-black to-gray-800 text-white">
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-400 mx-auto mb-4"></div>
              <p className="text-gray-300">Loading optimization data...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-black to-gray-800 text-white">
        {/* Enhanced Header */}
        <div className="mx-4 mt-4 mb-2 bg-gray-900 rounded-xl px-6 py-4 flex items-center shadow-lg border border-gray-700">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => window.history.back()}
              className="flex items-center text-gray-300 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-800"
            >
              <FaChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-teal-400 to-teal-600 rounded-xl">
                <FaChartLine className="text-white text-lg" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Pricing Optimization</h1>
                <p className="text-sm text-gray-400">AI-powered price recommendations</p>
              </div>
            </div>
          </div>
          
          <div className="flex-1 flex justify-center items-center space-x-6">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={withForecast}
                onChange={() => setWithForecast((f) => !f)}
              />
              <div className="w-11 h-6 bg-gray-700 rounded-full peer-focus:ring-2 peer-focus:ring-teal-400 peer-checked:bg-teal-500 transition-colors" />
              <div className="absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full peer-checked:translate-x-5 transition-transform" />
              <span className="ml-3 text-sm">With Optimized Price</span>
            </label>
            
            <div className="flex gap-3 items-center">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="text"
                  className="w-48 bg-gray-800 border border-gray-700 text-white pl-9 pr-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="relative">
                <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <select
                  className="bg-gray-800 border border-gray-700 text-white px-3 py-2 pl-9 pr-8 rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option>All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => window.location.reload()}
              className="flex items-center space-x-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <FiRefreshCw className="w-4 h-4" />
              <span className="text-sm">Refresh</span>
            </button>
            <button
              onClick={handleExport}
              disabled={isExporting || selectedProducts.length === 0}
              className="flex items-center space-x-2 px-3 py-2 bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors disabled:opacity-50"
            >
              {isExporting ? (
                <FaSpinner className="w-4 h-4 animate-spin" />
              ) : (
                <FaDownload className="w-4 h-4" />
              )}
              <span className="text-sm">Export ({selectedProducts.length})</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="mx-4 mb-4 bg-red-900 border border-red-700 text-red-200 p-4 rounded-lg flex items-center space-x-2">
            <FaExclamationTriangle className="w-4 h-4" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Bulk Actions Bar */}
        {selectedProducts.length > 0 && (
          <div className="mx-4 mb-4 bg-teal-900 border border-teal-700 text-teal-200 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                                 <FaLayerGroup className="w-5 h-5" />
                <span className="font-medium">{selectedProducts.length} products selected</span>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setSelectedProducts([])}
                  className="text-sm text-teal-300 hover:text-teal-100 transition-colors"
                >
                  Clear Selection
                </button>
                <button
                  onClick={handleExport}
                  className="flex items-center space-x-2 px-3 py-1 bg-teal-600 hover:bg-teal-700 rounded text-sm transition-colors"
                >
                  <FaDownload className="w-3 h-3" />
                  <span>Export Selected</span>
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-auto px-4 mb-20">
          {sortedData.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaSearch className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-400 text-lg mb-2">No products found matching your criteria.</p>
              <p className="text-gray-500 text-sm">Try adjusting your search or filter settings.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left text-gray-900 bg-white rounded-xl overflow-hidden shadow-xl">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    {showPrices && (
                      <th className="p-4 border-r border-gray-700">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-teal-400 bg-gray-700 rounded focus:ring-teal-400"
                          checked={selectedProducts.length === sortedData.length && sortedData.length > 0}
                          onChange={handleSelectAll}
                        />
                      </th>
                    )}
                    <th 
                      className="p-4 border-r border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center space-x-2">
                        <span>Product Name</span>
                        <FaSort className="w-3 h-3" />
                      </div>
                    </th>
                    <th 
                      className="p-4 border-r border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors"
                      onClick={() => handleSort('category')}
                    >
                      <div className="flex items-center space-x-2">
                        <span>Category</span>
                        <FaSort className="w-3 h-3" />
                      </div>
                    </th>
                    <th className="p-4 border-r border-gray-700">Description</th>
                    <th 
                      className="p-4 border-r border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors"
                      onClick={() => handleSort('selling_price')}
                    >
                      <div className="flex items-center space-x-2">
                        <span>Current Price</span>
                        <FaSort className="w-3 h-3" />
                      </div>
                    </th>
                    {showPrices && (
                      <>
                        <th className="p-4 border-r border-gray-700">Cost Price</th>
                        <th 
                          className="p-4 border-r border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors"
                          onClick={() => handleSort('optimized_price')}
                        >
                          <div className="flex items-center space-x-2">
                            <span>Optimized Price</span>
                            <FaSort className="w-3 h-3" />
                          </div>
                        </th>
                        <th 
                          className="p-4 border-r border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors"
                          onClick={() => handleSort('price_change')}
                        >
                          <div className="flex items-center space-x-2">
                            <span>Price Change</span>
                            <FaSort className="w-3 h-3" />
                          </div>
                        </th>
                        <th 
                          className="p-4 border-r border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors"
                          onClick={() => handleSort('optimized_profit')}
                        >
                          <div className="flex items-center space-x-2">
                            <span>Expected Profit</span>
                            <FaSort className="w-3 h-3" />
                          </div>
                        </th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {sortedData.map((d, idx) => {
                    const cost = parseFloat(d.cost_price);
                    const sell = parseFloat(d.selling_price);
                    const optimized = d.optimized_price;
                    const priceChange = d.price_change;
                    const expectedProfit = d.optimized_profit;
                    const isSelected = selectedProducts.includes(d.id);
                    
                    return (
                      <tr
                        key={d.id}
                        className={`${idx % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-gray-100 transition-colors ${
                          isSelected ? "bg-teal-50 border-l-4 border-teal-400" : ""
                        }`}
                      >
                        {showPrices && (
                          <td className="p-4 border-r border-gray-300">
                            <input
                              type="checkbox"
                              className="h-4 w-4 text-teal-400 bg-white rounded focus:ring-teal-400"
                              checked={isSelected}
                              onChange={() => handleSelectProduct(d.id)}
                            />
                          </td>
                        )}
                        <td className="p-4 border-r border-gray-300 font-medium">{d.name}</td>
                        <td className="p-4 border-r border-gray-300">
                          <span className="px-3 py-1 bg-gray-200 rounded-full text-xs font-medium">
                            {d.category}
                          </span>
                        </td>
                        <td className="p-4 border-r border-gray-300 max-w-xs truncate">
                          {d.description || "No description"}
                        </td>
                        <td className="p-4 border-r border-gray-300 font-semibold">
                          ${isNaN(sell) ? "—" : sell.toFixed(2)}
                        </td>
                        {showPrices && (
                          <>
                            <td className="p-4 border-r border-gray-300">
                              ${isNaN(cost) ? "—" : cost.toFixed(2)}
                            </td>
                            <td className="p-4 border-r border-gray-300 text-teal-600 font-semibold">
                              {optimized != null ? `$${optimized.toFixed(2)}` : "—"}
                            </td>
                            <td className="p-4 border-r border-gray-300">
                              <PriceChangeIndicator change={priceChange} />
                            </td>
                            <td className="p-4 border-r border-gray-300 text-green-600 font-semibold">
                              {expectedProfit != null ? `$${expectedProfit.toFixed(2)}` : "—"}
                            </td>
                          </>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {/* Enhanced Footer */}
        <div className="fixed bottom-0 left-0 w-full bg-gray-900 px-6 py-4 flex justify-between items-center border-t border-gray-700">
          <div className="flex items-center space-x-6">
            <div className="text-sm text-gray-400">
              Showing {sortedData.length} of {optData.length} products
            </div>
            {selectedProducts.length > 0 && (
              <div className="text-sm text-teal-400 font-medium">
                {selectedProducts.length} selected
              </div>
            )}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => navigate(-1)}
              className="bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg px-4 py-2 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => navigate(-1)}
              className="bg-gradient-to-r from-teal-400 to-teal-600 hover:from-teal-500 hover:to-teal-700 text-black text-sm rounded-lg px-4 py-2 font-semibold transition-all"
            >
              Apply Changes
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PricingOptimization;
