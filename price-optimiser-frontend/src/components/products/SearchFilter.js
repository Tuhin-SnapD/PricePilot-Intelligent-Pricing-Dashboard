import React, { useState } from 'react';

const SearchFilter = ({ onSearch }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');

  const handleSearch = () => {
    onSearch({ name, category });
  };

  return (
    <div className="flex gap-4 items-center">
      <input
        type="text"
        placeholder="🔍 Search"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="bg-black text-white border border-teal-500 rounded px-3 py-1 focus:outline-none"
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="bg-black text-white border border-teal-500 rounded px-3 py-1 focus:outline-none"
      >
        <option value="">Category</option>
        <option value="Stationary">Stationary</option>
        <option value="Electronics">Electronics</option>
        <option value="Apparel">Apparel</option>
      </select>
      <button
        onClick={handleSearch}
        className="border border-white text-white px-3 py-1 rounded hover:bg-teal-600 transition"
      >
        🧠 Filter
      </button>
    </div>
  );
};

export default SearchFilter;
