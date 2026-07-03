'use client';

import React, { createContext, useContext, useState } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  size: string;
  colorName: string;
  quantity: number;
  image: string;
}

interface AppContextType {
  cartItems: CartItem[];
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  addToCart: (item: Omit<CartItem, 'quantity' | 'id'> & { id: string }) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  country: string;
  setCountry: (country: string) => void;
  formatPrice: (price: number) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [country, setCountry] = useState('US');

  const formatPrice = (price: number) => {
    switch (country) {
      case 'UK': return `£${Math.round(price * 0.79)}`;
      case 'DUBAI': return `${Math.round(price * 3.67)} AED`;
      case 'INDIA': return `₹${Math.round(price * 83).toLocaleString('en-IN')}`;
      case 'US':
      default: return `$${price}`;
    }
  };

  const addToCart = (item: Omit<CartItem, 'quantity' | 'id'> & { id: string }) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <AppContext.Provider
      value={{
        cartItems,
        cartOpen,
        setCartOpen,
        addToCart,
        removeFromCart,
        clearCart,
        country,
        setCountry,
        formatPrice,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
