'use client';

import React from 'react';
import Cart from './Cart';
import { useAppContext } from '@/context/AppContext';
import { useRouter } from 'next/navigation';

export default function CartWrapper() {
  const { cartOpen, setCartOpen, cartItems, removeFromCart } = useAppContext();
  const router = useRouter();

  const handleCheckout = () => {
    setCartOpen(false);
    router.push('/checkout');
  };

  return (
    <Cart
      isOpen={cartOpen}
      onClose={() => setCartOpen(false)}
      items={cartItems}
      onRemoveItem={removeFromCart}
      onCheckout={handleCheckout}
      isLoading={false}
    />
  );
}
