import React from 'react';
import { FiEye, FiEdit, FiTrash2 } from 'react-icons/fi';

export const formatPrice = (val) => {
  const num = typeof val === 'number' ? val : parseFloat(val) || 0;
  return `$${num.toFixed(2)}`;
};

const ProductTable = ({ products, onView, onEdit, onDelete, showForecast }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full text-sm text-left text-gray-900 bg-white">
      <thead className="bg-gray-800 text-white">
        <tr>
          <th className="p-3">
            <input type="checkbox" className="h-4 w-4 text-teal-400 bg-gray-700 rounded" />
          </th>
          <th className="p-3">Product Name</th>
          <th className="p-3">Product Category</th>
          <th className="p-3">Cost Price</th>
          <th className="p-3">Selling Price</th>
          <th className="p-3">Description</th>
          <th className="p-3">Available Stock</th>
          <th className="p-3">Units Sold</th>
          {showForecast && <th className="p-3">Demand Forecast</th>}
          <th className="p-3">Action</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {products.map((p, idx) => (
          <tr key={p.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
            <td className="px-2 py-1">
              <input type="checkbox" className="h-4 w-4 text-teal-400 bg-gray-200 rounded" />
            </td>
            <td className="px-2 py-1">{p.name}</td>
            <td className="px-2 py-1">{p.category}</td>
            <td className="px-2 py-1">{formatPrice(p.cost_price)}</td>
            <td className="px-2 py-1">{formatPrice(p.selling_price)}</td>
            <td className="px-2 py-1">
              {p.description?.length > 50 ? `${p.description.slice(0, 50)}…` : p.description}
            </td>
            <td className="px-2 py-1">{Number(p.stock_available).toLocaleString()}</td>
            <td className="px-2 py-1">{Number(p.units_sold).toLocaleString()}</td>
            {showForecast && (
              <td className="px-2 py-1 font-medium text-center">
                {p.demand_forecast != null
                  ? Number(p.demand_forecast).toLocaleString()
                  : '—'}
              </td>
            )}
            <td className="px-2 py-1 flex items-center space-x-2">
              <FiEye
                onClick={() => onView(p)}
                className="cursor-pointer w-5 h-5 text-gray-600 hover:text-gray-800"
              />
              <FiEdit
                onClick={() => onEdit(p)}
                className="cursor-pointer w-5 h-5 text-gray-600 hover:text-gray-800"
              />
              <FiTrash2
                onClick={() => onDelete(p.id)}
                className="cursor-pointer w-5 h-5 text-red-500 hover:text-red-700"
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default ProductTable;
