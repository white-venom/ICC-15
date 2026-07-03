'use client';

import React from 'react';
import Cart from './Cart';
import { useAppContext } from '@/context/AppContext';

export default function CartWrapper() {
  const { cartOpen, setCartOpen, cartItems, removeFromCart } = useAppContext();

  const handleCheckout = () => {
    alert('Thank you. Connecting to our private secure check-out portal...');
  };

  return (
    <Cart
      isOpen={cartOpen}
      onClose={() => setCartOpen(false)}
      items={cartItems}
      onRemoveItem={removeFromCart}
      onCheckout={handleCheckout}
    />
  );
}
