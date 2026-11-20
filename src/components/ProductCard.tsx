'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Eye, ShoppingBag, Check } from 'lucide-react';
import { Product } from '@/lib/types';
import { formatEGP } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export default function ProductCard({ product, onQuickView }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [showSizeDropdown, setShowSizeDropdown] = useState(false);

  // Derive unique colors and sizes
  const uniqueColors: Array<{ name: string; hex: string }> = [];
  const colorMap = new Set<string>();
  for (const v of product.variants || []) {
    if (!colorMap.has(v.colorName)) {
      colorMap.add(v.colorName);
      uniqueColors.push({ name: v.colorName, hex: v.colorHex });
    }
  }

  const isFavorited = isInWishlist(product.id);
  const totalStock = (product.variants || []).reduce((acc, v) => acc + v.stock, 0);
  const isOutOfStock = totalStock <= 0;

  // Primary and secondary images
  const primaryImage = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80';
  const secondaryImage = product.images?.[1]?.url || primaryImage;

  // Discount calculation
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  const handleDirectAdd = (variantId?: string, size?: string, color?: string) => {
    if (isOutOfStock) return;

    // Pick first in-stock variant if not chosen
    const variant = variantId
      ? product.variants.find((v) => v.id === variantId)
      : product.variants.find((v) => v.stock > 0) || product.variants[0];

    if (!variant) return;

    setIsAdding(true);
    addToCart({
      productId: product.id,
      variantId: variant.id,
      name: product.name,
      slug: product.slug,
      image: primaryImage,
      price: product.price,
      size: variant.size,
      color: variant.colorName,
      quantity: 1,
      maxStock: variant.stock,
    });

    setTimeout(() => {
      setIsAdding(false);
      setShowSizeDropdown(false);
    }, 600);
  };

  return (
    <div className="group relative flex flex-col rounded-2xl bg-neutral-900/40 border border-neutral-800/80 hover:border-neutral-700/80 transition-all duration-300 overflow-hidden">
      {/* Product Image Area */}
      <div className="relative aspect-[3/4] w-full bg-neutral-950 overflow-hidden">
        <Link href={`/product/${product.slug}`} className="block w-full h-full">
          <img
            src={primaryImage}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.isNewDrop && (
            <span className="bg-white text-black text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-lg">
              New Drop
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-red-600 text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-lg">
              Best Seller
            </span>
          )}
          {hasDiscount && (
            <span className="bg-neutral-800 text-red-400 border border-red-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg">
              -{discountPercent}%
            </span>
          )}
          {isOutOfStock && (
            <span className="bg-neutral-900/90 text-neutral-400 border border-neutral-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
              Out Of Stock
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-200 z-10 ${
            isFavorited
              ? 'bg-red-600 text-white shadow-lg'
              : 'bg-black/40 text-neutral-300 hover:text-white hover:bg-black/60'
          }`}
          aria-label="Wishlist"
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View Button on Hover */}
        <div className="absolute inset-x-3 bottom-3 hidden sm:flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          {onQuickView && (
            <button
              onClick={() => onQuickView(product)}
              className="flex-1 bg-neutral-900/90 hover:bg-neutral-800 text-white text-xs font-semibold py-2 px-3 rounded-xl backdrop-blur-md border border-white/10 flex items-center justify-center gap-1.5 transition-all shadow-xl"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Quick View</span>
            </button>
          )}

          {!isOutOfStock && (
            <button
              onClick={() => setShowSizeDropdown(!showSizeDropdown)}
              disabled={isAdding}
              className="flex-1 bg-white hover:bg-neutral-200 text-black text-xs font-bold py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xl"
            >
              {isAdding ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add To Cart</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Quick Size Selector Dropdown Overlay */}
        {showSizeDropdown && (
          <div className="absolute inset-x-2 bottom-2 bg-neutral-900/95 border border-neutral-700 p-3 rounded-xl backdrop-blur-lg z-20 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider">
                Select Size
              </span>
              <button
                onClick={() => setShowSizeDropdown(false)}
                className="text-[10px] text-neutral-400 hover:text-white"
              >
                Cancel
              </button>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  disabled={v.stock <= 0}
                  onClick={() => handleDirectAdd(v.id, v.size, v.colorName)}
                  className={`py-1.5 text-xs font-bold rounded-lg border transition-all ${
                    v.stock > 0
                      ? 'border-neutral-700 hover:border-white bg-neutral-800 text-white hover:bg-neutral-700'
                      : 'border-neutral-850 bg-neutral-950 text-neutral-600 cursor-not-allowed line-through'
                  }`}
                >
                  {v.size}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Product Details Section */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Color Dots */}
          {uniqueColors.length > 0 && (
            <div className="flex items-center gap-1.5 mb-2">
              {uniqueColors.map((col, idx) => (
                <span
                  key={col.name}
                  title={col.name}
                  className={`w-3 h-3 rounded-full border ${
                    selectedColorIndex === idx ? 'border-white scale-110' : 'border-neutral-700'
                  }`}
                  style={{ backgroundColor: col.hex }}
                />
              ))}
              <span className="text-[10px] text-neutral-500 ml-1">
                {uniqueColors.length} {uniqueColors.length === 1 ? 'color' : 'colors'}
              </span>
            </div>
          )}

          {/* Name */}
          <Link href={`/product/${product.slug}`} className="block">
            <h3 className="font-semibold text-sm text-neutral-200 hover:text-white transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>

          {/* Egyptian Streetwear Material Hint */}
          {product.material && (
            <p className="text-[11px] text-neutral-500 line-clamp-1 mt-0.5">
              {product.material.split('(')[0]}
            </p>
          )}
        </div>

        {/* Pricing */}
        <div className="pt-2 border-t border-neutral-800/60 flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-extrabold text-white">
              {formatEGP(product.price)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-neutral-500 line-through">
                {formatEGP(product.originalPrice!)}
              </span>
            )}
          </div>

          {/* Mobile direct button */}
          <div className="sm:hidden">
            <button
              onClick={() => setShowSizeDropdown(!showSizeDropdown)}
              disabled={isOutOfStock}
              className="p-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg"
              aria-label="Add"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
