import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    //name is either the email or password
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/v1/user/login', formData);
     //extract the token and the msg from the response
      const { token, message } = response.data;

      // Save token to localStorage
      localStorage.setItem('Token', token);

      toast.success(message); // Success message
      navigate('/shop'); // Redirect to the shop
    } catch (err) {
      const errorMessage =
        err.response?.data?.errors?.[0]?.message || 'Failed to login. Please try again.';
      setError(errorMessage);
    }
  };

  return (
    <div className="flex flex-col md:flex-row container h-[100vh] w-full">
      <Toaster />
      {/* Image Section */}
      <div className="hidden md:block md:w-[60%]">
        <img
          className="object-cover w-full h-full"
          src="/login.jpg"
          alt=""
        />
      </div>
  
      {/* Form Section */}
      <div className="w-full h-full md:w-[40%] flex items-center justify-center p-5">
        <form
          onSubmit={handleSubmit}
          className="border-2 border-gray-700 flex flex-col gap-5 w-full max-w-xs md:max-w-sm lg:max-w-md rounded-[20px] p-6 m-auto shadow-lg backdrop-blur-2xl"
        >
          <h2 className="text-3xl font-bold text-center mb-5">Login</h2>
          {error && <p className="text-red-500 text-center">{error}</p>}
          
          {/* Email Field */}
          <div className="flex flex-col gap-1 ">
            <label htmlFor="email" className="font-medium text-lg text-start ml-3">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="w-full px-3 py-2 border rounded-[20px] focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
  
          {/* Password Field */}
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="font-medium text-lg text-start ml-3">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="w-full px-3 py-2 border rounded-[20px] focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>
  
          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
  
};

export default Login;
