import React, { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import api from "../../api";

const ProductForm = ({ product, onSave, onCancel }) => {
  const isEdit = Boolean(product);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    cost_price: "",
    selling_price: "",
    description: "",
    stock_available: "",
    units_sold: "",
    customer_rating: "",
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        category: product.category || "",
        cost_price: product.cost_price || "",
        selling_price: product.selling_price || "",
        description: product.description || "",
        stock_available: product.stock_available || "",
        units_sold: product.units_sold || "",
        customer_rating: product.customer_rating || "",
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await api.put(`/products/${product.id}/`, formData);
      } else {
        await api.post("/products/", formData);
      }
      onSave();
    } catch (err) {
      console.error(err);
      alert("Error saving product");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 px-4">
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-xl bg-gray-900 text-white rounded-lg p-6"
      >
        <button
          type="button"
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-200"
        >
          <FiX className="w-6 h-6" />
        </button>
        <h3 className="text-xl font-semibold mb-6 text-teal-400">
          {isEdit ? "Edit Product" : "Add New Product"}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none"
            >
              <option value="">Select category</option>
              <option value="Stationary">Stationary</option>
              <option value="Electronics">Electronics</option>
              <option value="Apparel">Apparel</option>
              <option value="Outdoor">Outdoor</option>
              <option value="Fitness">Fitness</option>
              <option value="Sustainable">Sustainable</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Cost Price</label>
            <input
              type="number"
              name="cost_price"
              value={formData.cost_price}
              onChange={handleChange}
              required
              step="0.01"
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Selling Price
            </label>
            <input
              type="number"
              name="selling_price"
              value={formData.selling_price}
              onChange={handleChange}
              required
              step="0.01"
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Stock Available
            </label>
            <input
              type="number"
              name="stock_available"
              value={formData.stock_available}
              onChange={handleChange}
              required
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Units Sold</label>
            <input
              type="number"
              name="units_sold"
              value={formData.units_sold}
              onChange={handleChange}
              required
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-1">
              Customer Rating
            </label>
            <input
              type="text"
              name="customer_rating"
              value={formData.customer_rating}
              onChange={handleChange}
              placeholder="e.g. 4.5"
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-700 rounded text-sm hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-teal-400 text-black rounded text-sm hover:bg-teal-500"
          >
            {isEdit ? "Update" : "Add"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
