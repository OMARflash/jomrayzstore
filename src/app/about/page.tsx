import React from 'react';
import Link from 'next/link';
import { ArrowRight, Flame, ShieldCheck, Truck, Sparkles } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {/* Hero Header */}
      <div className="text-center space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-red-500">
          The JOMRAYZ Manifesto
        </span>
        <h1 className="font-stencil text-4xl sm:text-6xl text-white tracking-tight">
          DEFINE YOUR STYLE
        </h1>
        <p className="text-sm sm:text-base text-neutral-400 max-w-xl mx-auto leading-relaxed">
          Modern Egyptian youth fashion crafted without compromise. One unified collection for the 13–25 generation.
        </p>
      </div>

      {/* Editorial Visual */}
      <div className="relative aspect-[21/9] rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-800 shadow-2xl">
        <img
          src="https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1600&q=80"
          alt="JOMRAYZ Studio"
          className="w-full h-full object-cover filter contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-8">
          <p className="font-stencil text-xl text-white tracking-wide">CAIRO • EGYPT</p>
        </div>
      </div>

      {/* Narrative Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-neutral-300 leading-relaxed text-sm">
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white font-stencil tracking-wider">
            1. BORN IN CAIRO
          </h2>
          <p>
            Egypt possesses the finest long-staple cotton in the world, yet Egyptian youth have historically looked to foreign streetwear labels for cutting-edge silhouettes.
          </p>
          <p>
            <strong>JOMRAYZ</strong> was founded in Cairo to challenge that reality. We craft streetwear with heavy GSM (420–460 GSM), double-washed fabrics, and intentional architectural drape—priced honestly between <strong>1,000 and 1,500 EGP</strong>.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white font-stencil tracking-wider">
            2. ONE UNIFIED COLLECTION
          </h2>
          <p>
            Style has no gender boundary. We reject archaic divisions into men’s and women’s departments. Every drop in the JOMRAYZ catalogue is engineered as <strong>one complete, unified collection</strong>.
          </p>
          <p>
            Whether boxy oversized hoodies, parachute cargo pants, or drop-shoulder tees, our pieces adapt effortlessly to any individual expressing their personal identity.
          </p>
        </div>
      </div>

      {/* Values Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
        <div className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800 space-y-2">
          <Truck className="w-6 h-6 text-red-500" />
          <h3 className="font-bold text-white text-sm">Cash On Delivery Only</h3>
          <p className="text-xs text-neutral-400">
            Convenient, trusted cash payments upon parcel arrival in all 27 Egyptian governorates.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800 space-y-2">
          <Flame className="w-6 h-6 text-amber-500" />
          <h3 className="font-bold text-white text-sm">Heavyweight Egyptian Cotton</h3>
          <p className="text-xs text-neutral-400">
            Durable 420–460 GSM combed cotton that maintains its shape wash after wash.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800 space-y-2">
          <ShieldCheck className="w-6 h-6 text-emerald-500" />
          <h3 className="font-bold text-white text-sm">14-Day Free Exchange</h3>
          <p className="text-xs text-neutral-400">
            Doorstep size and style exchanges across Cairo, Giza, Alexandria, and nationwide.
          </p>
        </div>
      </div>

      {/* Community CTA */}
      <div className="p-8 sm:p-12 rounded-3xl bg-neutral-900/60 border border-neutral-800 text-center space-y-4">
        <h3 className="font-stencil text-2xl sm:text-3xl text-white">
          JOIN OUR TIKTOK COMMUNITY
        </h3>
        <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto">
          Follow <strong>@jomrayz_star4</strong> for live drop showcases, behind-the-scenes cutting, and community style battles.
        </p>
        <div className="pt-2">
          <Link
            href="https://www.tiktok.com/@jomrayz_star4"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-black font-extrabold text-xs uppercase tracking-wider rounded-xl hover:bg-neutral-200 transition-colors"
          >
            <span>Follow @jomrayz_star4</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
