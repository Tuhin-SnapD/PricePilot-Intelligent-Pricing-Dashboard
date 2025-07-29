import React, { useState, useEffect } from "react";
import { FaSearch, FaFilter } from "react-icons/fa";

const SearchFilter = ({ onSearch }) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");

  // All available categories from the backend
  const categories = [
    "Electronics",
    "Outdoor", 
    "Sustainable",
    "Home",
    "Fitness",
    "Stationary",
    "Apparel"
  ];

  useEffect(() => {
    onSearch({ name, category });
  }, [name, category, onSearch]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSearch({ name, category });
    }
  };

  return (
    <div className="flex gap-3 items-center">
      <div className="relative">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
        <input
          type="text"
          placeholder="Search products..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
          className="bg-gray-800 text-white border border-gray-700 rounded px-3 py-1 pl-9 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all"
        />
      </div>
      <div className="relative">
        <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="bg-gray-800 text-white border border-gray-700 rounded px-3 py-1 pl-9 pr-8 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
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
