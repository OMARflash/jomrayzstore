'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Tag, Plus, Trash2, Check, X, Calendar } from 'lucide-react';
import { formatEGP } from '@/lib/utils';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState('PERCENTAGE');
  const [discountValue, setDiscountValue] = useState('10');
  const [minOrderValue, setMinOrderValue] = useState('1000');
  const [maxUses, setMaxUses] = useState('500');

  const fetchCoupons = async () => {
    try {
      const res = await fetch('/api/coupons');
      const data = await res.json();
      if (data.coupons) setCoupons(data.coupons);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          discountType,
          discountValue: parseFloat(discountValue),
          minOrderValue: parseFloat(minOrderValue),
          maxUses: parseInt(maxUses) || null,
        }),
      });

      if (res.ok) {
        fetchCoupons();
        setIsModalOpen(false);
        setCode('');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this coupon?')) return;
    try {
      const res = await fetch('/api/coupons', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setCoupons(coupons.filter((c) => c.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-4">
          <div>
            <h1 className="font-stencil text-xl sm:text-3xl text-white">DISCOUNT COUPONS</h1>
            <p className="text-xs text-neutral-400 mt-0.5">
              Configure promo codes, percentage or fixed discounts, and minimum order requirements.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create Promo Coupon</span>
          </button>
        </div>

        {/* 1. MOBILE COUPON CARDS (< 640px) */}
        <div className="space-y-3 sm:hidden">
          {coupons.map((c) => (
            <div
              key={c.id}
              className="p-4 rounded-2xl bg-neutral-900/50 border border-neutral-800 space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-white text-base">{c.code}</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold uppercase">
                  Active
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="font-mono font-black text-red-400 text-sm">
                  {c.discountType === 'PERCENTAGE' ? `${c.discountValue}% OFF` : `${c.discountValue} EGP OFF`}
                </span>
                <span className="text-neutral-400 text-[11px]">
                  Min order: {formatEGP(c.minOrderValue)}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-neutral-850 text-xs">
                <span className="text-neutral-500 font-mono text-[11px]">
                  {c.usedCount} / {c.maxUses || '∞'} used
                </span>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="p-1.5 bg-neutral-800 text-neutral-400 hover:text-red-400 rounded-lg"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 2. DESKTOP COUPONS TABLE (>= 640px) */}
        <div className="hidden sm:block p-6 rounded-3xl bg-neutral-900/40 border border-neutral-800 overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="bg-neutral-950 text-neutral-400 uppercase text-[10px] tracking-wider border-b border-neutral-800">
              <tr>
                <th className="py-3 px-3">Coupon Code</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3">Discount Value</th>
                <th className="py-3 px-3">Min Order</th>
                <th className="py-3 px-3">Usage</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-850">
              {coupons.map((c) => (
                <tr key={c.id} className="hover:bg-neutral-800/30">
                  <td className="py-3 px-3 font-mono font-bold text-white text-sm">{c.code}</td>
                  <td className="py-3 px-3">
                    <span className="bg-neutral-800 px-2 py-0.5 rounded text-[10px] font-bold">
                      {c.discountType}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-red-400">
                    {c.discountType === 'PERCENTAGE' ? `${c.discountValue}% OFF` : `${c.discountValue} EGP OFF`}
                  </td>
                  <td className="py-3 px-3 font-mono text-neutral-400">
                    {formatEGP(c.minOrderValue)}
                  </td>
                  <td className="py-3 px-3 font-mono">
                    {c.usedCount} / {c.maxUses || '∞'} uses
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold uppercase">
                      Active
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="p-1.5 text-neutral-400 hover:text-red-400 bg-neutral-800 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl sm:rounded-3xl w-full max-w-md p-5 sm:p-8 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-stencil text-lg sm:text-xl text-white">Create New Coupon</h2>

            <form onSubmit={handleCreateCoupon} className="space-y-3 sm:space-y-4">
              <div>
                <label className="text-[11px] font-bold text-neutral-300 block mb-1">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  required
                  placeholder="e.g. FLASH20"
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white uppercase placeholder-neutral-600 focus:outline-none focus:border-red-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-neutral-300 block mb-1">
                    Discount Type
                  </label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl px-3 py-2 text-xs"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED">Fixed (EGP)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-neutral-300 block mb-1">
                    Discount Value *
                  </label>
                  <input
                    type="number"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    required
                    placeholder="10"
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-neutral-300 block mb-1">
                    Min Order Subtotal (EGP)
                  </label>
                  <input
                    type="number"
                    value={minOrderValue}
                    onChange={(e) => setMinOrderValue(e.target.value)}
                    placeholder="1000"
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-neutral-300 block mb-1">
                    Maximum Uses
                  </label>
                  <input
                    type="number"
                    value={maxUses}
                    onChange={(e) => setMaxUses(e.target.value)}
                    placeholder="500"
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-2 sm:gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl"
                >
                  Save Coupon
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-3 bg-neutral-800 text-neutral-300 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
