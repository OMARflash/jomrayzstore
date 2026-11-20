import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');
    const categorySlug = searchParams.get('category');
    const size = searchParams.get('size');
    const color = searchParams.get('color');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const inStock = searchParams.get('inStock');
    const isNewDrop = searchParams.get('newDrop');
    const isBestSeller = searchParams.get('bestSeller');
    const sort = searchParams.get('sort') || 'newest';
    const includeUnpublished = searchParams.get('includeUnpublished') === 'true';

    const where: any = {};

    if (!includeUnpublished) {
      where.isPublished = true;
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { material: { contains: search } },
      ];
    }

    if (categorySlug && categorySlug !== 'all') {
      where.category = {
        slug: categorySlug,
      };
    }

    if (isNewDrop === 'true') {
      where.isNewDrop = true;
    }

    if (isBestSeller === 'true') {
      where.isBestSeller = true;
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    // Filter by variant size or color or stock
    if (size || color || inStock === 'true') {
      where.variants = {
        some: {
          ...(size ? { size } : {}),
          ...(color ? { colorName: { contains: color } } : {}),
          ...(inStock === 'true' ? { stock: { gt: 0 } } : {}),
        },
      };
    }

    // Sorting
    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price-low') {
      orderBy = { price: 'asc' };
    } else if (sort === 'price-high') {
      orderBy = { price: 'desc' };
    } else if (sort === 'bestselling') {
      orderBy = { isBestSeller: 'desc' };
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
        images: {
          orderBy: { sortOrder: 'asc' },
        },
        variants: true,
        reviews: {
          where: { isApproved: true },
        },
      },
      orderBy,
    });

    return NextResponse.json({ products });
  } catch (error: any) {
    console.error('Products fetch error:', error);
    return NextResponse.json({ message: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) {
      return NextResponse.json({ message: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const data = await req.json();
    const {
      name,
      slug,
      description,
      material,
      care,
      price,
      originalPrice,
      isNewDrop,
      isBestSeller,
      isPublished,
      categoryId,
      images,
      variants,
    } = data;

    if (!name || !slug || !price) {
      return NextResponse.json({ message: 'Name, slug and price are required' }, { status: 400 });
    }

    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ message: 'A product with this slug already exists' }, { status: 400 });
    }

    const newProduct = await prisma.product.create({
      data: {
        name,
        slug,
        description: description || '',
        material,
        care,
        price: parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : null,
        isNewDrop: Boolean(isNewDrop),
        isBestSeller: Boolean(isBestSeller),
        isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
        categoryId: categoryId || null,
        images: {
          create: (images || []).map((img: any, idx: number) => ({
            url: typeof img === 'string' ? img : img.url,
            alt: typeof img === 'string' ? name : (img.alt || name),
            sortOrder: idx,
          })),
        },
        variants: {
          create: (variants || []).map((v: any) => ({
            size: v.size,
            colorName: v.colorName,
            colorHex: v.colorHex || '#000000',
            stock: parseInt(v.stock) || 0,
            sku: v.sku || `JOM-${slug.substring(0, 4).toUpperCase()}-${v.colorName.substring(0, 3).toUpperCase()}-${v.size}`,
          })),
        },
      },
      include: {
        category: true,
        images: true,
        variants: true,
      },
    });

    return NextResponse.json({ success: true, product: newProduct }, { status: 201 });
  } catch (error: any) {
    console.error('Create product error:', error);
    return NextResponse.json({ message: error.message || 'Failed to create product' }, { status: 500 });
  }
}
