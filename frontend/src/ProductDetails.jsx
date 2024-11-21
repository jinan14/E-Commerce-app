import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProductDetails = () => {
  const { id } = useParams(); // Get product ID from URL params
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [likes, setLikes] = useState([]);
  const [error, setError] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/v1/product/${id}`);
        const { product, likes } = response.data.data;
        setProduct(product);
        setLikes(likes);
        setError('');
      } catch (err) {
        console.error('Error fetching product details:', err);
        setError('Failed to fetch product details.');
      }
    };

    fetchProductDetails();
  }, [id]);

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  if (!product) {
    return <p className="text-center">Loading...</p>;
  }

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === product.pictures.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? product.pictures.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="container mx-auto p-5">
      <button
        onClick={() => navigate(-1)}
        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mb-5"
      >
        Back
      </button>

      <div className="flex gap-8">
        {/* Carousel Section */}
        <div className="relative w-1/2">
          <div className="overflow-hidden rounded-lg">
            <img
              src={`http://localhost:5000/${product.pictures[currentImageIndex]}`}
              alt={`${product.name} - ${currentImageIndex + 1}`}
              className="w-full h-96 object-cover"
            />
          </div>
          {/* Navigation Controls */}
          <button
            onClick={prevImage}
            className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full shadow hover:bg-gray-700"
            aria-label="Previous"
          >
            &#8249; {/* Left Arrow */}
          </button>
          <button
            onClick={nextImage}
            className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full shadow hover:bg-gray-700"
            aria-label="Next"
          >
            &#8250; {/* Right Arrow */}
          </button>
          {/* Pagination Dots */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {product.pictures.map((_, index) => (
              <span
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index === currentImageIndex ? 'bg-blue-500' : 'bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="w-1/2">
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-lg mb-2">{product.description}</p>
          <p className="font-bold text-xl text-gray-700 mb-2">${product.price}</p>
          <p className="text-gray-600">Category: {product.category}</p>
          <div className="mt-4">
            <h2 className="text-lg font-semibold mb-2">Likes</h2>
            {likes.length > 0 ? (
              <ul>
                {likes.map((like, index) => (
                  <li key={index} className="text-gray-700">
                    {like.user?.name || 'Anonymous'}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No likes for this product yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
