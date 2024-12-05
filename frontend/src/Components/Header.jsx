

import React from 'react';
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { IoSearch } from "react-icons/io5";
import { FaCartShopping } from "react-icons/fa6";
import { MdLogout } from "react-icons/md";


import useCartStore from '../store/useCartStore';import { HiMenu } from "react-icons/hi"; // Burger menu icon


  const Header = ({ searchQuery, setSearchQuery, applyFilters }) => {

    const [menuOpen, setMenuOpen] = useState(false); // State for toggling the menu


  const navigate = useNavigate();
  const {

    setPriceRange,
    setCategory,
    searchProducts,
  } = useCartStore();

  return (
    <div className="flex justify-between items-center mt-3 mb-3 px-4">
      <h1 className="text-3xl font-bold">QuickShop</h1>

      {/* Burger Menu for Small Screens */}
      <div className="lg:hidden">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-2xl focus:outline-none"
        >
          <HiMenu />
        </button>
      </div>

      {/* Full Menu for Larger Screens */}
      <div className={`flex flex-col lg:flex-row lg:items-center lg:gap-3 absolute lg:static top-16 left-0 w-full lg:w-auto shadow-lg lg:shadow-none ${menuOpen ? "block" : "hidden"}`}>
        {/* Categories */}
        <div className="flex flex-col lg:flex-row lg:gap-3">
          {["Furniture", "Tables", "Paintings"].map((category) => (
            <button
              key={category}
              onClick={() => {
                setCategory(category);
                searchProducts();
              }}
              className="px-4 py-2 hover:bg-gray-100"
            >
              {category}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-3 mt-3 lg:mt-0 px-4 lg:px-0">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full lg:w-64 px-3 py-1 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              onClick={applyFilters}
              className="bg-orange-400 text-lg text-white mr-3 px-2 py-2 rounded-3xl hover:bg-orange-500"
            >
              <IoSearch />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col lg:flex-row lg:gap-3 mt-3 lg:mt-0 px-4 lg:px-0">
          <button
            onClick={() => navigate("/add-product")}
            className="bg-blue-500 text-white px-4 py-2 rounded-3xl hover:bg-blue-600"
          >
            Add Product
          </button>
          <button
            className="bg-orange-400 text-xl text-white px-3 py-2 rounded-3xl hover:bg-orange-500"
            onClick={() => navigate("/cart")}
          >
            <FaCartShopping />
          </button>
          <button
            className="bg-red-500 text-xl text-white px-2 py-2 rounded-3xl hover:bg-red-400"
            onClick={() => navigate("/login")}
          >
            <MdLogout />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Header;
