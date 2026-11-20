import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromRequest, requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');
    const adminMode = searchParams.get('admin') === 'true';

    if (adminMode) {
      const admin = await requireAdmin(req);
      if (!admin) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
      }

      const reviews = await prisma.review.findMany({
        include: {
          product: {
            select: { id: true, name: true, slug: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
      return NextResponse.json({ reviews });
    }

    if (!productId) {
      return NextResponse.json({ message: 'ProductId is required' }, { status: 400 });
    }

    const reviews = await prisma.review.findMany({
      where: {
        productId,
        isApproved: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ reviews });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    const { productId, authorName, rating, comment, customerPhone } = await req.json();

    if (!productId || !authorName || !rating || !comment) {
      return NextResponse.json({ message: 'All review fields are required' }, { status: 400 });
    }

    // Check if verified purchase: check if this user or phone bought this product in any delivered/confirmed order
    let isVerifiedPurchase = false;
    const orderCheck = await prisma.orderItem.findFirst({
      where: {
        productId,
        order: {
          OR: [
            ...(user ? [{ userId: user.id }] : []),
            ...(customerPhone ? [{ customerPhone: { contains: customerPhone.slice(-8) } }] : []),
          ],
        },
      },
    });

    if (orderCheck) {
      isVerifiedPurchase = true;
    }

    const review = await prisma.review.create({
      data: {
        productId,
        userId: user ? user.id : null,
        authorName: authorName.trim(),
        rating: Math.min(5, Math.max(1, parseInt(rating))),
        comment: comment.trim(),
        isVerifiedPurchase,
        isApproved: true, // Auto-approve or admin can moderate
      },
    });

    return NextResponse.json({ success: true, review }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Failed to submit review' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const { id, isApproved } = await req.json();
    const updated = await prisma.review.update({
      where: { id },
      data: { isApproved: Boolean(isApproved) },
    });

    return NextResponse.json({ success: true, review: updated });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to update review' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const { id } = await req.json();
    await prisma.review.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Review deleted' });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to delete review' }, { status: 500 });
  }
}
