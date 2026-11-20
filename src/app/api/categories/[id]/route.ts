import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });

    const { name, slug, description, image } = await req.json();
    if (!name?.trim() || !slug?.trim()) {
      return NextResponse.json({ message: 'Name and slug are required' }, { status: 400 });
    }

    const category = await prisma.category.update({
      where: { id: params.id },
      data: {
        name: name.trim(),
        slug: slug.trim(),
        description: description?.trim() || null,
        image: image?.trim() || null,
      },
    });
    return NextResponse.json({ category });
  } catch (error: any) {
    const status = error.code === 'P2002' ? 409 : error.code === 'P2025' ? 404 : 500;
    const message = status === 409 ? 'Name or slug already exists' : status === 404 ? 'Catalog not found' : 'Failed to update catalog';
    return NextResponse.json({ message }, { status });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });

    await prisma.$transaction(async (tx) => {
      await tx.product.updateMany({ where: { categoryId: params.id }, data: { categoryId: null } });
      await tx.category.delete({ where: { id: params.id } });
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    const status = error.code === 'P2025' ? 404 : 500;
    return NextResponse.json({ message: status === 404 ? 'Catalog not found' : 'Failed to delete catalog' }, { status });
  }
}