import React, { Suspense } from 'react';
import prisma from '@/lib/prisma';
import ShopClient from '@/components/ShopClient';
import { Product, Category } from '@/lib/types';

export const revalidate = 0;

export default async function ShopPage() {
  const [dbProducts, dbCategories] = await Promise.all([
    prisma.product.findMany({
      where: { isPublished: true },
      include: {
        category: true,
        images: { orderBy: { sortOrder: 'asc' } },
        variants: true,
        reviews: { where: { isApproved: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.category.findMany({
      orderBy: { name: 'asc' },
    }),
  ]);

  const products: Product[] = JSON.parse(JSON.stringify(dbProducts));
  const categories: Category[] = JSON.parse(JSON.stringify(dbCategories));

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Loading JOMRAYZ shop...</div>}>
      <ShopClient initialProducts={products} categories={categories} />
    </Suspense>
  );
}
