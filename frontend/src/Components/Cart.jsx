import React, { useEffect, useState } from 'react';
import Header from './Header';
import { useNavigate } from 'react-router-dom';
import { RxCross2 } from "react-icons/rx";
import toast, { Toaster } from 'react-hot-toast';


function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCart() {
      const token = localStorage.getItem('Token'); // Get token from local storage
      if (!token) {
        alert('Please log in to view your cart.');
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/v1/cart/get', {
          headers: {
            Authorization: `Bearer ${token}`, // Pass token in headers
          },
        });

        const result = await response.json();
        if (response.ok) {
          setCartItems(result.data);
        } else {
          alert(result.message || 'Failed to fetch cart.');
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
        alert('An error occurred while fetching the cart.');
      } finally {
        setLoading(false);
      }
    }

    fetchCart();
  }, []);

  const calculateTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  const calculateTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const proceedToCheckout = async () => {
    const token = localStorage.getItem('Token');
    if (!token) {
      alert('Please log in to proceed.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/v1/order/create', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      console.log(response)

      const result = await response.json();
      if (response.ok) {
        toast.success('Order created successfully!');
        navigate('/order', { state: { order: result.data } }); // Navigate to Order.jsx
      } else {
        setError(result.message || 'Failed to create order.');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      setError('An error occurred while creating the order.');
    }
  };

  if (loading) {
    return <p>Loading your cart...</p>;
  }

  const handleRemoveFromCart = async (productId) => {
    const token = localStorage.getItem('Token');
    if (!token) {
      toast.error('Please log in to remove items from your cart.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/v1/cart/removeItemFromCart/${productId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`, // Include JWT token
        },
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message || 'Product removed from cart successfully.');
        // Update cartItems state by filtering out the removed product
        setCartItems((prevItems) =>
          prevItems.filter((item) => item.product._id !== productId)
        );
      } else {
        alert(result.message || 'Failed to remove product from cart.');
      }
    } catch (error) {
      console.error('Error removing product:', error);
      alert('An error occurred while removing the product.');
    }
  };


  return (
    <>
      <div className="container mx-auto p-5 ">
      <Toaster />
        <div className="flex justify-between items-center mt-3 mb-4">
          <h1 className="text-3xl font-bold">QuickShop</h1>

          <div className="flex gap-3">
            <button
              onClick={() => navigate(-1)}
              className="bg-orange-400 text-white px-4 py-2 rounded-3xl hover:bg-orange-500"
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
            <p className='font-bold text-2xl mt-28'>Your cart is empty.</p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Products Section */}
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
                          <p className="text-sm text-gray-400">
                            {item.product.description}
                          </p>
                        </div>
                        <div>
                          <p>
                            <b>Price:</b> ${item.product.price}
                          </p>
                          <p>
                            <b>Quantity:</b> {item.quantity}
                          </p>
                        </div>
                        <div>
                          <button
                            className="bg-red-500 text-xl text-white px-2 py-2 rounded-3xl hover:bg-red-400"
                            onClick={() => handleRemoveFromCart(item.product._id)} // Pass product ID
                          >
                            <RxCross2 />
                          </button>

                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary Section */}
              <div className=" p-4 rounded ">
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
                  onClick={proceedToCheckout}
                  className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Cart;
