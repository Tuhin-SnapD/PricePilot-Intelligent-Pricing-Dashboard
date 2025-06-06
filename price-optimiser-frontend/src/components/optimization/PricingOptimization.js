import React, { useEffect, useState } from 'react';
import api from '../../api';

const PricingOptimization = () => {
  const [optData, setOptData] = useState([]);

  useEffect(() => {
    const fetchOptimization = async () => {
      const response = await api.get('/products/optimize/');
      setOptData(response.data);
    };
    fetchOptimization();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Pricing Optimization</h2>
      <table border="1" cellPadding="8" cellSpacing="0" style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>Product</th>
            <th>Optimized Price</th>
          </tr>
        </thead>
        <tbody>
          {optData.map((d) => (
            <tr key={d.product_id}>
              <td>{d.name}</td>
              <td>${d.optimized_price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PricingOptimization;
