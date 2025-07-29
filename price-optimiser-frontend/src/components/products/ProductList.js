import React, { useState, useEffect, useCallback } from "react";
import { HiArrowLeft } from "react-icons/hi2";
import { FiX } from "react-icons/fi";
import { FaPlus, FaChartLine } from "react-icons/fa";
import api from "../../api";
import Navbar from "../common/Navbar";
import ProductTable from "./ProductTable";
import ProductForm from "./ProductForm";
import SearchFilter from "./SearchFilter";
import DemandForecastChartModal from "../forecasts/DemandForecast";

export default function ProductList() {
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewProduct, setViewProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showForecast, setShowForecast] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [category, setCategory] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const { data: response } = await api.get("/products/");
      let prods = response.success ? response.data : response;

      if (showForecast && prods.length) {
        try {
          const { data: forecastResponse } = await api.get("/products/forecast/");
          const forecastsArray = forecastResponse.success ? forecastResponse.data : forecastResponse;
          const forecastsMap = forecastsArray.reduce(
            (map, { product_id, forecast }) => {
              map[product_id] = forecast;
              return map;
            },
            {}
          );
          prods = prods.map((p) => ({
            ...p,
            demand_forecast: forecastsMap[p.id] ?? 0,
          }));
        } catch (error) {
          console.error("Forecast loading error:", error);
          prods = prods.map((p) => ({ ...p, demand_forecast: 0 }));
        }
      } else {
        prods = prods.map((p) => ({ ...p, demand_forecast: 0 }));
      }

      setAllProducts(prods);
      setErrorMessage("");
    } catch (err) {
      console.error("Error loading products:", err);
      setAllProducts([]);
      setErrorMessage(
        err.response?.status === 403
          ? "🚫 Buyers cannot manage products."
          : "❌ Error fetching products."
      );
    } finally {
      setLoading(false);
    }
  }, [showForecast]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    setProducts(
      allProducts.filter((p) => {
        const byName = searchText
          ? p.name.toLowerCase().includes(searchText.toLowerCase())
          : true;
        const byCat = category ? p.category === category : true;
        return byName && byCat;
      })
    );
  }, [allProducts, searchText, category]);

  const handleFilter = ({ name, category }) => {
    setSearchText(name);
    setCategory(category);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/products/${id}/`);
      await loadProducts();
      setSelectedIds((prev) => prev.filter((sid) => sid !== id));
    } catch (error) {
      console.error("Delete error:", error);
      setErrorMessage("Failed to delete product. Please try again.");
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-black to-gray-800 text-white">
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-400 mx-auto mb-4"></div>
              <p className="text-gray-300">Loading products...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-black to-gray-800 text-white">
      <Navbar />
      <div className="mx-4 mt-4 mb-2 bg-gray-900 rounded-lg px-4 py-3 flex items-center">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => window.history.back()}
            className="flex items-center text-gray-300 hover:text-white transition-colors"
          >
            <HiArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-base font-semibold">
            Create and Manage Products
          </span>
        </div>
        <div className="flex-1 flex justify-center items-center space-x-6">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={showForecast}
              onChange={() => setShowForecast((v) => !v)}
            />
            <div className="w-11 h-6 bg-gray-700 rounded-full peer-focus:ring-2 peer-focus:ring-teal-400 peer-checked:bg-teal-500 transition-colors" />
            <div className="absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full peer-checked:translate-x-5 transition-transform" />
            <span className="ml-3 text-sm">With Demand Forecast</span>
          </label>
          <div className="w-1/3">
            <SearchFilter onSearch={handleFilter} />
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              setEditingProduct(null);
              setShowForm(true);
            }}
            className="bg-teal-400 hover:bg-teal-500 text-black text-sm rounded px-3 py-1 flex items-center space-x-1 transition-colors"
          >
            <FaPlus className="w-3 h-3" />
            <span>Add New</span>
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="bg-teal-400 hover:bg-teal-500 text-black text-sm rounded px-3 py-1 flex items-center space-x-1 transition-colors"
          >
            <FaChartLine className="w-3 h-3" />
            <span>Forecast</span>
          </button>
        </div>
      </div>
      
      {errorMessage && (
        <div className="mx-4 mb-4 bg-red-900 border border-red-700 text-red-200 p-3 rounded-lg">
          <p className="text-sm">{errorMessage}</p>
        </div>
      )}
      
      {showForm && (
        <div className="mx-4 mb-4">
          <ProductForm
            product={editingProduct}
            onSave={() => {
              setShowForm(false);
              loadProducts();
            }}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}
      
      {viewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 px-4">
          <div className="relative w-full max-w-md bg-gray-900 text-white rounded-lg p-6">
            <button
              type="button"
              onClick={() => setViewProduct(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-200"
            >
              <FiX className="w-6 h-6" />
            </button>
            <h3 className="text-xl font-semibold mb-4">Product Details</h3>
            <div className="space-y-2">
              <p>
                <strong>Demand Forecast:</strong>{" "}
                {viewProduct.demand_forecast.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex-1 overflow-auto px-4 pb-20">
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No products found matching your criteria.</p>
          </div>
        ) : (
          <ProductTable
            products={products}
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
            onView={(prod) => setViewProduct(prod)}
            onEdit={(prod) => {
              setEditingProduct(prod);
              setShowForm(true);
            }}
            onDelete={handleDelete}
            showForecast={showForecast}
          />
        )}
      </div>
      
      <div className="fixed bottom-0 left-0 w-full bg-gray-900 px-4 py-3 flex justify-between items-center">
        <div className="text-sm text-gray-400">
          Showing {products.length} of {allProducts.length} products
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => window.history.back()}
            className="bg-gray-700 hover:bg-gray-600 text-white text-sm rounded px-3 py-1 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => window.history.back()}
            className="bg-teal-400 hover:bg-teal-500 text-black text-sm rounded px-3 py-1 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
      
      {showModal && (
        <DemandForecastChartModal
          selectedIds={selectedIds}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
