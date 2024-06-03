import { createSlice } from '@reduxjs/toolkit';
import { CartBurger } from '../types';

interface CartState {
  items: CartBurger[];
  value: number;
  price: number;
}

const initialState: CartState = {
  items: [],
  price: 0,
  value: 0,
};

const isBrowser = () => typeof window !== 'undefined';

const loadCartFromLocalStorage = () => {
  if (!isBrowser()) return initialState;

  try {
    const cart = JSON.parse(localStorage.getItem('cart') || '{}');
    return {
      items: cart.items || [],
      price: cart.price || 0, // Initialize price to 0 if not present
      value: cart.value || 0, // Initialize value to 0 if not present
    };
  } catch (e) {
    console.error('Failed to load cart from localStorage', e);
    return initialState;
  }
};

export const appSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addBurgerToCart: (state, action) => {
      const cartArr = [...state.items];
      const existingBurger = cartArr.find(
        (burger) => burger._id === action.payload.burger._id
      );

      if (existingBurger) {
        existingBurger.itemsInCart++;
      } else {
        cartArr.push({ ...action.payload.burger, itemsInCart: 1 });
      }

      state.price += action.payload.burger.price;
      state.value += 1;
      state.items = cartArr;

      if (isBrowser()) {
        localStorage.setItem('cart', JSON.stringify(state));
      }
    },
    removeBurgerFromCart: (state, action) => {
      const cartArr = [...state.items];
      const existingBurger = cartArr.find(
        (burger) => burger._id === action.payload.burger._id
      );

      if (existingBurger) {
        if (existingBurger.itemsInCart > 1) {
          existingBurger.itemsInCart--;
        } else {
          cartArr.splice(cartArr.indexOf(existingBurger), 1);
        }
        state.price -= action.payload.burger.price;
        state.value -= 1;
        state.items = cartArr;

        if (isBrowser()) {
          localStorage.setItem('cart', JSON.stringify(state));
        }
      }
    },
    removeBurgerInstancesFromCart: (state, action) => {
      const cartArr = [...state.items];
      const existingBurger = cartArr.find(
        (burger) => burger._id === action.payload.burger._id
      );

      if (existingBurger) {
        state.price -= existingBurger.price * existingBurger.itemsInCart;
        state.value -= existingBurger.itemsInCart;
        cartArr.splice(cartArr.indexOf(existingBurger), 1);
        state.items = cartArr;

        if (isBrowser()) {
          localStorage.setItem('cart', JSON.stringify(state));
        }
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.price = 0;
      state.value = 0;

      if (isBrowser()) {
        localStorage.removeItem('cart');
      }
    },
    initCart: (state) => {
      if (isBrowser()) {
        const cart = JSON.parse(localStorage.getItem('cart') || '{}');

        state.items = cart.items || [];
        state.price = cart.price || 0;
        state.value = cart.value || 0;
      }
    },
  },
});

export const {
  addBurgerToCart,
  removeBurgerFromCart,
  removeBurgerInstancesFromCart,
  clearCart,
  initCart,
} = appSlice.actions;

export default appSlice.reducer;
