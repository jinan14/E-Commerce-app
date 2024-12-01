import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Order = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const order = location.state?.order;
  console.log("555",order)

  if (!order) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Order Details</h1>
        <p>No order details available.</p>
        <button
          onClick={() => navigate('/cart')}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mt-4"
        >
          Back to Cart
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Order Summary</h1>
      <p><strong>Order ID:</strong> {order._id}</p>
      <p><strong>Total Price:</strong> ${order.totalAmount?.toFixed(2) || '0.00'}</p>
      <h2 className="text-xl font-semibold mt-4">Products:</h2>
      <ul>
        {order.products.map((product, index) => (
          <li key={index}>
            {product.quantity} x {product.product} - ${product.priceOfOne}
          </li>
        ))}
      </ul>
      <button
        onClick={() => navigate('/shop')}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4"
      >
        Back to Shop
      </button>
    </div>
  );
};

export default Order;
