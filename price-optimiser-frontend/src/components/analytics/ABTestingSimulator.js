import React, { useState, useEffect } from 'react';
import { FiBarChart2, FiTrendingUp, FiTrendingDown, FiTarget, FiZap } from 'react-icons/fi';
import api from '../../api';

const ABTestingSimulator = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [abResults, setAbResults] = useState(null);
  const [selectedStrategy, setSelectedStrategy] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const strategies = [
    { key: 'penetration', name: 'Penetration Pricing', description: 'Low price to gain market share' },
    { key: 'skimming', name: 'Price Skimming', description: 'High price for premium positioning' },
    { key: 'competitive', name: 'Competitive Pricing', description: 'Match competitor pricing' },
    { key: 'cost_plus', name: 'Cost-Plus Pricing', description: 'Cost plus 20% margin' },
    { key: 'value_based', name: 'Value-Based Pricing', description: 'Price based on perceived value' }
  ];

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

  const runABTest = async (productId, strategy = null) => {
    try {
      setLoading(true);
      setError(null);
      
      const payload = { product_id: productId };
      if (strategy) {
        payload.strategy_name = strategy;
      }
      
      const response = await api.post('/products/ab-testing/', payload);
      
      if (response.data.success) {
        setAbResults(response.data.data);
      } else {
        setError('Failed to run A/B test');
      }
    } catch (err) {
      console.error('Error running A/B test:', err);
      setError('Failed to run A/B test');
    } finally {
      setLoading(false);
    }
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setAbResults(null);
    setSelectedStrategy('');
    runABTest(product.id);
  };

  const handleStrategySelect = (strategy) => {
    setSelectedStrategy(strategy);
    if (selectedProduct) {
      runABTest(selectedProduct.id, strategy);
    }
  };

  const getProfitColor = (profit, maxProfit) => {
    const ratio = profit / maxProfit;
    if (ratio > 0.8) return 'text-green-400';
    if (ratio > 0.6) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getChangeColor = (change) => {
    if (change > 0) return 'text-green-400';
    if (change < 0) return 'text-red-400';
    return 'text-gray-400';
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <FiBarChart2 className="text-2xl text-teal-400" />
          <h2 className="text-xl font-semibold text-white">A/B Testing Simulator</h2>
        </div>
        <div className="text-sm text-gray-400">
          Compare pricing strategies
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Product Selection */}
        <div className="lg:col-span-1">
          <h3 className="text-lg font-medium text-white mb-4">Select Product</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
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
                <div className="font-medium text-sm">{product.name}</div>
                <div className="text-xs opacity-75">{product.category}</div>
                <div className="text-xs opacity-75">
                  ${product.selling_price}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Strategy Selection */}
        <div className="lg:col-span-1">
          <h3 className="text-lg font-medium text-white mb-4">Pricing Strategies</h3>
          <div className="space-y-2">
            {strategies.map((strategy) => (
              <div
                key={strategy.key}
                onClick={() => handleStrategySelect(strategy.key)}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedStrategy === strategy.key
                    ? 'bg-teal-500 text-black'
                    : 'bg-gray-800 hover:bg-gray-700 text-white'
                }`}
              >
                <div className="font-medium text-sm">{strategy.name}</div>
                <div className="text-xs opacity-75">{strategy.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-2">
          {loading && (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-400 mx-auto mb-4"></div>
                <p className="text-gray-400">Running A/B test simulation...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="text-center p-6">
              <p className="text-red-400 mb-4">{error}</p>
              <button
                onClick={() => selectedProduct && runABTest(selectedProduct.id, selectedStrategy)}
                className="px-4 py-2 bg-teal-500 text-black rounded hover:bg-teal-600"
              >
                Retry
              </button>
            </div>
          )}

          {abResults && !loading && (
            <div className="space-y-6">
              {selectedStrategy ? (
                // Single strategy result
                <div className="bg-gray-800 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-white mb-4">
                    {strategies.find(s => s.key === selectedStrategy)?.name} Strategy
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">${abResults.price}</div>
                      <div className="text-sm text-gray-400">Price</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{abResults.demand}</div>
                      <div className="text-sm text-gray-400">Demand</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">${abResults.revenue}</div>
                      <div className="text-sm text-gray-400">Revenue</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">${abResults.profit}</div>
                      <div className="text-sm text-gray-400">Profit</div>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-gray-700 rounded-lg">
                    <div className="text-sm text-gray-300">
                      Price Change: <span className={getChangeColor(abResults.price_change)}>
                        {abResults.price_change > 0 ? '+' : ''}{abResults.price_change}%
                      </span>
                    </div>
                    <div className="text-sm text-gray-300">
                      Margin: {abResults.margin}%
                    </div>
                  </div>
                </div>
              ) : (
                // All strategies comparison
                <>
                  <div className="bg-gray-800 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-white mb-4">Strategy Comparison</h3>
                    <div className="space-y-4">
                      {abResults.strategies?.map((strategy, index) => (
                        <div key={index} className="bg-gray-700 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-medium text-white">{strategy.strategy}</div>
                            {index === 0 && (
                              <div className="flex items-center space-x-1 text-green-400">
                                <FiZap />
                                <span className="text-sm">Best</span>
                              </div>
                            )}
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                            <div>
                              <span className="text-gray-400">Price:</span>
                              <span className="text-white ml-1">${strategy.price}</span>
                            </div>
                            <div>
                              <span className="text-gray-400">Demand:</span>
                              <span className="text-white ml-1">{strategy.demand}</span>
                            </div>
                            <div>
                              <span className="text-gray-400">Revenue:</span>
                              <span className="text-white ml-1">${strategy.revenue}</span>
                            </div>
                            <div>
                              <span className="text-gray-400">Profit:</span>
                              <span className={`ml-1 ${getProfitColor(strategy.profit, abResults.strategies[0].profit)}`}>
                                ${strategy.profit}
                              </span>
                            </div>
                          </div>
                          <div className="mt-2 text-xs text-gray-400">
                            {strategy.description}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Summary */}
                  {abResults.summary && (
                    <div className="bg-gray-800 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-white mb-2">Summary</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Strategies:</span>
                          <span className="text-white ml-1">{abResults.summary.total_strategies}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Min Profit:</span>
                          <span className="text-white ml-1">${abResults.summary.profit_range.min}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Max Profit:</span>
                          <span className="text-white ml-1">${abResults.summary.profit_range.max}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Best Strategy:</span>
                          <span className="text-green-400 ml-1 capitalize">
                            {abResults.best_strategy?.strategy.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {!selectedProduct && !loading && (
            <div className="text-center p-12">
              <FiBarChart2 className="text-4xl text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Select a product to run A/B testing simulation</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ABTestingSimulator; 