import React, { useState, useEffect } from 'react';
import { FiTrendingUp, FiTrendingDown, FiMinus } from 'react-icons/fi';
import api from '../../api';

const ElasticityHeatmap = () => {
  const [heatmapData, setHeatmapData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHeatmapData();
  }, []);

  const fetchHeatmapData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/products/elasticity-heatmap/');
      
      if (response.data.success) {
        setHeatmapData(response.data.data);
      } else {
        setError('Failed to load elasticity data');
      }
    } catch (err) {
      console.error('Error fetching elasticity heatmap:', err);
      setError('Failed to load elasticity heatmap data');
    } finally {
      setLoading(false);
    }
  };

  const getElasticityColor = (elasticity) => {
    if (elasticity < -2) return 'bg-red-500'; // Very Elastic
    if (elasticity < -1) return 'bg-orange-500'; // Elastic
    if (elasticity < -0.5) return 'bg-yellow-500'; // Unit Elastic
    return 'bg-green-500'; // Inelastic
  };

  const getElasticityIcon = (elasticity) => {
    if (elasticity < -1) return <FiTrendingDown className="text-white" />;
    if (elasticity > -0.5) return <FiTrendingUp className="text-white" />;
    return <FiMinus className="text-white" />;
  };

  const getElasticityDescription = (elasticity) => {
    if (elasticity < -2) return 'Very Elastic - Highly price sensitive';
    if (elasticity < -1) return 'Elastic - Price sensitive';
    if (elasticity < -0.5) return 'Unit Elastic - Moderate sensitivity';
    return 'Inelastic - Less price sensitive';
  };

  if (loading) {
    return (
      <div className="bg-gray-900 rounded-lg p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-400 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading elasticity heatmap...</p>
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
            onClick={fetchHeatmapData}
            className="px-4 py-2 bg-teal-500 text-black rounded hover:bg-teal-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!heatmapData || !heatmapData.data) {
    return (
      <div className="bg-gray-900 rounded-lg p-6">
        <p className="text-gray-400 text-center">No elasticity data available</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Price Elasticity Heatmap</h2>
        <button
          onClick={fetchHeatmapData}
          className="px-3 py-1 bg-teal-500 text-black rounded text-sm hover:bg-teal-600"
        >
          Refresh
        </button>
      </div>

      {/* Legend */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-300 mb-3">Elasticity Ranges:</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {heatmapData.elasticity_ranges.map((range, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className={`w-4 h-4 rounded ${getElasticityColor(-2 + index * 0.5)}`}></div>
              <span className="text-xs text-gray-400">{range}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="grid gap-4">
        {heatmapData.data.map((item, index) => (
          <div key={index} className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-medium text-white">{item.category}</h4>
              <div className="flex items-center space-x-2">
                {getElasticityIcon(item.elasticity)}
                <span className="text-sm text-gray-300">
                  {item.elasticity}
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-gray-400">
                {getElasticityDescription(item.elasticity)}
              </p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">
                  Products: {item.product_count}
                </span>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${getElasticityColor(item.elasticity)}`}></div>
                  <span className="text-gray-300">
                    Range {item.range_index + 1}
                  </span>
                </div>
              </div>
            </div>

            {/* Elasticity Bar */}
            <div className="mt-3">
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${getElasticityColor(item.elasticity)}`}
                  style={{
                    width: `${Math.min(Math.abs(item.elasticity) * 20, 100)}%`
                  }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 p-4 bg-gray-800 rounded-lg">
        <h3 className="text-sm font-medium text-gray-300 mb-2">Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-400">Total Categories:</span>
            <span className="text-white ml-2">{heatmapData.data.length}</span>
          </div>
          <div>
            <span className="text-gray-400">Most Elastic:</span>
            <span className="text-white ml-2">
              {heatmapData.data.reduce((min, item) => 
                item.elasticity < min.elasticity ? item : min
              ).category}
            </span>
          </div>
          <div>
            <span className="text-gray-400">Least Elastic:</span>
            <span className="text-white ml-2">
              {heatmapData.data.reduce((max, item) => 
                item.elasticity > max.elasticity ? item : max
              ).category}
            </span>
          </div>
          <div>
            <span className="text-gray-400">Avg Elasticity:</span>
            <span className="text-white ml-2">
              {(heatmapData.data.reduce((sum, item) => sum + item.elasticity, 0) / heatmapData.data.length).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElasticityHeatmap; 