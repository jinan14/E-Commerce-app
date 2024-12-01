import React, { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Favorites() {
  const [likedProducts, setLikedProducts] = useState([]); // Stores liked products
  const navigate = useNavigate(); // Hook to navigate to other pages

  const token = localStorage.getItem('Token');
  // Fetch liked products from the backend
  useEffect(() => {
    if (!token) return;

    const fetchLikedProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/v1/like/likes', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const likedIds = response.data.data.map((like) => like.productId);
        console.log("111",response.data.data)
        setLikedProducts(likedIds);
        console.log("liked IDs:", likedIds)
      } catch (err) {
        console.error('Error fetching likes:', err);
      }
    };

    fetchLikedProducts();
  }, [token]);
  // Toggle like status for a product
  const handleLikeClick = async (productId) => {
    try {
      // Determine action based on whether the product is already liked
      const isLiked = likedProducts.some((product) => product.productId === productId);

      if (isLiked) {
        // Unlike the product
        await axios.delete(`http://localhost:5000/api/v1/like/likes/${productId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setLikedProducts((prev) => prev.filter((product) => product.productId !== productId));
      } else {
        // Like the product
        await axios.post(
          "http://localhost:5000/api/v1/like/likes",
          { productId },
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        setLikedProducts((prev) => [...prev, { productId }]);
      }
    } catch (error) {
      console.error("Error toggling like:", error.message);
    }
  };
  console.log("liked Products:",likedProducts)
  const goToCart = () => {
    // Pass the selected favorites directly to the Cart page
    navigate("/cart", { state: { cart: likedProducts } });
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
      <h1 className="text-3xl font-bold m-auto">Your Favorite Products</h1>
      <div className="flex gap-10 flex-wrap justify-center mt-3 mb-8 z-10">
        {likedProducts.map((product) => (
          <div
            key={product.productId}
            className="border p-4 shadow-md w-[300px] h-[470px] gap-3 rounded-lg flex flex-col"
          >
            <div className="w-full h-[50%] relative">
              <ProductCarousel pictures={product.pictures || []} />
            </div>
            <div className="flex flex-col gap-3 h-[50%] items-start">
              <div className="flex flex-col gap-3 h-[70%] items-start">
                <div className="flex justify-between items-center w-full">
                  <h2 className="text-xl font-semibold">{product.name}</h2>
                  <button onClick={() => handleLikeClick(product.productId)}>
                    {likedProducts.some((liked) => liked.productId === product.productId) ? (
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
                  onClick={() => navigate(`/product/${product.productId}`)}
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
