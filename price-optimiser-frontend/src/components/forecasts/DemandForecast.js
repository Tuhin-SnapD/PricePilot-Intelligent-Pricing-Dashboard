// src/components/forecasts/DemandForecastChartModal.jsx
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { FiX } from "react-icons/fi";
import api from "../../api";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function DemandForecastChartModal({ selectedIds, onClose }) {
  const [forecastData, setForecastData] = useState([]);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (!selectedIds.length) return;

    (async () => {
      try {
        const { data: products } = await api.get("/products/");
        const { data: forecastsArray } = await api.get("/products/forecast/");
        const forecastMap = forecastsArray.reduce(
          (m, { product_id, forecast }) => {
            m[product_id] = forecast;
            return m;
          },
          {}
        );
        const filtered = products
          .filter((p) => selectedIds.includes(p.id))
          .map((p) => ({
            product_id: p.id,
            name: p.name,
            stock_available: p.stock_available,
            units_sold: p.units_sold,
            forecast: forecastMap[p.id] ?? 0,
          }));

        setForecastData(filtered);
        setChartData({
          labels: filtered.map((d) => d.name),
          datasets: [
            {
              label: "Demand Forecast",
              data: filtered.map((d) => d.forecast),
              borderColor: "#8b5cf6",
              tension: 0.1,
            },
            {
              label: "Available Stock",
              data: filtered.map((d) => d.stock_available),
              borderColor: "#3b82f6",
              tension: 0.1,
            },
            {
              label: "Units Sold",
              data: filtered.map((d) => d.units_sold),
              borderColor: "#facc15",
              tension: 0.1,
            },
          ],
        });
      } catch (err) {
        console.error("Error fetching forecast data:", err);
      }
    })();
  }, [selectedIds]);

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
      <div className="w-full max-w-3xl mx-4 rounded-xl overflow-hidden shadow-xl bg-gray-900 max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 bg-gray-800">
          <h2 className="text-lg font-semibold text-white">Demand Forecast</h2>
          <FiX
            size={20}
            onClick={onClose}
            className="text-red-500 hover:text-red-600 cursor-pointer"
          />
        </div>

        <div className="flex-shrink-0 px-4 pt-4 pb-2 bg-black">
          {chartData ? (
            <Line
              data={chartData}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: "bottom", labels: { color: "#ddd" } },
                },
                scales: {
                  x: {
                    ticks: { color: "#ddd", maxRotation: 45, minRotation: 45 },
                    grid: { color: "transparent" },
                  },
                  y: { ticks: { color: "#ddd" }, grid: { color: "#444" } },
                },
              }}
            />
          ) : (
            <p className="text-gray-400 text-center">Loading chart…</p>
          )}
        </div>

        <div className="flex-1 overflow-auto bg-gray-900">
          <table className="w-full divide-y divide-gray-700">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-white">
                  Product Name
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-white">
                  Available Stock
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-white">
                  Units Sold
                </th>
                <th className="px-4 py-2 text-center text-sm font-medium text-white">
                  Demand Forecast
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {forecastData.map((d, i) => (
                <tr
                  key={d.product_id}
                  className={i % 2 ? "bg-gray-800" : "bg-gray-900"}
                >
                  <td className="px-4 py-2 text-sm text-gray-200">{d.name}</td>
                  <td className="px-4 py-2 text-sm text-gray-200">
                    {d.stock_available.toLocaleString()}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-200">
                    {d.units_sold.toLocaleString()}
                  </td>
                  <td className="px-4 py-2 text-sm font-bold text-center bg-teal-400 text-black">
                    {d.forecast.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  if (!selectedIds.length) {
    return ReactDOM.createPortal(
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
        <div className="p-8 text-center text-gray-300 bg-gray-900 rounded-xl shadow-lg">
          <p>No products selected for forecast.</p>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-teal-500 text-black rounded"
          >
            Go Back
          </button>
        </div>
      </div>,
      document.body
    );
  }

  return ReactDOM.createPortal(modalContent, document.body);
}
