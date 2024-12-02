import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { FaCartShopping } from "react-icons/fa6";

const Order = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const order = location.state?.order;
  console.log("Order", order);

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
      <Toaster />
      <div className="flex justify-between items-center mt-3 mb-4">
        <h1 className="text-3xl font-bold">QuickShop</h1>
        <div className="flex gap-3">
          <button
            className="bg-orange-400 text-white px-4 py-2 rounded-3xl hover:bg-orange-500"
            onClick={() => navigate('/cart')}
          >
            <FaCartShopping />
          </button>
          <button
            onClick={() => navigate('/shop')}
            className="bg-blue-400 text-white px-4 py-2 rounded-3xl hover:bg-blue-500"
          >
            Back
          </button>
        </div>
      </div>
      <hr className="my-3" />
      <h1 className="text-2xl font-bold mb-4">Order Summary</h1>

      <div className='flex flex-col '>
        <div className='flex flex-col gap-2 items-start'>
          <p className='text-xl'><strong>Status:</strong> {order.status}</p>
          <p className='text-xl'><strong>Total Price:</strong> ${order.totalAmount?.toFixed(2) || '0.00'}</p>
        </div>
        <h2 className="text-xl font-semibold mt-4">Products:</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
          {order.products.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-4 border p-4 rounded shadow-md"
            >
              <img
                src={`http://localhost:5000/${item.productId.pictures[0]}`}
                alt={item.productId.name}
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
      </div>

    </div>
  );
};

export default Order;
