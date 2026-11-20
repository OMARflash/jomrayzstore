import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin, getUserFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: { orderNumber: string } }
) {
  try {
    const { orderNumber } = params;

    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: {
          include: {
            product: {
              include: { images: true },
            },
          },
        },
        user: {
          select: { id: true, name: true, email: true, phone: true },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error: any) {
    return NextResponse.json({ message: 'Failed to fetch order' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { orderNumber: string } }
) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) {
      return NextResponse.json({ message: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const { orderNumber } = params;
    const { status } = await req.json();

    const validStatuses = ['RECEIVED', 'CONFIRMED', 'PREPARING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ message: 'Invalid order status' }, { status: 400 });
    }

    const currentOrder = await prisma.order.findUnique({
      where: { orderNumber },
      include: { items: true },
    });

    if (!currentOrder) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    // If changing to CANCELLED and wasn't already CANCELLED, restock items!
    if (status === 'CANCELLED' && currentOrder.status !== 'CANCELLED') {
      for (const item of currentOrder.items) {
        if (item.variantId) {
          await prisma.productVariant.update({
            where: { id: item.variantId },
            data: {
              stock: {
                increment: item.quantity,
              },
            },
          });
        }
      }
    }

    const updated = await prisma.order.update({
      where: { orderNumber },
      data: { status },
      include: {
        items: true,
      },
    });

    return NextResponse.json({ success: true, order: updated });
  } catch (error: any) {
    console.error('Update order status error:', error);
    return NextResponse.json({ message: 'Failed to update order status' }, { status: 500 });
  }
}
