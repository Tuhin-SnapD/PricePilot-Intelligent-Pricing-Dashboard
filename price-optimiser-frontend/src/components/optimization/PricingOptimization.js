import React, { useEffect, useState, useContext } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import Navbar from "../common/Navbar";
import { FaChevronLeft, FaSearch } from "react-icons/fa";
import { HiChevronDown } from "react-icons/hi";
import { AuthContext } from "../../contexts/AuthContext";

const PricingOptimization = () => {
  const { user } = useContext(AuthContext);
  const [optData, setOptData] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [withForecast, setWithForecast] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: products } = await api.get("/products/");
        let merged;
        if (withForecast) {
          const { data: optimization } = await api.get("/products/optimize/");
          const optMap = optimization.reduce(
            (acc, { product_id, optimized_price }) => {
              acc[product_id] = optimized_price;
              return acc;
            },
            {}
          );
          merged = products.map((p) => ({
            ...p,
            optimized_price: optMap[p.id] ?? null,
          }));
        } else {
          merged = products.map((p) => ({ ...p, optimized_price: null }));
        }
        setOptData(merged);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, [withForecast]);

  const filtered = optData.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) &&
      (category === "All" || d.category === category)
  );

  const showPrices = user.role !== "buyer";

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-black to-gray-800 text-white">
        <div className="mx-4 mt-4 mb-2 bg-gray-900 rounded-lg px-4 py-2 flex items-center">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => window.history.back()}
              className="flex items-center text-gray-300 hover:text-white"
            >
              <FaChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-base font-semibold">
              Pricing Optimization
            </span>
          </div>
          <div className="flex-1" />
          <div className="flex items-center space-x-4">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={withForecast}
                onChange={() => setWithForecast((f) => !f)}
              />
              <div className="w-11 h-6 bg-gray-700 rounded-full peer-focus:ring-2 peer-focus:ring-green-400 peer-checked:bg-green-500 transition-colors" />
              <div className="absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full peer-checked:translate-x-5 transition-transform" />
              <span className="ml-3 text-sm">With Optimised Price</span>
            </label>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                className="w-48 bg-gray-800 border border-gray-700 text-white pl-10 pr-3 py-1 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="relative">
              <select
                className="bg-gray-800 border border-gray-700 text-white px-3 py-1 rounded text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-green-400"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option>All</option>
                <option>Stationary</option>
                <option>Electronics</option>
                <option>Apparel</option>
              </select>
              <HiChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-auto px-4 mb-20">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left text-gray-900 bg-white">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="p-3 border-r border-gray-700">Product Name</th>
                  <th className="p-3 border-r border-gray-700">Category</th>
                  <th className="p-3 border-r border-gray-700">Description</th>
                  <th className="p-3 border-r border-gray-700">
                    Selling Price
                  </th>
                  {showPrices && (
                    <>
                      <th className="p-3 border-r border-gray-700">
                        Cost Price
                      </th>
                      <th className="p-3 border-r border-gray-700">
                        Optimized Price
                      </th>
                      <th className="p-3 border-r border-gray-700">
                        Difference
                      </th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {filtered.map((d, idx) => {
                  const cost = parseFloat(d.cost_price);
                  const sell = parseFloat(d.selling_price);
                  const diff =
                    d.optimized_price != null ? sell - d.optimized_price : null;
                  let colorClass = "text-yellow-500";
                  if (diff < 0) colorClass = "text-green-600";
                  else if (diff > 0) colorClass = "text-red-600";

                  return (
                    <tr
                      key={d.id}
                      className={`${idx % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                    >
                      <td className="p-3 border-r border-gray-300">{d.name}</td>
                      <td className="p-3 border-r border-gray-300">
                        {d.category}
                      </td>
                      <td className="p-3 border-r border-gray-300">
                        {d.description}
                      </td>
                      <td className="p-3 border-r border-gray-300">
                        ${isNaN(sell) ? "—" : sell.toFixed(2)}
                      </td>{" "}
                      {showPrices && (
                        <>
                          <td className="p-3 border-r border-gray-300">
                            ${isNaN(cost) ? "—" : cost.toFixed(2)}
                          </td>

                          <td className="p-3 border-r border-gray-300 text-green-600 font-semibold">
                            {d.optimized_price != null
                              ? `$${d.optimized_price.toFixed(2)}`
                              : "—"}
                          </td>
                          <td className={`p-3 font-semibold ${colorClass}`}>
                            {diff == null
                              ? "—"
                              : diff > 0
                              ? `-$${diff.toFixed(2)}`
                              : diff < 0
                              ? `+$${Math.abs(diff).toFixed(2)}`
                              : `$0.00`}
                          </td>
                        </>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <div className="fixed bottom-0 left-0 w-full bg-gray-900 px-4 py-3 flex justify-end space-x-2">
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-700 hover:bg-gray-600 text-white text-sm rounded px-3 py-1"
          >
            Cancel
          </button>
          <button
            onClick={() => navigate(-1)}
            className="bg-teal-400 hover:bg-teal-500 text-black text-sm rounded px-3 py-1"
          >
            Save
          </button>
        </div>
      </div>
    </>
  );
};

export default PricingOptimization;
