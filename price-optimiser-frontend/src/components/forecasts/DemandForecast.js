import React, { useEffect, useState } from 'react';
import api from '../../api';
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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const DemandForecast = () => {
  const [forecastData, setForecastData] = useState([]);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchForecast = async () => {
      const response = await api.get('/products/forecast/');
      setForecastData(response.data);
      const labels = response.data.map((d) => d.name);
      const values = response.data.map((d) => d.forecast);
      setChartData({
        labels,
        datasets: [{
          label: 'Demand Forecast',
          data: values,
          fill: false,
          tension: 0.1,
        }],
      });
    };
    fetchForecast();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Demand Forecast</h2>
      {chartData && (
        <Line data={chartData} />
      )}
      <table border="1" cellPadding="8" cellSpacing="0" style={{ width: '100%', marginTop: '1rem' }}>
        <thead>
          <tr>
            <th>Product</th>
            <th>Forecasted Demand</th>
          </tr>
        </thead>
        <tbody>
          {forecastData.map((d) => (
            <tr key={d.product_id}>
              <td>{d.name}</td>
              <td>{d.forecast}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DemandForecast;
