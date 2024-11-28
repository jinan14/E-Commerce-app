

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoSearch } from "react-icons/io5";

function Header({ searchQuery, setSearchQuery }) {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold">QuickShop</h1>
      <div className="flex gap-3 w-[30%]">
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Update search query state
          placeholder="Search a product..."
          className="w-full px-3 py-1 border rounded-[20px] focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
        <button
          className="w-8 h-8 items-center flex p-2 bg-blue-600 justify-center rounded-full"
        >
          <IoSearch />
        </button>
      </div>
      <div className="flex gap-3">
        <button
          onClick={() => navigate('/add-product')}
          className="bg-blue-500 text-white px-4 py-2 rounded-3xl hover:bg-blue-600"
        >
          Add Product
        </button>
        <button onClick={() => navigate('/Order')}>Order</button>
      </div>
    </div>
  );
}

export default Header;
