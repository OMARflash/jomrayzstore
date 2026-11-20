import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const variants = await prisma.productVariant.findMany({
      include: {
        product: {
          select: { id: true, name: true, slug: true, price: true, images: true },
        },
      },
      orderBy: [
        { product: { name: 'asc' } },
        { size: 'asc' },
      ],
    });

    return NextResponse.json({ variants });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch inventory' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const { id, stock } = await req.json();

    const updated = await prisma.productVariant.update({
      where: { id },
      data: {
        stock: Math.max(0, parseInt(stock) || 0),
      },
    });

    return NextResponse.json({ success: true, variant: updated });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to update stock' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const { productId, colorName } = await req.json();
    if (!productId || !colorName) {
      return NextResponse.json({ message: 'Product and color are required' }, { status: 400 });
    }

    const result = await prisma.$transaction(async (tx) => {
      const variants = await tx.productVariant.findMany({
        where: { productId, colorName },
        select: { id: true },
      });
      if (variants.length === 0) return 0;

      await tx.orderItem.updateMany({
        where: { variantId: { in: variants.map((variant) => variant.id) } },
        data: { variantId: null },
      });
      const deleted = await tx.productVariant.deleteMany({ where: { productId, colorName } });
      return deleted.count;
    });

    if (!result) {
      return NextResponse.json({ message: 'Color not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, deletedCount: result });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to delete color' }, { status: 500 });
  }
}
