import React, { useEffect, useState } from "react";
import { FiTrendingUp, FiTrendingDown, FiMinus } from "react-icons/fi";
import api from "../../api";

const LEGEND_COLORS = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500"];

const ElasticityHeatmap = () => {
  const [heatmapData, setHeatmapData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHeatmapData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/products/elasticity-heatmap/");

      if (response.data.success) {
        setHeatmapData(response.data.data);
      } else {
        setError(response.data.error || "Failed to load elasticity data.");
      }
    } catch (err) {
      setError(
        err.response?.data?.error || "Failed to load elasticity heatmap data. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHeatmapData();
  }, []);

  const getElasticityColor = (elasticity) => {
    const value = Number(elasticity);
    if (!Number.isFinite(value)) return "bg-gray-500";
    if (value < -2) return "bg-red-500";
    if (value < -1) return "bg-orange-500";
    if (value < -0.5) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getElasticityIcon = (elasticity) => {
    const value = Number(elasticity);
    if (!Number.isFinite(value)) return <FiMinus className="text-white" />;
    if (value < -1) return <FiTrendingDown className="text-white" />;
    if (value > -0.5) return <FiTrendingUp className="text-white" />;
    return <FiMinus className="text-white" />;
  };

  const getElasticityDescription = (elasticity) => {
    const value = Number(elasticity);
    if (!Number.isFinite(value)) return "Elasticity data unavailable";
    if (value < -2) return "Very Elastic - Highly price sensitive";
    if (value < -1) return "Elastic - Price sensitive";
    if (value < -0.5) return "Unit Elastic - Moderate sensitivity";
    return "Inelastic - Less price sensitive";
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
            type="button"
            onClick={fetchHeatmapData}
            className="px-4 py-2 bg-teal-500 text-black rounded hover:bg-teal-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!heatmapData || !Array.isArray(heatmapData.data)) {
    return (
      <div className="bg-gray-900 rounded-lg p-6">
        <p className="text-gray-400 text-center">No elasticity data available.</p>
      </div>
    );
  }

  const items = heatmapData.data;
  const ranges = Array.isArray(heatmapData.elasticity_ranges)
    ? heatmapData.elasticity_ranges
    : [];

  const mostElastic = items.reduce(
    (min, item) =>
      Number(item.elasticity) < Number(min.elasticity) ? item : min,
    items[0]
  );
  const leastElastic = items.reduce(
    (max, item) =>
      Number(item.elasticity) > Number(max.elasticity) ? item : max,
    items[0]
  );
  const averageElasticity =
    items.length > 0
      ? items.reduce((sum, item) => sum + (Number(item.elasticity) || 0), 0) / items.length
      : null;

  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h2 className="text-xl font-semibold text-white">Price Elasticity Heatmap</h2>
        <button
          type="button"
          onClick={fetchHeatmapData}
          className="px-3 py-1 bg-teal-500 text-black rounded text-sm hover:bg-teal-600"
        >
          Refresh
        </button>
      </div>

      {ranges.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-300 mb-3">Elasticity Ranges:</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {ranges.map((range, index) => (
              <div key={range} className="flex items-center space-x-2">
                <div
                  className={`w-4 h-4 rounded ${LEGEND_COLORS[index] || "bg-gray-500"}`}
                />
                <span className="text-xs text-gray-400">{range}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {items.length === 0 ? (
        <p className="text-gray-400 text-center py-6">No elasticity data available.</p>
      ) : (
        <>
          <div className="grid gap-4">
            {items.map((item) => {
              const elasticity = Number(item.elasticity);
              const barWidth = Number.isFinite(elasticity)
                ? Math.min(Math.max(Math.abs(elasticity) * 20, 0), 100)
                : 0;
              const rangeLabel =
                ranges[item.range_index] ||
                `Range ${Number(item.range_index) + 1 || "unknown"}`;

              return (
                <div key={item.category} className="bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <h4 className="text-lg font-medium text-white">{item.category}</h4>
                    <div className="flex items-center space-x-2">
                      {getElasticityIcon(elasticity)}
                      <span className="text-sm text-gray-300">
                        {Number.isFinite(elasticity) ? elasticity.toFixed(3) : "—"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-gray-400">
                      {getElasticityDescription(elasticity)}
                    </p>
                    {item.insights && (
                      <p className="text-sm text-gray-300">{item.insights}</p>
                    )}
                    <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                      <span className="text-gray-400">
                        Products: {Number(item.product_count) || 0}
                      </span>
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-3 h-3 rounded-full ${getElasticityColor(elasticity)}`}
                        />
                        <span className="text-gray-300">{rangeLabel}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getElasticityColor(elasticity)}`}
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 p-4 bg-gray-800 rounded-lg">
            <h3 className="text-sm font-medium text-gray-300 mb-2">Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Total Categories:</span>
                <span className="text-white ml-2">{items.length}</span>
              </div>
              <div>
                <span className="text-gray-400">Most Elastic:</span>
                <span className="text-white ml-2">{mostElastic?.category || "—"}</span>
              </div>
              <div>
                <span className="text-gray-400">Least Elastic:</span>
                <span className="text-white ml-2">{leastElastic?.category || "—"}</span>
              </div>
              <div>
                <span className="text-gray-400">Avg Elasticity:</span>
                <span className="text-white ml-2">
                  {averageElasticity != null ? averageElasticity.toFixed(2) : "—"}
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ElasticityHeatmap;
