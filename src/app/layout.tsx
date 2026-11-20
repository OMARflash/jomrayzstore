import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { AuthProvider } from '@/context/AuthContext';
import AnnouncementBar from '@/components/AnnouncementBar';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';

export const metadata: Metadata = {
  title: 'JOMRAYZ | DEFINE YOUR STYLE | Egyptian Youth Fashion',
  description:
    'Modern, premium youth streetwear brand in Egypt for ages 13–25. High-density Egyptian cotton, unisex architectural cuts, and 100% Cash On Delivery nationwide.',
  keywords: [
    'JOMRAYZ',
    'Egyptian streetwear',
    'Egypt fashion brand',
    'Cairo clothing brand',
    'oversized hoodies egypt',
    'oversized tees egypt',
    'cash on delivery clothing egypt',
    '@jomrayz_star4',
  ],
  authors: [{ name: 'JOMRAYZ' }],
  metadataBase: new URL('https://jomrayz.com'),
  openGraph: {
    title: 'JOMRAYZ | DEFINE YOUR STYLE',
    description:
      'Raw Egyptian craftsmanship meets avant-garde youth streetwear. Unified collection for ages 13–25. Cash On Delivery across all 27 Governorates.',
    url: 'https://jomrayz.com',
    siteName: 'JOMRAYZ',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'JOMRAYZ Unified Collection',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JOMRAYZ | DEFINE YOUR STYLE',
    description: 'Egyptian premium streetwear brand for ages 13–25. Cash on Delivery across Egypt.',
    images: ['https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=80'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col bg-[#08080a] text-[#f3f3f5] antialiased selection:bg-red-500 selection:text-white">
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <AnnouncementBar />
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
              <CartDrawer />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
