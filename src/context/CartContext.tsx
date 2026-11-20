'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartItem, ShippingRate, Coupon } from '@/lib/types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  updateItemVariant: (oldItemId: string, newVariant: { variantId: string; size: string; color: string; maxStock: number }) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  itemCount: number;
  subtotal: number;
  discountAmount: number;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  selectedGovernorate: string;
  setSelectedGovernorate: (gov: string) => void;
  shippingFee: number;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [selectedGovernorate, setSelectedGovernorate] = useState<string>('Cairo');
  const [shippingFee, setShippingFee] = useState<number>(50);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('jomrayz_cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
      const savedGov = localStorage.getItem('jomrayz_gov');
      if (savedGov) {
        setSelectedGovernorate(savedGov);
      }
    } catch (e) {
      console.error('Failed to load cart from storage', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('jomrayz_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to storage', e);
    }
  }, [cart, isLoaded]);

  // Fetch shipping fee when governorate changes
  useEffect(() => {
    if (!selectedGovernorate) return;
    localStorage.setItem('jomrayz_gov', selectedGovernorate);
    fetch(`/api/shipping?governorate=${encodeURIComponent(selectedGovernorate)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.rate !== undefined) {
          setShippingFee(data.rate);
        }
      })
      .catch((err) => {
        console.error('Shipping rate fetch error', err);
      });
  }, [selectedGovernorate]);

  const addToCart = (item: Omit<CartItem, 'id'>) => {
    const id = `${item.productId}-${item.variantId}`;
    setCart((prev) => {
      const existing = prev.find((i) => i.id === id);
      if (existing) {
        const newQty = Math.min(existing.quantity + item.quantity, item.maxStock);
        return prev.map((i) => (i.id === id ? { ...i, quantity: newQty } : i));
      }
      return [...prev, { ...item, id }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((i) => i.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const validQty = Math.min(quantity, item.maxStock);
          return { ...item, quantity: validQty };
        }
        return item;
      })
    );
  };

  const updateItemVariant = (
    oldItemId: string,
    newVariant: { variantId: string; size: string; color: string; maxStock: number }
  ) => {
    setCart((prev) => {
      const target = prev.find((i) => i.id === oldItemId);
      if (!target) return prev;

      const newId = `${target.productId}-${newVariant.variantId}`;
      const filtered = prev.filter((i) => i.id !== oldItemId);
      const existingInNew = filtered.find((i) => i.id === newId);

      if (existingInNew) {
        return filtered.map((i) =>
          i.id === newId
            ? { ...i, quantity: Math.min(i.quantity + target.quantity, newVariant.maxStock) }
            : i
        );
      }

      return [
        ...filtered,
        {
          ...target,
          id: newId,
          variantId: newVariant.variantId,
          size: newVariant.size,
          color: newVariant.color,
          maxStock: newVariant.maxStock,
          quantity: Math.min(target.quantity, newVariant.maxStock),
        },
      ];
    });
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Discount calculation
  let discountAmount = 0;
  if (appliedCoupon) {
    if (subtotal >= appliedCoupon.minOrderValue) {
      if (appliedCoupon.discountType === 'PERCENTAGE') {
        discountAmount = (subtotal * appliedCoupon.discountValue) / 100;
      } else {
        discountAmount = appliedCoupon.discountValue;
      }
    }
  }

  // Free shipping rule: over 2,500 EGP free shipping!
  const effectiveShipping = subtotal >= 2500 ? 0 : shippingFee;
  const total = Math.max(0, subtotal - discountAmount + effectiveShipping);

  const applyCoupon = async (code: string) => {
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotal }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.message || 'Invalid coupon code' };
      }
      setAppliedCoupon(data.coupon);
      return { success: true, message: `Coupon applied: ${data.coupon.code}` };
    } catch (err) {
      return { success: false, message: 'Failed to apply coupon. Try again.' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateItemVariant,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        itemCount,
        subtotal,
        discountAmount,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        selectedGovernorate,
        setSelectedGovernorate,
        shippingFee: effectiveShipping,
        total,
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
