'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Heart,
  ShoppingBag,
  Zap,
  Truck,
  ShieldCheck,
  Check,
  Star,
  Ruler,
  ChevronDown,
  ChevronUp,
  Share2,
  CheckCircle2,
} from 'lucide-react';
import { Product } from '@/lib/types';
import { formatEGP } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import SizeGuideModal from '@/components/SizeGuideModal';
import ProductCard from '@/components/ProductCard';

interface ProductDetailClientProps {
  product: Product;
  recommendedProducts: Product[];
}

export default function ProductDetailClient({
  product,
  recommendedProducts,
}: ProductDetailClientProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  // Extract unique colors
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
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [shippingOpen, setShippingOpen] = useState(false);
  const [returnsOpen, setReturnsOpen] = useState(false);

  // Review submission state
  const [reviewName, setReviewName] = useState('');
  const [reviewPhone, setReviewPhone] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [reviewsList, setReviewsList] = useState(product.reviews || []);

  const isFavorited = isInWishlist(product.id);

  // Active variant resolution
  const matchingVariants = (product.variants || []).filter((v) => v.colorName === selectedColor);
  const activeVariant =
    matchingVariants.find((v) => v.size === selectedSize) || matchingVariants[0] || product.variants?.[0];

  const currentStock = activeVariant ? activeVariant.stock : 0;
  const isOutOfStock = currentStock <= 0;

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  // Add to Cart
  const handleAddToCart = () => {
    if (isOutOfStock || !activeVariant) return;

    setIsAdding(true);
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

    setTimeout(() => {
      setIsAdding(false);
    }, 600);
  };

  // Buy Now: adds to cart and immediately pushes to /checkout
  const handleBuyNow = () => {
    if (isOutOfStock || !activeVariant) return;

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

    router.push('/checkout');
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewComment) return;

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          authorName: reviewName,
          customerPhone: reviewPhone,
          rating: reviewRating,
          comment: reviewComment,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setReviewsList([data.review, ...reviewsList]);
        setReviewSubmitted(true);
        setReviewName('');
        setReviewComment('');
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-neutral-400">
        <Link href="/" className="hover:text-white transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-white transition-colors">
          Unified Collection
        </Link>
        <span>/</span>
        <span className="text-white font-medium truncate">{product.name}</span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* GALLERY COLUMN (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Hero Photo */}
          <div className="relative aspect-[3/4] w-full bg-neutral-950 rounded-3xl overflow-hidden border border-neutral-800 shadow-2xl">
            <img
              src={product.images?.[activeImageIndex]?.url || product.images?.[0]?.url}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
              {product.isNewDrop && (
                <span className="bg-white text-black text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-lg">
                  New Drop
                </span>
              )}
              {hasDiscount && (
                <span className="bg-red-600 text-white text-xs font-black px-3 py-1 rounded-full shadow-lg">
                  -{discountPercent}% OFF
                </span>
              )}
              {isOutOfStock && (
                <span className="bg-black/90 text-red-400 border border-red-500/40 text-xs font-bold px-3 py-1 rounded-full">
                  OUT OF STOCK
                </span>
              )}
            </div>

            {/* Wishlist Button */}
            <button
              onClick={() => toggleWishlist(product)}
              className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md transition-all ${
                isFavorited
                  ? 'bg-red-600 text-white shadow-xl'
                  : 'bg-black/40 text-neutral-300 hover:text-white hover:bg-black/70'
              }`}
              aria-label="Wishlist"
            >
              <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Thumbnails Row */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={img.id || idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-24 rounded-2xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                    activeImageIndex === idx
                      ? 'border-red-500 scale-105'
                      : 'border-neutral-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* DETAILS & ACTIONS COLUMN (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-red-500 mb-2">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span>Unified Youth Streetwear</span>
            </div>

            <h1 className="font-stencil text-2xl sm:text-4xl text-white tracking-tight leading-tight">
              {product.name}
            </h1>

            {/* Price section */}
            <div className="flex items-baseline gap-3 mt-3">
              <span className="text-3xl font-black text-white">{formatEGP(product.price)}</span>
              {hasDiscount && (
                <span className="text-base text-neutral-500 line-through">
                  {formatEGP(product.originalPrice!)}
                </span>
              )}
            </div>

            <p className="text-xs text-neutral-400 mt-1">
              Inclusive of all taxes. Free delivery across Egypt on orders over 2,500 EGP.
            </p>
          </div>

          {/* COLOR SELECTOR */}
          {uniqueColors.length > 0 && (
            <div className="pt-4 border-t border-neutral-800 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-neutral-300">
                  Color: <span className="text-white">{selectedColor}</span>
                </label>
              </div>
              <div className="flex items-center gap-3">
                {uniqueColors.map((col) => (
                  <button
                    key={col.name}
                    onClick={() => setSelectedColor(col.name)}
                    className={`w-9 h-9 rounded-full border-2 transition-transform ${
                      selectedColor === col.name
                        ? 'border-white scale-110 shadow-lg ring-2 ring-red-500/50'
                        : 'border-neutral-700 opacity-70 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: col.hex }}
                    title={col.name}
                  />
                ))}
              </div>
            </div>
          )}

          {/* SIZE SELECTOR & STOCK NOTICE */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-neutral-300">
                Size: <span className="text-white">{selectedSize}</span>
              </label>

              {/* Size guide trigger */}
              <button
                type="button"
                onClick={() => setIsSizeGuideOpen(true)}
                className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 font-semibold underline underline-offset-4"
              >
                <Ruler className="w-3.5 h-3.5 text-red-400" />
                <span>Size Guide</span>
              </button>
            </div>

            {/* Size Buttons */}
            <div className="grid grid-cols-6 gap-2">
              {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((sz) => {
                const variantMatch = matchingVariants.find((v) => v.size === sz);
                const isAvailable = variantMatch && variantMatch.stock > 0;
                return (
                  <button
                    key={sz}
                    disabled={!isAvailable}
                    onClick={() => setSelectedSize(sz)}
                    className={`py-3 text-xs font-bold rounded-xl border transition-all ${
                      selectedSize === sz
                        ? 'border-white bg-white text-black shadow-lg scale-105'
                        : isAvailable
                        ? 'border-neutral-700 bg-neutral-900 text-neutral-300 hover:border-neutral-500'
                        : 'border-neutral-850 bg-neutral-950 text-neutral-600 line-through cursor-not-allowed'
                    }`}
                  >
                    {sz}
                  </button>
                );
              })}
            </div>

            {/* Stock feedback */}
            <div className="pt-1">
              {isOutOfStock ? (
                <div className="text-xs font-black text-red-500 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  <span>OUT OF STOCK IN THIS SIZE</span>
                </div>
              ) : currentStock < 5 ? (
                <div className="text-xs text-amber-400 font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <span>Only {currentStock} left in stock - order soon!</span>
                </div>
              ) : (
                <div className="text-xs text-emerald-400 font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>In Stock • Ready to dispatch from Cairo</span>
                </div>
              )}
            </div>
          </div>

          {/* QUANTITY & ACTIONS */}
          <div className="space-y-3 pt-2">
            <div className="flex gap-3">
              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock || isAdding}
                className={`flex-1 py-4 px-6 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-xl ${
                  isAdding
                    ? 'bg-emerald-600 text-white'
                    : isOutOfStock
                    ? 'bg-neutral-850 text-neutral-500 cursor-not-allowed'
                    : 'bg-white hover:bg-neutral-200 text-black'
                }`}
              >
                {isAdding ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added To Cart!</span>
                  </>
                ) : isOutOfStock ? (
                  <span>OUT OF STOCK</span>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>ADD TO CART</span>
                  </>
                )}
              </button>

              {/* Buy Now Button (Fast COD Checkout) */}
              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className={`flex-1 py-4 px-6 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-xl ${
                  isOutOfStock
                    ? 'bg-neutral-850 text-neutral-500 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-500 text-white'
                }`}
              >
                <Zap className="w-4 h-4" />
                <span>BUY NOW (COD)</span>
              </button>
            </div>
          </div>

          {/* DESCRIPTION & SPECIFICATIONS */}
          <div className="pt-6 border-t border-neutral-800 space-y-4">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Description</h3>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-light">
                {product.description}
              </p>
            </div>

            {product.material && (
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1">Material & Craft</h4>
                <p className="text-xs text-neutral-400 font-mono">{product.material}</p>
              </div>
            )}

            {product.care && (
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1">Care Guide</h4>
                <p className="text-xs text-neutral-400">{product.care}</p>
              </div>
            )}
          </div>

          {/* ACCORDIONS: SHIPPING & RETURNS */}
          <div className="border-t border-neutral-800 divide-y divide-neutral-800">
            {/* Shipping Accordion */}
            <div className="py-3">
              <button
                onClick={() => setShippingOpen(!shippingOpen)}
                className="w-full flex items-center justify-between text-xs font-bold text-neutral-200 hover:text-white"
              >
                <span className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-red-500" />
                  <span>Egypt Nationwide Shipping & Cash on Delivery</span>
                </span>
                {shippingOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {shippingOpen && (
                <div className="mt-3 text-xs text-neutral-400 space-y-2 leading-relaxed animate-fade-in">
                  <p>
                    • <strong>Cash on Delivery (COD)</strong> is our exclusive payment method. You inspect the parcel and pay the courier cash upon arrival.
                  </p>
                  <p>• Cairo & Giza: 1-2 business days (50 EGP).</p>
                  <p>• Alexandria, Delta & Canal: 2-3 business days (60-70 EGP).</p>
                  <p>• Upper Egypt & Red Sea: 3-5 business days (80-100 EGP).</p>
                  <p>• Orders exceeding 2,500 EGP qualify for <strong>100% Free Shipping</strong>.</p>
                </div>
              )}
            </div>

            {/* Returns Accordion */}
            <div className="py-3">
              <button
                onClick={() => setReturnsOpen(!returnsOpen)}
                className="w-full flex items-center justify-between text-xs font-bold text-neutral-200 hover:text-white"
              >
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>14-Day Doorstep Exchange Policy</span>
                </span>
                {returnsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {returnsOpen && (
                <div className="mt-3 text-xs text-neutral-400 space-y-2 leading-relaxed animate-fade-in">
                  <p>
                    We offer hassle-free size exchanges directly to your doorstep. If your piece does not fit exactly how you like, contact our team or WhatsApp within 14 days of receipt, and a courier will deliver the replacement size to you.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CUSTOMER REVIEWS SECTION */}
      <section className="pt-12 border-t border-neutral-800 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="font-stencil text-2xl sm:text-3xl text-white tracking-tight">
              CUSTOMER REVIEWS
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="text-xs font-bold text-white">5.0 / 5.0</span>
              <span className="text-xs text-neutral-400 font-mono">
                ({reviewsList.length} reviews from verified Egyptian buyers)
              </span>
            </div>
          </div>
        </div>

        {/* Reviews List & Write Review Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Reviews Stream (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {reviewsList.length === 0 ? (
              <p className="text-xs text-neutral-500">No reviews yet. Be the first to review this drop!</p>
            ) : (
              reviewsList.map((rev) => (
                <div
                  key={rev.id}
                  className="p-5 rounded-2xl bg-neutral-900/40 border border-neutral-800 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{rev.authorName}</span>
                      {rev.isVerifiedPurchase && (
                        <span className="inline-flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Verified Purchase</span>
                        </span>
                      )}
                    </div>
                    <div className="flex text-amber-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed">{rev.comment}</p>
                </div>
              ))
            )}
          </div>

          {/* Write A Review Box (5 cols) */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Write A Verified Review
            </h3>
            {reviewSubmitted ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Thank you! Your review has been added.</span>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-3">
                <div>
                  <label className="text-[11px] font-bold text-neutral-400 block mb-1">Your Name</label>
                  <input
                    type="text"
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    required
                    placeholder="e.g. Omar Tarek"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-neutral-400 block mb-1">
                    Phone (To verify your COD order)
                  </label>
                  <input
                    type="text"
                    value={reviewPhone}
                    onChange={(e) => setReviewPhone(e.target.value)}
                    placeholder="e.g. 01012345678"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-neutral-400 block mb-1">Rating</label>
                  <div className="flex gap-1 text-amber-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-5 h-5 ${star <= reviewRating ? 'fill-current' : 'text-neutral-700'}`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-neutral-400 block mb-1">Your Review</label>
                  <textarea
                    rows={3}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    required
                    placeholder="Tell other streetwear enthusiasts about the fit, fabric GSM, and cut..."
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-red-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-white hover:bg-neutral-200 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-colors"
                >
                  Submit Review
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* RECOMMENDED PRODUCTS SECTION */}
      {recommendedProducts.length > 0 && (
        <section className="pt-12 border-t border-neutral-800 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-red-500 uppercase tracking-widest">
                Complete The Look
              </span>
              <h2 className="font-stencil text-2xl sm:text-3xl text-white tracking-tight mt-1">
                RECOMMENDED DROPS
              </h2>
            </div>
            <Link
              href="/shop"
              className="text-xs font-bold text-neutral-400 hover:text-white"
            >
              Shop All Drops →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Size Guide Modal */}
      <SizeGuideModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />
    </div>
  );
}
