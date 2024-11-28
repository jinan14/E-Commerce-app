// src/store/useCartStore.js
import {create} from 'zustand';

const useCartStore = create((set) => ({
  cart: [],
  addToCart: (product) => set((state) => {
    const productExists = state.cart.find(item => item._id === product._id);
    if (productExists) {
      // If the product already exists, update the quantity
      return {
        cart: state.cart.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      };
    } else {
      // If the product doesn't exist, add it to the cart
      return {
        cart: [...state.cart, { ...product, quantity: 1 }],
      };
    }
  }),
  removeFromCart: (productId) => set((state) => ({
    cart: state.cart.filter(item => item._id !== productId),
  })),
  clearCart: () => set({ cart: [] }),
}));

export default useCartStore;
