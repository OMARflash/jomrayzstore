'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Shirt,
  Boxes,
  ShoppingBag,
  Users,
  Tag,
  Tags,
  Star,
  Truck,
  BarChart3,
  ExternalLink,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAdmin, isLoading, logout } = useAuth();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      router.push('/admin/login');
    }
  }, [user, isAdmin, isLoading, router]);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileDrawerOpen(false);
  }, [pathname]);

  if (isLoading || !user || !isAdmin) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white text-xs">
        Verifying Admin Access...
      </div>
    );
  }

  const menuItems = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Products', href: '/admin/products', icon: Shirt },
    { label: 'Catalogs', href: '/admin/catalogs', icon: Tags },
    { label: 'Inventory', href: '/admin/inventory', icon: Boxes },
    { label: 'COD Orders', href: '/admin/orders', icon: ShoppingBag },
    { label: 'Customers', href: '/admin/customers', icon: Users },
    { label: 'Coupons', href: '/admin/coupons', icon: Tag },
    { label: 'Reviews', href: '/admin/reviews', icon: Star },
    { label: 'Egyptian Shipping', href: '/admin/shipping', icon: Truck },
    { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  ];

  const currentItem = menuItems.find((item) => item.href === pathname) || menuItems[0];

  return (
    <div className="min-h-screen bg-[#090a0d] text-neutral-200 flex flex-col md:flex-row">
      {/* 1. TOP MOBILE APP BAR (Visible on mobile screens only) */}
      <header className="md:hidden sticky top-0 z-30 w-full bg-neutral-900/95 backdrop-blur-md border-b border-neutral-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileDrawerOpen(true)}
            className="p-2 -ml-1 text-neutral-300 hover:text-white rounded-xl bg-neutral-800/80 border border-neutral-700/60 active:scale-95 transition-all"
            aria-label="Open Admin Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-stencil text-lg text-white">JOMRAYZ</span>
              <span className="bg-red-600 text-white text-[8px] font-black px-1.5 py-0.2 rounded uppercase">
                Admin
              </span>
            </div>
            <p className="text-[10px] text-red-400 font-medium leading-none mt-0.5">
              {currentItem.label}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            target="_blank"
            className="p-2 text-neutral-400 hover:text-white bg-neutral-800/50 rounded-lg text-xs"
            title="View Live Store"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>
          <button
            onClick={() => logout()}
            className="p-2 text-neutral-400 hover:text-red-400 bg-neutral-800/50 rounded-lg text-xs"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 2. MOBILE SLIDE-IN DRAWER OVERLAY */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileDrawerOpen(false)}
          />

          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-neutral-950 border-r border-neutral-800 p-5 flex flex-col justify-between z-10 shadow-2xl animate-fade-in">
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-stencil text-xl text-white">JOMRAYZ</span>
                    <span className="bg-red-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase">
                      Admin
                    </span>
                  </div>
                  <p className="text-[10px] text-neutral-400 mt-0.5">Management Console</p>
                </div>
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1.5 text-neutral-400 hover:text-white rounded-lg bg-neutral-900 border border-neutral-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="space-y-1.5 overflow-y-auto max-h-[calc(100vh-220px)] pr-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileDrawerOpen(false)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-red-600 text-white shadow-lg shadow-red-900/30'
                          : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span>{item.label}</span>
                      </div>
                      <ChevronRight className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-neutral-600'}`} />
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Drawer Footer */}
            <div className="pt-4 border-t border-neutral-850 space-y-2 text-xs">
              <Link
                href="/"
                target="_blank"
                onClick={() => setMobileDrawerOpen(false)}
                className="flex items-center justify-between px-3 py-2 rounded-xl text-neutral-400 hover:text-white bg-neutral-900/50"
              >
                <span className="flex items-center gap-2">
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Live Storefront</span>
                </span>
                <span className="text-[10px] text-neutral-500 font-mono">↗</span>
              </Link>

              <button
                onClick={() => logout()}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-neutral-400 hover:text-red-400 bg-neutral-900/50"
              >
                <span className="flex items-center gap-2">
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. DESKTOP PERMANENT SIDEBAR (Hidden on mobile) */}
      <aside className="hidden md:flex w-64 bg-neutral-900/90 border-r border-neutral-800 p-6 flex-col justify-between flex-shrink-0 sticky top-0 h-screen overflow-y-auto">
        <div className="space-y-8">
          {/* Logo & Portal title */}
          <div>
            <div className="flex items-center gap-2">
              <span className="font-stencil text-2xl text-white">JOMRAYZ</span>
              <span className="bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded uppercase">
                Admin
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 mt-1">
              Store Management Console
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-red-600 text-white shadow-lg shadow-red-900/30'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer shortcuts */}
        <div className="pt-6 border-t border-neutral-800 space-y-2 text-xs">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Live Storefront</span>
            </span>
          </Link>

          <button
            onClick={() => logout()}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-neutral-400 hover:text-red-400 hover:bg-neutral-800 transition-colors"
          >
            <span className="flex items-center gap-2">
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </span>
          </button>
        </div>
      </aside>

      {/* 4. MAIN ADMIN CONTENT CONTAINER */}
      <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8 min-w-0">
        {children}
      </main>
    </div>
  );
}
