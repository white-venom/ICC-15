'use client';

import React from 'react';
import Navbar from './Navbar';
import { useAppContext } from '@/context/AppContext';
import { usePathname } from 'next/navigation';

export default function NavbarWrapper() {
  const { cartItems, setCartOpen } = useAppContext();
  const pathname = usePathname();
  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  if (pathname === '/checkout' || pathname === '/order-status') {
    return null;
  }

  return <Navbar cartCount={cartCount} onCartClick={() => setCartOpen(true)} />;
}

