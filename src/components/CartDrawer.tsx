'use client';

import React from 'react';
import Link from 'next/link';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Truck } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatEGP } from '@/lib/utils';

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    shippingFee,
    total,
    selectedGovernorate,
    setSelectedGovernorate,
    discountAmount,
    appliedCoupon,
  } = useCart();

  if (!isCartOpen) return null;

  const freeShippingThreshold = 2500;
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-neutral-950 border-l border-neutral-800 shadow-2xl flex flex-col justify-between animate-fade-in">
          {/* Header */}
          <div className="p-6 border-b border-neutral-850 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-red-500" />
              <h2 className="text-lg font-bold text-white font-stencil tracking-wider">
                Shopping Cart
              </h2>
              <span className="text-xs bg-neutral-800 text-neutral-300 font-bold px-2 py-0.5 rounded-full">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress in Egypt */}
          <div className="px-6 py-3 bg-neutral-900/60 border-b border-neutral-850">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-neutral-400 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-red-400" />
                {amountToFreeShipping > 0 ? (
                  <span>
                    Add <strong className="text-white">{formatEGP(amountToFreeShipping)}</strong> for free Egypt shipping
                  </span>
                ) : (
                  <span className="text-emerald-400 font-bold">You qualify for FREE delivery across Egypt!</span>
                )}
              </span>
              <span className="font-bold text-neutral-300">{progressPercent}%</span>
            </div>
            <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-red-500 h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto text-neutral-500">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Your cart is empty</h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    Discover new unified drops and define your signature style.
                  </p>
                </div>
                <Link
                  href="/shop"
                  onClick={() => setIsCartOpen(false)}
                  className="inline-flex items-center gap-2 bg-white text-black text-xs font-bold px-6 py-3 rounded-xl hover:bg-neutral-200 transition-colors"
                >
                  <span>Explore Collection</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 rounded-xl bg-neutral-900/50 border border-neutral-850 items-center"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-24 object-cover rounded-lg bg-neutral-950 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-bold text-white line-clamp-1">{item.name}</h4>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-neutral-500 hover:text-red-400 p-1 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-neutral-400 mt-1">
                      <span className="bg-neutral-800 px-2 py-0.5 rounded font-medium">
                        Size: {item.size}
                      </span>
                      <span className="bg-neutral-800 px-2 py-0.5 rounded font-medium">
                        {item.color}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs font-black text-white">
                        {formatEGP(item.price * item.quantity)}
                      </span>

                      {/* Quantity Selector */}
                      <div className="flex items-center border border-neutral-750 bg-neutral-950 rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-1 text-neutral-400 hover:text-white"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-white min-w-[20px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1 text-neutral-400 hover:text-white"
                          disabled={item.quantity >= item.maxStock}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Area */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-neutral-850 bg-neutral-950 space-y-4">
              {/* Egyptian Shipping Destination Quick Select */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-400">Ship To Governorate:</span>
                <select
                  value={selectedGovernorate}
                  onChange={(e) => setSelectedGovernorate(e.target.value)}
                  className="bg-neutral-900 border border-neutral-700 text-white rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-red-500"
                >
                  <option value="Cairo">Cairo (القاهرة)</option>
                  <option value="Giza">Giza (الجيزة)</option>
                  <option value="Alexandria">Alexandria (الإسكندرية)</option>
                  <option value="Sharqia">Sharqia (الشرقية)</option>
                  <option value="Dakahlia">Dakahlia (الدقهلية)</option>
                  <option value="Gharbia">Gharbia (الغربية)</option>
                  <option value="Monufia">Monufia (المنوفية)</option>
                  <option value="Qalyubia">Qalyubia (القليوبية)</option>
                  <option value="Beheira">Beheira (البحيرة)</option>
                  <option value="Suez">Suez (السويس)</option>
                  <option value="Port Said">Port Said (بورسعيد)</option>
                  <option value="Ismailia">Ismailia (الإسماعيلية)</option>
                  <option value="Red Sea">Red Sea (البحر الأحمر)</option>
                  <option value="Aswan">Aswan (أسوان)</option>
                </select>
              </div>

              {/* Cost Summary */}
              <div className="space-y-1.5 text-xs text-neutral-400 pt-2 border-t border-neutral-850">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="text-white font-medium">{formatEGP(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-red-400 font-medium">
                    <span>Discount ({appliedCoupon?.code}):</span>
                    <span>-{formatEGP(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping ({selectedGovernorate}):</span>
                  <span className="text-white font-medium">
                    {shippingFee === 0 ? <span className="text-emerald-400 font-bold">FREE</span> : formatEGP(shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-neutral-800">
                  <span>Total (Cash On Delivery):</span>
                  <span className="text-base text-red-500">{formatEGP(total)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <div className="space-y-2">
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full flex items-center justify-center gap-2 bg-white hover:bg-neutral-200 text-black font-extrabold text-sm py-3.5 rounded-xl transition-all shadow-xl"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <p className="text-[11px] text-center text-neutral-500">
                  Cash on Delivery Only • No card required
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
