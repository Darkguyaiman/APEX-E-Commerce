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
  addToCart: (product: any, size: string, qty?: number) => void;
  removeFromCart: (id: number, size: string) => void;
  updateQty: (id: number, size: string, qty: number) => void;
  clearCart: () => void;
  getCartSubtotal: () => number;
  getCartCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from LocalStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem('apex_pitch_cart');
    if (storedCart) {
      try {
        setCart(JSON.parse(storedCart));
      } catch (e) {
        console.error('Failed to parse cart data from localStorage', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save cart to LocalStorage on changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('apex_pitch_cart', JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  const addToCart = (product: any, size: string, qty = 1) => {
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
