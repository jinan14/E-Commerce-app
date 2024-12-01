

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import toast from 'react-hot-toast';

const useCartStore = create((set) => ({
  cartItems: [],
  loading: true,
  error: '',
  setCartItems: (items) => set({ cartItems: items }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  fetchCart: async (token) => {
    try {
      const response = await axios.get('http://localhost:5000/api/v1/cart/get', {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({
        cartItems: response.data.data || [],
        loading: false,
        error: '',
      });
    } catch (err) {
      set({
        loading: false,
        error: 'Failed to fetch cart.',
      });
    }
  },

  clearCart: async (token) => {
    try {
      await axios.delete('http://localhost:5000/api/v1/cart/clearCart', {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ cartItems: [] });
    } catch (err) {
      console.error(err.message || 'Error clearing cart');
    }
  },

  updateItemQuantity: async (productId, quantity, token) => {
    try {
      await axios.patch(
        'http://localhost:5000/api/v1/cart/updateItemQuantity',
        { productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      set((state) => ({
        cartItems: state.cartItems.map((item) =>
          item.product._id === productId ? { ...item, quantity } : item
        ),
      }));
    } catch (err) {
      console.error('Failed to update item quantity', err);
    }
  },

  removeItem: async (productId, token) => {
    try {
      await axios.delete(`http://localhost:5000/api/v1/cart/removeItemFromCart/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set((state) => ({
        cartItems: state.cartItems.filter((item) => item.product._id !== productId),
      }));
    } catch (err) {
      console.error('Error removing item', err);
    }
  },

  proceedToCheckout: async (navigate) => {
    const token = localStorage.getItem('Token');
    if (!token) {
      toast.error('Please log in to proceed.');
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
  
      const result = await response.json();
      if (response.ok) {
        toast.success('Order created successfully!');
        navigate('/order', { state: { order: result.data } }); // Navigate to Order.jsx
      } else {
        set({ error: result.message || 'Failed to create order.' });
      }
    } catch (error) {
      console.error('Error creating order:', error);
      set({ error: 'An error occurred while creating the order.' });
    }
  },

  products: [],
  likedProducts: [],
  searchQuery: '',
  error: '',
  successMessage: '',

  // Fetch Products
  fetchProducts: async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/v1/product/search');
      set({ products: response.data.data, error: '' });
    } catch (err) {
      set({ error: 'Failed to fetch products.', products: [] });
      console.error(err);
    }
  },

  // Set Search Query
  setSearchQuery: (query) => set({ searchQuery: query }),

  // Toggle Liked Products
  toggleLikedProduct: (productId) =>
    set((state) => {
      const isLiked = state.likedProducts.includes(productId);
      const likedProducts = isLiked
        ? state.likedProducts.filter((id) => id !== productId)
        : [...state.likedProducts, productId];
      return { likedProducts };
    }),

  // Add to Cart
  addToCart: async (productId) => {
    const token = localStorage.getItem('Token'); // Retrieve token from localStorage
    if (!token) {
      return { success: false, message: 'Please log in to add items to your cart.' };
    }

    const cartUpdate = {
      cart: {
        [productId]: 1, // Set quantity to 1 for simplicity
      },
    };

    try {
      const response = await fetch('http://localhost:5000/api/v1/cart/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(cartUpdate),
      });

      const result = await response.json();
      if (response.ok) {
        return { success: true, message: 'Product added to cart successfully!' };
      }
      return { success: false, message: result.message || 'Failed to add product to cart.' };
    } catch (error) {
      console.error('Error:', error);
      return { success: false, message: 'An error occurred while adding the product to the cart.' };
    }
  },
  
}));

export default useCartStore;
