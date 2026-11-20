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

    const [
      orders,
      totalCustomers,
      products,
      variants,
      reviews,
    ] = await Promise.all([
      prisma.order.findMany({
        include: {
          items: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where: { role: 'USER' } }),
      prisma.product.findMany({
        include: {
          variants: true,
          images: true,
          orderItems: true,
        },
      }),
      prisma.productVariant.findMany({
        include: { product: true },
      }),
      prisma.review.count(),
    ]);

    const totalOrders = orders.length;
    const deliveredOrders = orders.filter((o) => o.status === 'DELIVERED').length;
    const cancelledOrders = orders.filter((o) => o.status === 'CANCELLED').length;
    const pendingOrders = orders.filter((o) => ['RECEIVED', 'CONFIRMED', 'PREPARING', 'SHIPPED'].includes(o.status)).length;

    // Total sales excludes cancelled orders
    const totalSales = orders
      .filter((o) => o.status !== 'CANCELLED')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    const averageOrderValue = totalOrders > 0 ? Math.round(totalSales / (totalOrders - cancelledOrders || 1)) : 0;

    // Low stock variants (< 5)
    const lowStockItems = variants.filter((v) => v.stock < 5);

    // Best selling products by quantity ordered
    const productSalesMap: Record<string, { product: any; totalSold: number; revenue: number }> = {};
    for (const order of orders) {
      if (order.status !== 'CANCELLED') {
        for (const item of order.items) {
          if (!item.productId) continue;
          if (!productSalesMap[item.productId]) {
            const p = products.find((prod) => prod.id === item.productId);
            productSalesMap[item.productId] = {
              product: p || { name: item.productName },
              totalSold: 0,
              revenue: 0,
            };
          }
          productSalesMap[item.productId].totalSold += item.quantity;
          productSalesMap[item.productId].revenue += item.total;
        }
      }
    }

    const bestSellers = Object.values(productSalesMap)
      .sort((a, b) => b.totalSold - a.totalSold)
      .slice(0, 5);

    // Sales by governorate
    const govDistribution: Record<string, number> = {};
    for (const order of orders) {
      govDistribution[order.governorate] = (govDistribution[order.governorate] || 0) + 1;
    }

    return NextResponse.json({
      stats: {
        totalSales,
        totalOrders,
        pendingOrders,
        deliveredOrders,
        cancelledOrders,
        totalCustomers,
        totalProducts: products.length,
        totalReviews: reviews,
        averageOrderValue,
        lowStockCount: lowStockItems.length,
      },
      lowStockItems: lowStockItems.map((v) => ({
        id: v.id,
        productName: v.product.name,
        size: v.size,
        color: v.colorName,
        stock: v.stock,
      })),
      bestSellers,
      recentOrders: orders.slice(0, 8),
      governorateDistribution: govDistribution,
    });
  } catch (error: any) {
    console.error('Stats error:', error);
    return NextResponse.json({ message: 'Failed to fetch dashboard stats' }, { status: 500 });
  }
}
