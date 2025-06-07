import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiArrowLeft } from 'react-icons/hi2';
import { FiX } from 'react-icons/fi';
import api from '../../api';
import Navbar from '../common/Navbar';
import ProductTable from './ProductTable';
import ProductForm from './ProductForm';
import SearchFilter from './SearchFilter';

export default function ProductList() {
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewProduct, setViewProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showForecast, setShowForecast] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [category, setCategory] = useState('');
  const navigate = useNavigate();

  const loadProducts = useCallback(async () => {
    try {
      const { data: prodsData } = await api.get('/products/');
      let prods = prodsData;

      if (showForecast && prods.length) {
        try {
          const { data: forecastsArray } = await api.get('/products/forecast/');
          const forecastsMap = forecastsArray.reduce((map, { product_id, forecast }) => {
            map[product_id] = forecast;
            return map;
          }, {});

          prods = prods.map(p => ({
            ...p,
            demand_forecast: forecastsMap[p.id] ?? 0,
          }));
        } catch (e) {
          // If forecast fetch fails, set to zero
          prods = prods.map(p => ({ ...p, demand_forecast: 0 }));
        }
      } else {
        // Forecast toggle off or no products
        prods = prods.map(p => ({ ...p, demand_forecast: 0 }));
      }

      setAllProducts(prods);
      setErrorMessage('');
    } catch (err) {
      setAllProducts([]);
      setErrorMessage(
        err.response?.status === 403
          ? '🚫 Buyers cannot manage products.'
          : '❌ Error fetching products.'
      );
    }
  }, [showForecast]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    setProducts(
      allProducts.filter(p => {
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

  const handleDelete = async id => {
    await api.delete(`/products/${id}/`);
    await loadProducts();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-black to-gray-800 text-white">
      <Navbar />

      <div className="mx-4 mt-4 mb-2 bg-gray-900 rounded-lg px-4 py-2 flex">
        <div className="flex-1 flex items-center space-x-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-teal-400 hover:text-teal-300"
          >
            <HiArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-base font-semibold">Create and Manage Product</span>
        </div>

        <div className="flex-1 flex justify-center items-center space-x-6">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={showForecast}
              onChange={() => setShowForecast(v => !v)}
            />
            <div className="w-11 h-6 bg-gray-700 rounded-full peer-focus:ring-2 peer-focus:ring-teal-400 peer-checked:bg-teal-500 transition-colors" />
            <div className="absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full peer-checked:translate-x-5 transition-transform" />
            <span className="ml-3 text-sm">With Demand Forecast</span>
          </label>
          <div className="w-1/3">
            <SearchFilter onSearch={handleFilter} />
          </div>
        </div>

        <div className="flex-1 flex justify-end items-center space-x-4">
          <button
            onClick={() => { setEditingProduct(null); setShowForm(true); }}
            className="bg-teal-400 hover:bg-teal-500 text-black text-sm rounded px-3 h-9"
          >
            + Add New
          </button>
          <button
            onClick={() => navigate('/forecast')}
            className="bg-teal-400 hover:bg-teal-500 text-black text-sm rounded px-3 h-9"
          >
            Forecast
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="mx-4 mb-2 bg-yellow-100 border-l-4 border-yellow-500 text-gray-900 p-2 rounded text-sm">
          {errorMessage}
        </div>
      )}

      {showForm && (
        <div className="mx-4 mb-4">
          <ProductForm
            product={editingProduct}
            onSave={() => { setShowForm(false); loadProducts(); }}
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
                <strong>Demand Forecast:</strong>{' '}
                {viewProduct.demand_forecast.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-auto px-4 pb-20">
        <ProductTable
          products={products}
          onView={prod => setViewProduct(prod)}
          onEdit={prod => { setEditingProduct(prod); setShowForm(true); }}
          onDelete={handleDelete}
          showForecast={showForecast}
        />
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-gray-900 px-4 py-3 flex justify-end space-x-2">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-700 hover:bg-gray-600 text-white text-sm rounded px-3 py-1"
        >
          Cancel
        </button>
        <button
          onClick={() => navigate(-1)}
          className="bg-teal-400 hover:bg-teal-500 text-black text-sm rounded px-3 py-1"
        >
          Save
        </button>
      </div>
    </div>
  );
}
