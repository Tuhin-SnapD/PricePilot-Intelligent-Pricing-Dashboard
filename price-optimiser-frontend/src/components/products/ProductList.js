import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import SearchFilter from './SearchFilter';
import ProductTable from './ProductTable';
import ProductForm from './ProductForm';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showForecast, setShowForecast] = useState(true);
  const navigate = useNavigate();

  const fetchProducts = async (filters = {}) => {
    let query = '';
    if (filters.name || filters.category) {
      const params = new URLSearchParams(filters);
      query = `?${params.toString()}`;
    }

    try {
      const response = await api.get(`/products/${query}`);
      setProducts(response.data);
    } catch (err) {
      if (err.response?.status === 403) {
        setProducts([]);
        setErrorMessage("🚫 As a buyer, you are not allowed to manage products.");
      } else {
        console.error(err);
        setErrorMessage("❌ Something went wrong while fetching products.");
      }
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearch = (filters) => { fetchProducts(filters); };
  const handleEdit = (product) => { setEditingProduct(product); setShowForm(true); };
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await api.delete(`/products/${id}/`);
      fetchProducts();
    }
  };
  const handleSave = () => { setEditingProduct(null); setShowForm(false); fetchProducts(); };
  const handleCancel = () => { setEditingProduct(null); setShowForm(false); };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 px-6 py-6">
      {/* NAVBAR */}
      <div className="flex justify-between items-center bg-black text-white p-4 rounded mb-6">
        <button
          onClick={() => navigate('/')}
          className="text-teal-400 font-semibold hover:underline px-4 py-2"
        >
          ⬅ Back
        </button>
        <h2 className="text-xl font-semibold">Create and Manage Product</h2>
        <div className="flex gap-2 items-center">
          <button
            onClick={() => navigate('/forecast')}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Demand Forecast
          </button>
          <button
            onClick={() => { setEditingProduct(null); setShowForm(true); }}
            className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600"
          >
            Add New Product
          </button>
        </div>
      </div>

      {/* ERROR MESSAGE */}
      {errorMessage && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 rounded max-w-xl mx-auto text-center">
          <p>{errorMessage}</p>
        </div>
      )}

      {/* FILTERS */}
      <div className="flex items-center gap-4 mb-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showForecast}
            onChange={() => setShowForecast(!showForecast)}
            className="accent-teal-500"
          />
          <span className="text-sm text-gray-700">With Demand Forecast</span>
        </label>
        <SearchFilter onSearch={handleSearch} />
      </div>

      {/* FORM */}
      {showForm && (
        <ProductForm
          product={editingProduct}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}

      {/* PRODUCT TABLE */}
      <ProductTable
        products={products}
        onEdit={handleEdit}
        onDelete={handleDelete}
        showForecast={showForecast}
      />
    </div>
  );
};

export default ProductList;
