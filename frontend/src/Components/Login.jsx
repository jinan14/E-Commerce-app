import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/v1/login', formData);
      const { token, message } = response.data;

      // Save token to localStorage or cookies (as per your auth strategy)
      localStorage.setItem('authToken', token);

      alert(message); // Success message
      navigate('/shop'); // Redirect to the shop or another page
    } catch (err) {
      const errorMessage =
        err.response?.data?.errors?.[0]?.message || 'Failed to login. Please try again.';
      setError(errorMessage);
    }
  };

  return (
    <div className="container mx-auto p-5">
      <h2 className="text-3xl font-bold text-center mb-5">Login</h2>
      <form
        onSubmit={handleSubmit}
        className="border p-6 rounded-lg shadow-md max-w-md mx-auto flex flex-col gap-4"
      >
        {error && <p className="text-red-500 text-center">{error}</p>}
        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
