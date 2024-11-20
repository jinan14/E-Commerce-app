import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
  });
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const navigate = useNavigate(); // React Router hook for navigation

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    const previewURLs = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(previewURLs);
  };

  const handleImageRemove = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = previewImages.filter((_, i) => i !== index);
    setImages(newImages);
    setPreviewImages(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(product).forEach(([key, value]) => {
      formData.append(key, value);
    });
    images.forEach((image) => {
      formData.append('pictures', image);
    });

    try {
      await axios.post('http://localhost:5000/api/v1/product/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Product created successfully!');
      navigate('/'); // Navigate to Shop after successful submission
    } catch (error) {
      alert('Product already exists');
      console.error('Error creating product:', error);
    }
  };

  return (
    <div>
      <h2 className="font-bold text-3xl mb-5">Add New Product</h2>
      <div className='flex justify-center items-center '>

        <form
          onSubmit={handleSubmit}
          className="border-2 border-gray-700 flex flex-col gap-5 w-[50%] max-w-xs md:max-w-sm lg:max-w-md rounded-[20px] p-6 mx-auto shadow-lg backdrop-blur-2xl"
        >
          <input
            className="w-full px-3 py-2 border rounded-[20px] focus:outline-none focus:ring-2 focus:ring-gray-500"
            type="text"
            name="name"
            placeholder="Product Name"
            value={product.name}
            onChange={handleInputChange}
            required
          />
          <textarea
            className="w-full h-20 sm:h-32 resize-none px-3 py-2 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-500"
            name="description"
            placeholder="Description"
            value={product.description}
            onChange={handleInputChange}
            required
          />
          <input
            className="w-full px-3 py-2 border rounded-[20px] focus:outline-none focus:ring-2 focus:ring-gray-500"
            type="number"
            name="price"
            placeholder="Price"
            value={product.price}
            onChange={handleInputChange}
            required
          />
          <input
            className="w-full px-3 py-2 border rounded-[20px] focus:outline-none focus:ring-2 focus:ring-gray-500"
            type="text"
            name="category"
            placeholder="Category"
            value={product.category}
            onChange={handleInputChange}
            required
          />
          <input
            className="w-full px-3 py-2 border rounded-[20px] focus:outline-none focus:ring-2 focus:ring-gray-500"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
          />
          <button type="submit">Add Product</button>
        </form>
        <div className='w-[50%] grid grid-cols-2 gap-4 '>
          {previewImages.map((url, index) => (
            <div key={index} className='flex flex-col items-center'>
              <img
                src={url}
                alt="Preview"
                className='w-[200px] h-[200px] object-cover'
              />
              <button
                type="button"
                className="mt-2 px-3 py-1 bg-red-500 text-white rounded-md"
                onClick={() => handleImageRemove(index)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default AddProduct;
