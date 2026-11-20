'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Users, Phone, Mail, ShoppingBag, Calendar, Banknote } from 'lucide-react';
import { formatEGP } from '@/lib/utils';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/customers')
      .then((res) => res.json())
      .then((data) => {
        if (data.customers) setCustomers(data.customers);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="border-b border-neutral-800 pb-4">
          <h1 className="font-stencil text-xl sm:text-3xl text-white">REGISTERED CUSTOMERS</h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Egyptian customer profiles, lifetime spend, and purchase history.
          </p>
        </div>

        {/* 1. MOBILE CUSTOMER CARDS (< 640px) */}
        <div className="space-y-3 sm:hidden">
          {customers.map((c) => (
            <div
              key={c.id}
              className="p-4 rounded-2xl bg-neutral-900/50 border border-neutral-800 space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm">{c.name}</span>
                <span className="font-mono text-[11px] text-neutral-400">
                  {c.totalOrders} orders
                </span>
              </div>

              <div className="text-xs space-y-1">
                <p className="text-neutral-400 font-mono text-[11px] truncate">{c.email}</p>
                {c.phone && (
                  <a
                    href={`tel:${c.phone}`}
                    className="text-red-400 font-mono hover:underline flex items-center gap-1 text-[11px]"
                  >
                    <Phone className="w-3 h-3" />
                    <span>{c.phone}</span>
                  </a>
                )}
              </div>

              <div className="pt-2 border-t border-neutral-850 flex items-center justify-between text-xs">
                <span className="text-neutral-500 text-[10px]">Total COD Spent:</span>
                <span className="font-mono font-black text-emerald-400 text-sm">
                  {formatEGP(c.totalSpent)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* 2. DESKTOP CUSTOMERS TABLE (>= 640px) */}
        <div className="hidden sm:block p-6 rounded-3xl bg-neutral-900/40 border border-neutral-800 overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="bg-neutral-950 text-neutral-400 uppercase text-[10px] tracking-wider border-b border-neutral-800">
              <tr>
                <th className="py-3 px-3">Customer</th>
                <th className="py-3 px-3">Contact</th>
                <th className="py-3 px-3">Orders Count</th>
                <th className="py-3 px-3">Total Spend (COD)</th>
                <th className="py-3 px-3">Joined Date</th>
                <th className="py-3 px-3">Recent Orders</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-850">
              {customers.map((c) => (
                <tr key={c.id} className="hover:bg-neutral-800/30">
                  <td className="py-3 px-3 font-semibold text-white">{c.name}</td>
                  <td className="py-3 px-3">
                    <p className="text-neutral-400 font-mono">{c.email}</p>
                    <p className="text-neutral-500 font-mono text-[11px]">{c.phone || '-'}</p>
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-neutral-200">
                    {c.totalOrders} orders
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-emerald-400">
                    {formatEGP(c.totalSpent)}
                  </td>
                  <td className="py-3 px-3 text-neutral-500 text-[11px]">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex flex-wrap gap-1">
                      {c.recentOrders.map((ord: any) => (
                        <span
                          key={ord.id}
                          className="bg-neutral-950 border border-neutral-800 text-neutral-300 px-2 py-0.5 rounded text-[10px] font-mono"
                        >
                          {ord.orderNumber}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
