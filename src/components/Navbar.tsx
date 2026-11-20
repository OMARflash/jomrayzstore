'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShoppingBag,
  Heart,
  Search,
  Menu,
  X,
  User,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const pathname = usePathname();
  const { itemCount, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    { label: 'New Drops', href: '/shop?filter=new' },
    { label: 'Best Sellers', href: '/shop?filter=bestseller' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/shop?search=${encodeURIComponent(searchQuery.trim())}`;
      setSearchModalOpen(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-nav transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 py-3.5 flex items-center justify-between">
          {/* Mobile menu trigger */}
          <div className="flex items-center gap-3 max-[359px]:gap-1 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 max-[359px]:p-1 text-neutral-300 hover:text-white rounded-md focus:outline-none focus:ring-1 focus:ring-neutral-700"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            <button
              onClick={() => setSearchModalOpen(true)}
              className="p-2 max-[359px]:p-1 text-neutral-300 hover:text-white"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Brand Logo */}
          <div className="flex-1 lg:flex-none flex justify-center lg:justify-start">
            <Link href="/" className="group flex items-center gap-2 max-[359px]:gap-1">
              <span className="font-stencil text-xl min-[360px]:text-2xl sm:text-3xl tracking-tight text-white group-hover:text-red-500 transition-colors">
                JOMRAYZ
              </span>
              <span className="text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded border border-white/20 text-neutral-400 group-hover:border-red-500/50 group-hover:text-red-400 transition-colors">
                EG
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links (UNIFIED - NO MEN/WOMEN) */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`text-sm font-medium tracking-wide transition-colors relative py-1 ${
                    isActive ? 'text-white font-semibold' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-500 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Utility Icons: Search, Wishlist, Cart, Account */}
          <div className="flex items-center gap-2 max-[359px]:gap-1 sm:gap-4">
            <button
              onClick={() => setSearchModalOpen(true)}
              className="hidden lg:flex items-center gap-2 text-xs text-neutral-400 hover:text-white bg-neutral-900/80 border border-neutral-800 hover:border-neutral-700 px-3 py-1.5 rounded-full transition-all"
              aria-label="Search items"
            >
              <Search className="w-3.5 h-3.5 text-neutral-400" />
              <span>Search unified drops...</span>
              <kbd className="text-[10px] bg-neutral-800 px-1.5 py-0.5 rounded text-neutral-400">⌘K</kbd>
            </button>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="relative p-2 max-[359px]:p-1 text-neutral-300 hover:text-white transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 bg-red-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Shopping Cart Drawer Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 max-[359px]:p-1 text-neutral-300 hover:text-white transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute top-1 right-1 bg-white text-black text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>

            {/* User Account */}
            {user ? (
              <div className="relative group">
                <Link
                  href="/account"
                  className="flex items-center gap-1.5 p-1.5 text-xs text-neutral-300 hover:text-white bg-neutral-900 border border-neutral-800 rounded-full pl-2 pr-3"
                >
                  <User className="w-4 h-4 text-red-500" />
                  <span className="hidden sm:inline">Account</span>
                </Link>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-neutral-300 hover:text-white bg-neutral-900/90 border border-neutral-800 px-3 py-1.5 rounded-full hover:border-neutral-700 transition-all"
              >
                <User className="w-3.5 h-3.5" />
                <span>Account</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Live Search Modal */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-xl p-6 shadow-2xl relative">
            <button
              onClick={() => setSearchModalOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-2 font-stencil tracking-wider">
              Search JOMRAYZ Collection
            </h3>
            <p className="text-xs text-neutral-400 mb-4">
              Explore hoodies, oversized tees, cargo trousers, and streetwear accessories.
            </p>

            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by product name, fabric, or style..."
                autoFocus
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-3 pl-11 text-white placeholder-neutral-500 focus:outline-none focus:border-red-500 text-sm"
              />
              <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-400" />
              <button
                type="submit"
                className="absolute right-2 top-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
              >
                Search
              </button>
            </form>

            <div className="mt-4 pt-4 border-t border-neutral-800 flex flex-wrap gap-2 items-center text-xs text-neutral-400">
              <span className="text-neutral-500">Popular:</span>
              <button
                onClick={() => {
                  setSearchQuery('Boxy Hoodie');
                  window.location.href = '/shop?search=Boxy%20Hoodie';
                }}
                className="px-2.5 py-1 bg-neutral-800 rounded-full hover:text-white transition-colors"
              >
                Boxy Hoodie
              </button>
              <button
                onClick={() => {
                  setSearchQuery('Cargo');
                  window.location.href = '/shop?search=Cargo';
                }}
                className="px-2.5 py-1 bg-neutral-800 rounded-full hover:text-white transition-colors"
              >
                Tactical Cargo
              </button>
              <button
                onClick={() => {
                  setSearchQuery('Acid-Wash');
                  window.location.href = '/shop?search=Acid-Wash';
                }}
                className="px-2.5 py-1 bg-neutral-800 rounded-full hover:text-white transition-colors"
              >
                Acid-Wash Tee
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-neutral-950 border-r border-neutral-800 p-6 flex flex-col justify-between z-10 shadow-2xl animate-fade-in">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-neutral-800">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-stencil text-2xl tracking-tight text-white"
                >
                  JOMRAYZ
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-neutral-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Links */}
              <div className="py-6 space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-lg font-medium text-neutral-200 hover:text-white py-1"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/track-order"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm font-semibold text-red-400 hover:text-red-300 py-1"
                >
                  Track Order
                </Link>
              </div>
            </div>

            {/* Bottom Mobile info */}
            <div className="pt-6 border-t border-neutral-800 space-y-4">
              {user ? (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-neutral-400">Account</p>
                    <p className="text-sm font-bold text-white">Signed in</p>
                  </div>
                  <Link
                    href="/account"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-xs bg-neutral-800 text-white px-3 py-1.5 rounded-lg font-medium"
                  >
                    Account
                  </Link>
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 bg-neutral-900 border border-neutral-700 hover:border-neutral-500 text-white text-sm font-bold py-2.5 rounded-xl"
                >
                  <User className="w-4 h-4" />
                  <span>Login / Register</span>
                </Link>
              )}

              <div className="text-[11px] text-neutral-500 text-center">
                Cash on Delivery Only • Egypt Wide
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
