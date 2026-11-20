'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Star, CheckCircle2, XCircle, Trash2, ShieldCheck } from 'lucide-react';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const res = await fetch('/api/reviews?admin=true');
      const data = await res.json();
      if (data.reviews) setReviews(data.reviews);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleModerate = async (id: string, isApproved: boolean) => {
    try {
      const res = await fetch('/api/reviews', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isApproved }),
      });
      if (res.ok) {
        setReviews(reviews.map((r) => (r.id === id ? { ...r, isApproved } : r)));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Permanently delete this review?')) return;
    try {
      const res = await fetch('/api/reviews', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setReviews(reviews.filter((r) => r.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="border-b border-neutral-800 pb-4">
          <h1 className="font-stencil text-xl sm:text-3xl text-white">REVIEWS MODERATION</h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Moderate customer feedback and review verified purchase badges before displaying on product pages.
          </p>
        </div>

        {/* 1. MOBILE REVIEWS CARDS (< 640px) */}
        <div className="space-y-3 sm:hidden">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="p-4 rounded-2xl bg-neutral-900/50 border border-neutral-800 space-y-2.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="font-bold text-white text-xs block">{r.product?.name}</span>
                  <span className="text-neutral-400 text-[11px]">{r.authorName}</span>
                </div>
                <div className="flex text-amber-400">
                  {[...Array(r.rating)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-current" />
                  ))}
                </div>
              </div>

              <p className="text-xs text-neutral-300 leading-relaxed bg-neutral-950 p-2.5 rounded-xl border border-neutral-850">
                "{r.comment}"
              </p>

              <div className="flex items-center justify-between pt-1">
                {r.isVerifiedPurchase ? (
                  <span className="inline-flex items-center gap-1 text-[9px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Verified Buyer</span>
                  </span>
                ) : (
                  <span className="text-[10px] text-neutral-500">Unverified</span>
                )}

                <div className="flex items-center gap-2">
                  {r.isApproved ? (
                    <button
                      onClick={() => handleModerate(r.id, false)}
                      className="px-2.5 py-1 bg-neutral-800 text-neutral-400 hover:text-amber-400 rounded-lg text-xs font-semibold"
                    >
                      Reject
                    </button>
                  ) : (
                    <button
                      onClick={() => handleModerate(r.id, true)}
                      className="px-2.5 py-1 bg-emerald-600/30 text-emerald-400 rounded-lg text-xs font-semibold"
                    >
                      Approve
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="p-1.5 bg-neutral-800 text-neutral-400 hover:text-red-400 rounded-lg text-xs"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 2. DESKTOP REVIEWS TABLE (>= 640px) */}
        <div className="hidden sm:block p-6 rounded-3xl bg-neutral-900/40 border border-neutral-800 overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="bg-neutral-950 text-neutral-400 uppercase text-[10px] tracking-wider border-b border-neutral-800">
              <tr>
                <th className="py-3 px-3">Product</th>
                <th className="py-3 px-3">Reviewer</th>
                <th className="py-3 px-3">Rating</th>
                <th className="py-3 px-3">Comment</th>
                <th className="py-3 px-3">Verified Purchase</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Moderate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-850">
              {reviews.map((r) => (
                <tr key={r.id} className="hover:bg-neutral-800/30">
                  <td className="py-3 px-3 font-semibold text-white">{r.product?.name}</td>
                  <td className="py-3 px-3">{r.authorName}</td>
                  <td className="py-3 px-3">
                    <div className="flex text-amber-400">
                      {[...Array(r.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-neutral-300 max-w-xs">{r.comment}</td>
                  <td className="py-3 px-3">
                    {r.isVerifiedPurchase ? (
                      <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Verified Buyer</span>
                      </span>
                    ) : (
                      <span className="text-[10px] text-neutral-500">Unverified</span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    {r.isApproved ? (
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                        Approved
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="inline-flex items-center gap-2">
                      {r.isApproved ? (
                        <button
                          onClick={() => handleModerate(r.id, false)}
                          className="p-1.5 bg-neutral-800 text-neutral-400 hover:text-amber-400 rounded-lg text-xs"
                          title="Reject"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleModerate(r.id, true)}
                          className="p-1.5 bg-neutral-800 text-neutral-400 hover:text-emerald-400 rounded-lg text-xs"
                          title="Approve"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(r.id)}
                        className="p-1.5 bg-neutral-800 text-neutral-400 hover:text-red-400 rounded-lg text-xs"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
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
