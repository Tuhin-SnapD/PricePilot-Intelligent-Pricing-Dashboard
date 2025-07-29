import React, { useState, useContext } from "react";
import { FiEye, FiEdit, FiTrash2, FiTrendingUp, FiTrendingDown, FiMinus, FiPackage, FiStar, FiDollarSign } from "react-icons/fi";
import { FaSort, FaCheck, FaTimes, FaExclamationTriangle } from "react-icons/fa";
import { AuthContext } from "../../contexts/AuthContext";

export const formatPrice = (val) => {
  const num = typeof val === "number" ? val : parseFloat(val) || 0;
  return `$${num.toFixed(2)}`;
};

const ProductTable = ({
  products,
  selectedIds,
  onSelectionChange,
  onEdit,
  onDelete,
  showForecast,
}) => {
  const { user } = useContext(AuthContext);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [hoveredRow, setHoveredRow] = useState(null);

  const showColumns = user.role !== "buyer";
  const allSelected = products.length > 0 && selectedIds.length === products.length;

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedProducts = React.useMemo(() => {
    if (!sortConfig.key) return products;

    return [...products].sort((a, b) => {
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
  }, [products, sortConfig]);

  const toggleSelectAll = () => {
    if (allSelected) {
      onSelectionChange([]);
    } else {
      onSelectionChange(sortedProducts.map((p) => p.id));
    }
  };

  const toggleSelectOne = (id) => {
    const next = selectedIds.includes(id)
      ? selectedIds.filter((sid) => sid !== id)
      : [...selectedIds, id];
    onSelectionChange(next);
  };

  // Status indicator component
  const StatusIndicator = ({ product }) => {
    const stock = parseInt(product.stock_available) || 0;
    const sold = parseInt(product.units_sold) || 0;
    
    if (stock === 0) {
      return (
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <span className="text-xs text-red-600 font-medium">Out of Stock</span>
        </div>
      );
    } else if (stock < 10) {
      return (
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
          <span className="text-xs text-yellow-600 font-medium">Low Stock</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-xs text-green-600 font-medium">In Stock</span>
        </div>
      );
    }
  };

  // Performance indicator component
  const PerformanceIndicator = ({ product }) => {
    const sold = parseInt(product.units_sold) || 0;
    const forecast = parseInt(product.demand_forecast) || 0;
    
    if (sold > forecast * 1.2) {
      return (
        <div className="flex items-center space-x-1 text-green-600">
          <FiTrendingUp className="w-3 h-3" />
          <span className="text-xs font-medium">Exceeding</span>
        </div>
      );
    } else if (sold < forecast * 0.8) {
      return (
        <div className="flex items-center space-x-1 text-red-600">
          <FiTrendingDown className="w-3 h-3" />
          <span className="text-xs font-medium">Under</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center space-x-1 text-gray-600">
          <FiMinus className="w-3 h-3" />
          <span className="text-xs font-medium">On Track</span>
        </div>
      );
    }
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left text-gray-900 bg-white rounded-xl overflow-hidden shadow-xl">
          <thead className="bg-gray-800 text-white">
            <tr>
              {showColumns && (
                <th className="p-4 border-r border-gray-700">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-teal-400 bg-gray-700 rounded focus:ring-teal-400"
                    checked={allSelected}
                    onChange={toggleSelectAll}
                  />
                </th>
              )}
              <th 
                className="p-4 border-r border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center space-x-2">
                  <span>Name</span>
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
              {showColumns && (
                <th 
                  className="p-4 border-r border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors"
                  onClick={() => handleSort('cost_price')}
                >
                  <div className="flex items-center space-x-2">
                    <span>Cost Price</span>
                    <FaSort className="w-3 h-3" />
                  </div>
                </th>
              )}
              <th 
                className="p-4 border-r border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors"
                onClick={() => handleSort('selling_price')}
              >
                <div className="flex items-center space-x-2">
                  <span>Sell Price</span>
                  <FaSort className="w-3 h-3" />
                </div>
              </th>
              <th 
                className="p-4 border-r border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors"
                onClick={() => handleSort('stock_available')}
              >
                <div className="flex items-center space-x-2">
                  <span>Stock</span>
                  <FaSort className="w-3 h-3" />
                </div>
              </th>
              {showColumns && (
                <th 
                  className="p-4 border-r border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors"
                  onClick={() => handleSort('units_sold')}
                >
                  <div className="flex items-center space-x-2">
                    <span>Sold</span>
                    <FaSort className="w-3 h-3" />
                  </div>
                </th>
              )}
              {showForecast && (
                <th 
                  className="p-4 border-r border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors"
                  onClick={() => handleSort('demand_forecast')}
                >
                  <div className="flex items-center space-x-2">
                    <span>Forecast</span>
                    <FaSort className="w-3 h-3" />
                  </div>
                </th>
              )}
              <th className="p-4 border-r border-gray-700">Status</th>
              {showColumns && <th className="p-4">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {sortedProducts.map((prod, idx) => {
              const isSelected = selectedIds.includes(prod.id);
              return (
                <tr
                  key={prod.id}
                  className={`odd:bg-gray-50 even:bg-white hover:bg-gray-100 transition-all duration-200 ${
                    isSelected ? "bg-teal-50 border-l-4 border-teal-400" : ""
                  } ${hoveredRow === prod.id ? "shadow-md transform scale-[1.01]" : ""}`}
                  onMouseEnter={() => setHoveredRow(prod.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  {showColumns && (
                    <td className="p-4 border-r border-gray-300">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-teal-400 bg-white rounded focus:ring-teal-400"
                        checked={isSelected}
                        onChange={() => toggleSelectOne(prod.id)}
                      />
                    </td>
                  )}
                  <td className="p-4 border-r border-gray-300">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-teal-400 to-teal-600 rounded-lg">
                        <FiPackage className="text-white text-sm" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{prod.name}</div>
                        {prod.customer_rating && (
                          <div className="flex items-center space-x-1 mt-1">
                            <FiStar className="w-3 h-3 text-yellow-400 fill-current" />
                            <span className="text-xs text-gray-500">{prod.customer_rating}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 border-r border-gray-300">
                    <span className="px-3 py-1 bg-gray-200 rounded-full text-xs font-medium">
                      {prod.category}
                    </span>
                  </td>
                  {showColumns && (
                    <td className="p-4 border-r border-gray-300">
                      <div className="flex items-center space-x-1">
                        <FiDollarSign className="w-3 h-3 text-gray-500" />
                        <span className="font-medium">{formatPrice(prod.cost_price)}</span>
                      </div>
                    </td>
                  )}
                  <td className="p-4 border-r border-gray-300">
                    <div className="flex items-center space-x-1">
                      <FiDollarSign className="w-3 h-3 text-green-500" />
                      <span className="font-semibold text-green-600">{formatPrice(prod.selling_price)}</span>
                    </div>
                  </td>
                  <td className="p-4 border-r border-gray-300">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{prod.stock_available}</span>
                      <StatusIndicator product={prod} />
                    </div>
                  </td>
                  {showColumns && (
                    <td className="p-4 border-r border-gray-300">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{prod.units_sold}</span>
                        {showForecast && <PerformanceIndicator product={prod} />}
                      </div>
                    </td>
                  )}
                  {showForecast && (
                    <td className="p-4 border-r border-gray-300">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{prod.demand_forecast}</span>
                        <button
                          onClick={() => setSelectedProduct(prod)}
                          className="text-teal-600 hover:text-teal-800 transition-colors"
                          title="View forecast details"
                        >
                          <FiEye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  )}
                  <td className="p-4 border-r border-gray-300">
                    <StatusIndicator product={prod} />
                  </td>
                  {showColumns && (
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedProduct(prod)}
                          title="View Details"
                          className="p-2 text-gray-600 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all"
                        >
                          <FiEye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onEdit(prod)}
                          title="Edit"
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        >
                          <FiEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(prod.id)}
                          title="Delete"
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {/* Enhanced Product Details Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-2xl shadow-2xl p-8 max-w-2xl w-full overflow-auto max-h-full text-white">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-teal-400 to-teal-600 rounded-xl">
                  <FiPackage className="text-white text-xl" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-teal-400">
                    {selectedProduct.name}
                  </h2>
                  <p className="text-gray-400">{selectedProduct.category}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProduct(null)}
                className="text-gray-400 hover:text-gray-200 p-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <FaTimes className="w-6 h-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Product Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Category:</span>
                    <span className="text-white font-medium">{selectedProduct.category}</span>
                  </div>
                  {selectedProduct.description && (
                    <div>
                      <span className="text-gray-400 block mb-1">Description:</span>
                      <p className="text-white text-sm bg-gray-800 p-3 rounded-lg">{selectedProduct.description}</p>
                    </div>
                  )}
                  {selectedProduct.customer_rating && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Rating:</span>
                      <div className="flex items-center space-x-1">
                        <FiStar className="text-yellow-400 fill-current" />
                        <span className="text-white font-medium">{selectedProduct.customer_rating}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Financial Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Financial Details</h3>
                <div className="space-y-3">
                  {showColumns && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Cost Price:</span>
                      <span className="text-white font-medium">{formatPrice(selectedProduct.cost_price)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-400">Selling Price:</span>
                    <span className="text-green-400 font-semibold">{formatPrice(selectedProduct.selling_price)}</span>
                  </div>
                  {showColumns && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Profit Margin:</span>
                      <span className="text-teal-400 font-medium">
                        {((parseFloat(selectedProduct.selling_price) - parseFloat(selectedProduct.cost_price)) / parseFloat(selectedProduct.selling_price) * 100).toFixed(1)}%
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Inventory Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Inventory Status</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Stock Available:</span>
                    <span className="text-white font-medium">{selectedProduct.stock_available}</span>
                  </div>
                  {showColumns && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Units Sold:</span>
                      <span className="text-white font-medium">{selectedProduct.units_sold}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-400 block mb-2">Status:</span>
                    <StatusIndicator product={selectedProduct} />
                  </div>
                </div>
              </div>

              {/* Forecast Information */}
              {showForecast && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Demand Forecast</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Forecast:</span>
                      <span className="text-white font-medium">{selectedProduct.demand_forecast}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block mb-2">Performance:</span>
                      <PerformanceIndicator product={selectedProduct} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 flex justify-end space-x-3">
              <button
                onClick={() => setSelectedProduct(null)}
                className="px-6 py-2 border border-gray-700 rounded-lg text-sm hover:bg-gray-800 transition-colors"
              >
                Close
              </button>
              {showColumns && (
                <button
                  onClick={() => {
                    onEdit(selectedProduct);
                    setSelectedProduct(null);
                  }}
                  className="px-6 py-2 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700 transition-colors"
                >
                  Edit Product
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductTable;
