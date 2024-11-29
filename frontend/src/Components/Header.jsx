

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoSearch } from "react-icons/io5";
import { FaCartShopping } from "react-icons/fa6";
import { MdLogout } from "react-icons/md";


function Header({ searchQuery, setSearchQuery }) {
  const navigate = useNavigate();

  const navigateToFavorites = () => {
    // Find the liked products by matching the product ids
    const likedProductDetails = products.filter(product =>
      likedProducts.includes(product._id)
    );

    navigate("/favorites", { state: { likedProducts: likedProductDetails, likedProductIds: likedProducts } });
  };

  return (
    <div className="flex justify-between items-center mt-3 mb-3">
      <h1 className="text-3xl font-bold">QuickShop</h1>
      <div className="flex gap-3 w-[30%]">
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Update search query state
          placeholder="Search a product..."
          className="w-full px-3 py-1 border rounded-[20px] focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
        <button
          className="w-8 h-8 items-center flex p-2 bg-orange-400 justify-center rounded-full"
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
  );
}

export default Header;
