'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Boxes, AlertTriangle, Check, RefreshCw, Search, Plus, Minus, Trash2 } from 'lucide-react';
import { formatEGP } from '@/lib/utils';

export default function AdminInventoryPage() {
  const [variants, setVariants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterLowStock, setFilterLowStock] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);

  const fetchInventory = async () => {
    try {
      const res = await fetch('/api/admin/inventory');
      const data = await res.json();
      if (data.variants) setVariants(data.variants);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleStockUpdate = async (id: string, newStock: number) => {
    try {
      const validStock = Math.max(0, newStock);
      const res = await fetch('/api/admin/inventory', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, stock: validStock }),
      });
      if (res.ok) {
        setSavedId(id);
        setVariants(variants.map((v) => (v.id === id ? { ...v, stock: validStock } : v)));
        setTimeout(() => setSavedId(null), 1200);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteColor = async (productId: string, colorName: string) => {
    if (!confirm(`Delete all ${colorName} size variants for this product?`)) return;
    try {
      const res = await fetch('/api/admin/inventory', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, colorName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Could not delete color');
      setVariants((current) => current.filter((v) => !(v.productId === productId && v.colorName === colorName)));
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Could not delete color');
    }
  };

  const handleDeleteProduct = async (productId: string, productName: string) => {
    if (!confirm(`Permanently delete ${productName}? Existing order history will be preserved.`)) return;
    try {
      const res = await fetch(`/api/products/${productId}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Could not delete product');
      setVariants((current) => current.filter((v) => v.productId !== productId));
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Could not delete product');
    }
  };

  const filtered = variants.filter((v) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      if (
        !v.product.name.toLowerCase().includes(q) &&
        !v.size.toLowerCase().includes(q) &&
        !v.colorName.toLowerCase().includes(q) &&
        !(v.sku && v.sku.toLowerCase().includes(q))
      ) {
        return false;
      }
    }
    if (filterLowStock && v.stock >= 5) {
      return false;
    }
    return true;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-4">
          <div>
            <h1 className="font-stencil text-xl sm:text-3xl text-white">INVENTORY MATRIX</h1>
            <p className="text-xs text-neutral-400 mt-0.5">
              Live stock counts per Product × Size × Color. Out-of-stock items lock automatically on store.
            </p>
          </div>
          <button
            onClick={fetchInventory}
            className="w-full sm:w-auto px-3.5 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Counts</span>
          </button>
        </div>

        {/* Filter controls */}
        <div className="p-4 rounded-2xl bg-neutral-900/40 border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="w-full sm:w-72 relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by garment, size, color..."
              className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 pl-9 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-500"
            />
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
          </div>

          <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer self-start sm:self-auto select-none">
            <input
              type="checkbox"
              checked={filterLowStock}
              onChange={(e) => setFilterLowStock(e.target.checked)}
              className="rounded text-red-500"
            />
            <span className="flex items-center gap-1 text-amber-400 font-bold text-xs">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Show Low Stock Only ({'<'} 5 units)</span>
            </span>
          </label>
        </div>

        {/* 1. MOBILE INVENTORY CARDS (< 640px) */}
        <div className="space-y-3 sm:hidden">
          {filtered.map((v) => (
            <div
              key={v.id}
              className="p-3.5 rounded-2xl bg-neutral-900/50 border border-neutral-800 space-y-2.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-bold text-white text-xs leading-tight">{v.product.name}</p>
                  <p className="text-[10px] text-neutral-500 font-mono mt-0.5">{v.sku || '-'}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      v.stock > 0
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-red-500/20 text-red-400 font-black'
                    }`}
                  >
                    {v.stock > 0 ? `${v.stock} in stock` : 'LOCKED (0)'}
                  </span>
                  <button
                    onClick={() => handleDeleteProduct(v.productId, v.product.name)}
                    aria-label={`Delete ${v.product.name}`}
                    title="Delete product"
                    className="p-1.5 text-neutral-500 hover:text-red-400 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-neutral-300">
                <span className="bg-neutral-800 font-mono font-bold px-2 py-0.5 rounded text-[11px] text-white">
                  Size: {v.size}
                </span>
                <span className="flex items-center gap-1 bg-neutral-800 px-2 py-0.5 rounded text-[11px]">
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-neutral-700"
                    style={{ backgroundColor: v.colorHex }}
                  />
                  <span>{v.colorName}</span>
                </span>
                <button
                  onClick={() => handleDeleteColor(v.productId, v.colorName)}
                  aria-label={`Delete ${v.colorName} color from ${v.product.name}`}
                  title="Delete all sizes in this color"
                  className="p-1.5 text-neutral-500 hover:text-red-400 rounded-lg"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Mobile Quick Stock Stepper */}
              <div className="pt-2 border-t border-neutral-850 flex items-center justify-between">
                <span className="text-[11px] text-neutral-400 font-semibold">Stock Count:</span>
                <div className="flex items-center gap-2">
                  <div className="flex items-center border border-neutral-700 bg-neutral-950 rounded-xl overflow-hidden">
                    <button
                      onClick={() => handleStockUpdate(v.id, v.stock - 1)}
                      disabled={v.stock <= 0}
                      className="px-2.5 py-1 text-neutral-400 hover:text-white disabled:opacity-30"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <input
                      type="number"
                      min="0"
                      value={v.stock}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (!isNaN(val)) handleStockUpdate(v.id, val);
                      }}
                      className="w-12 bg-transparent text-center text-xs font-mono font-bold text-white focus:outline-none"
                    />
                    <button
                      onClick={() => handleStockUpdate(v.id, v.stock + 1)}
                      className="px-2.5 py-1 text-neutral-400 hover:text-white"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {savedId === v.id && (
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 animate-fade-in" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 2. DESKTOP INVENTORY TABLE (>= 640px) */}
        <div className="hidden sm:block p-6 rounded-3xl bg-neutral-900/40 border border-neutral-800 overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="bg-neutral-950 text-neutral-400 uppercase text-[10px] tracking-wider border-b border-neutral-800">
              <tr>
                <th className="py-3 px-3">Product Name</th>
                <th className="py-3 px-3">Size</th>
                <th className="py-3 px-3">Color</th>
                <th className="py-3 px-3">SKU</th>
                <th className="py-3 px-3">Stock Units</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Update Stock</th>
                <th className="py-3 px-3 text-right">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-850">
              {filtered.map((v) => (
                <tr key={v.id} className="hover:bg-neutral-800/30">
                  <td className="py-3 px-3 font-semibold text-white">{v.product.name}</td>
                  <td className="py-3 px-3 font-mono font-bold text-neutral-200">{v.size}</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-3 h-3 rounded-full border border-neutral-700"
                        style={{ backgroundColor: v.colorHex }}
                      />
                      <span>{v.colorName}</span>
                      <button
                        onClick={() => handleDeleteColor(v.productId, v.colorName)}
                        aria-label={`Delete ${v.colorName} color from ${v.product.name}`}
                        title="Delete all sizes in this color"
                        className="ml-1 p-1 text-neutral-500 hover:text-red-400 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-mono text-neutral-500 text-[11px]">{v.sku || '-'}</td>
                  <td className="py-3 px-3 font-mono font-bold">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] ${
                        v.stock >= 5
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : v.stock > 0
                          ? 'bg-amber-500/10 text-amber-400'
                          : 'bg-red-500/10 text-red-400 font-black'
                      }`}
                    >
                      {v.stock} units
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    {v.stock > 0 ? (
                      <span className="text-[10px] text-emerald-400 font-semibold">Available</span>
                    ) : (
                      <span className="text-[10px] text-red-400 font-bold">LOCKED (0 Stock)</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="inline-flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        defaultValue={v.stock}
                        onBlur={(e) => {
                          const val = parseInt(e.target.value);
                          if (!isNaN(val) && val !== v.stock) {
                            handleStockUpdate(v.id, val);
                          }
                        }}
                        className="w-20 bg-neutral-950 border border-neutral-700 rounded-lg px-2 py-1 text-xs text-white text-right font-mono focus:outline-none focus:border-red-500"
                      />
                      {savedId === v.id && (
                        <Check className="w-4 h-4 text-emerald-400 animate-fade-in" />
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => handleDeleteProduct(v.productId, v.product.name)}
                      aria-label={`Delete ${v.product.name}`}
                      title="Delete product"
                      className="p-2 text-neutral-500 hover:text-red-400 hover:bg-neutral-800 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
