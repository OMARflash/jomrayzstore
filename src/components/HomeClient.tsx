'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Sparkles,
  Flame,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Instagram,
  Eye,
  Send,
  Zap,
} from 'lucide-react';
import { Product, Category } from '@/lib/types';
import ProductCard from '@/components/ProductCard';
import QuickViewModal from '@/components/QuickViewModal';

interface HomeClientProps {
  initialProducts: Product[];
  categories: Category[];
}

export default function HomeClient({ initialProducts, categories }: HomeClientProps) {
  const [selectedQuickViewProduct, setSelectedQuickViewProduct] = useState<Product | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const newDrops = initialProducts.filter((p) => p.isNewDrop).slice(0, 4);
  const bestSellers = initialProducts.filter((p) => p.isBestSeller).slice(0, 4);
  const allProducts = initialProducts.slice(0, 8);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <div className="space-y-20 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden bg-neutral-950 border-b border-neutral-850">
        {/* Background Streetwear Editorial Visual */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=2000&q=85"
            alt="JOMRAYZ Streetwear Aesthetic"
            className="w-full h-full object-cover object-center filter brightness-[0.38] contrast-125 transform scale-105 animate-pulse-glow"
          />
          {/* Subtle noise and gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#08080a] via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#08080a]/60 to-[#08080a]" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-12">
          {/* Release Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold mb-6 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span className="tracking-wider uppercase text-[11px]">2026 UNIFIED DROP 01 // CAIRO ATELIER</span>
          </div>

          {/* Brand Name */}
          <h1 className="font-stencil text-5xl sm:text-7xl md:text-9xl text-white tracking-tighter leading-none mb-4 drop-shadow-2xl">
            JOMRAYZ
          </h1>

          {/* Brand Tagline */}
          <p className="text-xl sm:text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-200 to-neutral-400 tracking-wider uppercase mb-6">
            DEFINE YOUR STYLE
          </p>

          {/* Subtext */}
          <p className="max-w-xl mx-auto text-neutral-300 text-sm sm:text-base leading-relaxed mb-8 font-light">
            Engineered heavyweight Egyptian combed cotton meets modern minimalist silhouette. One unified collection curated for ages 13–25.
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/shop"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white hover:bg-neutral-200 text-black font-extrabold text-sm tracking-wider uppercase transition-all shadow-2xl flex items-center justify-center gap-2 group"
            >
              <span>SHOP NOW</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/shop?filter=new"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-neutral-900/80 hover:bg-neutral-800 text-white border border-white/20 font-bold text-sm tracking-wider uppercase backdrop-blur-md transition-all flex items-center justify-center gap-2"
            >
              <span>VIEW NEW DROPS</span>
            </Link>
          </div>

          {/* Quick value flags */}
          <div className="mt-12 pt-8 border-t border-white/10 flex flex-wrap justify-center items-center gap-6 sm:gap-12 text-xs text-neutral-400">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-red-500" />
              <span>Cash on Delivery Only (Egypt)</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>420–460 GSM Heavyweight Fabric</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>14-Day Free Exchange</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. NEW DROPS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-red-500 uppercase tracking-widest mb-1">
              <Flame className="w-4 h-4" />
              <span>Fresh From The Cairo Atelier</span>
            </div>
            <h2 className="font-stencil text-3xl sm:text-4xl text-white tracking-tight">
              NEW DROPS
            </h2>
          </div>
          <Link
            href="/shop?filter=new"
            className="inline-flex items-center gap-2 text-xs font-bold text-neutral-300 hover:text-white group"
          >
            <span>VIEW ALL NEW DROPS</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newDrops.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={(p) => setSelectedQuickViewProduct(p)}
            />
          ))}
        </div>
      </section>

      {/* 3. PROMOTIONAL BANNER SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900 border border-neutral-800 p-8 sm:p-12 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="space-y-4 max-w-xl text-center lg:text-left">
            <span className="inline-block bg-red-600/20 border border-red-500/40 text-red-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
              Limited Drop Offer
            </span>
            <h3 className="text-2xl sm:text-4xl font-stencil text-white tracking-tight">
              GET 10% OFF YOUR FIRST ORDER
            </h3>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Use code <strong className="text-white font-mono bg-neutral-800 px-2 py-0.5 rounded border border-neutral-700">JOMRAYZ10</strong> at checkout. Cash on delivery available directly to your home across all 27 Egyptian governorates.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link
              href="/shop"
              className="px-8 py-4 bg-white hover:bg-neutral-200 text-black font-extrabold text-sm rounded-xl tracking-wider uppercase transition-all shadow-xl"
            >
              CLAIM YOUR DISCOUNT
            </Link>
          </div>
        </div>
      </section>

      {/* 4. BEST SELLERS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-500 uppercase tracking-widest mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Most Wanted Across Egypt</span>
            </div>
            <h2 className="font-stencil text-3xl sm:text-4xl text-white tracking-tight">
              BEST SELLERS
            </h2>
          </div>
          <Link
            href="/shop?filter=bestseller"
            className="inline-flex items-center gap-2 text-xs font-bold text-neutral-300 hover:text-white group"
          >
            <span>VIEW ALL BEST SELLERS</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={(p) => setSelectedQuickViewProduct(p)}
            />
          ))}
        </div>
      </section>

      {/* 5. ALL PRODUCTS SHOWCASE (UNIFIED JOMRAYZ COLLECTION) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-neutral-500">
            One Unified Vision
          </span>
          <h2 className="font-stencil text-3xl sm:text-5xl text-white tracking-tight mt-1 mb-3">
            ALL PRODUCTS
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400">
            No gender division. One complete streetwear aesthetic engineered for individuality and self-expression.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {allProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={(p) => setSelectedQuickViewProduct(p)}
            />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-xl bg-neutral-900 hover:bg-neutral-850 text-white border border-neutral-700 hover:border-neutral-500 font-extrabold text-sm tracking-wider uppercase transition-all shadow-xl"
          >
            <span>SHOP ALL</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 6. ABOUT JOMRAYZ SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-neutral-900/40 border border-neutral-800 rounded-3xl p-8 sm:p-12 lg:p-16">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-red-500">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span>The JOMRAYZ Narrative</span>
            </div>

            <h2 className="font-stencil text-3xl sm:text-5xl text-white tracking-tight leading-tight">
              EGYPTIAN RAW STREETWEAR FOR THE NEW ERA
            </h2>

            <div className="space-y-4 text-xs sm:text-sm text-neutral-300 leading-relaxed font-light">
              <p>
                Born in Cairo, <strong>JOMRAYZ</strong> was founded with a singular conviction: Egyptian youth deserve streetwear of uncompromising global luxury quality, crafted directly on our own soil.
              </p>
              <p>
                We reject standard fast-fashion templates. Our silhouettes are architectural, boxy, and unisex—designed as <strong>one unified collection</strong> for the 13–25 generation who define their own aesthetic boundaries.
              </p>
              <p>
                Every piece is spun from heavyweight Egyptian combed cotton (420–460 GSM), double-stitched for enduring drape, and shipped exclusively via <strong>Cash On Delivery</strong> to your doorstep anywhere in Egypt.
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider underline underline-offset-8 hover:text-red-400 transition-colors"
              >
                <span>Read Full Brand Story</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-800">
            <img
              src="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1000&q=80"
              alt="JOMRAYZ Brand Culture"
              className="w-full h-full object-cover filter contrast-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
              <div>
                <p className="font-stencil text-xl text-white">CAIRO • 2026</p>
                <p className="text-xs text-neutral-400">Crafted without boundaries</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. TIKTOK COMMUNITY SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-neutral-950 border border-neutral-800 p-8 sm:p-12 text-center">
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto text-white shadow-xl">
              <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" />
              </svg>
            </div>

            <p className="text-xs font-bold text-red-500 uppercase tracking-widest">
              Follow JOMRAYZ
            </p>

            <h2 className="font-stencil text-4xl sm:text-5xl text-white tracking-tight">
              @jomrayz_star4
            </h2>

            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-lg mx-auto">
              Join thousands of streetwear enthusiasts across Egypt. Watch styling guides, behind-the-scenes cutting in Cairo mills, and drop announcements first.
            </p>

            <div className="pt-2">
              <Link
                href="https://www.tiktok.com/@jomrayz_star4"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-extrabold text-sm tracking-wider uppercase transition-all shadow-xl"
              >
                <span>OPEN OFFICIAL TIKTOK</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 8. NEWSLETTER SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-neutral-900/60 border border-neutral-800 p-8 sm:p-12 text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-neutral-500">
            Never Miss A Limited Drop
          </span>
          <h3 className="font-stencil text-2xl sm:text-4xl text-white tracking-tight mt-1 mb-3">
            SUBSCRIBE TO JOMRAYZ
          </h3>
          <p className="text-xs sm:text-sm text-neutral-400 mb-6">
            Get instant SMS and email notifications when new drops, secret discount vouchers, and restocks go live.
          </p>

          {newsletterSubscribed ? (
            <div className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>You are now subscribed to the official JOMRAYZ Drop Bulletin!</span>
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="flex-1 bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-500"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-white hover:bg-neutral-200 text-black font-extrabold text-xs uppercase tracking-wider transition-colors"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Quick View Modal */}
      <QuickViewModal
        product={selectedQuickViewProduct}
        onClose={() => setSelectedQuickViewProduct(null)}
      />
    </div>
  );
}
