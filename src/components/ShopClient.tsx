'use client';

import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Filter,
  SlidersHorizontal,
  X,
  Search,
  Check,
  RotateCcw,
  ShoppingBag,
} from 'lucide-react';
import { Product, Category } from '@/lib/types';
import ProductCard from '@/components/ProductCard';
import QuickViewModal from '@/components/QuickViewModal';
import { formatEGP } from '@/lib/utils';

interface ShopClientProps {
  initialProducts: Product[];
  categories: Category[];
}

export default function ShopClient({ initialProducts, categories }: ShopClientProps) {
  const searchParams = useSearchParams();

  // URL query params initialization
  const initialCategory = searchParams.get('category') || 'all';
  const initialSearch = searchParams.get('search') || '';
  const featureFilter = searchParams.get('filter') || '';

  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [selectedColor, setSelectedColor] = useState<string>('all');
  const [minPrice, setMinPrice] = useState<number>(1000);
  const [maxPrice, setMaxPrice] = useState<number>(1500);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<string>(
    featureFilter === 'bestseller' ? 'bestselling' : 'newest'
  );
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Extract all distinct colors and sizes from products
  const { allSizes, allColors } = useMemo(() => {
    const sizeSet = new Set<string>();
    const colorSet = new Set<string>();

    for (const p of initialProducts) {
      for (const v of p.variants || []) {
        if (v.size) sizeSet.add(v.size);
        if (v.colorName) colorSet.add(v.colorName);
      }
    }

    return {
      allSizes: Array.from(sizeSet),
      allColors: Array.from(colorSet),
    };
  }, [initialProducts]);

  // Client-side instant filtering & sorting
  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      if (featureFilter === 'new' && !product.isNewDrop) return false;
      if (featureFilter === 'bestseller' && !product.isBestSeller) return false;

      // 1. Search query
      if (search.trim()) {
        const query = search.toLowerCase().trim();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        const matchesMaterial = product.material?.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesMaterial) return false;
      }

      // 2. Category
      if (selectedCategory !== 'all') {
        if (product.category?.slug !== selectedCategory) return false;
      }

      // 3. Size
      if (selectedSize !== 'all') {
        const hasSize = product.variants?.some((v) => v.size === selectedSize && v.stock > 0);
        if (!hasSize) return false;
      }

      // 4. Color
      if (selectedColor !== 'all') {
        const hasColor = product.variants?.some((v) => v.colorName === selectedColor);
        if (!hasColor) return false;
      }

      // 5. Price
      if (product.price < minPrice || product.price > maxPrice) {
        return false;
      }

      // 6. In stock
      if (inStockOnly) {
        const totalStock = (product.variants || []).reduce((acc, v) => acc + v.stock, 0);
        if (totalStock <= 0) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') {
        return a.price - b.price;
      }
      if (sortBy === 'price-high') {
        return b.price - a.price;
      }
      if (sortBy === 'bestselling') {
        return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
      }
      // default: newest
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });
  }, [
    initialProducts,
    featureFilter,
    search,
    selectedCategory,
    selectedSize,
    selectedColor,
    minPrice,
    maxPrice,
    inStockOnly,
    sortBy,
  ]);

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    setSelectedSize('all');
    setSelectedColor('all');
    setMinPrice(1000);
    setMaxPrice(1500);
    setInStockOnly(false);
    setSortBy('newest');
  };

  const hasActiveFilters =
    search !== '' ||
    selectedCategory !== 'all' ||
    selectedSize !== 'all' ||
    selectedColor !== 'all' ||
    minPrice > 1000 ||
    maxPrice < 1500 ||
    inStockOnly;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header Banner */}
      <div className="mb-10 text-center sm:text-left border-b border-neutral-800 pb-8">
        <div className="flex items-center gap-2 text-xs font-bold text-red-500 uppercase tracking-widest mb-1">
          <span>Unified Streetwear Collection</span>
          <span>•</span>
          <span>Egypt Only</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
          <div>
            <h1 className="font-stencil text-3xl sm:text-5xl text-white tracking-tight">
              THE JOMRAYZ SHOP
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1">
              One unified aesthetic. Heavyweight Egyptian cotton engineered for ages 13–25.
            </p>
          </div>
          <span className="text-xs text-neutral-400 font-mono">
            Showing <strong className="text-white">{filteredProducts.length}</strong> items
          </span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* DESKTOP FILTERS SIDEBAR */}
        <aside className="hidden lg:block w-64 flex-shrink-0 space-y-6">
          <div className="p-5 rounded-2xl bg-neutral-900/50 border border-neutral-800 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <SlidersHorizontal className="w-3.5 h-3.5 text-red-500" />
                <span>Filters</span>
              </span>
              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="text-[11px] text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {/* Search filter */}
            <div>
              <label className="text-xs font-bold text-neutral-300 block mb-2">Search</label>
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Filter drops..."
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 pl-8 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-500"
                />
                <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 top-2.5" />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="text-xs font-bold text-neutral-300 block mb-2">Categories</label>
              <div className="space-y-1.5 text-xs">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left px-3 py-1.5 rounded-lg transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-white text-black font-bold'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
                  }`}
                >
                  All Unified Drops
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg transition-colors ${
                      selectedCategory === cat.slug
                        ? 'bg-white text-black font-bold'
                        : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter (1,000–1,500 EGP) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-neutral-300">Price Range</label>
                <span className="text-[11px] font-mono text-red-400 font-bold">
                  {formatEGP(minPrice)} - {formatEGP(maxPrice)}
                </span>
              </div>
              <div className="space-y-2">
                <input
                  type="range"
                  min="1000"
                  max="1500"
                  step="50"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                  className="w-full accent-red-500 bg-neutral-800 h-1 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
                  <span>1,000 EGP</span>
                  <span>1,500 EGP</span>
                </div>
              </div>
            </div>

            {/* Size Filter */}
            <div>
              <label className="text-xs font-bold text-neutral-300 block mb-2">Size</label>
              <div className="grid grid-cols-4 gap-1.5">
                <button
                  onClick={() => setSelectedSize('all')}
                  className={`py-1.5 text-xs font-bold rounded-lg border transition-colors ${
                    selectedSize === 'all'
                      ? 'border-white bg-white text-black'
                      : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  All
                </button>
                {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`py-1.5 text-xs font-bold rounded-lg border transition-colors ${
                      selectedSize === sz
                        ? 'border-white bg-white text-black'
                        : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Filter */}
            <div>
              <label className="text-xs font-bold text-neutral-300 block mb-2">Color</label>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setSelectedColor('all')}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition-colors ${
                    selectedColor === 'all'
                      ? 'border-white bg-white text-black font-bold'
                      : 'border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  All
                </button>
                {allColors.map((colorName) => (
                  <button
                    key={colorName}
                    onClick={() => setSelectedColor(colorName)}
                    className={`text-[11px] px-2.5 py-1 rounded-lg border transition-colors ${
                      selectedColor === colorName
                        ? 'border-white bg-white text-black font-bold'
                        : 'border-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {colorName}
                  </button>
                ))}
              </div>
            </div>

            {/* In Stock Availability Filter */}
            <div className="pt-2 border-t border-neutral-800">
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-neutral-300">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded border-neutral-700 text-red-500 focus:ring-0 bg-neutral-950 w-4 h-4"
                />
                <span>In Stock Only</span>
              </label>
            </div>
          </div>
        </aside>

        {/* MAIN SHOP CONTENT */}
        <main className="flex-1">
          {/* Top Controls Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-neutral-900/30 border border-neutral-800 mb-6">
            {/* Mobile Filter Toggle Button */}
            <div className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-3">
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-800 text-white text-xs font-bold"
              >
                <Filter className="w-3.5 h-3.5" />
                <span>Filters {hasActiveFilters && '• Active'}</span>
              </button>

              <span className="text-xs text-neutral-400">
                Found {filteredProducts.length} pieces
              </span>
            </div>

            {/* Sort Selector */}
            <div className="w-full sm:w-auto flex items-center gap-2 self-end sm:self-auto text-xs">
              <span className="text-neutral-500">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-neutral-900 border border-neutral-700 text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-red-500"
              >
                <option value="newest">Newest Drops</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="bestselling">Best Sellers</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-neutral-900/20 border border-neutral-850 rounded-3xl p-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto text-neutral-500">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white">No products match your criteria</h3>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                Try widening your price range, clearing filters, or searching for other streetwear keywords.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-6 py-2.5 bg-white text-black text-xs font-bold rounded-xl hover:bg-neutral-200 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={(p) => setQuickViewProduct(p)}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* MOBILE FILTERS DRAWER */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileFiltersOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-neutral-950 border-l border-neutral-800 p-6 flex flex-col justify-between z-10 shadow-2xl overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
                <h3 className="font-stencil text-lg text-white">Filter Drops</h3>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-1 text-neutral-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Categories */}
              <div>
                <label className="text-xs font-bold text-neutral-300 block mb-2">Category</label>
                <div className="space-y-1 text-xs">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`w-full text-left px-3 py-2 rounded-lg ${
                      selectedCategory === 'all' ? 'bg-white text-black font-bold' : 'text-neutral-400'
                    }`}
                  >
                    All Unified Drops
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCategory(c.slug)}
                      className={`w-full text-left px-3 py-2 rounded-lg ${
                        selectedCategory === c.slug ? 'bg-white text-black font-bold' : 'text-neutral-400'
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <label className="text-xs font-bold text-neutral-300 block mb-1">
                  Max Price: {formatEGP(maxPrice)}
                </label>
                <input
                  type="range"
                  min="1000"
                  max="1500"
                  step="50"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                  className="w-full accent-red-500"
                />
              </div>

              {/* Sizes */}
              <div>
                <label className="text-xs font-bold text-neutral-300 block mb-2">Size</label>
                <div className="grid grid-cols-3 gap-2">
                  {['all', 'XS', 'S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`py-2 text-xs font-bold rounded-lg border ${
                        selectedSize === sz ? 'bg-white text-black border-white' : 'border-neutral-800 text-neutral-400'
                      }`}
                    >
                      {sz.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-neutral-800 space-y-2">
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl"
              >
                Apply Filters ({filteredProducts.length})
              </button>
              <button
                onClick={handleResetFilters}
                className="w-full py-2.5 bg-neutral-900 text-neutral-400 hover:text-white text-xs font-semibold rounded-xl"
              >
                Reset All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
}
