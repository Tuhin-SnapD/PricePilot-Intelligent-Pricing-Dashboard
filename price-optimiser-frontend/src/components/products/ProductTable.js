import React from 'react';

const ProductTable = ({ products, onEdit, onDelete, showForecast }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-white bg-black border border-gray-700">
        <thead className="text-xs uppercase bg-gray-800 text-teal-400">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Cost Price</th>
            <th className="px-4 py-3">Selling Price</th>
            <th className="px-4 py-3">Description</th>
            <th className="px-4 py-3">Stock</th>
            <th className="px-4 py-3">Units Sold</th>
            <th className="px-4 py-3">Rating</th>
            {showForecast && <th className="px-4 py-3">Demand Forecast</th>}
            <th className="px-4 py-3">Optimized Price</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-gray-900 divide-y divide-gray-700">
          {products.map((p) => (
            <tr key={p.id}>
              <td className="px-4 py-2">{p.name}</td>
              <td className="px-4 py-2">{p.category}</td>
              <td className="px-4 py-2">${p.cost_price}</td>
              <td className="px-4 py-2">${p.selling_price}</td>
              <td className="px-4 py-2">{p.description?.substring(0, 30)}...</td>
              <td className="px-4 py-2">{p.stock_available}</td>
              <td className="px-4 py-2">{p.units_sold}</td>
              <td className="px-4 py-2">{p.customer_rating}</td>
              {showForecast && (
                <td className="px-4 py-2">
                  {p.demand_forecast ? p.demand_forecast['2023'] || '-' : '-'}
                </td>
              )}
              <td className="px-4 py-2">{p.optimized_price ? `$${p.optimized_price}` : '-'}</td>
              <td className="px-4 py-2 flex gap-2">
                <button
                  onClick={() => onEdit(p)}
                  className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
                >
                  ✏ Edit
                </button>
                <button
                  onClick={() => onDelete(p.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                >
                  🗑 Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
