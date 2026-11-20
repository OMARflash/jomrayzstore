'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import {
  ShoppingBag,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  Truck,
  Phone,
  MapPin,
  X,
} from 'lucide-react';
import { Order } from '@/lib/types';
import { formatEGP } from '@/lib/utils';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [activeOrderModal, setActiveOrderModal] = useState<Order | null>(null);

  const fetchOrders = async () => {
    try {
      const url = selectedStatus === 'ALL' ? '/api/orders' : `/api/orders?status=${selectedStatus}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.orders) setOrders(data.orders);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [selectedStatus]);

  const handleStatusChange = async (orderNumber: string, status: string) => {
    try {
      const res = await fetch(`/api/orders/${orderNumber}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setOrders(orders.map((o) => (o.orderNumber === orderNumber ? { ...o, status: status as any } : o)));
        if (activeOrderModal && activeOrderModal.orderNumber === orderNumber) {
          setActiveOrderModal({ ...activeOrderModal, status: status as any });
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      if (
        !o.orderNumber.toLowerCase().includes(q) &&
        !o.customerName.toLowerCase().includes(q) &&
        !o.customerPhone.includes(q) &&
        !o.governorate.toLowerCase().includes(q)
      ) {
        return false;
      }
    }
    return true;
  });

  const statuses = ['ALL', 'RECEIVED', 'CONFIRMED', 'PREPARING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-4">
          <div>
            <h1 className="font-stencil text-xl sm:text-3xl text-white">CASH ON DELIVERY ORDERS</h1>
            <p className="text-xs text-neutral-400 mt-0.5">
              Fulfill, call customers to confirm, update shipment status, and manage deliveries in Egypt.
            </p>
          </div>
          <span className="self-start sm:self-auto text-xs font-mono bg-neutral-900 border border-neutral-800 text-neutral-300 px-3 py-1.5 rounded-full">
            {filteredOrders.length} Orders
          </span>
        </div>

        {/* Filter Bar with Horizontal Scroll for Status Tabs on Mobile */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-neutral-900/40 border border-neutral-800 space-y-3">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by order #, phone, customer, city..."
              className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 pl-9 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-500 font-mono"
            />
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
          </div>

          {/* Horizontally scrollable status pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            {statuses.map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-3 py-1.5 rounded-lg font-bold flex-shrink-0 transition-colors ${
                  selectedStatus === st
                    ? 'bg-red-600 text-white shadow-md'
                    : 'bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* 1. MOBILE ORDERS CARD VIEW (< 640px) */}
        <div className="space-y-3 sm:hidden">
          {filteredOrders.length === 0 ? (
            <div className="p-8 text-center text-xs text-neutral-500 bg-neutral-900/20 rounded-2xl border border-neutral-850">
              No orders found matching this filter.
            </div>
          ) : (
            filteredOrders.map((ord) => (
              <div
                key={ord.id}
                className="p-4 rounded-2xl bg-neutral-900/50 border border-neutral-800 space-y-3"
              >
                {/* Header row */}
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

                {/* Customer & Call Button */}
                <div className="flex items-center justify-between bg-neutral-950 p-3 rounded-xl border border-neutral-850">
                  <div>
                    <p className="font-bold text-white text-xs">{ord.customerName}</p>
                    <p className="text-[10px] text-neutral-400">
                      {ord.city}, {ord.governorate}
                    </p>
                  </div>
                  <a
                    href={`tel:${ord.customerPhone}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call</span>
                  </a>
                </div>

                {/* Items & Amount */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-neutral-400">
                    {ord.items.reduce((s, i) => s + i.quantity, 0)} items • COD
                  </span>
                  <span className="font-mono font-black text-red-400 text-sm">
                    {formatEGP(ord.totalAmount)}
                  </span>
                </div>

                {/* Actions: Quick Status + View Modal */}
                <div className="pt-2 border-t border-neutral-850 flex items-center justify-between gap-2">
                  <div className="flex-1">
                    <select
                      value={ord.status}
                      onChange={(e) => handleStatusChange(ord.orderNumber, e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-700 text-white text-xs font-semibold rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-red-500"
                    >
                      <option value="RECEIVED">Received</option>
                      <option value="CONFIRMED">Confirmed</option>
                      <option value="PREPARING">Preparing</option>
                      <option value="SHIPPED">Shipped</option>
                      <option value="DELIVERED">Delivered</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </div>

                  <button
                    onClick={() => setActiveOrderModal(ord)}
                    className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Details</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 2. DESKTOP ORDERS TABLE (>= 640px) */}
        <div className="hidden sm:block p-6 rounded-3xl bg-neutral-900/40 border border-neutral-800 overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="bg-neutral-950 text-neutral-400 uppercase text-[10px] tracking-wider border-b border-neutral-800">
              <tr>
                <th className="py-3 px-3">Order #</th>
                <th className="py-3 px-3">Customer & Phone</th>
                <th className="py-3 px-3">Location</th>
                <th className="py-3 px-3">Items</th>
                <th className="py-3 px-3">Total (COD)</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-850">
              {filteredOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-neutral-800/30">
                  <td className="py-3 px-3 font-mono font-bold text-white">{ord.orderNumber}</td>
                  <td className="py-3 px-3">
                    <p className="font-semibold text-white">{ord.customerName}</p>
                    <a
                      href={`tel:${ord.customerPhone}`}
                      className="text-[11px] text-red-400 font-mono hover:underline flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3" />
                      <span>{ord.customerPhone}</span>
                    </a>
                  </td>
                  <td className="py-3 px-3">
                    <p className="font-medium text-white">{ord.governorate}</p>
                    <p className="text-[10px] text-neutral-500 truncate max-w-[140px]">{ord.city}</p>
                  </td>
                  <td className="py-3 px-3 text-neutral-400">
                    {ord.items.reduce((s, i) => s + i.quantity, 0)} pieces
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-red-400">
                    {formatEGP(ord.totalAmount)}
                  </td>
                  <td className="py-3 px-3 text-neutral-500 text-[11px]">
                    {new Date(ord.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-3">
                    <select
                      value={ord.status}
                      onChange={(e) => handleStatusChange(ord.orderNumber, e.target.value)}
                      className={`text-[11px] font-bold rounded-lg px-2 py-1 bg-neutral-950 border focus:outline-none ${
                        ord.status === 'DELIVERED'
                          ? 'border-emerald-500/50 text-emerald-400'
                          : ord.status === 'CANCELLED'
                          ? 'border-red-500/50 text-red-400'
                          : 'border-amber-500/50 text-amber-400'
                      }`}
                    >
                      <option value="RECEIVED">Received</option>
                      <option value="CONFIRMED">Confirmed</option>
                      <option value="PREPARING">Preparing</option>
                      <option value="SHIPPED">Shipped</option>
                      <option value="DELIVERED">Delivered</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => setActiveOrderModal(ord)}
                      className="p-1.5 text-neutral-400 hover:text-white bg-neutral-800 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ORDER DETAILS MODAL (Mobile-Optimized) */}
      {activeOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl sm:rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-y-auto p-4 sm:p-8 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setActiveOrderModal(null)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-neutral-800 gap-1">
              <div>
                <span className="text-[10px] uppercase font-bold text-red-500">
                  Cash on Delivery Order Details
                </span>
                <h2 className="font-mono text-xl sm:text-2xl font-bold text-white">
                  {activeOrderModal.orderNumber}
                </h2>
              </div>
              <span className="text-xs font-mono text-neutral-400">
                {new Date(activeOrderModal.createdAt).toLocaleDateString()}
              </span>
            </div>

            {/* Customer & Shipping Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-850 space-y-1">
                <span className="text-[10px] font-bold text-neutral-400 uppercase">Customer Info</span>
                <p className="font-bold text-white text-sm">{activeOrderModal.customerName}</p>
                <p className="font-mono text-red-400 font-bold">
                  <a href={`tel:${activeOrderModal.customerPhone}`}>📞 {activeOrderModal.customerPhone}</a>
                </p>
                {activeOrderModal.user?.email && (
                  <p className="text-neutral-500 text-[11px] truncate">{activeOrderModal.user.email}</p>
                )}
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-850 space-y-1">
                <span className="text-[10px] font-bold text-neutral-400 uppercase">Delivery Address</span>
                <p className="text-neutral-300">{activeOrderModal.address}</p>
                <p className="text-neutral-400 text-[11px]">
                  Bldg: {activeOrderModal.building || '-'} • Floor: {activeOrderModal.floor || '-'} • Apt: {activeOrderModal.apartment || '-'}
                </p>
                <p className="font-bold text-white">
                  {activeOrderModal.city}, {activeOrderModal.governorate}, Egypt
                </p>
              </div>
            </div>

            {activeOrderModal.notes && (
              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-850 text-xs text-neutral-300">
                <strong>Customer Notes:</strong> "{activeOrderModal.notes}"
              </div>
            )}

            {/* Items */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Ordered Garments</h3>
              <div className="divide-y divide-neutral-850 border border-neutral-850 rounded-2xl p-3 bg-neutral-950">
                {activeOrderModal.items.map((item) => (
                  <div key={item.id} className="py-2 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-white">{item.productName}</p>
                      <p className="text-[10px] text-neutral-400">
                        {item.size} • {item.color} • Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="font-mono font-bold text-white">{formatEGP(item.total)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial summary */}
            <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-850 space-y-1.5 text-xs text-neutral-400">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-mono text-white">{formatEGP(activeOrderModal.subtotal)}</span>
              </div>
              {activeOrderModal.discountAmount > 0 && (
                <div className="flex justify-between text-red-400">
                  <span>Discount:</span>
                  <span className="font-mono">-{formatEGP(activeOrderModal.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping Fee:</span>
                <span className="font-mono text-white">{formatEGP(activeOrderModal.shippingFee)}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-neutral-800">
                <span>Final Total (COD):</span>
                <span className="text-red-500 font-mono text-base">
                  {formatEGP(activeOrderModal.totalAmount)}
                </span>
              </div>
            </div>

            {/* Status Changer */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2 gap-2">
              <span className="text-xs font-bold text-neutral-300">Update Order Status:</span>
              <select
                value={activeOrderModal.status}
                onChange={(e) => handleStatusChange(activeOrderModal.orderNumber, e.target.value)}
                className="w-full sm:w-auto bg-neutral-950 border border-neutral-700 text-white text-xs font-bold rounded-xl px-4 py-2.5"
              >
                <option value="RECEIVED">Order Received</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="PREPARING">Preparing</option>
                <option value="SHIPPED">Shipped</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
