'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Cart } from '@driptide/contracts';
import { api } from '@/lib/api';

interface CartContextType {
  cart: Cart | null;
  isOpen: boolean;
  isLoading: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (variantId: string, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  applyCoupon: (code: string) => Promise<void>;
  removeCoupon: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');

  // Initialize or restore guest session ID
  useEffect(() => {
    let sid = localStorage.getItem('driptide_session_id');
    if (!sid) {
      sid = `guest-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('driptide_session_id', sid);
    }
    setSessionId(sid);
  }, []);

  const refreshCart = useCallback(async () => {
    if (!sessionId) return;
    try {
      setIsLoading(true);
      const data = await api.getCart(sessionId);
      setCart(data);
    } catch (err) {
      console.error('Failed to load cart:', err);
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    if (sessionId) {
      refreshCart();
    }
  }, [sessionId, refreshCart]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen((prev) => !prev);

  const addToCart = async (variantId: string, quantity: number = 1) => {
    if (!sessionId) return;
    try {
      setIsLoading(true);
      const updatedCart = await api.addToCart(variantId, quantity, sessionId);
      setCart(updatedCart);
      setIsOpen(true); // Open drawer on addition
    } catch (err: any) {
      alert(err.message || 'Failed to add item to bag');
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (!sessionId) return;
    try {
      setIsLoading(true);
      const updated = await api.updateCartItem(itemId, quantity, sessionId);
      setCart(updated);
    } catch (err: any) {
      alert(err.message || 'Failed to update item quantity');
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (itemId: string) => {
    if (!sessionId) return;
    try {
      setIsLoading(true);
      const updated = await api.removeFromCart(itemId, sessionId);
      setCart(updated);
    } catch (err: any) {
      alert(err.message || 'Failed to remove item');
    } finally {
      setIsLoading(false);
    }
  };

  const applyCoupon = async (code: string) => {
    if (!sessionId) return;
    try {
      setIsLoading(true);
      const updated = await api.applyCoupon(code, sessionId);
      setCart(updated);
    } catch (err: any) {
      alert(err.message || 'Invalid coupon code');
    } finally {
      setIsLoading(false);
    }
  };

  const removeCoupon = async () => {
    if (!sessionId) return;
    try {
      setIsLoading(true);
      const updated = await api.removeCoupon(sessionId);
      setCart(updated);
    } catch (err: any) {
      alert(err.message || 'Failed to remove coupon');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isOpen,
        isLoading,
        openCart,
        closeCart,
        toggleCart,
        addToCart,
        updateQuantity,
        removeItem,
        applyCoupon,
        removeCoupon,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
