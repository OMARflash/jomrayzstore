import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { code, subtotal } = await req.json();

    if (!code) {
      return NextResponse.json({ message: 'Coupon code is required' }, { status: 400 });
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.trim().toUpperCase() },
    });

    if (!coupon || !coupon.isActive) {
      return NextResponse.json({ message: 'Invalid or expired coupon code' }, { status: 400 });
    }

    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return NextResponse.json({ message: 'This coupon has expired' }, { status: 400 });
    }

    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return NextResponse.json({ message: 'This coupon has reached its maximum usage limit' }, { status: 400 });
    }

    const orderSubtotal = parseFloat(subtotal) || 0;
    if (orderSubtotal < coupon.minOrderValue) {
      return NextResponse.json(
        { message: `Coupon requires a minimum order subtotal of ${coupon.minOrderValue} EGP` },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minOrderValue: coupon.minOrderValue,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ message: 'Failed to validate coupon' }, { status: 500 });
  }
}
