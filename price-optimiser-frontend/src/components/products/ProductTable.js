import React, { useState, useContext } from "react";
import { FiEye, FiEdit, FiTrash2 } from "react-icons/fi";
import { AuthContext } from "../../contexts/AuthContext";

export const formatPrice = (val) => {
  const num = typeof val === "number" ? val : parseFloat(val) || 0;
  return `$${num.toFixed(2)}`;
};

const ProductTable = ({
  products,
  selectedIds,
  onSelectionChange,
  onEdit,
  onDelete,
  showForecast,
}) => {
  const { user } = useContext(AuthContext);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const showColumns = user.role !== "buyer";
  const allSelected =
    products.length > 0 && selectedIds.length === products.length;

  const toggleSelectAll = () => {
    if (allSelected) {
      onSelectionChange([]);
    } else {
      onSelectionChange(products.map((p) => p.id));
    }
  };

  const toggleSelectOne = (id) => {
    const next = selectedIds.includes(id)
      ? selectedIds.filter((sid) => sid !== id)
      : [...selectedIds, id];
    onSelectionChange(next);
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left text-gray-900 bg-white">
          <thead className="bg-gray-800 text-white">
            <tr>
              {showColumns && (
                <th className="p-3 border-r border-gray-700">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-teal-400 bg-gray-700 rounded"
                    checked={allSelected}
                    onChange={toggleSelectAll}
                  />
                </th>
              )}
              <th className="p-3 border-r border-gray-700">Name</th>
              <th className="p-3 border-r border-gray-700">Category</th>
              {showColumns && (
                <th className="p-3 border-r border-gray-700">Cost Price</th>
              )}
              <th className="p-3 border-r border-gray-700">Sell Price</th>
              <th className="p-3 border-r border-gray-700">Stock Avail.</th>
              {showColumns && (
                <th className="p-3 border-r border-gray-700">Units Sold</th>
              )}
              {showForecast && (
                <th className="p-3 border-r border-gray-700">Forecast</th>
              )}
              {showColumns && <th className="p-3">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {products.map((prod, idx) => {
              const isSelected = selectedIds.includes(prod.id);
              return (
                <tr
                  key={prod.id}
                  className={`odd:bg-gray-200 even:bg-gray-100 ${
                    isSelected ? "bg-teal-50" : ""
                  }`}
                >
                  {showColumns && (
                    <td className="p-3 border-r border-gray-300">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-teal-400 bg-white rounded"
                        checked={isSelected}
                        onChange={() => toggleSelectOne(prod.id)}
                      />
                    </td>
                  )}
                  <td className="p-3 border-r border-gray-300">{prod.name}</td>
                  <td className="p-3 border-r border-gray-300">
                    {prod.category}
                  </td>
                  {showColumns && (
                    <td className="p-3 border-r border-gray-300">
                      {formatPrice(prod.cost_price)}
                    </td>
                  )}
                  <td className="p-3 border-r border-gray-300">
                    {formatPrice(prod.selling_price)}
                  </td>
                  <td className="p-3 border-r border-gray-300">
                    {prod.stock_available}
                  </td>
                  {showColumns && (
                    <td className="p-3 border-r border-gray-300">
                      {prod.units_sold}
                    </td>
                  )}
                  {showForecast && (
                    <td className="p-3 border-r border-gray-300">
                      {prod.demand_forecast}
                    </td>
                  )}
                  {showColumns && (
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedProduct(prod)}
                          title="View Details"
                          className="hover:text-teal-500"
                        >
                          <FiEye />
                        </button>
                        <button
                          onClick={() => onEdit(prod)}
                          title="Edit"
                          className="hover:text-teal-500"
                        >
                          <FiEdit />
                        </button>
                        <button
                          onClick={() => onDelete(prod.id)}
                          title="Delete"
                          className="text-red-500 hover:text-red-600 focus:outline-none"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-2xl shadow-xl p-6 max-w-md w-full overflow-auto max-h-full text-white">
            <h2 className="text-2xl font-bold mb-4 text-teal-400">
              {selectedProduct.name}
            </h2>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <dt className="font-semibold text-gray-300">Category:</dt>
              <dd className="text-gray-200">{selectedProduct.category}</dd>
              {showColumns && (
                <>
                  <dt className="font-semibold text-gray-300">Cost Price:</dt>
                  <dd className="text-gray-200">
                    {formatPrice(selectedProduct.cost_price)}
                  </dd>
                </>
              )}
              <dt className="font-semibold text-gray-300">Selling Price:</dt>
              <dd className="text-gray-200">
                {formatPrice(selectedProduct.selling_price)}
              </dd>
              <dt className="font-semibold text-gray-300">Stock Available:</dt>
              <dd className="text-gray-200">
                {selectedProduct.stock_available}
              </dd>
              {showColumns && (
                <>
                  <dt className="font-semibold text-gray-300">Units Sold:</dt>
                  <dd className="text-gray-200">
                    {selectedProduct.units_sold}
                  </dd>
                </>
              )}
              {showForecast && (
                <>
                  <dt className="font-semibold text-gray-300">Forecast:</dt>
                  <dd className="text-gray-200">
                    {selectedProduct.demand_forecast}
                  </dd>
                </>
              )}
              {selectedProduct.description && (
                <>
                  <dt className="font-semibold text-gray-300">Description:</dt>
                  <dd className="text-gray-200">
                    {selectedProduct.description}
                  </dd>
                </>
              )}
              {selectedProduct.customer_rating && (
                <>
                  <dt className="font-semibold text-gray-300">Rating:</dt>
                  <dd className="text-gray-200">
                    {selectedProduct.customer_rating}
                  </dd>
                </>
              )}
            </dl>
            <div className="mt-6 text-right">
              <button
                onClick={() => setSelectedProduct(null)}
                className="px-4 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductTable;
