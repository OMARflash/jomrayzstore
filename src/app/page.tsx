import React from 'react';
import prisma from '@/lib/prisma';
import HomeClient from '@/components/HomeClient';
import { Product, Category } from '@/lib/types';

export const revalidate = 0; // Dynamic data for live stock & updates

export default async function HomePage() {
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

  return <HomeClient initialProducts={products} categories={categories} />;
}
