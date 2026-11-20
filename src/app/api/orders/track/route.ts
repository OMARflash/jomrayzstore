import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { orderNumber, phone } = await req.json();

    if (!orderNumber || !phone) {
      return NextResponse.json(
        { message: 'Please provide both Order Number and Phone Number.' },
        { status: 400 }
      );
    }

    const cleanOrderNumber = orderNumber.trim();
    const cleanPhone = phone.trim().replace(/\s+/g, '');

    const order = await prisma.order.findFirst({
      where: {
        orderNumber: { equals: cleanOrderNumber },
        customerPhone: { contains: cleanPhone.slice(-8) }, // Match last 8 digits for Egyptian phone formats
      },
      include: {
        items: {
          include: {
            product: {
              include: { images: true },
            },
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { message: 'No matching order found for the provided details. Please verify your order number and phone number.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    return NextResponse.json({ message: 'Tracking service error' }, { status: 500 });
  }
}
