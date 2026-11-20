'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Banknote,
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  Users,
  Shirt,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Phone,
  MapPin,
} from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { formatEGP } from '@/lib/utils';

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleUpdateStatus = async (orderNumber: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderNumber}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchStats();
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading || !data) {
    return (
      <AdminLayout>
        <div className="text-white text-xs sm:text-sm">Loading analytics & store metrics...</div>
      </AdminLayout>
    );
  }

  const { stats, lowStockItems, bestSellers, recentOrders } = data;

  const kpis = [
    {
      label: 'Total Sales (COD)',
      value: formatEGP(stats.totalSales),
      icon: Banknote,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    },
    {
      label: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    },
    {
      label: 'Pending Orders',
      value: stats.pendingOrders,
      icon: Clock,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    },
    {
      label: 'Delivered (Collected)',
      value: stats.deliveredOrders,
      icon: CheckCircle2,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    },
    {
      label: 'Cancelled Orders',
      value: stats.cancelledOrders,
      icon: XCircle,
      color: 'text-red-400 bg-red-500/10 border-red-500/20',
    },
    {
      label: 'Registered Customers',
      value: stats.totalCustomers,
      icon: Users,
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    },
    {
      label: 'Unified Products',
      value: stats.totalProducts,
      icon: Shirt,
      color: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
    },
    {
      label: 'Low Stock Alerts',
      value: stats.lowStockCount,
      icon: AlertTriangle,
      color: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-4">
          <div>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-red-500">
              JOMRAYZ Egypt • Brand Operations
            </span>
            <h1 className="font-stencil text-xl sm:text-3xl text-white tracking-tight mt-0.5">
              STORE PERFORMANCE OVERVIEW
            </h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <span className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-[11px] sm:text-xs font-mono text-neutral-300">
              AOV: <strong>{formatEGP(stats.averageOrderValue)}</strong>
            </span>
            <Link
              href="/admin/products"
              className="px-3 py-1.5 sm:px-4 sm:py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow-lg transition-colors flex items-center gap-1"
            >
              <span>+ Add Product</span>
            </Link>
          </div>
        </div>

        {/* 8 KPI Cards Grid: 2 columns on mobile, 4 on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          {kpis.map((kpi, idx) => {
            const Icon = kpi.icon;
            return (
              <div
                key={idx}
                className="p-3.5 sm:p-5 rounded-2xl bg-neutral-900/40 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 shadow-sm"
              >
                <div>
                  <p className="text-[10px] sm:text-[11px] font-semibold text-neutral-400 leading-snug">
                    {kpi.label}
                  </p>
                  <p className="text-base sm:text-xl font-black text-white font-mono mt-0.5 sm:mt-1 truncate">
                    {kpi.value}
                  </p>
                </div>
                <div className={`p-2 sm:p-3 rounded-xl border self-start sm:self-auto flex-shrink-0 ${kpi.color}`}>
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent COD Orders & Quick Status Changers */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          {/* Recent Orders Stream (8 cols) */}
          <div className="lg:col-span-8 p-4 sm:p-6 rounded-3xl bg-neutral-900/40 border border-neutral-800 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white">
                Recent COD Orders
              </h2>
              <Link
                href="/admin/orders"
                className="text-xs text-red-400 hover:text-red-300 font-semibold"
              >
                View All →
              </Link>
            </div>

            {/* MOBILE CARD VIEW FOR RECENT ORDERS (< 640px) */}
            <div className="space-y-3 sm:hidden">
              {recentOrders.map((ord: any) => (
                <div
                  key={ord.id}
                  className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-white text-xs">{ord.orderNumber}</span>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        ord.status === 'DELIVERED'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : ord.status === 'CANCELLED'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}
                    >
                      {ord.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-neutral-300">
                    <div>
                      <p className="font-semibold text-white">{ord.customerName}</p>
                      <a
                        href={`tel:${ord.customerPhone}`}
                        className="text-[11px] text-red-400 font-mono hover:underline flex items-center gap-1 mt-0.5"
                      >
                        <Phone className="w-3 h-3" />
                        <span>{ord.customerPhone}</span>
                      </a>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-neutral-500 block">{ord.governorate}</span>
                      <span className="font-mono font-black text-red-400 text-xs">
                        {formatEGP(ord.totalAmount)}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-neutral-850 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-neutral-400">Update Status:</span>
                    <select
                      value={ord.status}
                      onChange={(e) => handleUpdateStatus(ord.orderNumber, e.target.value)}
                      className="bg-neutral-900 border border-neutral-700 text-white text-xs font-semibold rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-red-500"
                    >
                      <option value="RECEIVED">Received</option>
                      <option value="CONFIRMED">Confirmed</option>
                      <option value="PREPARING">Preparing</option>
                      <option value="SHIPPED">Shipped</option>
                      <option value="DELIVERED">Delivered</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>

            {/* DESKTOP TABLE VIEW (>= 640px) */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-xs text-neutral-300">
                <thead className="bg-neutral-950 text-neutral-400 uppercase text-[10px] tracking-wider border-b border-neutral-800">
                  <tr>
                    <th className="py-2.5 px-3">Order #</th>
                    <th className="py-2.5 px-3">Customer</th>
                    <th className="py-2.5 px-3">Governorate</th>
                    <th className="py-2.5 px-3">Total (COD)</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Quick Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-850">
                  {recentOrders.map((ord: any) => (
                    <tr key={ord.id} className="hover:bg-neutral-800/30">
                      <td className="py-3 px-3 font-mono font-bold text-white">
                        {ord.orderNumber}
                      </td>
                      <td className="py-3 px-3">
                        <p className="font-semibold text-white">{ord.customerName}</p>
                        <a
                          href={`tel:${ord.customerPhone}`}
                          className="text-[10px] text-neutral-400 font-mono hover:text-red-400"
                        >
                          {ord.customerPhone}
                        </a>
                      </td>
                      <td className="py-3 px-3">{ord.governorate}</td>
                      <td className="py-3 px-3 font-mono font-bold text-red-400">
                        {formatEGP(ord.totalAmount)}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            ord.status === 'DELIVERED'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : ord.status === 'CANCELLED'
                              ? 'bg-red-500/20 text-red-400'
                              : 'bg-amber-500/20 text-amber-400'
                          }`}
                        >
                          {ord.status}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <select
                          value={ord.status}
                          onChange={(e) => handleUpdateStatus(ord.orderNumber, e.target.value)}
                          className="bg-neutral-950 border border-neutral-700 text-white text-[11px] rounded-lg px-2 py-1 focus:outline-none focus:border-red-500"
                        >
                          <option value="RECEIVED">Received</option>
                          <option value="CONFIRMED">Confirmed</option>
                          <option value="PREPARING">Preparing</option>
                          <option value="SHIPPED">Shipped</option>
                          <option value="DELIVERED">Delivered</option>
                          <option value="CANCELLED">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Low Stock & Best Sellers (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Low Stock Box */}
            <div className="p-4 sm:p-6 rounded-3xl bg-neutral-900/40 border border-neutral-800 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Low Stock Variants</span>
                </h3>
                <Link
                  href="/admin/inventory"
                  className="text-[11px] text-neutral-400 hover:text-white"
                >
                  Manage
                </Link>
              </div>

              {lowStockItems.length === 0 ? (
                <p className="text-xs text-neutral-500">All inventory healthy ({'>'}5 items per variant).</p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {lowStockItems.slice(0, 5).map((item: any) => (
                    <div
                      key={item.id}
                      className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-850 flex items-center justify-between text-xs"
                    >
                      <div className="min-w-0 pr-2">
                        <p className="font-semibold text-white truncate">{item.productName}</p>
                        <p className="text-[10px] text-neutral-500">
                          {item.size} • {item.color}
                        </p>
                      </div>
                      <span className="font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded text-[10px]">
                        {item.stock} left
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Best Sellers */}
            <div className="p-4 sm:p-6 rounded-3xl bg-neutral-900/40 border border-neutral-800 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                <span>Best Selling Drops</span>
              </h3>

              <div className="space-y-2">
                {bestSellers.length === 0 ? (
                  <p className="text-xs text-neutral-500">No sales recorded yet.</p>
                ) : (
                  bestSellers.map((item: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-850 flex items-center justify-between text-xs"
                    >
                      <div className="min-w-0 pr-2">
                        <p className="font-semibold text-white truncate">{item.product.name}</p>
                        <p className="text-[10px] text-neutral-500">{item.totalSold} pieces ordered</p>
                      </div>
                      <span className="font-mono font-bold text-emerald-400 text-xs">
                        {formatEGP(item.revenue)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
