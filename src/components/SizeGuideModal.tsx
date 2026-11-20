'use client';

import React from 'react';
import { X, Ruler } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SizeGuideModal({ isOpen, onClose }: SizeGuideModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-neutral-400 hover:text-white p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-red-500/10 text-red-400 rounded-xl">
            <Ruler className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-white font-stencil tracking-wider">
            JOMRAYZ Fit & Size Guide
          </h3>
        </div>

        <p className="text-xs text-neutral-400 mb-6">
          All JOMRAYZ garments feature an intentional relaxed, oversized streetwear silhouette. If you prefer a regular tailored fit, size down one size.
        </p>

        {/* Size Chart Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="bg-neutral-950 text-neutral-400 uppercase text-[10px] tracking-wider border-b border-neutral-800">
              <tr>
                <th className="py-3 px-3">Size</th>
                <th className="py-3 px-3">Chest (cm)</th>
                <th className="py-3 px-3">Length (cm)</th>
                <th className="py-3 px-3">Shoulder (cm)</th>
                <th className="py-3 px-3">Recommended Height</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 font-mono">
              <tr>
                <td className="py-2.5 px-3 font-bold text-white">XS</td>
                <td className="py-2.5 px-3">108</td>
                <td className="py-2.5 px-3">68</td>
                <td className="py-2.5 px-3">52</td>
                <td className="py-2.5 px-3 text-neutral-400 font-sans">155 - 165 cm</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-white">S</td>
                <td className="py-2.5 px-3">114</td>
                <td className="py-2.5 px-3">71</td>
                <td className="py-2.5 px-3">55</td>
                <td className="py-2.5 px-3 text-neutral-400 font-sans">165 - 172 cm</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-white">M</td>
                <td className="py-2.5 px-3">120</td>
                <td className="py-2.5 px-3">74</td>
                <td className="py-2.5 px-3">58</td>
                <td className="py-2.5 px-3 text-neutral-400 font-sans">170 - 178 cm</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-white">L</td>
                <td className="py-2.5 px-3">126</td>
                <td className="py-2.5 px-3">77</td>
                <td className="py-2.5 px-3">61</td>
                <td className="py-2.5 px-3 text-neutral-400 font-sans">176 - 185 cm</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-white">XL</td>
                <td className="py-2.5 px-3">132</td>
                <td className="py-2.5 px-3">80</td>
                <td className="py-2.5 px-3">64</td>
                <td className="py-2.5 px-3 text-neutral-400 font-sans">182 - 192 cm</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-white">XXL</td>
                <td className="py-2.5 px-3">138</td>
                <td className="py-2.5 px-3">82</td>
                <td className="py-2.5 px-3">67</td>
                <td className="py-2.5 px-3 text-neutral-400 font-sans">188+ cm</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-6 pt-4 border-t border-neutral-800 text-xs text-neutral-400 flex items-center justify-between">
          <span>Unsure about your size? We offer 14-day direct doorstep size exchanges.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white font-bold rounded-xl"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
}
