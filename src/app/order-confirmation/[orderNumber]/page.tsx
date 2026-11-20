import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CheckCircle2, Truck, Banknote, ArrowRight, PackageCheck, MapPin } from 'lucide-react';
import prisma from '@/lib/prisma';
import { formatEGP } from '@/lib/utils';

interface OrderConfirmationPageProps {
  params: { orderNumber: string };
}

export default async function OrderConfirmationPage({ params }: OrderConfirmationPageProps) {
  const { orderNumber } = params;

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: {
      items: {
        include: {
          product: {
            include: { images: true },
          },
        },
      },
    },
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Success Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-neutral-900/50 border border-neutral-800 text-center space-y-4 shadow-2xl">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-lg">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <h1 className="font-stencil text-3xl sm:text-5xl text-white tracking-tight">
          THANK YOU FOR YOUR ORDER.
        </h1>

        <p className="text-xs sm:text-sm text-neutral-300 max-w-lg mx-auto leading-relaxed">
          Your order has been received and is being prepared in our Cairo workshop. You will pay purely via <strong>Cash On Delivery</strong> when the courier arrives.
        </p>

        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-neutral-950 border border-neutral-800 text-xs">
          <span className="text-neutral-400">Order Reference:</span>
          <span className="font-mono font-bold text-white tracking-wider">{order.orderNumber}</span>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customer & Shipping Details */}
        <div className="p-6 rounded-3xl bg-neutral-900/30 border border-neutral-800 space-y-4">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <MapPin className="w-4 h-4 text-red-500" />
            <span>Delivery Destination</span>
          </h2>
          <div className="space-y-1.5 text-xs text-neutral-300 font-light">
            <p className="font-bold text-white text-sm">{order.customerName}</p>
            <p className="font-mono text-neutral-400">{order.customerPhone}</p>
            <p>{order.address}</p>
            {(order.building || order.floor || order.apartment) && (
              <p className="text-neutral-400">
                Building: {order.building || '-'} • Floor: {order.floor || '-'} • Apt: {order.apartment || '-'}
              </p>
            )}
            <p className="font-semibold text-white">
              {order.city}, {order.governorate}, Egypt
            </p>
            {order.notes && (
              <p className="pt-2 text-neutral-400 italic">Notes: "{order.notes}"</p>
            )}
          </div>
        </div>

        {/* Payment & Status Details */}
        <div className="p-6 rounded-3xl bg-neutral-900/30 border border-neutral-800 space-y-4">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Banknote className="w-4 h-4 text-emerald-500" />
            <span>Payment & Status</span>
          </h2>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-neutral-800">
              <span className="text-neutral-400">Payment Method:</span>
              <span className="font-bold text-white">Cash on Delivery (COD)</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-neutral-800">
              <span className="text-neutral-400">Current Status:</span>
              <span className="bg-red-500/10 text-red-400 border border-red-500/30 font-bold px-2.5 py-0.5 rounded-full text-[11px] uppercase">
                {order.status}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-400">Estimated Delivery:</span>
              <span className="text-white font-medium">1 - 3 Business Days</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ordered Products Breakdown */}
      <div className="p-6 sm:p-8 rounded-3xl bg-neutral-900/30 border border-neutral-800 space-y-6">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <PackageCheck className="w-4 h-4 text-red-500" />
          <span>Ordered Pieces</span>
        </h2>

        <div className="divide-y divide-neutral-800">
          {order.items.map((item) => (
            <div key={item.id} className="py-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={item.product?.images?.[0]?.url || 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=400&q=80'}
                  alt=""
                  className="w-14 h-18 object-cover rounded-xl bg-neutral-950 flex-shrink-0"
                />
                <div>
                  <h3 className="text-xs font-bold text-white">{item.productName}</h3>
                  <p className="text-[11px] text-neutral-400">
                    Size: {item.size} • Color: {item.color}
                  </p>
                  <p className="text-[11px] text-neutral-500 font-mono">
                    Qty: {item.quantity} × {formatEGP(item.price)}
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-white">
                {formatEGP(item.total)}
              </span>
            </div>
          ))}
        </div>

        {/* Pricing Summary */}
        <div className="pt-4 border-t border-neutral-800 space-y-2 text-xs text-neutral-400">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span className="text-white font-mono">{formatEGP(order.subtotal)}</span>
          </div>
          {order.discountAmount > 0 && (
            <div className="flex justify-between text-red-400">
              <span>Coupon Discount:</span>
              <span className="font-mono">-{formatEGP(order.discountAmount)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Shipping ({order.governorate}):</span>
            <span className="text-white font-mono">
              {order.shippingFee === 0 ? 'FREE' : formatEGP(order.shippingFee)}
            </span>
          </div>
          <div className="flex justify-between text-base font-black text-white pt-4 border-t border-neutral-800">
            <span>Final Total (Due in Cash to Courier):</span>
            <span className="text-red-500 font-mono text-xl">{formatEGP(order.totalAmount)}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <Link
          href={`/track-order?orderNumber=${order.orderNumber}&phone=${order.customerPhone}`}
          className="w-full sm:w-auto px-8 py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-700 text-xs font-bold rounded-xl flex items-center justify-center gap-2"
        >
          <Truck className="w-4 h-4 text-red-500" />
          <span>Track Order Status</span>
        </Link>

        <Link
          href="/shop"
          className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-neutral-200 text-black text-xs font-black rounded-xl uppercase tracking-wider flex items-center justify-center gap-2"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
