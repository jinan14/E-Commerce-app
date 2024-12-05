

import React from 'react';
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { IoSearch } from "react-icons/io5";
import { FaCartShopping } from "react-icons/fa6";
import { MdLogout } from "react-icons/md";


import useCartStore from '../store/useCartStore'; import { HiMenu } from "react-icons/hi"; // Burger menu icon


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
  
      {/* Hamburger Menu for Medium and Small Screens */}
      <div className="block lg:hidden">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-3xl"
        >
          &#9776;
        </button>
      </div>
  
      {/* Desktop Header (Shown on large screens) */}
      <div className="hidden lg:flex gap-3 justify-between items-center">
        <div className="flex gap-3">
          {['Furniture', 'Tables', 'Paintings'].map((category) => (
            <button
              key={category}
              onClick={() => {
                setCategory(category);
                searchProducts();
              }}
              className="text-lg"
            >
              {category}
            </button>
          ))}
        </div>
  
        <div className="flex gap-1">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64 px-3 py-1 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button
            onClick={applyFilters}
            className="bg-orange-400 text-lg text-white px-2 py-2 rounded-3xl hover:bg-orange-400"
          >
            <IoSearch />
          </button>
        </div>
      </div>
  
      {/* Buttons: Add Product, Cart, Logout */}
      <div className="hidden lg:flex gap-3">
        <button
          onClick={() => navigate('/add-product')}
          className="bg-blue-500 text-white px-4 py-2 rounded-3xl hover:bg-blue-600"
        >
          Add Product
        </button>
        <button
          className="bg-orange-400 text-xl text-white px-3 py-2 rounded-3xl hover:bg-orange-400"
          onClick={() => navigate('/cart')}
        >
          <FaCartShopping />
        </button>
        <button
          className="bg-red-500 text-xl text-white px-2 py-2 rounded-3xl hover:bg-red-400"
          onClick={() => navigate('/login')}
        >
          <MdLogout />
        </button>
      </div>
  
      {/* Mobile Burger Menu (Visible on small and medium screens when menu is open) */}
      {menuOpen && (
        <div className="absolute top-16 left-0 right-0 border-t-2 p-4 lg:hidden backdrop-blur-xl">
          <div className="flex flex-col gap-3 items-center">
            <div className="flex gap-3 items-center">
              {['Furniture', 'Tables', 'Paintings'].map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setCategory(category);
                    searchProducts();
                  }}
                  className="text-lg"
                >
                  {category}
                </button>
              ))}
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 px-3 py-1 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button
                onClick={applyFilters}
                className="bg-orange-400 text-lg text-white px-2 py-2 rounded-3xl hover:bg-orange-400"
              >
                <IoSearch />
              </button>
            </div>
            <div className="flex gap-3 items-center">
              <button
                onClick={() => navigate('/add-product')}
                className="bg-blue-500 text-white px-4 py-2 rounded-3xl hover:bg-blue-600"
              >
                Add Product
              </button>
              <button
                className="bg-orange-400 text-xl text-white px-3 py-2 rounded-3xl hover:bg-orange-400"
                onClick={() => navigate('/cart')}
              >
                <FaCartShopping />
              </button>
              <button
                className="bg-red-500 text-xl text-white px-2 py-2 rounded-3xl hover:bg-red-400"
                onClick={() => navigate('/login')}
              >
                <MdLogout />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
  
}

export default Header;
