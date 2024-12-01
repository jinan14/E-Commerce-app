import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Order = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const order = location.state?.order;

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
      <p><strong>Status:</strong> {order.status}</p>
      <p><strong>Total Price:</strong> ${order.totalAmount?.toFixed(2) || '0.00'}</p>
      <h2 className="text-xl font-semibold mt-4">Products:</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
        {order.products.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-4 border p-4 rounded shadow-md"
          >
            <img
              src={`http://localhost:5000/${item.productId.pictures[0]}`} // Use the populated `pictures` array
              alt={item.productId.name} // Use the populated `name`
              className="w-28 h-28 object-cover rounded"
            />
            <div className="flex-grow">
              <h2 className="text-lg font-bold">{item.productId.name}</h2>
              <p className="text-sm text-gray-400">
                <strong>Price:</strong> ${item.productId.price.toFixed(2)}
              </p>
              <p className="text-sm text-gray-400">
                <strong>Quantity:</strong> {item.quantity}
              </p>
              <p className="text-sm text-gray-400">
                <strong>Total:</strong> ${(item.productId.price * item.quantity).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>
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
