

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';


const SignUp = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/v1/user/create', user);

      // Store the token in localStorage
      localStorage.setItem('Token', response.data.token);

      // Navigate to the shop
      toast.success('Account created successfully!');
      navigate('/shop');
    } catch (err) {
      // Handle errors
      if (err.response && err.response.data) {
        setError(err.response.data.message);
      } else {
        setError('Something went wrong. Please try again.');
      }
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
      <div className="w-full h-full md:w-[40%] flex flex-col items-center justify-center p-4">
        {error && (
          <div className="text-red-500 text-center mb-4">{error}</div>
        )}
  
        <form
          onSubmit={handleSubmit}
          className="border-2 border-gray-700 flex flex-col gap-5 w-full max-w-xs md:max-w-sm lg:max-w-md rounded-[20px] p-6 shadow-lg backdrop-blur-2xl"
        >
          <h1 className="text-2xl font-bold mb-6 text-center">Sign Up</h1>
  
          {/* Name Input */}
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={user.name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-[20px] focus:outline-none focus:ring-2 focus:ring-gray-500"
            required
          />
  
          {/* Email Input */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={user.email}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-[20px] focus:outline-none focus:ring-2 focus:ring-gray-500"
            required
          />
  
          {/* Password Input */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={user.password}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-[20px] focus:outline-none focus:ring-2 focus:ring-gray-500"
            required
          />
  
          {/* Submit Button */}
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Sign Up
          </button>
        </form>
  
        {/* Login Redirect */}
        <div className="text-center mt-4">
          Already have an account?{' '}
          <button
            className="ml-3 text-blue-500 underline p-0 bg-inherit"
            onClick={() => navigate('/login')}
          >
            Login here
          </button>
        </div>
      </div>
    </div>
  );
  
};

export default SignUp;
