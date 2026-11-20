import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ categories });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });

    const { name, slug, description, image } = await req.json();
    if (!name?.trim() || !slug?.trim()) {
      return NextResponse.json({ message: 'Name and slug are required' }, { status: 400 });
    }

    const category = await prisma.category.create({
      data: {
        name: name.trim(),
        slug: slug.trim(),
        description: description?.trim() || null,
        image: image?.trim() || null,
      },
    });
    return NextResponse.json({ category }, { status: 201 });
  } catch (error: any) {
    const status = error.code === 'P2002' ? 409 : 500;
    return NextResponse.json({ message: error.code === 'P2002' ? 'Name or slug already exists' : 'Failed to create catalog' }, { status });
  }
}
