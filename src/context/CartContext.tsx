'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image_url: string;
  size: string;
  qty: number;
  category: string;
  colorway?: string;
  type_chip?: string | null;
}

interface CartContextType {
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: CartProductInput, size: string, qty?: number) => void;
  removeFromCart: (id: number, size: string) => void;
  updateQty: (id: number, size: string, qty: number) => void;
  clearCart: () => void;
  getCartSubtotal: () => number;
  getCartCount: () => number;
}

type CartProductInput = {
  id: number;
  name: string;
  price: number | string;
  image_url: string;
  category: string;
  colorway?: string;
  type_chip?: string | null;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'apex_pitch_cart';

function loadStoredCart(): CartItem[] {
  if (typeof window === 'undefined') return [];

  const storedCart = window.localStorage.getItem(CART_STORAGE_KEY);
  if (!storedCart) return [];

  try {
    const parsed = JSON.parse(storedCart);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Failed to parse cart data from localStorage', e);
    return [];
  }
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(loadStoredCart);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Save cart to LocalStorage on changes
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: CartProductInput, size: string, qty = 1) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (item) => item.id === product.id && item.size === size
      );

      if (existingItemIndex > -1) {
        // Item with same ID and size exists, update its quantity
        const newCart = [...prevCart];
        newCart[existingItemIndex].qty += qty;
        return newCart;
      } else {
        // Add new item
        return [
          ...prevCart,
          {
            id: product.id,
            name: product.name,
            price: Number(product.price),
            image_url: product.image_url,
            size,
            qty,
            category: product.category,
            colorway: product.colorway,
            type_chip: product.type_chip,
          },
        ];
      }
    });
    // Open cart drawer for premium UX feedback
    setIsCartOpen(true);
  };

  const removeFromCart = (id: number, size: string) => {
    setCart((prevCart) => prevCart.filter((item) => !(item.id === id && item.size === size)));
  };

  const updateQty = (id: number, size: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(id, size);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id && item.size === size ? { ...item, qty } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem(CART_STORAGE_KEY);
  };

  const getCartSubtotal = () => {
    return cart.reduce((total, item) => total + item.price * item.qty, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.qty, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        getCartSubtotal,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
