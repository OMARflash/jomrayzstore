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

    const users = await prisma.user.findMany({
      where: { role: 'USER' },
      include: {
        orders: {
          select: {
            id: true,
            orderNumber: true,
            status: true,
            totalAmount: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const customersWithStats = users.map((u) => {
      const completedOrders = u.orders.filter((o) => o.status !== 'CANCELLED');
      const totalSpent = completedOrders.reduce((sum, o) => sum + o.totalAmount, 0);
      return {
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        totalOrders: u.orders.length,
        totalSpent,
        recentOrders: u.orders.slice(0, 3),
        createdAt: u.createdAt,
      };
    });

    return NextResponse.json({ customers: customersWithStats });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch customers' }, { status: 500 });
  }
}
