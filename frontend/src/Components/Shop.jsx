import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from './Header';


const Shop = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); // Search query state

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/v1/product/retrieve/all');
        setProducts(response.data.data);
        console.log('123', response.data.data)
      } catch (err) {
        setError('Failed to fetch products.');
        console.error(err);
      }
    };

    fetchProducts();
  }, []);

  // Add item to cart
  async function handleAddToCart(productId) {
    const token = localStorage.getItem('Token'); // Retrieve token from localStorage
    if (!token) {
      alert('Please log in to add items to your cart.');
      return;
    }

    const cartUpdate = {
      cart: {
        [productId]: 1, // Set quantity to 1 for simplicity
      },
    };

    try {
      const response = await fetch('http://localhost:5000/api/v1/cart/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include the token in the request
        },
        body: JSON.stringify(cartUpdate),
      });

      const result = await response.json();
      if (response.ok) {
        alert('Product added to cart successfully!');
        console.log('Updated Cart:', result.data);
      } else {
        alert(result.message || 'Failed to add product to cart.');
        console.error(result.errors);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while adding the product to the cart.');
    }
  }

  // Filter products based on search query
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );


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
              className="absolute top-1/2 left-2 transform -translate-y-1/2 flex items-center justify-center backdrop-blur-lg text-white p-2 w-8 h-8 rounded-full shadow hover:bg-gray-700"
            >
              &#8249;
            </button>
            <button
              onClick={nextImage}
              className="absolute top-1/2 right-2 transform -translate-y-1/2 text-white p-2 w-8 h-8 backdrop-blur-lg flex items-center justify-center rounded-full shadow hover:bg-gray-700"
            >
              &#8250;
            </button>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-5 ">
      {/* Navigation Bar */}
   

      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
   
     
      <hr className="my-8" />

      {/* Success and Error Messages */}
      {successMessage && <p className="text-green-500">{successMessage}</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Product Grid */}
      <div className="grid grid-cols-4 gap-11 ">
        {filteredProducts.map((product) => (
          <div
            key={product._id}
            className="border p-4 shadow-md w-[300px] h-[470px] gap-3 rounded-lg flex flex-col"
          >
            {/* Product Image Carousel */}
            <div className="w-full h-[50%] relative">
              <ProductCarousel pictures={product.pictures} />
            </div>

            {/* Product Info */}
            <div className="flex flex-col gap-3 h-[50%] items-start">
              <div className="flex flex-col gap-3 h-[70%] items-start">

                <h2 className="text-xl font-semibold">{product.name}</h2>
                <div className='h-[50px] flex text-start'>
                  <p className="text-white">{product.description}</p>
                </div>
                <p className="text-white">Category: {product.category}</p>
                <p className="text-white font-bold text-start">${product.price}</p>
              </div>

              <div className="flex gap-5 h-[30%] items-center justify-between p-1">
                <button
                  className="text-white p-2 px-3 rounded-3xl bg-blue-400 hover:bg-blue-600"
                  onClick={() => handleAddToCart(product._id)}                 >
                  Add to Cart
                </button>
                <button
                  onClick={() => navigate(`/product/${product._id}`)}
                  className="text-white p-2 px-3 rounded-3xl bg-orange-400 hover:bg-orange-500"
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
