import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const governorate = searchParams.get('governorate');

    if (governorate) {
      const rate = await prisma.shippingRate.findFirst({
        where: {
          OR: [
            { governorate: { equals: governorate } },
            { governorateAr: { equals: governorate } },
          ],
        },
      });

      if (!rate) {
        return NextResponse.json({ rate: 60, estimatedDays: '2-3 business days' });
      }

      return NextResponse.json(rate);
    }

    const rates = await prisma.shippingRate.findMany({
      orderBy: { governorate: 'asc' },
    });

    return NextResponse.json({ rates });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch shipping rates' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const { id, rate, estimatedDays, isActive } = await req.json();

    const updated = await prisma.shippingRate.update({
      where: { id },
      data: {
        rate: rate !== undefined ? parseFloat(rate) : undefined,
        estimatedDays: estimatedDays !== undefined ? estimatedDays : undefined,
        isActive: isActive !== undefined ? Boolean(isActive) : undefined,
      },
    });

    return NextResponse.json({ success: true, rate: updated });
  } catch (error: any) {
    return NextResponse.json({ message: 'Failed to update shipping rate' }, { status: 500 });
  }
}
