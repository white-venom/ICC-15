'use client';

import React from 'react';
import Navbar from './Navbar';
import { useAppContext } from '@/context/AppContext';

export default function NavbarWrapper() {
  const { cartItems, setCartOpen } = useAppContext();
  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  return <Navbar cartCount={cartCount} onCartClick={() => setCartOpen(true)} />;
}
