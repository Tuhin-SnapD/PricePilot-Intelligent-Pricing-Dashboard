import React, { useMemo, useState, useEffect } from "react";
import {
  FiX,
  FiSave,
  FiAlertCircle,
  FiPackage,
  FiDollarSign,
  FiTag,
  FiFileText,
  FiBox,
  FiStar,
} from "react-icons/fi";
import api from "../../api";
import { CATEGORY_OPTIONS, getCategoryIcon } from "../../constants/categories";

const EMPTY_FORM = {
  name: "",
  category: "",
  cost_price: "",
  selling_price: "",
  description: "",
  stock_available: "",
  units_sold: "",
  customer_rating: "",
};

const toInputValue = (value) => (value === null || value === undefined ? "" : String(value));

const ProductForm = ({ product, categories = [], onSave, onCancel }) => {
  const isEdit = Boolean(product);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categoryOptions = useMemo(() => {
    const extras = categories
      .filter((category) => !CATEGORY_OPTIONS.some((option) => option.value === category))
      .map((category) => ({ value: category, icon: getCategoryIcon(category) }));
    return [...CATEGORY_OPTIONS, ...extras];
  }, [categories]);

  useEffect(() => {
    if (product) {
      setFormData({
        name: toInputValue(product.name),
        category: toInputValue(product.category),
        cost_price: toInputValue(product.cost_price),
        selling_price: toInputValue(product.selling_price),
        description: toInputValue(product.description),
        stock_available: toInputValue(product.stock_available),
        units_sold: toInputValue(product.units_sold),
        customer_rating: toInputValue(product.customer_rating),
      });
    } else {
      setFormData({ ...EMPTY_FORM });
    }
    setErrors({});
  }, [product]);

  const validateForm = () => {
    const nextErrors = {};
    const cost = parseFloat(formData.cost_price);
    const selling = parseFloat(formData.selling_price);
    const stock = Number(formData.stock_available);
    const units = Number(formData.units_sold);
    const rating = parseFloat(formData.customer_rating);

    if (!formData.name.trim()) {
      nextErrors.name = "Product name is required";
    } else if (formData.name.trim().length < 2) {
      nextErrors.name = "Product name must be at least 2 characters";
    }

    if (!formData.category) {
      nextErrors.category = "Category is required";
    }

    if (formData.cost_price === "" || !Number.isFinite(cost) || cost <= 0) {
      nextErrors.cost_price = "Enter a cost price greater than 0";
    }

    if (formData.selling_price === "" || !Number.isFinite(selling) || selling <= 0) {
      nextErrors.selling_price = "Enter a selling price greater than 0";
    } else if (Number.isFinite(cost) && selling <= cost) {
      nextErrors.selling_price = "Selling price must be higher than the cost price";
    }

    if (formData.stock_available === "" || !Number.isInteger(stock) || stock < 0) {
      nextErrors.stock_available = "Enter a whole number of 0 or more";
    }

    if (formData.units_sold === "" || !Number.isInteger(units) || units < 0) {
      nextErrors.units_sold = "Enter a whole number of 0 or more";
    }

    if (
      formData.customer_rating !== "" &&
      (!Number.isFinite(rating) || rating < 0 || rating > 5)
    ) {
      nextErrors.customer_rating = "Rating must be between 0 and 5";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
    if (errors[name]) {
      setErrors((previous) => ({ ...previous, [name]: "" }));
    }
  };

  const handleCategoryChange = (category) => {
    setFormData((previous) => ({ ...previous, category }));
    if (errors.category) {
      setErrors((previous) => ({ ...previous, category: "" }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    const payload = {
      ...formData,
      name: formData.name.trim(),
      description: formData.description.trim(),
      customer_rating: formData.customer_rating === "" ? null : formData.customer_rating,
    };

    setIsSubmitting(true);
    try {
      if (isEdit) {
        await api.put(`/products/${product.id}/`, payload);
      } else {
        await api.post("/products/", payload);
      }
      onSave();
    } catch (err) {
      const data = err.response?.data;
      const fieldErrors = {};

      if (data && typeof data === "object") {
        ["name", "category", "cost_price", "selling_price", "stock_available", "units_sold", "customer_rating", "description"].forEach(
          (field) => {
            if (data[field]) {
              fieldErrors[field] = Array.isArray(data[field])
                ? data[field].join(" ")
                : String(data[field]);
            }
          }
        );
      }

      let message = data?.detail || data?.error;
      if (data?.non_field_errors) {
        message = Array.isArray(data.non_field_errors)
          ? data.non_field_errors.join(" ")
          : data.non_field_errors;
      }
      if (!message && Object.keys(fieldErrors).length === 0) {
        message =
          err.response?.status === 403
            ? "You do not have permission to save products."
            : "Unable to save the product. Please try again.";
      }

      setErrors({ ...fieldErrors, ...(message ? { submit: message } : {}) });
    } finally {
      setIsSubmitting(false);
    }
  };

  const cost = parseFloat(formData.cost_price);
  const selling = parseFloat(formData.selling_price);
  const margin =
    Number.isFinite(cost) && Number.isFinite(selling) && selling > 0
      ? ((selling - cost) / selling) * 100
      : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 px-4 py-6">
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 text-white rounded-2xl p-6 sm:p-8 shadow-2xl"
      >
        <div className="flex items-start justify-between mb-6 sm:mb-8">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl shrink-0">
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

          <button
            type="button"
            onClick={onCancel}
            aria-label="Close product form"
            className="text-gray-400 hover:text-gray-200 transition-colors p-1"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          <div className="space-y-6">
            <div>
              <label htmlFor="product-name" className="block text-sm font-medium mb-2 flex items-center">
                <FiPackage className="w-4 h-4 mr-2 text-teal-400" />
                Product Name *
              </label>
              <input
                id="product-name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                maxLength={255}
                className={`w-full bg-gray-800 border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all ${
                  errors.name ? "border-red-500" : "border-gray-700"
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

            <div>
              <span className="block text-sm font-medium mb-2 flex items-center">
                <FiTag className="w-4 h-4 mr-2 text-teal-400" />
                Category *
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {categoryOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleCategoryChange(option.value)}
                    aria-pressed={formData.category === option.value}
                    className={`p-3 rounded-lg border-2 transition-all flex items-center space-x-2 ${
                      formData.category === option.value
                        ? "border-teal-400 bg-teal-400/10"
                        : "border-gray-700 hover:border-gray-600"
                    }`}
                  >
                    <span className="text-lg">{option.icon}</span>
                    <span className="text-sm font-medium">{option.value}</span>
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

            <div>
              <label htmlFor="product-description" className="block text-sm font-medium mb-2 flex items-center">
                <FiFileText className="w-4 h-4 mr-2 text-teal-400" />
                Description
              </label>
              <textarea
                id="product-description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all"
                placeholder="Describe your product..."
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-5 sm:p-6">
              <h4 className="text-lg font-semibold mb-4 flex items-center">
                <FiDollarSign className="w-5 h-5 mr-2 text-teal-400" />
                Pricing Information
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="product-cost-price" className="block text-sm font-medium mb-2">
                    Cost Price *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                    <input
                      id="product-cost-price"
                      type="number"
                      name="cost_price"
                      value={formData.cost_price}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      className={`w-full bg-gray-700 border rounded-lg pl-8 pr-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all ${
                        errors.cost_price ? "border-red-500" : "border-gray-600"
                      }`}
                      placeholder="0.00"
                    />
                  </div>
                  {errors.cost_price && (
                    <p className="mt-1 text-sm text-red-400">{errors.cost_price}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="product-selling-price" className="block text-sm font-medium mb-2">
                    Selling Price *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                    <input
                      id="product-selling-price"
                      type="number"
                      name="selling_price"
                      value={formData.selling_price}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      className={`w-full bg-gray-700 border rounded-lg pl-8 pr-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all ${
                        errors.selling_price ? "border-red-500" : "border-gray-600"
                      }`}
                      placeholder="0.00"
                    />
                  </div>
                  {errors.selling_price && (
                    <p className="mt-1 text-sm text-red-400">{errors.selling_price}</p>
                  )}
                </div>
              </div>

              {margin !== null && (
                <div className="mt-4 p-3 bg-gray-700 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-300">Profit Margin:</span>
                    <span
                      className={`text-lg font-bold ${
                        margin >= 20
                          ? "text-green-400"
                          : margin >= 10
                          ? "text-yellow-400"
                          : "text-red-400"
                      }`}
                    >
                      {margin.toFixed(1)}%
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-gray-800 rounded-lg p-5 sm:p-6">
              <h4 className="text-lg font-semibold mb-4 flex items-center">
                <FiBox className="w-5 h-5 mr-2 text-teal-400" />
                Inventory &amp; Sales
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="product-stock" className="block text-sm font-medium mb-2">
                    Stock Available *
                  </label>
                  <input
                    id="product-stock"
                    type="number"
                    name="stock_available"
                    value={formData.stock_available}
                    onChange={handleChange}
                    min="0"
                    step="1"
                    className={`w-full bg-gray-700 border rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all ${
                      errors.stock_available ? "border-red-500" : "border-gray-600"
                    }`}
                    placeholder="0"
                  />
                  {errors.stock_available && (
                    <p className="mt-1 text-sm text-red-400">{errors.stock_available}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="product-units-sold" className="block text-sm font-medium mb-2">
                    Units Sold *
                  </label>
                  <input
                    id="product-units-sold"
                    type="number"
                    name="units_sold"
                    value={formData.units_sold}
                    onChange={handleChange}
                    min="0"
                    step="1"
                    className={`w-full bg-gray-700 border rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all ${
                      errors.units_sold ? "border-red-500" : "border-gray-600"
                    }`}
                    placeholder="0"
                  />
                  {errors.units_sold && (
                    <p className="mt-1 text-sm text-red-400">{errors.units_sold}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-5 sm:p-6">
              <h4 className="text-lg font-semibold mb-4 flex items-center">
                <FiStar className="w-5 h-5 mr-2 text-teal-400" />
                Customer Rating
              </h4>

              <div className="flex flex-wrap items-center gap-4">
                <input
                  type="number"
                  name="customer_rating"
                  value={formData.customer_rating}
                  onChange={handleChange}
                  step="0.1"
                  min="0"
                  max="5"
                  aria-label="Customer rating out of 5"
                  className={`w-24 bg-gray-700 border rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all ${
                    errors.customer_rating ? "border-red-500" : "border-gray-600"
                  }`}
                  placeholder="4.5"
                />
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FiStar
                      key={star}
                      className={`w-5 h-5 ${
                        parseFloat(formData.customer_rating) >= star
                          ? "text-yellow-400 fill-current"
                          : "text-gray-400"
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

        {errors.submit && (
          <div role="alert" className="mt-6 p-4 bg-red-900 border border-red-700 rounded-lg">
            <p className="text-red-200 text-sm flex items-center">
              <FiAlertCircle className="w-4 h-4 mr-2" />
              {errors.submit}
            </p>
          </div>
        )}

        <div className="mt-8 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
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
            className="px-6 py-3 bg-gradient-to-r from-teal-400 to-teal-600 text-black font-semibold rounded-lg hover:from-teal-500 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
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
