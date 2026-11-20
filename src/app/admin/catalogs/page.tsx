'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Check, Pencil, Plus, Save, Tags, Trash2, X } from 'lucide-react';
import { Category } from '@/lib/types';

export default function AdminCatalogsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');

  const loadCatalogs = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      if (response.ok) setCategories(data.categories || []);
    } catch {
      setError('Could not load catalogs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCatalogs();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setSlug('');
    setDescription('');
    setError('');
  };

  const handleNameChange = (value: string) => {
    setName(value);
    if (!editingId) {
      setSlug(value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
    }
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      const response = await fetch(editingId ? `/api/categories/${editingId}` : '/api/categories', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, slug, description }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message || 'Could not save catalog.');
        return;
      }
      resetForm();
      await loadCatalogs();
    } catch {
      setError('Network error while saving catalog.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingId(category.id);
    setName(category.name);
    setSlug(category.slug);
    setDescription(category.description || '');
    setError('');
  };

  const handleDelete = async (category: Category) => {
    if (!confirm(`Delete "${category.name}"? Products in it will remain uncategorized.`)) return;
    const response = await fetch(`/api/categories/${category.id}`, { method: 'DELETE' });
    const data = await response.json();
    if (!response.ok) {
      setError(data.message || 'Could not delete catalog.');
      return;
    }
    if (editingId === category.id) resetForm();
    setCategories((current) => current.filter((item) => item.id !== category.id));
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="border-b border-neutral-800 pb-4">
          <div className="flex items-center gap-2 text-red-400 mb-1">
            <Tags className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Store organization</span>
          </div>
          <h1 className="font-stencil text-2xl sm:text-3xl text-white">CATALOGS</h1>
          <p className="text-xs text-neutral-400 mt-1">Manage the categories shown in the shop.</p>
        </div>

        <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 sm:p-5 bg-neutral-900/40 border border-neutral-800 rounded-2xl">
          <label className="text-xs text-neutral-300 space-y-1.5">
            <span>Catalog name</span>
            <input required value={name} onChange={(event) => handleNameChange(event.target.value)} className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-red-500" placeholder="Oversized Tees" />
          </label>
          <label className="text-xs text-neutral-300 space-y-1.5">
            <span>URL slug</span>
            <input required value={slug} onChange={(event) => setSlug(event.target.value)} className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-red-500" placeholder="oversized-tees" />
          </label>
          <label className="text-xs text-neutral-300 space-y-1.5 md:col-span-2">
            <span>Description</span>
            <textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={2} className="w-full resize-y bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-red-500" placeholder="Optional description" />
          </label>
          {error && <p role="alert" className="text-xs text-red-400 md:col-span-2">{error}</p>}
          <div className="flex gap-2 md:col-span-2">
            <button disabled={saving} className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-xs font-bold rounded-lg">
              {editingId ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {saving ? 'Saving...' : editingId ? 'Save changes' : 'Add catalog'}
            </button>
            {editingId && <button type="button" onClick={resetForm} className="inline-flex items-center gap-2 px-4 py-2.5 border border-neutral-700 text-neutral-300 text-xs font-bold rounded-lg"><X className="w-4 h-4" />Cancel</button>}
          </div>
        </form>

        {loading ? <p className="text-sm text-neutral-400">Loading catalogs...</p> : (
          <div className="divide-y divide-neutral-800 border-y border-neutral-800">
            {categories.map((category) => (
              <div key={category.id} className="flex items-start sm:items-center justify-between gap-3 py-4">
                <div className="min-w-0">
                  <h2 className="text-sm font-bold text-white break-words">{category.name}</h2>
                  <p className="text-[11px] text-neutral-500 font-mono break-all">/{category.slug}</p>
                  {category.description && <p className="text-xs text-neutral-400 mt-1 break-words">{category.description}</p>}
                </div>
                <div className="flex shrink-0 gap-1">
                  <button onClick={() => handleEdit(category)} aria-label={`Edit ${category.name}`} title="Edit catalog" className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(category)} aria-label={`Delete ${category.name}`} title="Delete catalog" className="p-2 text-neutral-400 hover:text-red-400 hover:bg-neutral-800 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
            {!categories.length && <div className="py-10 text-center text-sm text-neutral-500"><Check className="w-5 h-5 mx-auto mb-2" />No catalogs yet.</div>}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}