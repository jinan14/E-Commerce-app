import React, { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';

function Favorites() {
  const [likedProducts, setLikedProducts] = useState([]); // Store liked product IDs
  const [products, setProducts] = useState([]); // Store product details
  const navigate = useNavigate(); // Hook to navigate to other pages

  const token = localStorage.getItem('Token');

  // Fetch liked product IDs from the backend
  useEffect(() => {
    if (!token) return;

    const fetchLikedProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/v1/like/likes', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const likedIds = response.data.data.map((like) => like.productId);
        setLikedProducts(likedIds);

        // Fetch product details
        const productDetails = await Promise.all(
          likedIds.map(async (id) => {
            const productResponse = await axios.get(`http://localhost:5000/api/v1/product/${id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            return productResponse.data.data.product;
          })
        );
        setProducts(productDetails);
      } catch (err) {
        console.error('Error fetching likes or products:', err);
      }
    };

    fetchLikedProducts();
  }, [token]);

  // Toggle like status for a product
  const handleLikeClick = async (productId) => {
    const token = localStorage.getItem('Token');
    if (!token) {
      toast.error('Please log in to like products.');
      return;
    }

    try {
      // Call the `/create` endpoint to toggle the like state
      const response = await axios.post(
        'http://localhost:5000/api/v1/like/create',
        { productId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        const { message } = response.data;
        toast.success(message);

        setLikedProducts((prevLikedProducts) => {
          if (prevLikedProducts.includes(productId)) {
            // If product was already liked, remove it
            return prevLikedProducts.filter((id) => id !== productId);
          } else {
            // If product was not liked, add it
            return [...prevLikedProducts, productId];
          }
        });
      }
    } catch (error) {
      console.error('Error toggling like:', error.message);
      toast.error('Error toggling like. Please try again.');
    }
  };


  const goToCart = () => {
    navigate("/cart", { state: { cart: products } });
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
    <div className="min-h-screen flex flex-col justify-center items-center relative">
      <div className="container mx-auto p-5">
        <div className="flex justify-between items-center mt-3 mb-4">
          <h1 className="text-3xl font-bold">QuickShop</h1>
          <div className="flex gap-3">
          
            <button
              onClick={() => navigate(-1)}
              className="bg-blue-400 text-white px-4 py-2 rounded-3xl hover:bg-blue-500"
            >
              Back
            </button>
          </div>
        </div>
      <hr className="my-3" />
      </div>

      <h1 className="text-2xl font-bold m-auto">Your Favorite Products</h1>
      <div className="flex gap-10 flex-wrap justify-center mt-3 mb-8 z-10">
        {products.map((product) => (
          <div
            key={product._id}
            className="border p-4 shadow-md w-[300px] h-[470px] gap-3 rounded-lg flex flex-col"
          >
            <div className="w-full h-[50%] relative">
              <ProductCarousel pictures={product.pictures || []} />
            </div>
            <div className="flex flex-col gap-3 h-[50%] items-start">
              <div className="flex flex-col gap-3 h-[70%] items-start">
                <div className="flex justify-between items-center w-full">
                  <h2 className="text-xl font-semibold">{product.name}</h2>
                  <button onClick={() => handleLikeClick(product._id)}>
                    {likedProducts.includes(product._id) ? (
                      <FaHeart className="text-red-600" />
                    ) : (
                      <FaRegHeart className="text-gray-400" />
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
                  onClick={goToCart}
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
        ))}
      </div>
    </div>
  );
}

export default Favorites;
