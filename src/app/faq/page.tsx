import React from 'react';
import Link from 'next/link';
import { Truck, ShieldCheck, HelpCircle, FileText } from 'lucide-react';

export default function FAQPage() {
  const faqs = [
    {
      q: 'How does Cash on Delivery (COD) work?',
      a: 'We operate exclusively with Cash on Delivery across Egypt. You place your order online without entering any credit card or online payment details. When our courier arrives at your location, you pay the exact amount in Egyptian Pounds (EGP) in cash directly to the driver.',
    },
    {
      q: 'What are the delivery timeframes in Egypt?',
      a: 'Cairo & Giza: 24–48 hours. Alexandria, Delta & Canal Governorates: 2–3 business days. Upper Egypt & Red Sea Governorates: 3–5 business days.',
    },
    {
      q: 'How much is shipping to my governorate?',
      a: 'Shipping is 50 EGP for Cairo and Giza, 60 EGP for Alexandria and Qalyubia, 65–70 EGP for Delta and Canal cities, and 80–110 EGP for Upper Egypt and Frontier governorates. Orders exceeding 2,500 EGP qualify for FREE shipping.',
    },
    {
      q: 'What is the 14-day doorstep exchange policy?',
      a: 'If a size does not fit, contact us via WhatsApp within 14 days of receiving your package. We will dispatch a courier with the replacement size to your doorstep. Items must be unworn with original tags attached.',
    },
    {
      q: 'Why are there no Men and Women categories?',
      a: 'JOMRAYZ is built around one unified, gender-free fashion collection. Our streetwear cuts are oversized and boxy, designed to look effortless and powerful on anyone aged 13–25.',
    },
    {
      q: 'What is the fabric quality?',
      a: 'We use 100% heavyweight combed Egyptian cotton (280 GSM for tees, 420–460 GSM French Terry for hoodies and sweats). All pieces are pre-shrunk and double-washed in Cairo mills.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-red-500">
          Support & Guidance
        </span>
        <h1 className="font-stencil text-3xl sm:text-5xl text-white tracking-tight">
          FREQUENTLY ASKED QUESTIONS
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto">
          Everything you need to know about shopping with JOMRAYZ in Egypt.
        </p>
      </div>

      {/* FAQs List */}
      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800 space-y-2"
          >
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="text-red-500 font-mono">0{idx + 1}.</span>
              <span>{faq.q}</span>
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed pl-6 font-light">{faq.a}</p>
          </div>
        ))}
      </div>

      {/* Terms & Policies Anchor Sections */}
      <div className="pt-10 border-t border-neutral-800 space-y-8 text-xs text-neutral-400 leading-relaxed">
        <div id="returns" className="space-y-2 p-6 rounded-2xl bg-neutral-900/20 border border-neutral-850">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Returns & Exchanges Policy</span>
          </h2>
          <p>
            In compliance with Egyptian Consumer Protection Agency regulations, customers are entitled to an exchange within 14 days of receipt, provided the product remains in brand-new condition with tags intact. To initiate an exchange, please provide your Order Number and phone number to our support team.
          </p>
        </div>

        <div id="terms" className="space-y-2 p-6 rounded-2xl bg-neutral-900/20 border border-neutral-850">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4 text-neutral-300" />
            <span>Terms & Conditions</span>
          </h2>
          <p>
            All products displayed on JOMRAYZ are priced in Egyptian Pounds (EGP). By placing an order, you agree to inspect the parcel upon courier delivery and pay the full invoice amount in cash. We reserve the right to cancel orders if contact information or address cannot be verified.
          </p>
        </div>

        <div id="privacy" className="space-y-2 p-6 rounded-2xl bg-neutral-900/20 border border-neutral-850">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4 text-neutral-300" />
            <span>Privacy Policy</span>
          </h2>
          <p>
            Your customer phone number, shipping address, and order history are kept strictly confidential and used solely for fulfillment and delivery purposes within Egypt. We never sell or share customer data with third parties.
          </p>
        </div>
      </div>
    </div>
  );
}
