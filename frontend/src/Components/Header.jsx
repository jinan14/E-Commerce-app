

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoSearch } from "react-icons/io5";
import { FaCartShopping } from "react-icons/fa6";
import { MdLogout } from "react-icons/md";


import useCartStore from '../store/useCartStore';

const Header = ({ searchQuery, setSearchQuery, applyFilters }) => {

  const navigate = useNavigate();
  const {

    setPriceRange,
    setCategory,
    searchProducts,
  } = useCartStore();

  return (
    <div className="flex justify-between items-center mt-3 mb-3">
      <h1 className="text-3xl font-bold">QuickShop</h1>
        <div className="flex gap-3  justify-between items-center">
          <div  className="flex gap-3 ">

            <div className="flex gap-3">
              {['Furniture', 'Tables', 'Paintings'].map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setCategory(category);
                    searchProducts();
                  }}
                >
                  {category}
                </button>
              ))}
            </div>

            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} // Optional if you want real-time update
              className="w-64 px-3 py-1 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              onClick={applyFilters}
              className="px-4 bg-orange-500 text-white rounded-r-lg hover:bg-orange-600"
            >
              <IoSearch />
            </button>
          </div>

        </div>
      <div className="flex gap-3 ">
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/add-product')}
            className="bg-blue-500 text-white px-4 py-2 rounded-3xl hover:bg-blue-600"
          >
            Add Product
          </button>
          <button
            className="bg-orange-400 text-xl text-white px-3 py-2 rounded-3xl hover:bg-orange-400"
            onClick={() => navigate('/cart')}><FaCartShopping />
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
  );
}

export default Header;
