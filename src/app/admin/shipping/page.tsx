'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Truck, Check, Edit, RefreshCw, Search } from 'lucide-react';
import { formatEGP } from '@/lib/utils';

export default function AdminShippingPage() {
  const [rates, setRates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRate, setEditRate] = useState<number>(0);
  const [editDays, setEditDays] = useState<string>('');

  const fetchRates = async () => {
    try {
      const res = await fetch('/api/shipping');
      const data = await res.json();
      if (data.rates) setRates(data.rates);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  const handleStartEdit = (r: any) => {
    setEditingId(r.id);
    setEditRate(r.rate);
    setEditDays(r.estimatedDays);
  };

  const handleSaveRate = async (id: string) => {
    try {
      const res = await fetch('/api/shipping', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          rate: editRate,
          estimatedDays: editDays,
        }),
      });

      if (res.ok) {
        setRates(
          rates.map((r) =>
            r.id === id ? { ...r, rate: editRate, estimatedDays: editDays } : r
          )
        );
        setEditingId(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredRates = rates.filter((r) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      return r.governorate.toLowerCase().includes(q) || r.governorateAr.includes(q);
    }
    return true;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-4">
          <div>
            <h1 className="font-stencil text-xl sm:text-3xl text-white">EGYPTIAN SHIPPING RATES</h1>
            <p className="text-xs text-neutral-400 mt-0.5">
              Configure Cash on Delivery shipping fees and delivery estimates across all 27 Egyptian Governorates.
            </p>
          </div>
          <button
            onClick={fetchRates}
            className="w-full sm:w-auto px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reload Rates</span>
          </button>
        </div>

        {/* Quick Search */}
        <div className="relative max-w-sm">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search governorate (القاهرة, Alexandria...)"
            className="w-full bg-neutral-900 border border-neutral-750 rounded-xl px-3 py-2 pl-9 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-500"
          />
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
        </div>

        {/* 1. MOBILE GOVERNORATES CARDS (< 640px) */}
        <div className="space-y-3 sm:hidden">
          {filteredRates.map((r) => {
            const isEditing = editingId === r.id;
            return (
              <div
                key={r.id}
                className="p-3.5 rounded-2xl bg-neutral-900/50 border border-neutral-800 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white text-xs">{r.governorate}</span>
                    <span className="text-neutral-400 text-xs ml-2 font-semibold font-sans">
                      ({r.governorateAr})
                    </span>
                  </div>
                  <span className="bg-emerald-500/10 text-emerald-400 text-[9px] font-bold px-2 py-0.5 rounded uppercase">
                    Active
                  </span>
                </div>

                {isEditing ? (
                  <div className="space-y-2 pt-1 border-t border-neutral-850">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-neutral-400 block mb-0.5">Rate (EGP)</label>
                        <input
                          type="number"
                          value={editRate}
                          onChange={(e) => setEditRate(parseFloat(e.target.value))}
                          className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-2 py-1.5 text-xs text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-neutral-400 block mb-0.5">Estimate</label>
                        <input
                          type="text"
                          value={editDays}
                          onChange={(e) => setEditDays(e.target.value)}
                          className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-2 py-1.5 text-xs text-white"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => handleSaveRate(r.id)}
                        className="flex-1 py-1.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg text-xs"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-3 py-1.5 bg-neutral-800 text-neutral-300 rounded-lg text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between pt-1 border-t border-neutral-850 text-xs">
                    <div>
                      <span className="font-mono font-black text-red-400 text-sm">
                        {formatEGP(r.rate)}
                      </span>
                      <span className="text-[10px] text-neutral-500 ml-2">{r.estimatedDays}</span>
                    </div>
                    <button
                      onClick={() => handleStartEdit(r)}
                      className="px-3 py-1 bg-neutral-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
                    >
                      <Edit className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 2. DESKTOP GOVERNORATES TABLE (>= 640px) */}
        <div className="hidden sm:block p-6 rounded-3xl bg-neutral-900/40 border border-neutral-800 overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="bg-neutral-950 text-neutral-400 uppercase text-[10px] tracking-wider border-b border-neutral-800">
              <tr>
                <th className="py-3 px-3">Governorate (English)</th>
                <th className="py-3 px-3">Governorate (Arabic)</th>
                <th className="py-3 px-3">COD Rate (EGP)</th>
                <th className="py-3 px-3">Delivery Estimate</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-850">
              {filteredRates.map((r) => {
                const isEditing = editingId === r.id;
                return (
                  <tr key={r.id} className="hover:bg-neutral-800/30">
                    <td className="py-3 px-3 font-bold text-white">{r.governorate}</td>
                    <td className="py-3 px-3 font-semibold text-neutral-300 font-sans">
                      {r.governorateAr}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-red-400">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editRate}
                          onChange={(e) => setEditRate(parseFloat(e.target.value))}
                          className="w-24 bg-neutral-950 border border-neutral-700 rounded px-2 py-1 text-white font-mono"
                        />
                      ) : (
                        formatEGP(r.rate)
                      )}
                    </td>
                    <td className="py-3 px-3 text-neutral-400">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editDays}
                          onChange={(e) => setEditDays(e.target.value)}
                          className="w-36 bg-neutral-950 border border-neutral-700 rounded px-2 py-1 text-white text-xs"
                        />
                      ) : (
                        r.estimatedDays
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                        Active
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {isEditing ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleSaveRate(r.id)}
                            className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg text-xs"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-2 py-1 bg-neutral-800 text-neutral-400 hover:text-white rounded-lg text-xs"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleStartEdit(r)}
                          className="p-1.5 text-neutral-400 hover:text-white bg-neutral-800 rounded-lg text-xs"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
