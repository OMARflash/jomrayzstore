'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import {
  Plus,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  Check,
  X,
  Shirt,
  Sparkles,
} from 'lucide-react';
import { Product } from '@/lib/types';
import { formatEGP } from '@/lib/utils';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [material, setMaterial] = useState('');
  const [care, setCare] = useState('');
  const [price, setPrice] = useState('1250');
  const [originalPrice, setOriginalPrice] = useState('');
  const [isNewDrop, setIsNewDrop] = useState(true);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isPublished, setIsPublished] = useState(true);
  const [imageUrl, setImageUrl] = useState('');
  const [variantsList, setVariantsList] = useState<Array<{ size: string; colorName: string; colorHex: string; stock: number }>>([
    { size: 'S', colorName: 'Onyx Black', colorHex: '#111111', stock: 10 },
    { size: 'M', colorName: 'Onyx Black', colorHex: '#111111', stock: 15 },
    { size: 'L', colorName: 'Onyx Black', colorHex: '#111111', stock: 12 },
    { size: 'XL', colorName: 'Onyx Black', colorHex: '#111111', stock: 8 },
  ]);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products?includeUnpublished=true');
      const data = await res.json();
      if (data.products) setProducts(data.products);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const resetForm = () => {
    setEditingProduct(null);
    setName('');
    setSlug('');
    setDescription('');
    setMaterial('100% Egyptian Combed Cotton (420 GSM)');
    setCare('Cold wash inside-out (30°C). Air dry only.');
    setPrice('1250');
    setOriginalPrice('');
    setIsNewDrop(true);
    setIsBestSeller(false);
    setIsPublished(true);
    setImageUrl('https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80');
    setVariantsList([
      { size: 'S', colorName: 'Onyx Black', colorHex: '#111111', stock: 10 },
      { size: 'M', colorName: 'Onyx Black', colorHex: '#111111', stock: 15 },
      { size: 'L', colorName: 'Onyx Black', colorHex: '#111111', stock: 12 },
      { size: 'XL', colorName: 'Onyx Black', colorHex: '#111111', stock: 8 },
    ]);
  };

  const handleOpenAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setSlug(p.slug);
    setDescription(p.description);
    setMaterial(p.material || '');
    setCare(p.care || '');
    setPrice(p.price.toString());
    setOriginalPrice(p.originalPrice ? p.originalPrice.toString() : '');
    setIsNewDrop(p.isNewDrop);
    setIsBestSeller(p.isBestSeller);
    setIsPublished(p.isPublished);
    setImageUrl(p.images?.[0]?.url || '');
    setVariantsList(
      p.variants.map((v) => ({
        size: v.size,
        colorName: v.colorName,
        colorHex: v.colorHex,
        stock: v.stock,
      }))
    );
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts(products.filter((p) => p.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleTogglePublish = async (p: Product) => {
    try {
      const res = await fetch(`/api/products/${p.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !p.isPublished }),
      });
      if (res.ok) {
        setProducts(products.map((item) => (item.id === p.id ? { ...item, isPublished: !p.isPublished } : item)));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name,
      slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      description,
      material,
      care,
      price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : null,
      isNewDrop,
      isBestSeller,
      isPublished,
      images: imageUrl ? [imageUrl] : [],
      variants: variantsList,
    };

    try {
      if (editingProduct) {
        const res = await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          fetchProducts();
          setIsModalOpen(false);
        }
      } else {
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          fetchProducts();
          setIsModalOpen(false);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-4">
          <div>
            <h1 className="font-stencil text-xl sm:text-3xl text-white">PRODUCTS CATALOG</h1>
            <p className="text-xs text-neutral-400 mt-0.5">
              Unified collection drops, pricing (1,000–1,500 EGP), and metadata.
            </p>
          </div>
          <button
            onClick={handleOpenAddModal}
            className="w-full sm:w-auto px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Drop</span>
          </button>
        </div>

        {/* 1. MOBILE PRODUCTS CARD LIST (< 640px) */}
        <div className="space-y-3 sm:hidden">
          {products.map((p) => {
            const totalStock = p.variants.reduce((acc, v) => acc + v.stock, 0);
            return (
              <div
                key={p.id}
                className="p-4 rounded-2xl bg-neutral-900/50 border border-neutral-800 space-y-3"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={p.images?.[0]?.url || 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=200&q=80'}
                    alt=""
                    className="w-16 h-20 rounded-xl object-cover bg-neutral-950 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-white text-xs line-clamp-1">{p.name}</p>
                    <p className="text-[10px] text-neutral-500 font-mono">/{p.slug}</p>
                    <p className="text-sm font-black text-white font-mono mt-1">
                      {formatEGP(p.price)}
                    </p>
                    <span
                      className={`inline-block mt-1 px-2 py-0.5 rounded text-[9px] font-bold ${
                        totalStock > 10
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : totalStock > 0
                          ? 'bg-amber-500/10 text-amber-400'
                          : 'bg-red-500/10 text-red-400'
                      }`}
                    >
                      {totalStock} units in stock
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-neutral-850">
                  <button
                    onClick={() => handleTogglePublish(p)}
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 ${
                      p.isPublished
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    {p.isPublished ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    <span>{p.isPublished ? 'Published' : 'Draft'}</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEditModal(p)}
                      className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
                    >
                      <Edit className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="p-1.5 bg-neutral-800 hover:bg-red-950/60 text-neutral-400 hover:text-red-400 rounded-lg text-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 2. DESKTOP PRODUCTS TABLE (>= 640px) */}
        <div className="hidden sm:block p-6 rounded-3xl bg-neutral-900/40 border border-neutral-800 overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="bg-neutral-950 text-neutral-400 uppercase text-[10px] tracking-wider border-b border-neutral-800">
              <tr>
                <th className="py-3 px-3">Product</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Price (EGP)</th>
                <th className="py-3 px-3">Total Stock</th>
                <th className="py-3 px-3">Badges</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-850">
              {products.map((p) => {
                const totalStock = p.variants.reduce((acc, v) => acc + v.stock, 0);
                return (
                  <tr key={p.id} className="hover:bg-neutral-800/30">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images?.[0]?.url || 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=200&q=80'}
                          alt=""
                          className="w-12 h-14 rounded-lg object-cover bg-neutral-950 flex-shrink-0"
                        />
                        <div>
                          <p className="font-bold text-white text-xs">{p.name}</p>
                          <p className="text-[10px] text-neutral-500 font-mono">/{p.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-neutral-400">{p.category?.name || 'General Drop'}</td>
                    <td className="py-3 px-3 font-mono font-bold text-white">
                      {formatEGP(p.price)}
                    </td>
                    <td className="py-3 px-3 font-mono">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          totalStock > 10
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : totalStock > 0
                            ? 'bg-amber-500/10 text-amber-400'
                            : 'bg-red-500/10 text-red-400'
                        }`}
                      >
                        {totalStock} units
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex gap-1">
                        {p.isNewDrop && (
                          <span className="text-[9px] bg-neutral-800 text-neutral-300 px-1.5 py-0.5 rounded font-bold uppercase">
                            New
                          </span>
                        )}
                        {p.isBestSeller && (
                          <span className="text-[9px] bg-red-600/30 text-red-400 px-1.5 py-0.5 rounded font-bold uppercase">
                            Best
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <button
                        onClick={() => handleTogglePublish(p)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                          p.isPublished
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-neutral-800 text-neutral-400'
                        }`}
                      >
                        {p.isPublished ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        <span>{p.isPublished ? 'Published' : 'Draft'}</span>
                      </button>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(p)}
                          className="p-1.5 text-neutral-400 hover:text-white bg-neutral-800 rounded-lg"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-1.5 text-neutral-400 hover:text-red-400 bg-neutral-800 rounded-lg"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE / EDIT PRODUCT MODAL (Mobile-Optimized) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl sm:rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-y-auto p-4 sm:p-8 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h2 className="font-stencil text-lg sm:text-xl text-white">
                {editingProduct ? 'Edit Product' : 'Add New Unified Drop'}
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Configure garment specifications, pricing, imagery, and variant inventory.
              </p>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="text-[11px] font-bold text-neutral-300 block mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (!editingProduct) {
                        setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
                      }
                    }}
                    required
                    placeholder="e.g. Tactical Cargo Sweats"
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-neutral-300 block mb-1">
                    Slug / URL Key *
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    required
                    placeholder="tactical-cargo-sweats"
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-red-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="text-[11px] font-bold text-neutral-300 block mb-1">
                    Price (EGP) *
                  </label>
                  <input
                    type="number"
                    min="500"
                    max="3000"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-red-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-neutral-300 block mb-1">
                    Original Price (Optional)
                  </label>
                  <input
                    type="number"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    placeholder="e.g. 1500"
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-red-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-neutral-300 block mb-1">
                  Product Image URL
                </label>
                <p className="text-[10px] text-neutral-500 mb-2">
                  Use a public image URL or a path such as /products/hoodie.jpg after adding the file to public/products.
                </p>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://... or /products/hoodie.jpg"
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-red-500 font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-neutral-300 block mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed streetwear cut, silhouette, and story..."
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="text-[11px] font-bold text-neutral-300 block mb-1">
                    Material Info
                  </label>
                  <input
                    type="text"
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                    placeholder="100% Egyptian Combed Cotton (460 GSM)"
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-neutral-300 block mb-1">
                    Care Instructions
                  </label>
                  <input
                    type="text"
                    value={care}
                    onChange={(e) => setCare(e.target.value)}
                    placeholder="Machine wash cold 30°C. Air dry."
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap gap-3 pt-1">
                <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isNewDrop}
                    onChange={(e) => setIsNewDrop(e.target.checked)}
                    className="rounded text-red-500"
                  />
                  <span>New Drop</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isBestSeller}
                    onChange={(e) => setIsBestSeller(e.target.checked)}
                    className="rounded text-red-500"
                  />
                  <span>Best Seller</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="rounded text-red-500"
                  />
                  <span>Published</span>
                </label>
              </div>

              {/* Variant Stock Matrix */}
              <div className="pt-2 border-t border-neutral-800 space-y-2">
                <label className="text-xs font-bold text-white block">
                  Variant Stock Matrix (S, M, L, XL)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {variantsList.map((v, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs">
                      <span className="font-bold text-white block truncate">{v.size} ({v.colorName})</span>
                      <div className="mt-1">
                        <label className="text-[10px] text-neutral-500 block">Stock</label>
                        <input
                          type="number"
                          value={v.stock}
                          onChange={(e) => {
                            const updated = [...variantsList];
                            updated[i].stock = parseInt(e.target.value) || 0;
                            setVariantsList(updated);
                          }}
                          className="w-full bg-neutral-900 border border-neutral-700 rounded px-2 py-1 text-xs text-white"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 flex gap-2 sm:gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-colors"
                >
                  Save Drop
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
