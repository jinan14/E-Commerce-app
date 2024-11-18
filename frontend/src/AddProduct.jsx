

import React, { useState } from 'react';
import axios from 'axios';

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
  });
  const [images, setImages] = useState([]); // Array to hold selected image files
  const [previewImages, setPreviewImages] = useState([]); // Array to hold preview URLs

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files); // Store the file objects
    const previewURLs = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(previewURLs); // Generate previews
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

    // Append product details to the formData
    Object.entries(product).forEach(([key, value]) => {
      formData.append(key, value);
    });

    // Append images to the formData
    images.forEach((image) => {
      formData.append('pictures', image);
    });

    try {
      const response = await axios.post('http://localhost:5000/api/v1/product/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Product created successfully!');
      console.log(response.data);
    } catch (error) {
        alert('Product already exists');
      console.error('Error creating product:', error);
    }
  };

  return (
    <div>
      <h2 className='font-bold text-3xl mb-5'>Add New Product</h2>
      <form onSubmit={handleSubmit}
        className="border-2 border-gray-700 flex flex-col gap-5 w-full max-w-xs md:max-w-sm lg:max-w-md rounded-[20px] p-6 mx-auto shadow-lg backdrop-blur-2xl"
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

        {/* Image Upload */}
        <input
         className="w-full px-3 py-2 border rounded-[20px] focus:outline-none focus:ring-2 focus:ring-gray-500"
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
        />
        <div>
          {previewImages.map((url, index) => (
            <div key={index} style={{ display: 'inline-block', margin: '10px' }}>
              <img
                src={url}
                alt="Preview"
                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
              />
              <button type="button" onClick={() => handleImageRemove(index)}>
                Remove
              </button>
            </div>
          ))}
        </div>

        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default AddProduct;
