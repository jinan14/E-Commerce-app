import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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

  return (
    <div className="container mx-auto p-5">
      {/* Navigation Bar */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Shop</h1>
        <button
          onClick={() => navigate('/add-product')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Product
        </button>
      </div>
      <br />
      <hr className="my-4" />

      {/* Display Error */}
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {/* Product Grid */}
      <div className="grid grid-cols-4 gap-11 ">
        {products.map((product) => (
          <div
            key={product._id}
            className="border p-4 shadow-md w-[300px] h-[450px] gap-3 rounded-lg flex flex-col items-center"
          >
            <div className='w-full h-[60%]'>

            <img
              src={`http://localhost:5000/${product.pictures[0]}`} // Adjust path if necessary
              alt={product.name}
              className="w-full h-full object-cover mb-4"
            />
            </div>
            <div className='flex flex-col gap-3 h-[40%]'>

            <h2 className="text-xl font-semibold">{product.name}</h2>
            <p className="text-white text-center">{product.description}</p>
            <p className="text-white font-bold">${product.price}</p>
            <p className="text-white">Category: {product.category}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shop;
