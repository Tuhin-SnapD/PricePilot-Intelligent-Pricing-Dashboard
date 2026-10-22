import React, { useEffect, useState } from "react";
import { FaSearch, FaFilter } from "react-icons/fa";

const SearchFilter = ({ onSearch, categories = [] }) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    onSearch({ name, category });
  }, [name, category, onSearch]);

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center w-full">
      <div className="relative flex-1 min-w-[160px]">
        <label htmlFor="product-search" className="sr-only">
          Search products
        </label>
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
        <input
          id="product-search"
          type="text"
          placeholder="Search products..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 pl-9 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all"
        />
      </div>
      <div className="relative flex-1 sm:flex-none sm:w-44">
        <label htmlFor="product-category" className="sr-only">
          Filter by category
        </label>
        <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
        <select
          id="product-category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 pl-9 pr-8 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all"
        >
          <option value="">All Categories</option>
          {categories.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;
