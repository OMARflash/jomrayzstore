import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';
import { generateOrderNumber } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    const body = await req.json();

    const {
      customerName,
      customerPhone,
      governorate,
      city,
      address,
      building,
      floor,
      apartment,
      notes,
      couponCode,
      items, // array of { productId, variantId, quantity }
      paymentMethod,
    } = body;

    // Strict validation
    if (!customerName || !customerPhone || !governorate || !city || !address) {
      return NextResponse.json(
        { message: 'Missing required shipping information (Name, Phone, Governorate, City, and Address are required).' },
        { status: 400 }
      );
    }

    // Payment validation: Cash on Delivery ONLY
    if (paymentMethod && paymentMethod !== 'COD') {
      return NextResponse.json(
        { message: 'Only Cash on Delivery (COD) is supported for JOMRAYZ.' },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ message: 'Your cart is empty.' }, { status: 400 });
    }

    // 1. Fetch Shipping Rate from DB for this governorate
    const shippingRecord = await prisma.shippingRate.findFirst({
      where: {
        OR: [
          { governorate: { equals: governorate } },
          { governorateAr: { equals: governorate } },
        ],
      },
    });

    const baseShippingFee = shippingRecord ? shippingRecord.rate : 60; // fallback standard 60 EGP

    // 2. Fetch and securely calculate subtotal and verify stock from DB
    let calculatedSubtotal = 0;
    const validatedItems: Array<{
      productId: string;
      variantId: string | null;
      productName: string;
      size: string;
      color: string;
      quantity: number;
      price: number;
      total: number;
    }> = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        include: { variants: true },
      });

      if (!product || !product.isPublished) {
        return NextResponse.json(
          { message: `Product ${item.productName || item.productId} is no longer available.` },
          { status: 400 }
        );
      }

      const variant = product.variants.find((v) => v.id === item.variantId);
      if (!variant) {
        return NextResponse.json(
          { message: `Selected variant for "${product.name}" was not found.` },
          { status: 400 }
        );
      }

      const requestedQty = parseInt(item.quantity) || 1;
      if (variant.stock < requestedQty) {
        return NextResponse.json(
          {
            message: `Not enough stock for "${product.name}" (${variant.size} - ${variant.colorName}). Only ${variant.stock} left.`,
          },
          { status: 400 }
        );
      }

      const itemTotal = product.price * requestedQty;
      calculatedSubtotal += itemTotal;

      validatedItems.push({
        productId: product.id,
        variantId: variant.id,
        productName: product.name,
        size: variant.size,
        color: variant.colorName,
        quantity: requestedQty,
        price: product.price,
        total: itemTotal,
      });
    }

    // 3. Securely validate coupon discount on server
    let discountAmount = 0;
    let validatedCoupon = null;

    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode.trim().toUpperCase() },
      });

      if (coupon && coupon.isActive) {
        const isNotExpired = !coupon.expiresAt || new Date(coupon.expiresAt) > new Date();
        const hasUsesLeft = !coupon.maxUses || coupon.usedCount < coupon.maxUses;
        const meetsMin = calculatedSubtotal >= coupon.minOrderValue;

        if (isNotExpired && hasUsesLeft && meetsMin) {
          validatedCoupon = coupon;
          if (coupon.discountType === 'PERCENTAGE') {
            discountAmount = (calculatedSubtotal * coupon.discountValue) / 100;
          } else {
            discountAmount = coupon.discountValue;
          }
        }
      }
    }

    // Free shipping threshold over 2500 EGP
    const finalShippingFee = calculatedSubtotal >= 2500 ? 0 : baseShippingFee;
    const finalTotal = Math.max(0, calculatedSubtotal - discountAmount + finalShippingFee);

    const orderNumber = generateOrderNumber();

    // 4. Execute atomic transaction: create order, decrement variant stock, increment coupon usedCount
    const createdOrder = await prisma.$transaction(async (tx) => {
      // Decrement stock
      for (const item of validatedItems) {
        if (item.variantId) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          });
        }
      }

      // Increment coupon if used
      if (validatedCoupon) {
        await tx.coupon.update({
          where: { id: validatedCoupon.id },
          data: {
            usedCount: {
              increment: 1,
            },
          },
        });
      }

      // Create Order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId: user ? user.id : null,
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          governorate: governorate.trim(),
          city: city.trim(),
          address: address.trim(),
          building: building ? building.trim() : null,
          floor: floor ? floor.trim() : null,
          apartment: apartment ? apartment.trim() : null,
          notes: notes ? notes.trim() : null,
          paymentMethod: 'COD',
          status: 'RECEIVED',
          subtotal: calculatedSubtotal,
          shippingFee: finalShippingFee,
          discountAmount: discountAmount,
          totalAmount: finalTotal,
          couponCode: validatedCoupon ? validatedCoupon.code : null,
          items: {
            create: validatedItems.map((item) => ({
              productId: item.productId,
              variantId: item.variantId,
              productName: item.productName,
              size: item.size,
              color: item.color,
              quantity: item.quantity,
              price: item.price,
              total: item.total,
            })),
          },
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

      return newOrder;
    });

    return NextResponse.json({
      success: true,
      order: createdOrder,
      orderNumber: createdOrder.orderNumber,
    });
  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json({ message: error.message || 'Failed to place order' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const where: any = {};

    if (user.role !== 'ADMIN') {
      where.userId = user.id;
    } else {
      if (status && status !== 'ALL') {
        where.status = status;
      }
    }

    const orders = await prisma.order.findMany({
      where,
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
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ orders });
  } catch (error: any) {
    console.error('Orders fetch error:', error);
    return NextResponse.json({ message: 'Failed to fetch orders' }, { status: 500 });
  }
}
