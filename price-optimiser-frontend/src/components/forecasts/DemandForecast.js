// src/components/forecasts/DemandForecastChartModal.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import { FiX } from 'react-icons/fi';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function DemandForecastChartModal({ onClose }) {
  const navigate = useNavigate();
  const [forecastData, setForecastData] = useState([]);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: products }       = await api.get('/products/');
        const { data: forecastsArray } = await api.get('/products/forecast/');
        const forecastMap = forecastsArray.reduce((m, i) => {
          m[i.product_id] = i.forecast;
          return m;
        }, {});
        const combined = products.map(p => ({
          product_id:      p.id,
          name:            p.name,
          stock_available: p.stock_available,
          units_sold:      p.units_sold,
          forecast:        forecastMap[p.id] ?? 0,
        }));
        setForecastData(combined);
        setChartData({
          labels: combined.map(d => d.name),
          datasets: [
            { label: 'Demand Forecast', data: combined.map(d => d.forecast),   borderColor: '#8b5cf6', tension: 0.1 },
            { label: 'Available Stock', data: combined.map(d => d.stock_available), borderColor: '#3b82f6', tension: 0.1 },
            { label: 'Units Sold',      data: combined.map(d => d.units_sold),    borderColor: '#facc15', tension: 0.1 },
          ],
        });
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
      <div className="w-full max-w-3xl mx-4 rounded-xl overflow-hidden shadow-xl bg-gray-900 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-800">
          <h2 className="text-lg font-semibold text-white">Demand Forecast</h2>
          <FiX
            size={20}
            onClick={() => {
              onClose?.();
              navigate(-1);
            }}
            className="text-red-500 hover:text-red-600 cursor-pointer"
          />
        </div>

        {/* Chart */}
        <div className="flex-shrink-0 px-4 pt-4 pb-2 bg-black">
          {chartData && (
            <Line
              data={chartData}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'bottom', labels: { color: '#ddd' } },
                },
                scales: {
                  x: { ticks: { color: '#ddd', maxRotation: 45, minRotation: 45 }, grid: { color: 'transparent' } },
                  y: { ticks: { color: '#ddd' }, grid: { color: '#444' } },
                },
              }}
            />
          )}
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto bg-white border-t border-gray-700">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-white">Product Name</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-white">Available Stock</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-white">Units Sold</th>
                <th className="px-4 py-2 text-center text-sm font-medium text-white">
                  Calculated Demand Forecast
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {forecastData.map((d, idx) => (
                <tr
                  key={d.product_id}
                  className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                >
                  <td className="px-4 py-2 text-sm text-gray-800">{d.name}</td>
                  <td className="px-4 py-2 text-sm text-gray-800">
                    {d.stock_available.toLocaleString()}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-800">
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
}
