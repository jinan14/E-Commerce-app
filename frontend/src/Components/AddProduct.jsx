import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
  });
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    const uniqueFiles = files.filter(
      (file) => !images.some((existingFile) => existingFile.name === file.name)
    );

    if (images.length + uniqueFiles.length > 5) {
      toast.error('You can only upload up to 5 images.');
      return;
    }

    setImages((prevImages) => [...prevImages, ...uniqueFiles]);

    const previewURLs = uniqueFiles.map((file) => URL.createObjectURL(file));
    setPreviewImages((prevPreviews) => [...prevPreviews, ...previewURLs]);
  };

  const handleImageRemove = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = previewImages.filter((_, i) => i !== index);

    URL.revokeObjectURL(previewImages[index]);

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
      toast.success('Product created successfully!');
      navigate('/shop');
    } catch (error) {
      toast.error('Product already exists');
      console.error('Error creating product:', error);
    }
  };

  return (
    <div className="px-4">
      <Toaster />
      <h2 className="font-bold text-3xl mb-5 mt-5 text-center">Add New Product</h2>
      <div className="flex flex-wrap justify-center items-start gap-6">
        <form
          onSubmit={handleSubmit}
          className="border-2 border-gray-700 flex flex-col gap-5 w-full sm:w-[80%] md:w-[60%] lg:w-[40%] rounded-[20px] p-6 mx-auto shadow-lg backdrop-blur-2xl"
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
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
          >
            Add Product
          </button>
        </form>
        <div className="w-full sm:w-[80%] md:w-[60%] lg:w-[40%] grid grid-cols-2 gap-4">
          {previewImages.map((url, index) => (
            <div key={index} className="flex flex-col items-center">
              <img
                src={url}
                alt="Preview"
                className="w-full max-w-[150px] h-[150px] object-cover sm:max-w-[200px] sm:h-[200px]"
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
