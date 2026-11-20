'use client';

import React from 'react';
import Link from 'next/link';
import { Truck, ShieldCheck, Flame } from 'lucide-react';

export default function AnnouncementBar() {
  return (
    <div className="bg-neutral-950 text-neutral-300 text-xs py-2 px-4 border-b border-white/10 overflow-hidden relative select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 text-center md:text-left">
        <div className="flex items-center gap-2 mx-auto md:mx-0">
          <span className="inline-flex items-center justify-center bg-red-600/20 text-red-400 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
            Egypt Only
          </span>
          <span className="font-medium text-white/90">
            Cash On Delivery (COD) Available Across All 27 Governorates
          </span>
          <span className="hidden sm:inline text-white/40">|</span>
          <span className="hidden sm:inline text-white/70">
            Free shipping on orders over 2,500 EGP
          </span>
        </div>

        <div className="hidden lg:flex items-center gap-4 text-[11px] text-neutral-400">
          <Link
            href="https://www.tiktok.com/@jomrayz_star4"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors flex items-center gap-1 font-semibold text-neutral-300"
          >
            <span>TikTok:</span>
            <span className="text-red-400 underline decoration-red-500/50">@jomrayz_star4</span>
          </Link>
          <span className="text-white/20">•</span>
          <Link href="/track-order" className="hover:text-white transition-colors">
            Track Order
          </Link>
        </div>
      </div>
    </div>
  );
}
