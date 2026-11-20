'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Truck,
  ShieldCheck,
  Tag,
  Check,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatEGP } from '@/lib/utils';

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    subtotal,
    shippingFee,
    discountAmount,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    selectedGovernorate,
    setSelectedGovernorate,
    total,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponMessage, setCouponMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const freeShippingThreshold = 2500;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    setIsApplyingCoupon(true);
    setCouponMessage(null);

    const res = await applyCoupon(couponInput.trim());
    if (res.success) {
      setCouponMessage({ text: res.message, isError: false });
      setCouponInput('');
    } else {
      setCouponMessage({ text: res.message, isError: true });
    }
    setIsApplyingCoupon(false);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto text-neutral-500 shadow-xl">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div>
          <h1 className="font-stencil text-3xl sm:text-4xl text-white">YOUR CART IS EMPTY</h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-2 max-w-sm mx-auto">
            Explore the latest unified streetwear drop from JOMRAYZ and define your signature silhouette.
          </p>
        </div>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-neutral-200 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xl"
        >
          <span>Explore Collection</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Title */}
      <div className="border-b border-neutral-800 pb-6 flex items-center justify-between">
        <div>
          <h1 className="font-stencil text-3xl sm:text-4xl text-white">SHOPPING CART</h1>
          <p className="text-xs text-neutral-400 mt-1">
            Review your pieces before completing your Cash On Delivery order.
          </p>
        </div>
        <span className="text-xs font-mono bg-neutral-900 border border-neutral-800 text-neutral-300 px-3 py-1.5 rounded-full">
          {cart.reduce((sum, item) => sum + item.quantity, 0)} Items
        </span>
      </div>

      {/* Free Shipping Alert across Egypt */}
      <div className="p-4 rounded-2xl bg-neutral-900/40 border border-neutral-800 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-neutral-300 flex items-center gap-2">
            <Truck className="w-4 h-4 text-red-500" />
            {amountToFreeShipping > 0 ? (
              <span>
                Add <strong className="text-white font-mono">{formatEGP(amountToFreeShipping)}</strong> more to get <strong>Free Nationwide Shipping</strong>
              </span>
            ) : (
              <span className="text-emerald-400 font-bold">
                🎉 Congratulations! Your order qualifies for 100% Free Shipping in Egypt!
              </span>
            )}
          </span>
          <span className="text-neutral-400 font-mono text-[11px]">{progressPercent}%</span>
        </div>
        <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-red-500 h-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Cart Items & Summary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Items List (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="p-4 sm:p-6 rounded-2xl bg-neutral-900/30 border border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-26 sm:w-24 sm:h-30 object-cover rounded-xl bg-neutral-950 flex-shrink-0"
                />
                <div className="space-y-1">
                  <Link href={`/product/${item.slug}`} className="hover:underline">
                    <h3 className="text-sm font-bold text-white leading-snug">{item.name}</h3>
                  </Link>
                  <div className="flex items-center gap-2 text-xs text-neutral-400">
                    <span className="bg-neutral-800 px-2 py-0.5 rounded text-neutral-300">
                      Size: {item.size}
                    </span>
                    <span className="bg-neutral-800 px-2 py-0.5 rounded text-neutral-300">
                      {item.color}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-neutral-500">Unit: {formatEGP(item.price)}</p>
                </div>
              </div>

              {/* Quantity and Price */}
              <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-neutral-800">
                {/* Quantity buttons */}
                <div className="flex items-center border border-neutral-700 bg-neutral-950 rounded-xl overflow-hidden">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="p-2 text-neutral-400 hover:text-white disabled:opacity-30"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-bold text-white min-w-[28px] text-center font-mono">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    disabled={item.quantity >= item.maxStock}
                    className="p-2 text-neutral-400 hover:text-white disabled:opacity-30"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-right">
                  <p className="text-base font-black text-white font-mono">
                    {formatEGP(item.price * item.quantity)}
                  </p>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-neutral-500 hover:text-red-400 p-2 transition-colors"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary & Coupon (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-3xl bg-neutral-900/60 border border-neutral-800 space-y-6">
            <h2 className="text-lg font-bold text-white font-stencil tracking-wider">
              ORDER SUMMARY
            </h2>

            {/* Governorate selection */}
            <div>
              <label className="text-xs font-bold text-neutral-300 block mb-1.5">
                Shipping Governorate (Egypt)
              </label>
              <select
                value={selectedGovernorate}
                onChange={(e) => setSelectedGovernorate(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-red-500"
              >
                <option value="Cairo">Cairo (القاهرة) - 50 EGP</option>
                <option value="Giza">Giza (الجيزة) - 50 EGP</option>
                <option value="Alexandria">Alexandria (الإسكندرية) - 60 EGP</option>
                <option value="Qalyubia">Qalyubia (القليوبية) - 60 EGP</option>
                <option value="Sharqia">Sharqia (الشرقية) - 65 EGP</option>
                <option value="Dakahlia">Dakahlia (الدقهلية) - 65 EGP</option>
                <option value="Gharbia">Gharbia (الغربية) - 65 EGP</option>
                <option value="Monufia">Monufia (المنوفية) - 65 EGP</option>
                <option value="Beheira">Beheira (البحيرة) - 65 EGP</option>
                <option value="Kafr El Sheikh">Kafr El Sheikh (كفر الشيخ) - 70 EGP</option>
                <option value="Damietta">Damietta (دمياط) - 70 EGP</option>
                <option value="Port Said">Port Said (بورسعيد) - 70 EGP</option>
                <option value="Ismailia">Ismailia (الإسماعيلية) - 70 EGP</option>
                <option value="Suez">Suez (السويس) - 70 EGP</option>
                <option value="Beni Suef">Beni Suef (بني سويف) - 80 EGP</option>
                <option value="Faiyum">Faiyum (الفيوم) - 80 EGP</option>
                <option value="Minya">Minya (المنيا) - 85 EGP</option>
                <option value="Asyut">Asyut (أسيوط) - 85 EGP</option>
                <option value="Sohag">Sohag (سوهاج) - 90 EGP</option>
                <option value="Qena">Qena (قنا) - 90 EGP</option>
                <option value="Luxor">Luxor (الأقصر) - 95 EGP</option>
                <option value="Aswan">Aswan (أسوان) - 100 EGP</option>
                <option value="Red Sea">Red Sea (البحر الأحمر) - 100 EGP</option>
                <option value="Matrouh">Matrouh (مطروح) - 100 EGP</option>
                <option value="New Valley">New Valley (الوادي الجديد) - 110 EGP</option>
                <option value="North Sinai">North Sinai (شمال سيناء) - 110 EGP</option>
                <option value="South Sinai">South Sinai (جنوب سيناء) - 110 EGP</option>
              </select>
            </div>

            {/* Coupon Code Input */}
            <div className="pt-2 border-t border-neutral-800">
              <label className="text-xs font-bold text-neutral-300 block mb-1.5">
                Discount Coupon Code
              </label>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs">
                  <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" />
                    <span>{appliedCoupon.code} applied!</span>
                  </span>
                  <button
                    onClick={removeCoupon}
                    className="text-neutral-400 hover:text-white underline text-[11px]"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="e.g. JOMRAYZ10"
                    className="flex-1 bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white uppercase placeholder-neutral-600 focus:outline-none focus:border-red-500 font-mono"
                  />
                  <button
                    type="submit"
                    disabled={isApplyingCoupon}
                    className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold rounded-xl transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}

              {couponMessage && (
                <p
                  className={`text-[11px] mt-1.5 ${
                    couponMessage.isError ? 'text-red-400' : 'text-emerald-400'
                  }`}
                >
                  {couponMessage.text}
                </p>
              )}
            </div>

            {/* Cost Breakdown */}
            <div className="space-y-2 pt-4 border-t border-neutral-800 text-xs text-neutral-400">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="text-white font-mono">{formatEGP(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-red-400 font-medium">
                  <span>Coupon Discount:</span>
                  <span className="font-mono">-{formatEGP(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping ({selectedGovernorate}):</span>
                <span className="text-white font-mono">
                  {shippingFee === 0 ? (
                    <span className="text-emerald-400 font-bold">FREE</span>
                  ) : (
                    formatEGP(shippingFee)
                  )}
                </span>
              </div>
              <div className="flex justify-between text-base font-black text-white pt-4 border-t border-neutral-800">
                <span>Final Total:</span>
                <span className="text-red-500 font-mono text-lg">{formatEGP(total)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <div className="space-y-3 pt-2">
              <Link
                href="/checkout"
                className="w-full py-4 bg-white hover:bg-neutral-200 text-black font-extrabold text-sm uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl"
              >
                <span>CHECKOUT</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="text-[11px] text-center text-neutral-500 flex items-center justify-center gap-1">
                <span>Payment Method:</span>
                <strong className="text-neutral-300">Cash On Delivery Only</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
