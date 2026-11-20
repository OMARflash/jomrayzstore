'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  ShoppingBag,
  Heart,
  MapPin,
  LogOut,
  Truck,
  Package,
  Calendar,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Order } from '@/lib/types';
import { formatEGP } from '@/lib/utils';

export default function AccountPage() {
  const router = useRouter();
  const { user, isLoading, logout, isAdmin } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login');
      return;
    }

    if (user) {
      fetch('/api/orders')
        .then((res) => res.json())
        .then((data) => {
          if (data.orders) setOrders(data.orders);
        })
        .catch(console.error)
        .finally(() => setLoadingOrders(false));
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return <div className="min-h-[60vh] flex items-center justify-center text-white">Loading account...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-neutral-900/40 border border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-red-600/10 border border-red-500/20 text-red-500 flex items-center justify-center font-stencil text-2xl font-black">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-white">{user.name}</h1>
              {isAdmin && (
                <span className="bg-red-500/20 text-red-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  Admin
                </span>
              )}
            </div>
            <p className="text-xs text-neutral-400 font-mono mt-0.5">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isAdmin && (
            <Link
              href="/admin"
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-1.5 transition-colors"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Admin Dashboard</span>
            </Link>
          )}

          <button
            onClick={() => logout()}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Grid: Orders List & Quick Nav */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Orders Stream (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Package className="w-4 h-4 text-red-500" />
              <span>Your Orders & Drops</span>
            </h2>
            <span className="text-xs text-neutral-400 font-mono">{orders.length} Orders</span>
          </div>

          {loadingOrders ? (
            <p className="text-xs text-neutral-500">Loading orders...</p>
          ) : orders.length === 0 ? (
            <div className="p-8 rounded-2xl bg-neutral-900/20 border border-neutral-850 text-center space-y-3">
              <ShoppingBag className="w-8 h-8 text-neutral-600 mx-auto" />
              <p className="text-xs text-neutral-400">You have not placed any orders yet.</p>
              <Link
                href="/shop"
                className="inline-block px-4 py-2 bg-white text-black font-bold text-xs rounded-xl"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="p-5 rounded-2xl bg-neutral-900/30 border border-neutral-800 hover:border-neutral-700 transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-850 text-xs">
                    <div>
                      <span className="font-mono font-bold text-white text-sm">{order.orderNumber}</span>
                      <p className="text-[11px] text-neutral-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="bg-neutral-800 text-neutral-300 text-[10px] px-2 py-0.5 rounded font-bold uppercase">
                        COD
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                          order.status === 'DELIVERED'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : order.status === 'CANCELLED'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Items in Order */}
                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between text-xs">
                        <span className="text-neutral-300 font-medium">
                          {item.quantity}× {item.productName} ({item.size} - {item.color})
                        </span>
                        <span className="font-mono text-white font-bold">{formatEGP(item.total)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Footer with Track CTA */}
                  <div className="pt-3 border-t border-neutral-850 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-neutral-400 text-[11px]">Total: </span>
                      <strong className="text-red-500 font-mono text-sm">
                        {formatEGP(order.totalAmount)}
                      </strong>
                    </div>

                    <Link
                      href={`/track-order?orderNumber=${order.orderNumber}&phone=${order.customerPhone}`}
                      className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 transition-colors"
                    >
                      <Truck className="w-3.5 h-3.5 text-red-500" />
                      <span>Track Order</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Nav & Links (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-6 rounded-3xl bg-neutral-900/40 border border-neutral-800 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Quick Shortcuts</h3>

            <div className="space-y-2 text-xs">
              <Link
                href="/wishlist"
                className="flex items-center justify-between p-3 rounded-xl bg-neutral-950 border border-neutral-850 hover:border-neutral-700 text-neutral-300 hover:text-white transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span>My Saved Wishlist</span>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-600" />
              </Link>

              <Link
                href="/track-order"
                className="flex items-center justify-between p-3 rounded-xl bg-neutral-950 border border-neutral-850 hover:border-neutral-700 text-neutral-300 hover:text-white transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-blue-500" />
                  <span>Track An Egyptian Order</span>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-600" />
              </Link>

              <Link
                href="/faq#returns"
                className="flex items-center justify-between p-3 rounded-xl bg-neutral-950 border border-neutral-850 hover:border-neutral-700 text-neutral-300 hover:text-white transition-colors"
              >
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-emerald-500" />
                  <span>14-Day Exchanges Policy</span>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-600" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
