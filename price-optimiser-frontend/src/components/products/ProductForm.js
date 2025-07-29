import React, { useState, useEffect } from "react";
import { FiX, FiSave, FiAlertCircle, FiCheckCircle, FiUpload, FiPackage, FiDollarSign, FiTag, FiFileText, FiBox, FiTrendingUp, FiStar } from "react-icons/fi";
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
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState("");
  const [lastSaved, setLastSaved] = useState(null);

  const categories = [
    { value: "Electronics", icon: "📱", color: "bg-blue-500" },
    { value: "Outdoor", icon: "🏕️", color: "bg-green-500" },
    { value: "Sustainable", icon: "🌱", color: "bg-emerald-500" },
    { value: "Home", icon: "🏠", color: "bg-orange-500" },
    { value: "Fitness", icon: "💪", color: "bg-purple-500" },
    { value: "Stationary", icon: "📝", color: "bg-gray-500" },
    { value: "Apparel", icon: "👕", color: "bg-pink-500" },
  ];

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

  // Auto-save functionality
  useEffect(() => {
    const autoSaveTimer = setTimeout(() => {
      if (formData.name && formData.category && !isSubmitting) {
        handleAutoSave();
      }
    }, 3000);

    return () => clearTimeout(autoSaveTimer);
  }, [formData]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    } else if (formData.name.length < 2) {
      newErrors.name = "Product name must be at least 2 characters";
    }
    
    if (!formData.category) {
      newErrors.category = "Category is required";
    }
    
    if (!formData.cost_price || parseFloat(formData.cost_price) <= 0) {
      newErrors.cost_price = "Valid cost price is required";
    }
    
    if (!formData.selling_price || parseFloat(formData.selling_price) <= 0) {
      newErrors.selling_price = "Valid selling price is required";
    } else if (parseFloat(formData.selling_price) <= parseFloat(formData.cost_price)) {
      newErrors.selling_price = "Selling price must be higher than cost price";
    }
    
    if (!formData.stock_available || parseInt(formData.stock_available) < 0) {
      newErrors.stock_available = "Valid stock quantity is required";
    }
    
    if (!formData.units_sold || parseInt(formData.units_sold) < 0) {
      newErrors.units_sold = "Valid units sold is required";
    }
    
    if (formData.customer_rating && (parseFloat(formData.customer_rating) < 0 || parseFloat(formData.customer_rating) > 5)) {
      newErrors.customer_rating = "Rating must be between 0 and 5";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleAutoSave = async () => {
    if (!validateForm()) return;
    
    try {
      setAutoSaveStatus("saving");
      if (isEdit) {
        await api.put(`/products/${product.id}/`, formData);
      } else {
        await api.post("/products/", formData);
      }
      setAutoSaveStatus("saved");
      setLastSaved(new Date());
      setTimeout(() => setAutoSaveStatus(""), 2000);
    } catch (err) {
      setAutoSaveStatus("error");
      setTimeout(() => setAutoSaveStatus(""), 3000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    try {
      setIsSubmitting(true);
      if (isEdit) {
        await api.put(`/products/${product.id}/`, formData);
      } else {
        await api.post("/products/", formData);
      }
      onSave();
    } catch (err) {
      console.error(err);
      setErrors({ submit: "Error saving product. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getProfitMargin = () => {
    const cost = parseFloat(formData.cost_price) || 0;
    const selling = parseFloat(formData.selling_price) || 0;
    if (cost === 0 || selling === 0) return 0;
    return ((selling - cost) / selling * 100).toFixed(1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 px-4 py-6 overflow-y-auto">
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-4xl bg-gray-900 text-white rounded-2xl p-8 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl">
              <FiPackage className="text-white text-xl" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-teal-400">
                {isEdit ? "Edit Product" : "Add New Product"}
              </h3>
              <p className="text-sm text-gray-400">
                {isEdit ? "Update product information" : "Create a new product listing"}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Auto-save status */}
            {autoSaveStatus && (
              <div className="flex items-center space-x-2 text-sm">
                {autoSaveStatus === "saving" && (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-teal-400"></div>
                    <span className="text-gray-400">Saving...</span>
                  </>
                )}
                {autoSaveStatus === "saved" && (
                  <>
                    <FiCheckCircle className="text-green-400" />
                    <span className="text-green-400">Saved</span>
                  </>
                )}
                {autoSaveStatus === "error" && (
                  <>
                    <FiAlertCircle className="text-red-400" />
                    <span className="text-red-400">Save failed</span>
                  </>
                )}
              </div>
            )}
            
            <button
              type="button"
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-200 transition-colors"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center">
                <FiPackage className="w-4 h-4 mr-2 text-teal-400" />
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full bg-gray-800 border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all ${
                  errors.name ? 'border-red-500' : 'border-gray-700'
                }`}
                placeholder="Enter product name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-400 flex items-center">
                  <FiAlertCircle className="w-4 h-4 mr-1" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center">
                <FiTag className="w-4 h-4 mr-2 text-teal-400" />
                Category *
              </label>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => handleChange({ target: { name: 'category', value: cat.value } })}
                    className={`p-3 rounded-lg border-2 transition-all flex items-center space-x-2 ${
                      formData.category === cat.value
                        ? 'border-teal-400 bg-teal-400/10'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <span className="text-lg">{cat.icon}</span>
                    <span className="text-sm font-medium">{cat.value}</span>
                  </button>
                ))}
              </div>
              {errors.category && (
                <p className="mt-1 text-sm text-red-400 flex items-center">
                  <FiAlertCircle className="w-4 h-4 mr-1" />
                  {errors.category}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center">
                <FiFileText className="w-4 h-4 mr-2 text-teal-400" />
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all"
                placeholder="Describe your product..."
              />
            </div>

            {/* Image Upload Placeholder */}
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center">
                <FiUpload className="w-4 h-4 mr-2 text-teal-400" />
                Product Image
              </label>
              <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-teal-400 transition-colors cursor-pointer">
                <FiUpload className="w-8 h-8 mx-auto mb-3 text-gray-400" />
                <p className="text-sm text-gray-400 mb-2">Click to upload product image</p>
                <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Pricing Section */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h4 className="text-lg font-semibold mb-4 flex items-center">
                <FiDollarSign className="w-5 h-5 mr-2 text-teal-400" />
                Pricing Information
              </h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Cost Price *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                    <input
                      type="number"
                      name="cost_price"
                      value={formData.cost_price}
                      onChange={handleChange}
                      step="0.01"
                      className={`w-full bg-gray-700 border rounded-lg pl-8 pr-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all ${
                        errors.cost_price ? 'border-red-500' : 'border-gray-600'
                      }`}
                      placeholder="0.00"
                    />
                  </div>
                  {errors.cost_price && (
                    <p className="mt-1 text-sm text-red-400">{errors.cost_price}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Selling Price *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                    <input
                      type="number"
                      name="selling_price"
                      value={formData.selling_price}
                      onChange={handleChange}
                      step="0.01"
                      className={`w-full bg-gray-700 border rounded-lg pl-8 pr-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all ${
                        errors.selling_price ? 'border-red-500' : 'border-gray-600'
                      }`}
                      placeholder="0.00"
                    />
                  </div>
                  {errors.selling_price && (
                    <p className="mt-1 text-sm text-red-400">{errors.selling_price}</p>
                  )}
                </div>
              </div>
              
              {/* Profit Margin Display */}
              {formData.cost_price && formData.selling_price && (
                <div className="mt-4 p-3 bg-gray-700 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-300">Profit Margin:</span>
                    <span className={`text-lg font-bold ${
                      getProfitMargin() > 20 ? 'text-green-400' : 
                      getProfitMargin() > 10 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {getProfitMargin()}%
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Inventory Section */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h4 className="text-lg font-semibold mb-4 flex items-center">
                <FiBox className="w-5 h-5 mr-2 text-teal-400" />
                Inventory & Sales
              </h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Stock Available *</label>
                  <input
                    type="number"
                    name="stock_available"
                    value={formData.stock_available}
                    onChange={handleChange}
                    className={`w-full bg-gray-700 border rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all ${
                      errors.stock_available ? 'border-red-500' : 'border-gray-600'
                    }`}
                    placeholder="0"
                  />
                  {errors.stock_available && (
                    <p className="mt-1 text-sm text-red-400">{errors.stock_available}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Units Sold *</label>
                  <input
                    type="number"
                    name="units_sold"
                    value={formData.units_sold}
                    onChange={handleChange}
                    className={`w-full bg-gray-700 border rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all ${
                      errors.units_sold ? 'border-red-500' : 'border-gray-600'
                    }`}
                    placeholder="0"
                  />
                  {errors.units_sold && (
                    <p className="mt-1 text-sm text-red-400">{errors.units_sold}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Rating Section */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h4 className="text-lg font-semibold mb-4 flex items-center">
                <FiStar className="w-5 h-5 mr-2 text-teal-400" />
                Customer Rating
              </h4>
              
              <div className="flex items-center space-x-4">
                <input
                  type="number"
                  name="customer_rating"
                  value={formData.customer_rating}
                  onChange={handleChange}
                  step="0.1"
                  min="0"
                  max="5"
                  className="w-24 bg-gray-700 border border-gray-600 rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all"
                  placeholder="4.5"
                />
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FiStar
                      key={star}
                      className={`w-5 h-5 ${
                        parseFloat(formData.customer_rating) >= star
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-400'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-400">out of 5</span>
              </div>
              {errors.customer_rating && (
                <p className="mt-1 text-sm text-red-400">{errors.customer_rating}</p>
              )}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {errors.submit && (
          <div className="mt-6 p-4 bg-red-900 border border-red-700 rounded-lg">
            <p className="text-red-200 text-sm flex items-center">
              <FiAlertCircle className="w-4 h-4 mr-2" />
              {errors.submit}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border border-gray-700 rounded-lg text-sm hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-gradient-to-r from-teal-400 to-teal-600 text-black font-semibold rounded-lg hover:from-teal-500 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <FiSave className="w-4 h-4" />
                <span>{isEdit ? "Update Product" : "Create Product"}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
