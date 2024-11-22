import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { IoSearch } from "react-icons/io5";


const Shop = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/v1/product/retrieve/all');
        setProducts(response.data.data); // Assuming the endpoint returns products in `data.data`
      } catch (err) {
        setError('Failed to fetch products.');
        console.error(err);
      }
    };

    fetchProducts();
  }, []);

  const ProductCarousel = ({ pictures }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const nextImage = () => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === pictures.length - 1 ? 0 : prevIndex + 1
      );
    };

    const prevImage = () => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? pictures.length - 1 : prevIndex - 1
      );
    };

    return (
      <div className="relative w-full h-[100%]">
        <div className="w-full rounded-lg h-full">
          <img
            src={`http://localhost:5000/${pictures[currentImageIndex]}`}
            alt={`Product - ${currentImageIndex + 1}`}
            className="w-full h-full object-cover"
          />
        </div>
        {/* Navigation Buttons */}
        {pictures.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute top-1/2 left-2 transform -translate-y-1/2 flex items-center justify-center backdrop-blur-xl text-white p-2 w-8 h-8 rounded-full shadow hover:bg-gray-700"
            >
              &#8249;
            </button>
            <button
              onClick={nextImage}
              className="absolute top-1/2 right-2 transform -translate-y-1/2 text-white p-2 w-8 h-8 backdrop-blur-xl flex items-center justify-center rounded-full shadow hover:bg-gray-700"
            >
              &#8250;
            </button>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-5">
      {/* Navigation Bar */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">QuickShop</h1>
        <div className='flex gap-3 w-[30%]'>
        <input type="search" 
        placeholder='Search a product...'
        className='w-full px-3 py-1 border rounded-[20px] focus:outline-none focus:ring-2 focus:ring-gray-500'
        />
       
        <button 
        className='w-8 h-8 items-center flex p-2 bg-blue-600 justify-center rounded-full'>        
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
            onClick={() => navigate('/login')}
            className="bg-blue-500 text-white px-4 py-2 rounded-3xl hover:bg-blue-600"
          >
            Login
          </button>
          <button
            onClick={() => navigate('/signUp')}
            className="bg-blue-500 text-white px-4 py-2 rounded-3xl hover:bg-blue-600"
          >
            SignUp
          </button>
          <button 
           onClick={() => navigate('/Order')}
          >
            Order
          </button>
        </div>
      </div>
      <br />
      <hr className="my-4" />

      {/* Display Error */}
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {/* Product Grid */}
      <div className="grid grid-cols-4 gap-11">
        {products.map((product) => (
          <div
            key={product._id}
            className="border p-4 shadow-md w-[300px] h-[450px] gap-3 rounded-lg flex flex-col"
          >
            {/* Product Image Carousel */}
            <div className="w-full h-[50%] relative">
              <ProductCarousel  pictures={product.pictures} />
            </div>

            {/* Product Info */}
            <div className="flex flex-col gap-3 h-[50%] items-start">
              <h2 className="text-xl font-semibold">{product.name}</h2>
              <p className="text-white text-center">{product.description}</p>
              <p className="text-white">Category: {product.category}</p>
              <p className="text-white font-bold text-start">${product.price}</p>

              <div className="flex gap-5">
                <button className="text-white p-2 px-3 rounded-3xl hover:bg-blue-600"
                 onClick={() => navigate('/Cart')}
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => navigate(`/product/${product._id}`)}
                  className="text-white p-2 px-3 rounded-3xl hover:bg-blue-600"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shop;
