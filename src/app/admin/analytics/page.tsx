'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { BarChart3, TrendingUp, MapPin, DollarSign, ShoppingCart, Users } from 'lucide-react';
import { formatEGP } from '@/lib/utils';

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <AdminLayout>
        <div className="text-white text-xs sm:text-sm">Loading analytics...</div>
      </AdminLayout>
    );
  }

  const { stats, bestSellers, governorateDistribution } = data;

  return (
    <AdminLayout>
      <div className="space-y-6 sm:space-y-8">
        <div className="border-b border-neutral-800 pb-4">
          <h1 className="font-stencil text-xl sm:text-3xl text-white">STORE ANALYTICS & INSIGHTS</h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Conversion metrics, governorate distribution across Egypt, and revenue performance.
          </p>
        </div>

        {/* Highlight Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6">
          <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-neutral-900/40 border border-neutral-800 space-y-1.5 sm:space-y-2">
            <span className="text-[10px] sm:text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
              Total COD Revenue
            </span>
            <p className="text-xl sm:text-3xl font-black text-emerald-400 font-mono">
              {formatEGP(stats.totalSales)}
            </p>
            <p className="text-[10px] text-neutral-500">Collected and confirmed shipments</p>
          </div>

          <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-neutral-900/40 border border-neutral-800 space-y-1.5 sm:space-y-2">
            <span className="text-[10px] sm:text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
              Average Order Value (AOV)
            </span>
            <p className="text-xl sm:text-3xl font-black text-white font-mono">
              {formatEGP(stats.averageOrderValue)}
            </p>
            <p className="text-[10px] text-neutral-500">Basket size across 13–25 demographic</p>
          </div>

          <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-neutral-900/40 border border-neutral-800 space-y-1.5 sm:space-y-2">
            <span className="text-[10px] sm:text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
              Delivery Completion Rate
            </span>
            <p className="text-xl sm:text-3xl font-black text-blue-400 font-mono">
              {stats.totalOrders > 0
                ? Math.round(
                    (stats.deliveredOrders / (stats.totalOrders - stats.cancelledOrders || 1)) * 100
                  )
                : 100}
              %
            </p>
            <p className="text-[10px] text-neutral-500">Low cancellation rate in Egypt</p>
          </div>
        </div>

        {/* Governorates Distribution & Best Sellers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Egyptian Governorates breakdown */}
          <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-neutral-900/40 border border-neutral-800 space-y-3 sm:space-y-4">
            <h2 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-red-500" />
              <span>Orders By Egyptian Governorate</span>
            </h2>

            <div className="space-y-3">
              {Object.entries(governorateDistribution || {}).map(([gov, count]: any) => (
                <div key={gov} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-white">{gov}</span>
                    <span className="font-mono text-neutral-400">{count} orders</span>
                  </div>
                  <div className="w-full bg-neutral-950 h-2 rounded-full overflow-hidden border border-neutral-800">
                    <div
                      className="bg-red-500 h-full rounded-full"
                      style={{
                        width: `${Math.min(100, (count / (stats.totalOrders || 1)) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
              {Object.keys(governorateDistribution || {}).length === 0 && (
                <p className="text-xs text-neutral-500">No regional data yet.</p>
              )}
            </div>
          </div>

          {/* Top Selling Unified Garments */}
          <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-neutral-900/40 border border-neutral-800 space-y-3 sm:space-y-4">
            <h2 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Top Revenue Streetwear Drops</span>
            </h2>

            <div className="space-y-2.5">
              {bestSellers.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-neutral-950 border border-neutral-850 flex items-center justify-between text-xs"
                >
                  <div className="min-w-0 pr-2">
                    <span className="text-[9px] font-mono text-neutral-500 font-bold block">
                      RANK #{idx + 1}
                    </span>
                    <p className="font-bold text-white text-xs sm:text-sm truncate">{item.product.name}</p>
                    <p className="text-[10px] text-neutral-400 mt-0.5">
                      {item.totalSold} items ordered
                    </p>
                  </div>
                  <span className="font-mono font-black text-emerald-400 text-xs sm:text-sm flex-shrink-0">
                    {formatEGP(item.revenue)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
