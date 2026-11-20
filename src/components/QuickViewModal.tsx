'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { X, Heart, ShoppingBag, Check, Truck, ShieldCheck } from 'lucide-react';
import { Product } from '@/lib/types';
import { formatEGP } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  if (!product) return null;

  const { addToCart, setIsCartOpen } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  // Find unique colors
  const uniqueColors: Array<{ name: string; hex: string }> = [];
  const colorMap = new Set<string>();
  for (const v of product.variants || []) {
    if (!colorMap.has(v.colorName)) {
      colorMap.add(v.colorName);
      uniqueColors.push({ name: v.colorName, hex: v.colorHex });
    }
  }

  const [selectedColor, setSelectedColor] = useState<string>(
    uniqueColors[0]?.name || product.variants?.[0]?.colorName || ''
  );
  const [selectedSize, setSelectedSize] = useState<string>(
    product.variants?.[0]?.size || 'M'
  );
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isAdded, setIsAdded] = useState(false);

  // Filter variants matching selected color
  const availableVariants = product.variants.filter((v) => v.colorName === selectedColor);
  const activeVariant = availableVariants.find((v) => v.size === selectedSize) || availableVariants[0];
  const maxStock = activeVariant?.stock || 0;
  const isOutOfStock = maxStock <= 0;

  const isFavorited = isInWishlist(product.id);
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;

  const handleAddToCart = () => {
    if (!activeVariant || isOutOfStock) return;

    addToCart({
      productId: product.id,
      variantId: activeVariant.id,
      name: product.name,
      slug: product.slug,
      image: product.images?.[0]?.url || '',
      price: product.price,
      size: activeVariant.size,
      color: activeVariant.colorName,
      quantity,
      maxStock: activeVariant.stock,
    });

    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-neutral-400 hover:text-white bg-black/40 hover:bg-black/80 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Gallery Column */}
        <div className="md:w-1/2 bg-neutral-950 p-4 flex flex-col justify-between">
          <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-neutral-900">
            <img
              src={product.images?.[activeImageIndex]?.url || product.images?.[0]?.url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={img.id || idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-14 h-16 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${
                    activeImageIndex === idx ? 'border-red-500' : 'border-neutral-800 opacity-60'
                  }`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info Column */}
        <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-red-500">
                Unified Collection
              </span>
              <h2 className="text-xl font-bold text-white mt-1">{product.name}</h2>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-2xl font-black text-white">{formatEGP(product.price)}</span>
                {hasDiscount && (
                  <span className="text-sm text-neutral-500 line-through">
                    {formatEGP(product.originalPrice!)}
                  </span>
                )}
              </div>
            </div>

            {/* Color Selection */}
            {uniqueColors.length > 0 && (
              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-2">
                  Color: <span className="text-white font-bold">{selectedColor}</span>
                </label>
                <div className="flex gap-2">
                  {uniqueColors.map((col) => (
                    <button
                      key={col.name}
                      onClick={() => {
                        setSelectedColor(col.name);
                      }}
                      className={`w-8 h-8 rounded-full border-2 transition-transform ${
                        selectedColor === col.name
                          ? 'border-white scale-110 shadow-lg'
                          : 'border-neutral-700 opacity-70'
                      }`}
                      style={{ backgroundColor: col.hex }}
                      title={col.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-neutral-300">
                  Size: <span className="text-white font-bold">{selectedSize}</span>
                </label>
                <span className="text-[11px] text-neutral-400">
                  {isOutOfStock ? (
                    <span className="text-red-400 font-bold">Out of stock</span>
                  ) : (
                    <span className="text-emerald-400 font-medium">{maxStock} available</span>
                  )}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((sz) => {
                  const match = availableVariants.find((v) => v.size === sz);
                  const isAvailable = match && match.stock > 0;
                  return (
                    <button
                      key={sz}
                      disabled={!isAvailable}
                      onClick={() => setSelectedSize(sz)}
                      className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                        selectedSize === sz
                          ? 'border-white bg-white text-black'
                          : isAvailable
                          ? 'border-neutral-700 bg-neutral-800 text-neutral-300 hover:border-neutral-500'
                          : 'border-neutral-850 bg-neutral-950 text-neutral-600 line-through cursor-not-allowed'
                      }`}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Description Snippet */}
            <p className="text-xs text-neutral-400 leading-relaxed line-clamp-2">
              {product.description}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-6 space-y-3">
            <div className="flex gap-2">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock || isAdded}
                className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                  isAdded
                    ? 'bg-emerald-600 text-white'
                    : isOutOfStock
                    ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                    : 'bg-white hover:bg-neutral-200 text-black'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Cart</span>
                  </>
                ) : isOutOfStock ? (
                  <span>Out Of Stock</span>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>

              <button
                onClick={() => toggleWishlist(product)}
                className={`p-3 rounded-xl border transition-colors ${
                  isFavorited
                    ? 'bg-red-600/20 border-red-500 text-red-500'
                    : 'bg-neutral-800 border-neutral-700 text-neutral-300 hover:text-white'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
              </button>
            </div>

            <Link
              href={`/product/${product.slug}`}
              onClick={onClose}
              className="block text-center text-xs text-neutral-400 hover:text-white underline underline-offset-4"
            >
              View Full Product Details & Size Guide →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
