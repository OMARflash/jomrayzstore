'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Truck,
  CheckCircle2,
  AlertCircle,
  Banknote,
  ArrowRight,
  ShoppingBag,
  Tag,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { formatEGP } from '@/lib/utils';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, subtotal, shippingFee, discountAmount, total, appliedCoupon, applyCoupon, removeCoupon, clearCart } = useCart();
  const { user } = useAuth();

  // Egyptian Address Form Fields
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [governorate, setGovernorate] = useState('Cairo');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [building, setBuilding] = useState('');
  const [floor, setFloor] = useState('');
  const [apartment, setApartment] = useState('');
  const [notes, setNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState('');
  const [couponMessage, setCouponMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const handleApplyCoupon = async (event?: React.SyntheticEvent) => {
    event?.preventDefault();
    if (!couponCode.trim()) return;
    setIsApplyingCoupon(true);
    setCouponMessage(null);
    const result = await applyCoupon(couponCode.trim());
    setCouponMessage({ text: result.message, isError: !result.success });
    if (result.success) setCouponCode('');
    setIsApplyingCoupon(false);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="font-stencil text-2xl text-white">YOUR CART IS EMPTY</h1>
        <p className="text-xs text-neutral-400">
          Please add products to your cart before proceeding to checkout.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black text-xs font-bold rounded-xl"
        >
          <span>Return To Shop</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validate phone number format (standard Egyptian mobile prefix: 010, 011, 012, 015)
    const phoneClean = customerPhone.replace(/\s+/g, '');
    if (!/^01[0125][0-9]{8}$/.test(phoneClean)) {
      setErrorMessage('Please enter a valid 11-digit Egyptian phone number (e.g. 01012345678, 011..., 012..., 015...)');
      return;
    }

    if (!customerName || !city || !address) {
      setErrorMessage('Please fill in all required shipping address fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        customerName,
        customerPhone: phoneClean,
        governorate,
        city,
        address,
        building,
        floor,
        apartment,
        notes,
        paymentMethod: 'COD', // Cash on Delivery ONLY
        couponCode: appliedCoupon?.code || null,
        items: cart.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          productName: item.name,
          quantity: item.quantity,
        })),
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.message || 'Failed to place your order. Please try again.');
        setIsSubmitting(false);
        return;
      }

      // Order created successfully
      clearCart();
      router.push(`/order-confirmation/${data.orderNumber}`);
    } catch (err: any) {
      setErrorMessage('Network error while placing order. Please check your connection.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title */}
      <div className="border-b border-neutral-800 pb-4">
        <h1 className="font-stencil text-3xl sm:text-4xl text-white">SECURE CHECKOUT</h1>
        <p className="text-xs text-neutral-400 mt-1">
          Cash On Delivery (COD) Only • Delivered straight to your doorstep across Egypt
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold flex items-center gap-2 animate-fade-in">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmitOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* SHIPPING & ADDRESS DETAILS (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Customer Contact */}
            <div className="p-6 rounded-3xl bg-neutral-900/40 border border-neutral-800 space-y-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                <span>1. Contact Details</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-neutral-300 block mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                    placeholder="e.g. Youssef Ahmed"
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-neutral-300 block mb-1">
                    Egyptian Mobile Number *
                  </label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    required
                    placeholder="01012345678"
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-red-500 font-mono"
                  />
                  <p className="text-[10px] text-neutral-500 mt-1">
                    Courier calls this number before arrival.
                  </p>
                </div>
              </div>
            </div>

            {/* Egyptian Delivery Address */}
            <div className="p-6 rounded-3xl bg-neutral-900/40 border border-neutral-800 space-y-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                <span>2. Egyptian Shipping Address</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-neutral-300 block mb-1">
                    Governorate (المحافظة) *
                  </label>
                  <select
                    value={governorate}
                    onChange={(e) => setGovernorate(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-red-500"
                  >
                    <option value="Cairo">Cairo (القاهرة)</option>
                    <option value="Giza">Giza (الجيزة)</option>
                    <option value="Alexandria">Alexandria (الإسكندرية)</option>
                    <option value="Qalyubia">Qalyubia (القليوبية)</option>
                    <option value="Sharqia">Sharqia (الشرقية)</option>
                    <option value="Dakahlia">Dakahlia (الدقهلية)</option>
                    <option value="Gharbia">Gharbia (الغربية)</option>
                    <option value="Monufia">Monufia (المنوفية)</option>
                    <option value="Beheira">Beheira (البحيرة)</option>
                    <option value="Kafr El Sheikh">Kafr El Sheikh (كفر الشيخ)</option>
                    <option value="Damietta">Damietta (دمياط)</option>
                    <option value="Port Said">Port Said (بورسعيد)</option>
                    <option value="Ismailia">Ismailia (الإسماعيلية)</option>
                    <option value="Suez">Suez (السويس)</option>
                    <option value="Beni Suef">Beni Suef (بني سويف)</option>
                    <option value="Faiyum">Faiyum (الفيوم)</option>
                    <option value="Minya">Minya (المنيا)</option>
                    <option value="Asyut">Asyut (أسيوط)</option>
                    <option value="Sohag">Sohag (سوهاج)</option>
                    <option value="Qena">Qena (قنا)</option>
                    <option value="Luxor">Luxor (الأقصر)</option>
                    <option value="Aswan">Aswan (أسوان)</option>
                    <option value="Red Sea">Red Sea (البحر الأحمر)</option>
                    <option value="Matrouh">Matrouh (مطروح)</option>
                    <option value="New Valley">New Valley (الوادي الجديد)</option>
                    <option value="North Sinai">North Sinai (شمال سيناء)</option>
                    <option value="South Sinai">South Sinai (جنوب سيناء)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-neutral-300 block mb-1">
                    City / District (المدينة / الحي) *
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    placeholder="e.g. New Cairo / Nasr City / Smouha"
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-neutral-300 block mb-1">
                  Full Street Address (اسم الشارع والعلامة المميزة) *
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  placeholder="Street name, landmark, near..."
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-red-500"
                />
              </div>

              {/* Building, Floor, Apartment */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-neutral-300 block mb-1">
                    Building (عمارة)
                  </label>
                  <input
                    type="text"
                    value={building}
                    onChange={(e) => setBuilding(e.target.value)}
                    placeholder="No. 12"
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-neutral-300 block mb-1">
                    Floor (دور)
                  </label>
                  <input
                    type="text"
                    value={floor}
                    onChange={(e) => setFloor(e.target.value)}
                    placeholder="3rd Floor"
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-neutral-300 block mb-1">
                    Apartment (شقة)
                  </label>
                  <input
                    type="text"
                    value={apartment}
                    onChange={(e) => setApartment(e.target.value)}
                    placeholder="Apt 6"
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              {/* Additional delivery notes */}
              <div>
                <label className="text-[11px] font-bold text-neutral-300 block mb-1">
                  Additional Delivery Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Ring bell number 4, or call upon entering compound..."
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            {/* PAYMENT METHOD: STRICT CASH ON DELIVERY ONLY */}
            <div className="p-6 rounded-3xl bg-neutral-900/40 border-2 border-red-500/40 space-y-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                <span>3. Payment Method (Cash on Delivery Only)</span>
              </h2>

              <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-start gap-4">
                <div className="p-3 bg-red-500/10 text-red-400 rounded-xl">
                  <Banknote className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">Cash on Delivery (الدفع عند الاستلام)</span>
                    <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                      Active
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Pay pure cash directly to the courier when your package arrives at your home. No credit cards, Stripe, or upfront online payment required.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ORDER SUMMARY (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-3xl bg-neutral-900/60 border border-neutral-800 space-y-6 sticky top-24 shadow-2xl">
              <h2 className="text-lg font-bold text-white font-stencil tracking-wider flex items-center justify-between">
                <span>ORDER SUMMARY</span>
                <span className="text-xs font-mono text-neutral-400">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)} Items
                </span>
              </h2>

              {/* Items preview list */}
              <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 text-xs border-b border-neutral-850 pb-2"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={item.image}
                        alt=""
                        className="w-10 h-12 rounded-lg object-cover bg-neutral-950 flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-white truncate">{item.name}</p>
                        <p className="text-[10px] text-neutral-400">
                          {item.size} • {item.color} • Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-white flex-shrink-0">
                      {formatEGP(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Coupon code */}
              <div className="pt-2 border-t border-neutral-800">
                <label className="text-xs font-bold text-neutral-300 block mb-1.5">Discount Coupon Code</label>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs">
                    <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5" />
                      {appliedCoupon.code} applied
                    </span>
                    <button type="button" onClick={removeCoupon} className="text-neutral-400 hover:text-white underline text-[11px]">
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(event) => setCouponCode(event.target.value)}
                      placeholder="e.g. JOMRAYZ10"
                      className="flex-1 min-w-0 bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white uppercase placeholder-neutral-600 focus:outline-none focus:border-red-500 font-mono"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      disabled={isApplyingCoupon}
                      className="shrink-0 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl"
                    >
                      Apply
                    </button>
                  </div>
                )}
                {couponMessage && (
                  <p className={`text-[11px] mt-1.5 ${couponMessage.isError ? 'text-red-400' : 'text-emerald-400'}`}>
                    {couponMessage.text}
                  </p>
                )}
              </div>

              {/* Pricing breakdown */}
              <div className="space-y-2 text-xs text-neutral-400 pt-2 border-t border-neutral-800">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="text-white font-mono">{formatEGP(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-red-400 font-medium">
                    <span>Discount ({appliedCoupon?.code}):</span>
                    <span className="font-mono">-{formatEGP(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping Fee ({governorate}):</span>
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
                  <span className="text-red-500 font-mono text-xl">{formatEGP(total)}</span>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="space-y-3 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-white hover:bg-neutral-200 text-black font-black text-sm uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 transition-all shadow-2xl disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Placing Your Order...</span>
                  ) : (
                    <>
                      <span>PLACE ORDER (CASH ON DELIVERY)</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="text-[11px] text-center text-neutral-500 flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>100% Guaranteed Doorstep Inspection & Delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
