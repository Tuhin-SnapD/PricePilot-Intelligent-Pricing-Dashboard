import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiArrowLeft } from "react-icons/hi2";
import { FaPlus, FaChartLine } from "react-icons/fa";
import api from "../../api";
import Navbar from "../common/Navbar";
import ProductTable from "./ProductTable";
import ProductForm from "./ProductForm";
import SearchFilter from "./SearchFilter";
import DemandForecastChartModal from "../forecasts/DemandForecast";
import { AuthContext } from "../../contexts/AuthContext";

export default function ProductList() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [allProducts, setAllProducts] = useState([]);
  const [forecastMap, setForecastMap] = useState({});
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showForecast, setShowForecast] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [category, setCategory] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const canManage = Boolean(user) && user.role !== "buyer";

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const [productsResult, forecastResult] = await Promise.allSettled([
        api.get("/products/"),
        api.get("/products/forecast/"),
      ]);

      if (productsResult.status !== "fulfilled") {
        throw productsResult.reason;
      }

      const response = productsResult.value.data;
      const products = response.success ? response.data : response;
      const nextProducts = Array.isArray(products) ? products : [];

      const nextForecastMap = {};
      if (forecastResult.status === "fulfilled") {
        const forecastResponse = forecastResult.value.data;
        const forecasts = forecastResponse.success ? forecastResponse.data : forecastResponse;
        if (Array.isArray(forecasts)) {
          forecasts.forEach(({ product_id, forecast }) => {
            nextForecastMap[product_id] = Number(forecast) || 0;
          });
        }
      }

      setAllProducts(nextProducts);
      setForecastMap(nextForecastMap);
      setErrorMessage("");
    } catch (err) {
      setAllProducts([]);
      setForecastMap({});
      setErrorMessage(
        err.response?.status === 403
          ? "You do not have permission to view products."
          : "Unable to load products. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const products = useMemo(
    () =>
      allProducts
        .filter((product) => {
          const matchesName = searchText
            ? product.name.toLowerCase().includes(searchText.toLowerCase())
            : true;
          const matchesCategory = category ? product.category === category : true;
          return matchesName && matchesCategory;
        })
        .map((product) => ({
          ...product,
          forecast: forecastMap[product.id] ?? null,
        })),
    [allProducts, forecastMap, searchText, category]
  );

  const categories = useMemo(
    () => Array.from(new Set(allProducts.map((product) => product.category))).sort(),
    [allProducts]
  );

  const handleFilter = useCallback(({ name, category: nextCategory }) => {
    setSearchText(name);
    setCategory(nextCategory);
  }, []);

  const handleDelete = async (id) => {
    const product = allProducts.find((item) => item.id === id);
    const confirmed = window.confirm(
      `Delete "${product?.name || "this product"}"? This action cannot be undone.`
    );
    if (!confirmed) return;

    try {
      await api.delete(`/products/${id}/`);
      setSelectedIds((previous) => previous.filter((selectedId) => selectedId !== id));
      await loadProducts();
    } catch (error) {
      setErrorMessage(
        error.response?.status === 403
          ? "You do not have permission to delete this product."
          : "Failed to delete the product. Please try again."
      );
    }
  };

  const openCreateForm = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const openEditForm = (product) => {
    if (!canManage) return;
    setEditingProduct(product);
    setShowForm(true);
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

      <div className="mx-4 mt-4 mb-3 bg-gray-900 rounded-xl px-4 py-3 flex flex-wrap items-center gap-3 border border-gray-800">
        <div className="flex items-center space-x-3 shrink-0">
          <button
            type="button"
            onClick={() => navigate("/")}
            aria-label="Back to dashboard"
            className="flex items-center text-gray-300 hover:text-white transition-colors p-1 rounded-lg hover:bg-gray-800"
          >
            <HiArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-base font-semibold">Create and Manage Products</span>
        </div>

        <div className="flex flex-1 flex-wrap items-center justify-center gap-3 min-w-[240px]">
          <label className="relative inline-flex items-center cursor-pointer select-none">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={showForecast}
              onChange={() => setShowForecast((value) => !value)}
            />
            <div className="w-11 h-6 bg-gray-700 rounded-full peer-focus:ring-2 peer-focus:ring-teal-400 peer-checked:bg-teal-500 transition-colors" />
            <div className="absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full peer-checked:translate-x-5 transition-transform" />
            <span className="ml-3 text-sm">With Demand Forecast</span>
          </label>

          <div className="w-full sm:w-auto sm:min-w-[320px]">
            <SearchFilter onSearch={handleFilter} categories={categories} />
          </div>
        </div>

        <div className="flex items-center space-x-3 ml-auto">
          {canManage && (
            <button
              type="button"
              onClick={openCreateForm}
              className="bg-teal-400 hover:bg-teal-500 text-black text-sm rounded-lg px-3 py-2 flex items-center space-x-1 transition-colors"
            >
              <FaPlus className="w-3 h-3" />
              <span>Add New</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="bg-teal-400 hover:bg-teal-500 text-black text-sm rounded-lg px-3 py-2 flex items-center space-x-1 transition-colors"
          >
            <FaChartLine className="w-3 h-3" />
            <span>Forecast</span>
          </button>
        </div>
      </div>

      {errorMessage && (
        <div role="alert" className="mx-4 mb-4 bg-red-900 border border-red-700 text-red-200 p-3 rounded-lg">
          <p className="text-sm">{errorMessage}</p>
        </div>
      )}

      {showForm && (
        <div className="mx-4 mb-4">
          <ProductForm
            product={editingProduct}
            categories={categories}
            onSave={() => {
              setShowForm(false);
              setEditingProduct(null);
              loadProducts();
            }}
            onCancel={() => {
              setShowForm(false);
              setEditingProduct(null);
            }}
          />
        </div>
      )}

      <div className="flex-1 px-4 pb-6">
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No products found matching your criteria.</p>
            {(searchText || category) && (
              <p className="text-gray-500 text-sm mt-2">
                Try clearing the search text or category filter.
              </p>
            )}
          </div>
        ) : (
          <>
            <ProductTable
              products={products}
              selectedIds={selectedIds}
              onSelectionChange={setSelectedIds}
              onEdit={openEditForm}
              onDelete={handleDelete}
              showForecast={showForecast}
            />
            <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
              <span>
                Showing {products.length} of {allProducts.length} products
              </span>
              {selectedIds.length > 0 && (
                <span className="text-teal-400 font-medium">
                  {selectedIds.length} selected
                </span>
              )}
            </div>
          </>
        )}
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
