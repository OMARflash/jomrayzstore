'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Send, CheckCircle2, ShieldCheck, MapPin, Truck } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-neutral-950 border-t border-neutral-800 text-neutral-400 text-sm">
      {/* Top Banner / COD highlight */}
      <div className="border-b border-neutral-850 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-neutral-900/40 border border-neutral-800/80">
            <div className="p-3 bg-red-950/60 border border-red-500/20 text-red-400 rounded-lg">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Cash On Delivery Only</h4>
              <p className="text-xs text-neutral-400">Pay cash upon arrival at your doorstep across Egypt.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-neutral-900/40 border border-neutral-800/80">
            <div className="p-3 bg-neutral-800 text-neutral-200 rounded-lg">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">14-Day Easy Exchange</h4>
              <p className="text-xs text-neutral-400">Hassle-free size or item exchanges directly to your door.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-neutral-900/40 border border-neutral-800/80">
            <div className="p-3 bg-neutral-800 text-neutral-200 rounded-lg">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Egyptian Craftsmanship</h4>
              <p className="text-xs text-neutral-400">High GSM Giza combed cotton and bespoke streetwear tailoring.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-stencil text-3xl text-white tracking-tight">JOMRAYZ</span>
            </Link>
            <p className="text-xs leading-relaxed text-neutral-400 max-w-sm">
              Egyptian modern streetwear redefining youth fashion for ages 13–25. Built on heavyweight fabrics, architectural cuts, and a single unified aesthetic for everyone.
            </p>
            <div className="pt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-neutral-300 font-medium">Orders dispatching daily from Cairo</span>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Collection</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/shop" className="hover:text-white transition-colors">
                  Shop All Drops
                </Link>
              </li>
              <li>
                <Link href="/shop?filter=new" className="hover:text-white transition-colors">
                  New Drops
                </Link>
              </li>
              <li>
                <Link href="/shop?filter=bestseller" className="hover:text-white transition-colors">
                  Best Sellers
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="hover:text-white transition-colors">
                  Saved Wishlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service & Policies */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Support</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/track-order" className="hover:text-white transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About JOMRAYZ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  FAQ & Shipping Fees
                </Link>
              </li>
              <li>
                <Link href="/faq#returns" className="hover:text-white transition-colors">
                  Returns & Exchange
                </Link>
              </li>
              <li>
                <Link href="/faq#terms" className="hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/faq#privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter and Social */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Stay Connected</h4>
            <p className="text-xs text-neutral-400 mb-3">
              Subscribe for exclusive drop access, secret discount codes, and launch announcements.
            </p>
            {subscribed ? (
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold py-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>You are on the VIP drop list!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-500"
                  />
                  <button
                    type="submit"
                    className="absolute right-1 top-1 bottom-1 bg-red-600 hover:bg-red-500 text-white px-2.5 rounded text-xs font-bold flex items-center justify-center transition-colors"
                  >
                    <Send className="w-3 h-3" />
                  </button>
                </div>
              </form>
            )}

            {/* TikTok & Social Links */}
            <div className="mt-6 pt-4 border-t border-neutral-850">
              <p className="text-[11px] font-bold text-neutral-300 uppercase mb-2">Follow The Community</p>
              <div className="flex items-center gap-3">
                <Link
                  href="https://www.tiktok.com/@jomrayz_star4"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-xs font-semibold text-white hover:text-red-400 transition-colors"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" />
                  </svg>
                  <span>@jomrayz_star4</span>
                </Link>
                <Link
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-xs font-semibold text-white hover:text-pink-400 transition-colors"
                >
                  Instagram
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} JOMRAYZ Egypt. All rights reserved. Single Unified Collection.</p>
          <p className="flex items-center gap-1">
            <span>Crafted for Egypt's Next Generation</span>
            <span>🇪🇬</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
