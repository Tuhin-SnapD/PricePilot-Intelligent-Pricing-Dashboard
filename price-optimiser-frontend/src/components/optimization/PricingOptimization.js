import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import Navbar from "../common/Navbar";
import {
  FaChevronLeft,
  FaSearch,
  FaFilter,
  FaDownload,
  FaSort,
  FaExclamationTriangle,
  FaChartLine,
  FaLayerGroup,
} from "react-icons/fa";
import { FiTrendingUp, FiTrendingDown, FiMinus, FiRefreshCw } from "react-icons/fi";
import { AuthContext } from "../../contexts/AuthContext";
import { formatCurrency } from "../../utils/format";

const PricingOptimization = () => {
  const { user } = useContext(AuthContext);
  const [optData, setOptData] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [withForecast, setWithForecast] = useState(true);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [optimizationWarning, setOptimizationWarning] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const navigate = useNavigate();

  const fetchData = useCallback(
    async (showSpinner = true) => {
      if (showSpinner) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }
      setError("");
      setOptimizationWarning("");

      try {
        const productsResponse = await api.get("/products/");
        const products = productsResponse.data.success
          ? productsResponse.data.data
          : productsResponse.data;
        const productList = Array.isArray(products) ? products : [];

        let merged = productList.map((product) => ({
          ...product,
          optimized_price: null,
          optimized_profit: null,
          price_change: null,
        }));

        if (withForecast) {
          try {
            const optimizationResponse = await api.get("/products/optimize/");
            const optimization = optimizationResponse.data.success
              ? optimizationResponse.data.data
              : optimizationResponse.data;

            const optimizationMap = (Array.isArray(optimization) ? optimization : []).reduce(
              (accumulator, item) => {
                accumulator[item.product_id] = {
                  optimized_price: item.optimized_price,
                  optimized_profit: item.optimized_profit,
                  current_price: item.current_price,
                  price_change: item.price_change,
                };
                return accumulator;
              },
              {}
            );

            merged = productList.map((product) => ({
              ...product,
              ...(optimizationMap[product.id] || {}),
            }));
          } catch (optimizationError) {
            setOptimizationWarning(
              "Optimized prices are unavailable right now. Showing current product data."
            );
          }
        }

        setOptData(merged);
      } catch (err) {
        setError("Failed to load pricing data. Please try again.");
        setOptData([]);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [withForecast]
  );

  useEffect(() => {
    fetchData(true);
  }, [fetchData]);

  const categories = useMemo(
    () => Array.from(new Set(optData.map((item) => item.category).filter(Boolean))).sort(),
    [optData]
  );

  const showPrices = Boolean(user) && user.role !== "buyer";
  const showOptimized = showPrices && withForecast;

  const filtered = useMemo(
    () =>
      optData.filter(
        (item) =>
          item.name.toLowerCase().includes(search.toLowerCase()) &&
          (category === "All" || item.category === category)
      ),
    [optData, search, category]
  );

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filtered;

    return [...filtered].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      const aNumber = Number(aValue);
      const bNumber = Number(bValue);
      const comparison =
        Number.isFinite(aNumber) &&
        Number.isFinite(bNumber) &&
        aValue !== "" &&
        bValue !== ""
          ? aNumber - bNumber
          : String(aValue).localeCompare(String(bValue));

      return sortConfig.direction === "asc" ? comparison : -comparison;
    });
  }, [filtered, sortConfig]);

  const allVisibleSelected =
    sortedData.length > 0 &&
    sortedData.every((item) => selectedProducts.includes(item.id));

  const handleSelectAll = () => {
    if (allVisibleSelected) {
      setSelectedProducts((previous) =>
        previous.filter((id) => !sortedData.some((item) => item.id === id))
      );
    } else {
      setSelectedProducts((previous) =>
        Array.from(new Set([...previous, ...sortedData.map((item) => item.id)]))
      );
    }
  };

  const handleSelectProduct = (productId) => {
    setSelectedProducts((previous) =>
      previous.includes(productId)
        ? previous.filter((id) => id !== productId)
        : [...previous, productId]
    );
  };

  const escapeCsv = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;

  const handleExport = () => {
    const selectedData = sortedData.filter((item) => selectedProducts.includes(item.id));
    if (selectedData.length === 0) return;

    const headers = [
      "Product Name",
      "Category",
      "Current Price",
      "Optimized Price",
      "Price Change",
      "Expected Profit",
    ];
    const rows = selectedData.map((item) => [
      item.name,
      item.category,
      formatCurrency(item.selling_price),
      item.optimized_price != null ? formatCurrency(item.optimized_price) : "N/A",
      item.price_change != null ? formatCurrency(item.price_change) : "N/A",
      item.optimized_profit != null ? formatCurrency(item.optimized_profit) : "N/A",
    ]);
    const csvContent = [headers, ...rows]
      .map((row) => row.map(escapeCsv).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "pricing-optimization-data.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const PriceChangeIndicator = ({ change }) => {
    const value = Number(change);
    if (change == null || !Number.isFinite(value)) {
      return <span className="text-gray-500">—</span>;
    }

    const isPositive = value > 0;
    const isNegative = value < 0;

    return (
      <div className="flex items-center space-x-1">
        {isPositive && <FiTrendingUp className="w-4 h-4 text-green-600" />}
        {isNegative && <FiTrendingDown className="w-4 h-4 text-red-600" />}
        {!isPositive && !isNegative && <FiMinus className="w-4 h-4 text-gray-500" />}
        <span
          className={`font-semibold ${
            isPositive ? "text-green-600" : isNegative ? "text-red-600" : "text-gray-500"
          }`}
        >
          {isPositive ? "+" : ""}
          {formatCurrency(value)}
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
        <div className="mx-4 mt-4 mb-3 bg-gray-900 rounded-xl px-4 sm:px-6 py-4 flex flex-wrap items-center gap-4 shadow-lg border border-gray-700">
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={() => navigate("/")}
              aria-label="Back to dashboard"
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

          <div className="flex flex-1 flex-wrap justify-center items-center gap-4 min-w-[260px]">
            <label className="relative inline-flex items-center cursor-pointer select-none">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={withForecast}
                onChange={() => setWithForecast((value) => !value)}
              />
              <div className="w-11 h-6 bg-gray-700 rounded-full peer-focus:ring-2 peer-focus:ring-teal-400 peer-checked:bg-teal-500 transition-colors" />
              <div className="absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full peer-checked:translate-x-5 transition-transform" />
              <span className="ml-3 text-sm">Show optimized prices</span>
            </label>

            <div className="flex flex-wrap gap-3 items-center">
              <div className="relative">
                <label htmlFor="optimization-search" className="sr-only">
                  Search products
                </label>
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  id="optimization-search"
                  type="text"
                  className="w-48 bg-gray-800 border border-gray-700 text-white pl-9 pr-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="relative">
                <label htmlFor="optimization-category" className="sr-only">
                  Filter by category
                </label>
                <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <select
                  id="optimization-category"
                  className="bg-gray-800 border border-gray-700 text-white px-3 py-2 pl-9 pr-8 rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="All">All Categories</option>
                  {categories.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
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

          <div className="flex items-center space-x-3 ml-auto">
            <button
              type="button"
              onClick={() => fetchData(false)}
              disabled={refreshing}
              className="flex items-center space-x-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
            >
              <FiRefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
              <span className="text-sm">Refresh</span>
            </button>
            <button
              type="button"
              onClick={handleExport}
              disabled={selectedProducts.length === 0}
              className="flex items-center space-x-2 px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaDownload className="w-4 h-4" />
              <span className="text-sm">Export ({selectedProducts.length})</span>
            </button>
          </div>
        </div>

        {error && (
          <div role="alert" className="mx-4 mb-4 bg-red-900 border border-red-700 text-red-200 p-4 rounded-lg flex items-center space-x-2">
            <FaExclamationTriangle className="w-4 h-4" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {optimizationWarning && (
          <div role="status" className="mx-4 mb-4 bg-yellow-900 border border-yellow-700 text-yellow-100 p-4 rounded-lg">
            <p className="text-sm">{optimizationWarning}</p>
          </div>
        )}

        {selectedProducts.length > 0 && (
          <div className="mx-4 mb-4 bg-teal-900 border border-teal-700 text-teal-200 p-4 rounded-lg">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <FaLayerGroup className="w-5 h-5" />
                <span className="font-medium">{selectedProducts.length} products selected</span>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setSelectedProducts([])}
                  className="text-sm text-teal-300 hover:text-teal-100 transition-colors"
                >
                  Clear Selection
                </button>
                <button
                  type="button"
                  onClick={handleExport}
                  className="flex items-center space-x-2 px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded text-sm transition-colors"
                >
                  <FaDownload className="w-3 h-3" />
                  <span>Export Selected</span>
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 px-4 pb-8">
          {sortedData.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaSearch className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-400 text-lg mb-2">No products found matching your criteria.</p>
              <p className="text-gray-500 text-sm">Try adjusting your search or filter settings.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left text-gray-900 bg-white rounded-xl overflow-hidden shadow-xl">
                  <thead className="bg-gray-800 text-white">
                    <tr>
                      {showPrices && (
                        <th className="p-4 border-r border-gray-700">
                          <input
                            type="checkbox"
                            aria-label="Select all visible products"
                            className="h-4 w-4 text-teal-400 bg-gray-700 rounded focus:ring-teal-400"
                            checked={allVisibleSelected}
                            onChange={handleSelectAll}
                          />
                        </th>
                      )}
                      <th
                        className="p-4 border-r border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors"
                        onClick={() => handleSort("name")}
                      >
                        <div className="flex items-center space-x-2">
                          <span>Product Name</span>
                          <FaSort className="w-3 h-3" />
                        </div>
                      </th>
                      <th
                        className="p-4 border-r border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors"
                        onClick={() => handleSort("category")}
                      >
                        <div className="flex items-center space-x-2">
                          <span>Category</span>
                          <FaSort className="w-3 h-3" />
                        </div>
                      </th>
                      <th className="p-4 border-r border-gray-700">Description</th>
                      <th
                        className="p-4 border-r border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors"
                        onClick={() => handleSort("selling_price")}
                      >
                        <div className="flex items-center space-x-2">
                          <span>Current Price</span>
                          <FaSort className="w-3 h-3" />
                        </div>
                      </th>
                      {showPrices && (
                        <th className="p-4 border-r border-gray-700">Cost Price</th>
                      )}
                      {showOptimized && (
                        <>
                          <th
                            className="p-4 border-r border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors"
                            onClick={() => handleSort("optimized_price")}
                          >
                            <div className="flex items-center space-x-2">
                              <span>Optimized Price</span>
                              <FaSort className="w-3 h-3" />
                            </div>
                          </th>
                          <th
                            className="p-4 border-r border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors"
                            onClick={() => handleSort("price_change")}
                          >
                            <div className="flex items-center space-x-2">
                              <span>Price Change</span>
                              <FaSort className="w-3 h-3" />
                            </div>
                          </th>
                          <th
                            className="p-4 border-r border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors"
                            onClick={() => handleSort("optimized_profit")}
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
                    {sortedData.map((item, index) => {
                      const isSelected = selectedProducts.includes(item.id);
                      return (
                        <tr
                          key={item.id}
                          className={`${
                            isSelected
                              ? "bg-teal-50 border-l-4 border-teal-400"
                              : index % 2 === 0
                              ? "bg-gray-50"
                              : "bg-white"
                          } hover:bg-gray-100 transition-colors`}
                        >
                          {showPrices && (
                            <td className="p-4 border-r border-gray-300">
                              <input
                                type="checkbox"
                                aria-label={`Select ${item.name}`}
                                className="h-4 w-4 text-teal-400 bg-white rounded focus:ring-teal-400"
                                checked={isSelected}
                                onChange={() => handleSelectProduct(item.id)}
                              />
                            </td>
                          )}
                          <td className="p-4 border-r border-gray-300 font-medium">{item.name}</td>
                          <td className="p-4 border-r border-gray-300">
                            <span className="px-3 py-1 bg-gray-200 rounded-full text-xs font-medium">
                              {item.category}
                            </span>
                          </td>
                          <td className="p-4 border-r border-gray-300 max-w-xs truncate">
                            {item.description || "No description"}
                          </td>
                          <td className="p-4 border-r border-gray-300 font-semibold">
                            {formatCurrency(item.selling_price)}
                          </td>
                          {showPrices && (
                            <td className="p-4 border-r border-gray-300">
                              {formatCurrency(item.cost_price)}
                            </td>
                          )}
                          {showOptimized && (
                            <>
                              <td className="p-4 border-r border-gray-300 text-teal-600 font-semibold">
                                {item.optimized_price != null
                                  ? formatCurrency(item.optimized_price)
                                  : "—"}
                              </td>
                              <td className="p-4 border-r border-gray-300">
                                <PriceChangeIndicator change={item.price_change} />
                              </td>
                              <td className="p-4 border-r border-gray-300 text-green-600 font-semibold">
                                {item.optimized_profit != null
                                  ? formatCurrency(item.optimized_profit)
                                  : "—"}
                              </td>
                            </>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm text-gray-400">
                <div className="flex items-center space-x-6">
                  <span>
                    Showing {sortedData.length} of {optData.length} products
                  </span>
                  {selectedProducts.length > 0 && (
                    <span className="text-teal-400 font-medium">
                      {selectedProducts.length} selected
                    </span>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default PricingOptimization;
