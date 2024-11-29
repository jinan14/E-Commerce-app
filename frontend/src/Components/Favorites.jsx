

/* eslint-disable-next-line no-unused-vars */
import React, { useEffect, useState } from 'react';
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";

function Favorites() {
  const { state } = useLocation(); // Get the state passed from ProductGallery
  const { likedProducts, likedProductIds } = state;

  const [likedProductsState, setLikedProductsState] = useState(likedProductIds);
  const [favorites, setFavorites] = useState([]);

  const navigate = useNavigate(); // Hook to navigate to Cart page

  // Toggle like status for the heart
  const handleLikeClick = (productId) => {
    setLikedProductsState((prevLikedProducts) => {
      const updatedLikedProducts = prevLikedProducts.includes(productId)
        ? prevLikedProducts.filter(id => id !== productId)
        : [...prevLikedProducts, productId];

      return updatedLikedProducts;
    });
  };

  // Update the favorites list with liked products
  useEffect(() => {
    setFavorites(likedProducts.filter(product => likedProductsState.includes(product._id)));
  }, [likedProductsState, likedProducts]);

  const goToCart = () => {
    // Pass the selected favorites directly to the Cart page
    navigate("/cart", { state: { cart: favorites } });
  };

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
    <div
      className="min-h-screen flex flex-col justify-center items-center relative"
    
    > 
    
        <h1 className='text-3xl font-bold m-auto'>Your Favorite Products</h1>
      <div className="flex gap-10 flex-wrap justify-center mt-3 mb-8 z-10">
        {likedProducts
          .filter(product => likedProductsState.includes(product._id)) // Only show liked products
          .map((product) => (
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
                <div className='flex justify-between items-center w-full'>
                  <h2 className="text-xl font-semibold">{product.name}</h2>
                  <button
                    onClick={() => handleLikeClick(product._id)}
                  
                  >
                    {likedProducts.includes(product._id) ? (
                      <FaRegHeart className="text-gray-400" />
                    ) : (
                      <FaHeart className="text-red-600"/>
                    )}
                  </button>
                </div>
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
}

export default Favorites;