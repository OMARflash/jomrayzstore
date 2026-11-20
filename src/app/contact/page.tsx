'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && message) {
      setSubmitted(true);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-red-500">
          Cairo Atelier & Support
        </span>
        <h1 className="font-stencil text-3xl sm:text-5xl text-white tracking-tight">
          GET IN TOUCH
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto">
          Need sizing advice, exchange support, or order tracking assistance? Our Cairo team is here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Contact Info (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-neutral-900/40 border border-neutral-800 space-y-6">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Contact Channels
            </h2>

            <div className="space-y-4 text-xs text-neutral-300">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-neutral-800 text-red-400 flex-shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-white">Direct & WhatsApp Support</p>
                  <p className="font-mono text-neutral-400 mt-0.5">+20 10 0000 0001</p>
                  <p className="text-[10px] text-neutral-500">Daily: 11:00 AM – 11:00 PM CLT</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-neutral-800 text-blue-400 flex-shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-white">Email Inquiries</p>
                  <p className="font-mono text-neutral-400 mt-0.5">contact@jomrayz.com</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-neutral-800 text-pink-400 flex-shrink-0">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-white">Official TikTok</p>
                  <Link
                    href="https://www.tiktok.com/@jomrayz_star4"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-red-400 hover:underline font-semibold"
                  >
                    @jomrayz_star4
                  </Link>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-neutral-800 text-emerald-400 flex-shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-white">Fulfillment Hub</p>
                  <p className="text-neutral-400 mt-0.5">Cairo, Egypt</p>
                  <p className="text-[10px] text-neutral-500">Shipping nationwide via Cash on Delivery</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form (7 cols) */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-neutral-900/40 border border-neutral-800 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Send Us A Message
          </h2>

          {submitted ? (
            <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 mx-auto" />
              <p className="text-sm">Thank you for reaching out!</p>
              <p className="text-neutral-400 font-normal">
                Our support team will contact you on WhatsApp or call you shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-neutral-300 block mb-1">Your Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="e.g. Mostafa Mahmoud"
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-neutral-300 block mb-1">
                  Egyptian Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  placeholder="01012345678"
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-red-500 font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-neutral-300 block mb-1">Message</label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  placeholder="How can we help with your order, drop inquiry, or exchange?"
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-red-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-white hover:bg-neutral-200 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xl flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Message</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
