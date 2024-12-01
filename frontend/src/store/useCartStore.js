

import { create } from 'zustand';
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
//--------------------------------------------------------------------------------------------------------
//Product Gallery-Shop.jsx
  products: [],
  likedProducts: [],
  searchQuery: '',
  error: '',
  successMessage: '',

  // Fetch Products
  fetchProducts: async (filters = {}) => {
    try {
        const queryString = new URLSearchParams(filters).toString();
        const response = await axios.get(`http://localhost:5000/api/v1/product/search?${queryString}`);
        set({ products: response.data.data });
    } catch (error) {
        console.error('Error fetching products:', error);
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
      toast.error('Please log in to add items to your cart.');
      return 
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
        toast.success('Product added to cart successfully!');
        return 
      }
      toast.error('Failed to add product to cart.' )
      
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred while adding the product to the cart.')
      return { success: false, message: 'An error occurred while adding the product to the cart.' };
    }
  },
  //-------------------------------------------------------------------------------------------------------------
  //Search 

  products: [],
  searchQuery: '',
  minPrice: '',
  maxPrice: '',
  category: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  setPriceRange: (min, max) => set({ minPrice: min, maxPrice: max }),
  setCategory: (category) => set({ category }),
  
  searchProducts: async () => {
    try {
      const { searchQuery, minPrice, maxPrice, category } = useCartStore.getState();
      const queryParams = new URLSearchParams();
      if (searchQuery) queryParams.append('search', searchQuery);
      if (category) queryParams.append('category', category);
      if (minPrice) queryParams.append('minPrice', minPrice);
      if (maxPrice) queryParams.append('maxPrice', maxPrice);

      const response = await axios.get(`http://localhost:5000/api/v1/product/search?${queryParams.toString()}`);
      set({ products: response.data.data });
    } catch (error) {
      console.error('Error searching products:', error);
    }
  },
  
}));

export default useCartStore;
