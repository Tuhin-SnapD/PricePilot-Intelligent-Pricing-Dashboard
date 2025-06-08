import React, { useState, useEffect } from "react";

const SearchFilter = ({ onSearch }) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");

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
    <div className="flex gap-4 items-center">
      <input
        type="text"
        placeholder="Search"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={handleKeyDown}
        className="bg-black text-white border border-teal-500 rounded px-3 py-1 text-sm focus:outline-none"
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="bg-black text-white border border-teal-500 rounded px-3 py-1 text-sm focus:outline-none"
      >
        <option value="">Category</option>
        <option value="Stationary">Stationary</option>
        <option value="Electronics">Electronics</option>
        <option value="Apparel">Apparel</option>
        <option value="Outdoor">Outdoor</option>
        <option value="Fitness">Fitness</option>
        <option value="Sustainable">Sustainable</option>
      </select>
    </div>
  );
};

export default SearchFilter;
