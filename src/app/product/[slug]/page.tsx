import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import prisma from '@/lib/prisma';
import ProductDetailClient from '@/components/ProductDetailClient';
import { Product } from '@/lib/types';

interface ProductPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: { images: true },
  });

  if (!product) {
    return {
      title: 'Product Not Found | JOMRAYZ',
    };
  }

  const primaryImage = product.images?.[0]?.url;

  return {
    title: `${product.name} | JOMRAYZ Official Store`,
    description: product.description.slice(0, 160),
    openGraph: {
      title: `${product.name} - ${product.price} EGP | JOMRAYZ`,
      description: product.description.slice(0, 160),
      images: primaryImage ? [{ url: primaryImage }] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const dbProduct = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: {
      category: true,
      images: { orderBy: { sortOrder: 'asc' } },
      variants: true,
      reviews: {
        where: { isApproved: true },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!dbProduct || !dbProduct.isPublished) {
    notFound();
  }

  // Fetch recommended products from same category or general drops
  const dbRecommended = await prisma.product.findMany({
    where: {
      isPublished: true,
      id: { not: dbProduct.id },
    },
    include: {
      category: true,
      images: { orderBy: { sortOrder: 'asc' } },
      variants: true,
    },
    take: 4,
  });

  const product: Product = JSON.parse(JSON.stringify(dbProduct));
  const recommended: Product[] = JSON.parse(JSON.stringify(dbRecommended));

  return (
    <>
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org/',
            '@type': 'Product',
            name: product.name,
            image: product.images.map((i) => i.url),
            description: product.description,
            brand: {
              '@type': 'Brand',
              name: 'JOMRAYZ',
            },
            offers: {
              '@type': 'Offer',
              priceCurrency: 'EGP',
              price: product.price,
              availability:
                product.variants.some((v) => v.stock > 0)
                  ? 'https://schema.org/InStock'
                  : 'https://schema.org/OutOfStock',
              itemCondition: 'https://schema.org/NewCondition',
            },
          }),
        }}
      />
      <ProductDetailClient product={product} recommendedProducts={recommended} />
    </>
  );
}
