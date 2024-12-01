import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import { FaHeart, FaRegHeart } from "react-icons/fa";
import toast, { Toaster } from 'react-hot-toast';
import useCartStore from '../store/useCartStore';
import { IoSearch } from "react-icons/io5";
import axios from 'axios'
const Shop = () => {
  const navigate = useNavigate();
  const [likedProducts, setLikedProducts] = useState([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [category, setCategory] = useState('');
  // Zustand store hooks
  const {
    products,
    fetchProducts,
    addToCart,
    // setSearchQuery,
    // searchQuery,
  } = useCartStore();

  const token = localStorage.getItem('Token');

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    if (!token) return;

    const fetchLikedProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/v1/like/likes', {
          headers: { Authorization: ` Bearer ${token}` },
        });
        const likedIds = response.data.data.map((like) => like.productId);
        setLikedProducts(likedIds);
      } catch (err) {
        console.error('Error fetching likes:', err);
      }
    };

    fetchLikedProducts();
  }, [token]);

  // Handle like click
  const handleLikeClick = async (productId) => {
    const token = localStorage.getItem('Token');
    if (!token) {
      toast.error('Please log in to like products.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/v1/like/create', { productId }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        // If the response is a success, toggle the like state
        setLikedProducts((prevLikedProducts) => {
          if (prevLikedProducts.includes(productId)) {
            // Remove from liked products (unlike)
            return prevLikedProducts.filter(id => id !== productId);
          } else {
            // Add to liked products (like)
            return [...prevLikedProducts, productId];
          }
        });
        toast.success(response.data.message); // Display success message (like/unlike)
      }
    } catch (error) {
      console.error('Error liking/unliking product:', error);
      toast.error('Error liking/unliking product.');
    }
  };

  // Navigate to Favorites page
  const navigateToFavorites = () => {
    navigate('/favorites', { state: { likedProductIds: likedProducts } });
  };

  // Filter products based on search query
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const ProductCarousel = ({ pictures }) => {
    const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

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

  const applyFilters = () => {
    const filters = {};

    if (searchQuery) filters.search = searchQuery;
    if (minPrice) filters.minPrice = minPrice; 
    if (maxPrice) filters.maxPrice = maxPrice; 
    if (category) filters.category = category;

    fetchProducts(filters); // Pass filters to Zustand fetchProducts
  };

  return (
    <div className="container mx-auto p-5 ">
      <Toaster />
      {/* Navigation Bar */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        applyFilters={applyFilters}
      />

      <hr className="my-7" />
      <button
        className="text-white rounded-[20px] mb-3 text-3xl flex justify-end items-end w-full"
        onClick={navigateToFavorites}
      >
        <FaHeart className="text-red-600" />
      </button>
      <div className="flex gap-4 my-4">
        <button
          onClick={() => {
            setSearchQuery('');
            setMinPrice('');
            setMaxPrice('');
            setCategory('');
            fetchProducts(); // Fetch all products
          }}
        >
          All
        </button>

        <input
          type="number"
          placeholder="Min price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <input
          type="number"
          placeholder="Max price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <button
        onClick={applyFilters}
        >
           <IoSearch />
        </button>
      </div>

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
                <div className="flex flex-col gap-3 h-[70%] items-start w-full">
                  <div className="flex justify-between items-center w-full">
                    <h2 className="text-xl font-semibold">{product.name}</h2>
                    <button onClick={() => handleLikeClick(product._id)} className='flex items-end'>
                      {likedProducts.includes(product._id) ? (
                        <FaHeart className="text-red-600" />
                      ) : (
                        <FaRegHeart className="text-gray-500" />
                      )}
                    </button>
                  </div>
                  <div className="h-[50px] flex text-start">
                    <p className="text-white">{product.description}</p>
                  </div>
                  <p className="text-white">Category: {product.category}</p>
                  <p className="text-white font-bold text-start">${product.price}</p>
                </div>

                <div className="flex gap-5 h-[30%] items-center justify-between p-1">
                  <button
                    className="text-white p-2 px-3 rounded-3xl bg-blue-400 hover:bg-blue-600"
                    onClick={() => addToCart(product._id)}
                  >
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
          )

          )}
      </div>
    </div>
  );
};

export default Shop;
