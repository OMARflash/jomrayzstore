import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id: id }, { slug: id }],
      },
      include: {
        category: true,
        images: {
          orderBy: { sortOrder: 'asc' },
        },
        variants: true,
        reviews: {
          where: { isApproved: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error: any) {
    return NextResponse.json({ message: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) {
      return NextResponse.json({ message: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const { id } = params;
    const body = await req.json();
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
    } = body;

    // Update base fields
    const updated = await prisma.product.update({
      where: { id },
      data: {
        name,
        slug,
        description,
        material,
        care,
        price: price !== undefined ? parseFloat(price) : undefined,
        originalPrice: originalPrice !== undefined ? (originalPrice ? parseFloat(originalPrice) : null) : undefined,
        isNewDrop: isNewDrop !== undefined ? Boolean(isNewDrop) : undefined,
        isBestSeller: isBestSeller !== undefined ? Boolean(isBestSeller) : undefined,
        isPublished: isPublished !== undefined ? Boolean(isPublished) : undefined,
        categoryId: categoryId !== undefined ? categoryId : undefined,
      },
    });

    // If images supplied, replace
    if (images && Array.isArray(images)) {
      await prisma.productImage.deleteMany({ where: { productId: id } });
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        await prisma.productImage.create({
          data: {
            productId: id,
            url: typeof img === 'string' ? img : img.url,
            alt: typeof img === 'string' ? name : (img.alt || name),
            sortOrder: i,
          },
        });
      }
    }

    // If variants supplied, update or recreate
    if (variants && Array.isArray(variants)) {
      await prisma.productVariant.deleteMany({ where: { productId: id } });
      for (const v of variants) {
        await prisma.productVariant.create({
          data: {
            productId: id,
            size: v.size,
            colorName: v.colorName,
            colorHex: v.colorHex || '#000000',
            stock: parseInt(v.stock) || 0,
            sku: v.sku || `JOM-${slug.substring(0, 4).toUpperCase()}-${v.colorName.substring(0, 3).toUpperCase()}-${v.size}`,
          },
        });
      }
    }

    const completeProduct = await prisma.product.findUnique({
      where: { id },
      include: { category: true, images: true, variants: true },
    });

    return NextResponse.json({ success: true, product: completeProduct });
  } catch (error: any) {
    console.error('Update product error:', error);
    return NextResponse.json({ message: error.message || 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) {
      return NextResponse.json({ message: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const { id } = params;
    await prisma.$transaction(async (tx) => {
      await tx.orderItem.updateMany({
        where: { productId: id },
        data: { productId: null, variantId: null },
      });
      await tx.product.delete({ where: { id } });
    });

    return NextResponse.json({ success: true, message: 'Product deleted' });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to delete product' }, { status: 500 });
  }
}
