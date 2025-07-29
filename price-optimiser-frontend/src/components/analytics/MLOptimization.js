import React, { useState, useEffect } from 'react';
import { FiTrendingUp, FiTrendingDown, FiTarget, FiInfo } from 'react-icons/fi';
import { FaBrain } from 'react-icons/fa';
import { HiArrowLeft } from 'react-icons/hi2';
import Navbar from '../common/Navbar';
import api from '../../api';

const MLOptimization = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [optimizationResult, setOptimizationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products/');
      if (response.data.success) {
        setProducts(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  const optimizeProduct = async (productId) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post('/products/ml-optimize/', {
        product_id: productId
      });
      
      if (response.data.success) {
        setOptimizationResult(response.data.data);
      } else {
        setError('Failed to optimize product');
      }
    } catch (err) {
      console.error('Error optimizing product:', err);
      setError('Failed to optimize product');
    } finally {
      setLoading(false);
    }
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setOptimizationResult(null);
    optimizeProduct(product.id);
  };

  const getPriceChangeColor = (change) => {
    if (change > 0) return 'text-green-400';
    if (change < 0) return 'text-red-400';
    return 'text-gray-400';
  };

  const getPriceChangeIcon = (change) => {
    if (change > 0) return <FiTrendingUp className="text-green-400" />;
    if (change < 0) return <FiTrendingDown className="text-red-400" />;
    return <FiTarget className="text-gray-400" />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-black to-gray-800 text-white">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-gray-900 rounded-lg p-6">

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Selection */}
        <div className="lg:col-span-1">
          <h3 className="text-lg font-medium text-white mb-4">Select Product</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {products.map((product) => (
              <div
                key={product.id}
                onClick={() => handleProductSelect(product)}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedProduct?.id === product.id
                    ? 'bg-teal-500 text-black'
                    : 'bg-gray-800 hover:bg-gray-700 text-white'
                }`}
              >
                <div className="font-medium">{product.name}</div>
                <div className="text-sm opacity-75">{product.category}</div>
                <div className="text-sm opacity-75">
                  Current: ${product.selling_price}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Optimization Results */}
        <div className="lg:col-span-2">
          {loading && (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-400 mx-auto mb-4"></div>
                <p className="text-gray-400">Analyzing pricing with AI...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="text-center p-6">
              <p className="text-red-400 mb-4">{error}</p>
              <button
                onClick={() => selectedProduct && optimizeProduct(selectedProduct.id)}
                className="px-4 py-2 bg-teal-500 text-black rounded hover:bg-teal-600"
              >
                Retry
              </button>
            </div>
          )}

          {optimizationResult && !loading && (
            <div className="space-y-6">
              {/* Main Recommendation */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-medium text-white mb-4">AI Recommendation</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                      ${optimizationResult.recommended_price}
                    </div>
                    <div className="text-sm text-gray-400">Recommended Price</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                      ${optimizationResult.current_price}
                    </div>
                    <div className="text-sm text-gray-400">Current Price</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold flex items-center justify-center space-x-1 ${
                      getPriceChangeColor(optimizationResult.justification.price_change_percent)
                    }`}>
                      {getPriceChangeIcon(optimizationResult.justification.price_change_percent)}
                      <span>
                        {optimizationResult.justification.price_change_percent > 0 ? '+' : ''}
                        {optimizationResult.justification.price_change_percent}%
                      </span>
                    </div>
                    <div className="text-sm text-gray-400">Price Change</div>
                  </div>
                </div>
                
                <div className="bg-gray-700 rounded-lg p-4">
                  <p className="text-white">{optimizationResult.justification.summary}</p>
                </div>
              </div>

              {/* Optimization Factors */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-medium text-white mb-4">Optimization Factors</h3>
                <div className="space-y-3">
                  {optimizationResult.justification.factors.map((factor, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-700 rounded-lg">
                      <FiInfo className="text-teal-400 mt-1 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-white">{factor.name.replace('_', ' ').toUpperCase()}</div>
                        <div className="text-sm text-gray-400">{factor.description}</div>
                        <div className="text-sm text-gray-300 mt-1">{factor.impact}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* A/B Testing Results */}
              {optimizationResult.ab_testing_results && (
                <div className="bg-gray-800 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-white mb-4">Strategy Comparison</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="text-left py-2 text-gray-300">Strategy</th>
                          <th className="text-right py-2 text-gray-300">Price</th>
                          <th className="text-right py-2 text-gray-300">Demand</th>
                          <th className="text-right py-2 text-gray-300">Revenue</th>
                          <th className="text-right py-2 text-gray-300">Profit</th>
                          <th className="text-right py-2 text-gray-300">Margin</th>
                        </tr>
                      </thead>
                      <tbody>
                        {optimizationResult.ab_testing_results.slice(0, 5).map((strategy, index) => (
                          <tr key={index} className="border-b border-gray-700">
                            <td className="py-2 text-white">{strategy.strategy}</td>
                            <td className="py-2 text-right text-white">${strategy.price}</td>
                            <td className="py-2 text-right text-white">{strategy.demand}</td>
                            <td className="py-2 text-right text-white">${strategy.revenue}</td>
                            <td className="py-2 text-right text-white">${strategy.profit}</td>
                            <td className="py-2 text-right text-white">{strategy.margin}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Additional Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="text-sm text-gray-400">Inventory Status</div>
                  <div className="text-lg font-medium text-white capitalize">
                    {optimizationResult.inventory_status}
                  </div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="text-sm text-gray-400">ML Confidence</div>
                  <div className="text-lg font-medium text-white">
                    {(optimizationResult.ml_confidence * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="text-sm text-gray-400">Price Elasticity</div>
                  <div className="text-lg font-medium text-white">
                    {optimizationResult.elasticity}
                  </div>
                </div>
              </div>
            </div>
          )}

          {!selectedProduct && !loading && (
            <div className="text-center p-12">
              <FiTarget className="text-4xl text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Select a product to see AI-powered pricing recommendations</p>
            </div>
          )}
        </div>
      </div>
        </div>
      </div>
    </div>
  );
};

export default MLOptimization; 