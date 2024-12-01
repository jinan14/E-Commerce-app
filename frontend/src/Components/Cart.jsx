import React, { useEffect } from 'react';
import Header from './Header';
import { useNavigate } from 'react-router-dom';
import { RxCross2 } from 'react-icons/rx';
import toast, { Toaster } from 'react-hot-toast';
import useCartStore from '../store/useCartStore';

function Cart() {
  const navigate = useNavigate();
  const {
    cartItems,
    loading,
    error,
    fetchCart,
    clearCart,
    updateItemQuantity,
    removeItem,
    proceedToCheckout,
  } = useCartStore();

  const token = localStorage.getItem('Token'); // Assuming token is stored in localStorage

  useEffect(() => {
    if (token) {
      fetchCart(token);
    } else {
      toast.error('Please log in to view your cart.');
    }
  }, [token]);

  const calculateTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  const calculateTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const handleClearCart = async () => {
    if (!token) {
      toast.error('Please log in to clear your cart.');
      return;
    }
    await clearCart(token);
    toast.success('Cart cleared successfully!');
  };

  const handleRemoveFromCart = async (productId) => {
    if (!token) {
      toast.error('Please log in to remove items from your cart.');
      return;
    }
    await removeItem(productId, token);
    toast.success('Item removed successfully!');
  };

  const updateCartItemQuantity = async (productId, newQuantity) => {
    if (!token) {
      toast.error('Please log in to update cart.');
      return;
    }
    await updateItemQuantity(productId, newQuantity, token);
    toast.success('Quantity updated successfully!');
  };

  const handleCheckout = async () => {
    if (!token) {
      toast.error('Please log in to proceed.');
      return;
    }
    await proceedToCheckout(navigate);
  };
  

  if (loading) {
    return <p>Loading your cart...</p>;
  }

  return (
    <div className="container mx-auto p-5">
      <Toaster />
      <div className="flex justify-between items-center mt-3 mb-4">
        <h1 className="text-3xl font-bold">QuickShop</h1>
        <div className="flex gap-3">
          <button
            className="bg-orange-400 text-white px-4 py-2 rounded-3xl hover:bg-orange-500"
            onClick={handleClearCart}
          >
            Clear Cart
          </button>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-400 text-white px-4 py-2 rounded-3xl hover:bg-blue-500"
          >
            Back
          </button>
        </div>
      </div>
      <hr className="my-3" />

      <div className="p-4">
        <h1 className="text-3xl font-bold mb-4">Your Cart</h1>
        {error && <p className="text-red-500">{error}</p>}
        {cartItems.length === 0 ? (
          <p className="font-bold text-2xl mt-28">Your cart is empty.</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="col-span-2">
              <div className="flex flex-col gap-4">
                {cartItems.map((item) => (
                  <div
                    key={item.product._id}
                    className="flex items-center gap-4 border p-4 rounded shadow-md"
                  >
                    <img
                      src={`http://localhost:5000/${item.product.pictures[0]}`}
                      alt={item.product.name}
                      className="w-28 h-28 object-cover rounded"
                    />
                    <div className="flex flex-grow justify-between items-center">
                      <div>
                        <h2 className="text-lg font-bold">{item.product.name}</h2>
                        <p className="text-sm text-gray-400">{item.product.description}</p>
                      </div>
                      <div>
                        <p>
                          <b>Price:</b> ${item.product.price}
                        </p>
                        <div>
                          <b>Quantity:</b>
                          <button
                            className="px-2 py-1 bg-gray-500 rounded mx-1"
                            onClick={() => updateCartItemQuantity(item.product._id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          {item.quantity}
                          <button
                            className="px-2 py-1 bg-gray-500 rounded mx-1"
                            onClick={() => updateCartItemQuantity(item.product._id, item.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <button
                        className="bg-red-500 text-xl text-white px-2 py-2 rounded-3xl hover:bg-red-400"
                        onClick={() => handleRemoveFromCart(item.product._id)}
                      >
                        <RxCross2 />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded">
              <h2 className="text-xl font-bold mb-4">Cart Summary</h2>
              <div className="flex justify-between mb-2">
                <span>Total Items:</span>
                <span>{calculateTotalItems()}</span>
              </div>
              <div className="flex justify-between mb-4">
                <span>Total Price:</span>
                <span>${calculateTotalPrice().toFixed(2)}</span>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
