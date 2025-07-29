import React, { useState, useEffect } from 'react';
import { FiPackage, FiAlertTriangle, FiCheckCircle, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import api from '../../api';

const InventoryAnalysis = () => {
  const [inventoryData, setInventoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInventoryData();
  }, []);

  const fetchInventoryData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/products/inventory-analysis/');
      
      if (response.data.success) {
        setInventoryData(response.data.data);
      } else {
        setError('Failed to load inventory data');
      }
    } catch (err) {
      console.error('Error fetching inventory data:', err);
      setError('Failed to load inventory analysis');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'low':
        return <FiAlertTriangle className="text-red-400" />;
      case 'medium':
        return <FiTrendingDown className="text-yellow-400" />;
      case 'adequate':
        return <FiCheckCircle className="text-green-400" />;
      case 'high':
        return <FiTrendingUp className="text-blue-400" />;
      default:
        return <FiPackage className="text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'low':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'adequate':
        return 'bg-green-500';
      case 'high':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusDescription = (status) => {
    switch (status) {
      case 'low':
        return 'Critical stock levels - immediate action needed';
      case 'medium':
        return 'Below optimal levels - consider restocking';
      case 'adequate':
        return 'Healthy stock levels - maintain current levels';
      case 'high':
        return 'Excess inventory - consider promotional pricing';
      default:
        return 'Unknown inventory status';
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-900 rounded-lg p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-400 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading inventory analysis...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900 rounded-lg p-6">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={fetchInventoryData}
            className="px-4 py-2 bg-teal-500 text-black rounded hover:bg-teal-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!inventoryData) {
    return (
      <div className="bg-gray-900 rounded-lg p-6">
        <p className="text-gray-400 text-center">No inventory data available</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <FiPackage className="text-2xl text-teal-400" />
          <h2 className="text-xl font-semibold text-white">Inventory Analysis</h2>
        </div>
        <button
          onClick={fetchInventoryData}
          className="px-3 py-1 bg-teal-500 text-black rounded text-sm hover:bg-teal-600"
        >
          Refresh
        </button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="text-2xl font-bold text-white">{inventoryData.total_products}</div>
          <div className="text-sm text-gray-400">Total Products</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="text-2xl font-bold text-red-400">{inventoryData.inventory_status.low}</div>
          <div className="text-sm text-gray-400">Low Stock</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="text-2xl font-bold text-yellow-400">{inventoryData.inventory_status.medium}</div>
          <div className="text-sm text-gray-400">Medium Stock</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-400">{inventoryData.inventory_status.adequate + inventoryData.inventory_status.high}</div>
          <div className="text-sm text-gray-400">Healthy Stock</div>
        </div>
      </div>

      {/* Inventory Status Distribution */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-medium text-white mb-4">Inventory Status Distribution</h3>
        <div className="space-y-4">
          {Object.entries(inventoryData.inventory_status).map(([status, count]) => (
            <div key={status} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getStatusIcon(status)}
                <div>
                  <div className="text-white capitalize">{status} Stock</div>
                  <div className="text-sm text-gray-400">{getStatusDescription(status)}</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-white font-medium">{count} products</div>
                <div className="w-24 bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${getStatusColor(status)}`}
                    style={{
                      width: `${(count / inventoryData.total_products) * 100}%`
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      {inventoryData.recommendations.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-medium text-white mb-4">Recommendations</h3>
          <div className="space-y-4">
            {inventoryData.recommendations.map((rec, index) => (
              <div key={index} className="border-l-4 border-teal-400 pl-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-white font-medium">{rec.message}</div>
                    <div className="text-sm text-gray-400 mt-1">{rec.action}</div>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs ${
                    rec.type === 'low_stock' ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
                  }`}>
                    {rec.type === 'low_stock' ? 'Urgent' : 'Consider'}
                  </div>
                </div>
                {rec.products && rec.products.length > 0 && (
                  <div className="mt-3">
                    <div className="text-sm text-gray-400 mb-2">Affected Products:</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {rec.products.map((product, pIndex) => (
                        <div key={pIndex} className="bg-gray-700 rounded p-2 text-sm">
                          <div className="text-white">{product.name}</div>
                          <div className="text-gray-400">
                            Stock: {product.stock} | Demand: {product.demand}
                          </div>
                          <div className="text-gray-400">
                            Ratio: {product.stock_ratio}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Products by Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Object.entries(inventoryData.products_by_status).map(([status, products]) => (
          <div key={status} className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              {getStatusIcon(status)}
              <h4 className="text-white font-medium capitalize">{status} Stock Products</h4>
              <span className="text-sm text-gray-400">({products.length})</span>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {products.slice(0, 5).map((product, index) => (
                <div key={index} className="bg-gray-700 rounded p-2 text-sm">
                  <div className="text-white">{product.name}</div>
                  <div className="text-gray-400">{product.category}</div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Stock: {product.stock}</span>
                    <span>Demand: {product.demand}</span>
                    <span>Ratio: {product.stock_ratio}</span>
                  </div>
                </div>
              ))}
              {products.length > 5 && (
                <div className="text-center text-sm text-gray-400">
                  +{products.length - 5} more products
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Action Items */}
      <div className="mt-6 bg-gray-800 rounded-lg p-4">
        <h4 className="text-white font-medium mb-3">Quick Actions</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button className="p-3 bg-red-500 text-white rounded hover:bg-red-600 text-sm">
            Restock Low Inventory ({inventoryData.inventory_status.low} items)
          </button>
          <button className="p-3 bg-yellow-500 text-black rounded hover:bg-yellow-600 text-sm">
            Review Medium Stock ({inventoryData.inventory_status.medium} items)
          </button>
          <button className="p-3 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">
            Optimize High Stock ({inventoryData.inventory_status.high} items)
          </button>
        </div>
      </div>
    </div>
  );
};

export default InventoryAnalysis; 