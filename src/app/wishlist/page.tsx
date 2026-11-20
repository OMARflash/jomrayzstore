'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { formatEGP } from '@/lib/utils';
import ProductCard from '@/components/ProductCard';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, moveToCart } = useWishlist();

  if (wishlist.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto text-neutral-500 shadow-xl">
          <Heart className="w-10 h-10" />
        </div>
        <div>
          <h1 className="font-stencil text-3xl sm:text-4xl text-white">YOUR WISHLIST IS EMPTY</h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-2 max-w-sm mx-auto">
            Save your favorite hoodies, tees, and streetwear pieces to keep track of new drops.
          </p>
        </div>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-neutral-200 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xl"
        >
          <span>Explore Collection</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-neutral-800 pb-4 flex items-center justify-between">
        <div>
          <h1 className="font-stencil text-3xl sm:text-4xl text-white">YOUR WISHLIST</h1>
          <p className="text-xs text-neutral-400 mt-1">
            Saved pieces from the unified JOMRAYZ streetwear collection.
          </p>
        </div>
        <span className="text-xs font-mono bg-neutral-900 border border-neutral-800 text-neutral-300 px-3 py-1.5 rounded-full">
          {wishlist.length} Items Saved
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {wishlist.map((product) => (
          <div key={product.id} className="flex flex-col space-y-3">
            <ProductCard product={product} />
            <button
              onClick={() => moveToCart(product)}
              className="w-full py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Move To Cart</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
