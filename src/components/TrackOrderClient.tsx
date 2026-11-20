'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  MapPin,
  Banknote,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { Order } from '@/lib/types';
import { formatEGP } from '@/lib/utils';

export default function TrackOrderClient() {
  const searchParams = useSearchParams();
  const initialOrderNumber = searchParams.get('orderNumber') || '';
  const initialPhone = searchParams.get('phone') || '';

  const [orderNumber, setOrderNumber] = useState(initialOrderNumber);
  const [phone, setPhone] = useState(initialPhone);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchTracking = async (ordNum: string, ph: string) => {
    if (!ordNum.trim() || !ph.trim()) return;

    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/orders/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderNumber: ordNum, phone: ph }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.message || 'No order found with these credentials.');
        setOrder(null);
      } else {
        setOrder(data.order);
      }
    } catch (e) {
      setErrorMessage('Network error while looking up order.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrderNumber && initialPhone) {
      fetchTracking(initialOrderNumber, initialPhone);
    }
  }, [initialOrderNumber, initialPhone]);

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTracking(orderNumber, phone);
  };

  const statusSteps = [
    { key: 'RECEIVED', label: 'Order Received', desc: 'Placed in system' },
    { key: 'CONFIRMED', label: 'Confirmed', desc: 'Verified by atelier' },
    { key: 'PREPARING', label: 'Preparing', desc: 'Cutting & packaging' },
    { key: 'SHIPPED', label: 'Shipped', desc: 'With courier' },
    { key: 'DELIVERED', label: 'Delivered', desc: 'Paid via COD' },
  ];

  const getStepIndex = (status: string) => {
    return statusSteps.findIndex((s) => s.key === status);
  };

  const currentStepIndex = order ? getStepIndex(order.status) : 0;
  const isCancelled = order?.status === 'CANCELLED';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Page Header */}
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-red-500">
          Live Order Tracking
        </span>
        <h1 className="font-stencil text-3xl sm:text-5xl text-white tracking-tight">
          TRACK YOUR JOMRAYZ DROP
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto">
          Enter your order reference code and the phone number provided at checkout.
        </p>
      </div>

      {/* Tracking Search Form */}
      <div className="p-6 sm:p-8 rounded-3xl bg-neutral-900/40 border border-neutral-800 shadow-xl">
        <form onSubmit={handleTrackSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          <div className="sm:col-span-5">
            <label className="text-[11px] font-bold text-neutral-300 block mb-1.5">
              Order Number (رقم الطلب)
            </label>
            <input
              type="text"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              required
              placeholder="e.g. JOM-2026-98124"
              className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-3 text-xs text-white uppercase placeholder-neutral-600 focus:outline-none focus:border-red-500 font-mono"
            />
          </div>

          <div className="sm:col-span-5">
            <label className="text-[11px] font-bold text-neutral-300 block mb-1.5">
              Phone Number (رقم الموبايل)
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              placeholder="01012345678"
              className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-red-500 font-mono"
            />
          </div>

          <div className="sm:col-span-2 flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-white hover:bg-neutral-200 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Searching...</span>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Track</span>
                </>
              )}
            </button>
          </div>
        </form>

        {errorMessage && (
          <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* TRACKING RESULTS VIEW */}
      {order && (
        <div className="space-y-8 animate-fade-in">
          {/* Order Header Card */}
          <div className="p-6 rounded-3xl bg-neutral-900/50 border border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-mono text-xl font-bold text-white">{order.orderNumber}</h2>
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                    isCancelled
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}
                >
                  {order.status}
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-1">
                Placed on {new Date(order.createdAt).toLocaleDateString()} for{' '}
                <strong className="text-white">{order.customerName}</strong>
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[11px] text-neutral-400 block">Total Due Upon Delivery</span>
              <span className="text-xl font-black text-red-500 font-mono">
                {formatEGP(order.totalAmount)}
              </span>
            </div>
          </div>

          {/* Stepper Progress Bar */}
          <div className="p-6 sm:p-8 rounded-3xl bg-neutral-900/40 border border-neutral-800 space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-300">
              Delivery Progress
            </h3>

            {isCancelled ? (
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                <div>
                  <p className="font-bold">This order has been cancelled.</p>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    If you did not request this cancellation, please contact our support team on WhatsApp.
                  </p>
                </div>
              </div>
            ) : (
              <div className="relative">
                {/* Connecting Track Line */}
                <div className="hidden sm:block absolute top-5 left-8 right-8 h-1 bg-neutral-800 z-0">
                  <div
                    className="h-full bg-red-500 transition-all duration-500"
                    style={{
                      width: `${Math.max(0, (currentStepIndex / (statusSteps.length - 1)) * 100)}%`,
                    }}
                  />
                </div>

                {/* Steps List */}
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 sm:gap-2 relative z-10">
                  {statusSteps.map((step, idx) => {
                    const isDone = idx <= currentStepIndex;
                    const isCurrent = idx === currentStepIndex;

                    return (
                      <div
                        key={step.key}
                        className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2"
                      >
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-lg ${
                            isCurrent
                              ? 'bg-red-500 text-white ring-4 ring-red-500/20'
                              : isDone
                              ? 'bg-emerald-600 text-white'
                              : 'bg-neutral-800 text-neutral-500'
                          }`}
                        >
                          {isDone ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                        </div>
                        <div>
                          <p
                            className={`text-xs font-bold leading-tight ${
                              isDone ? 'text-white' : 'text-neutral-500'
                            }`}
                          >
                            {step.label}
                          </p>
                          <p className="text-[10px] text-neutral-500 mt-0.5">{step.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Delivery & Items Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Delivery address */}
            <div className="p-6 rounded-3xl bg-neutral-900/30 border border-neutral-800 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-500" />
                <span>Shipping Address</span>
              </h4>
              <div className="text-xs text-neutral-300 space-y-1 font-light">
                <p className="font-bold text-white">{order.customerName}</p>
                <p className="font-mono text-neutral-400">{order.customerPhone}</p>
                <p>{order.address}</p>
                <p className="font-medium text-white">
                  {order.city}, {order.governorate}, Egypt
                </p>
              </div>
            </div>

            {/* Payment & instructions */}
            <div className="p-6 rounded-3xl bg-neutral-900/30 border border-neutral-800 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <Banknote className="w-4 h-4 text-emerald-500" />
                <span>Payment Notice</span>
              </h4>
              <div className="text-xs text-neutral-300 space-y-2 leading-relaxed">
                <p>
                  • Payment is <strong>Cash On Delivery ONLY</strong>. Please have the exact amount of{' '}
                  <strong className="text-white font-mono">{formatEGP(order.totalAmount)}</strong>{' '}
                  ready for the courier.
                </p>
                <p className="text-neutral-500 text-[11px]">
                  You have the right to inspect parcel packaging before handing cash to the driver.
                </p>
              </div>
            </div>
          </div>

          {/* Items in this Order */}
          <div className="p-6 rounded-3xl bg-neutral-900/30 border border-neutral-800 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Pieces In This Drop
            </h4>
            <div className="divide-y divide-neutral-850">
              {order.items.map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-white">{item.productName}</p>
                    <p className="text-[11px] text-neutral-400">
                      Size: {item.size} • Color: {item.color} • Qty: {item.quantity}
                    </p>
                  </div>
                  <span className="font-mono font-bold text-white">{formatEGP(item.total)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
