const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('--- Starting JOMRAYZ Database Seed ---');

  // 1. Create Admin & Demo Customer
  const rawAdminPassword = process.env.ADMIN_PASSWORD;
  if (!rawAdminPassword || rawAdminPassword.length < 12) {
    throw new Error('Set ADMIN_PASSWORD to a value of at least 12 characters before seeding.');
  }
  const adminPassword = await bcrypt.hash(rawAdminPassword, 10);
  const customerPassword = await bcrypt.hash('customer123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@jomrayz.com' },
    update: { password: adminPassword },
    create: {
      email: 'admin@jomrayz.com',
      password: adminPassword,
      name: 'JOMRAYZ Admin',
      phone: '01000000001',
      role: 'ADMIN',
    },
  });

  const demoCustomer = await prisma.user.upsert({
    where: { email: 'customer@jomrayz.com' },
    update: {},
    create: {
      email: 'customer@jomrayz.com',
      password: customerPassword,
      name: 'Youssef El-Sayed',
      phone: '01012345678',
      role: 'USER',
    },
  });

  console.log('Created Users:', { admin: admin.email, customer: demoCustomer.email });

  // 2. Egyptian Shipping Rates (All 27 Governorates)
  const shippingData = [
    { governorate: 'Cairo', governorateAr: 'القاهرة', rate: 50, estimatedDays: '1-2 business days' },
    { governorate: 'Giza', governorateAr: 'الجيزة', rate: 50, estimatedDays: '1-2 business days' },
    { governorate: 'Alexandria', governorateAr: 'الإسكندرية', rate: 60, estimatedDays: '2-3 business days' },
    { governorate: 'Qalyubia', governorateAr: 'القليوبية', rate: 60, estimatedDays: '2-3 business days' },
    { governorate: 'Sharqia', governorateAr: 'الشرقية', rate: 65, estimatedDays: '2-3 business days' },
    { governorate: 'Dakahlia', governorateAr: 'الدقهلية', rate: 65, estimatedDays: '2-3 business days' },
    { governorate: 'Gharbia', governorateAr: 'الغربية', rate: 65, estimatedDays: '2-3 business days' },
    { governorate: 'Monufia', governorateAr: 'المنوفية', rate: 65, estimatedDays: '2-3 business days' },
    { governorate: 'Beheira', governorateAr: 'البحيرة', rate: 65, estimatedDays: '2-3 business days' },
    { governorate: 'Kafr El Sheikh', governorateAr: 'كفر الشيخ', rate: 70, estimatedDays: '2-3 business days' },
    { governorate: 'Damietta', governorateAr: 'دمياط', rate: 70, estimatedDays: '2-3 business days' },
    { governorate: 'Port Said', governorateAr: 'بورسعيد', rate: 70, estimatedDays: '2-3 business days' },
    { governorate: 'Ismailia', governorateAr: 'الإسماعيلية', rate: 70, estimatedDays: '2-3 business days' },
    { governorate: 'Suez', governorateAr: 'السويس', rate: 70, estimatedDays: '2-3 business days' },
    { governorate: 'Beni Suef', governorateAr: 'بني سويف', rate: 80, estimatedDays: '3-4 business days' },
    { governorate: 'Faiyum', governorateAr: 'الفيوم', rate: 80, estimatedDays: '3-4 business days' },
    { governorate: 'Minya', governorateAr: 'المنيا', rate: 85, estimatedDays: '3-4 business days' },
    { governorate: 'Asyut', governorateAr: 'أسيوط', rate: 85, estimatedDays: '3-4 business days' },
    { governorate: 'Sohag', governorateAr: 'سوهاج', rate: 90, estimatedDays: '3-4 business days' },
    { governorate: 'Qena', governorateAr: 'قنا', rate: 90, estimatedDays: '3-4 business days' },
    { governorate: 'Luxor', governorateAr: 'الأقصر', rate: 95, estimatedDays: '3-4 business days' },
    { governorate: 'Aswan', governorateAr: 'أسوان', rate: 100, estimatedDays: '3-5 business days' },
    { governorate: 'Red Sea', governorateAr: 'البحر الأحمر', rate: 100, estimatedDays: '3-5 business days' },
    { governorate: 'Matrouh', governorateAr: 'مطروح', rate: 100, estimatedDays: '3-5 business days' },
    { governorate: 'New Valley', governorateAr: 'الوادي الجديد', rate: 110, estimatedDays: '4-5 business days' },
    { governorate: 'North Sinai', governorateAr: 'شمال سيناء', rate: 110, estimatedDays: '4-6 business days' },
    { governorate: 'South Sinai', governorateAr: 'جنوب سيناء', rate: 110, estimatedDays: '4-6 business days' },
  ];

  for (const s of shippingData) {
    await prisma.shippingRate.upsert({
      where: { governorate: s.governorate },
      update: s,
      create: s,
    });
  }
  console.log(`Seeded ${shippingData.length} Egyptian Shipping Rates.`);

  // 3. Coupons
  const coupons = [
    {
      code: 'JOMRAYZ10',
      discountType: 'PERCENTAGE',
      discountValue: 10,
      minOrderValue: 1000,
      maxUses: 500,
      isActive: true,
    },
    {
      code: 'WELCOME150',
      discountType: 'FIXED',
      discountValue: 150,
      minOrderValue: 1200,
      maxUses: 200,
      isActive: true,
    },
    {
      code: 'TIKTOK20',
      discountType: 'PERCENTAGE',
      discountValue: 20,
      minOrderValue: 1100,
      maxUses: 1000,
      isActive: true,
    },
  ];

  for (const c of coupons) {
    await prisma.coupon.upsert({
      where: { code: c.code },
      update: c,
      create: c,
    });
  }
  console.log(`Seeded Coupons.`);

  // 4. Categories (UNISEX ONLY - NO MEN/WOMEN)
  const categories = [
    {
      name: 'Hoodies & Sweatshirts',
      slug: 'hoodies-sweatshirts',
      description: 'Heavyweight Egyptian cotton oversized silhouettes and modern cuts.',
      image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80',
    },
    {
      name: 'Oversized Tees',
      slug: 'oversized-tees',
      description: 'Relaxed drop-shoulder tees engineered from 100% Egyptian combed cotton.',
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80',
    },
    {
      name: 'Cargo & Parachute Pants',
      slug: 'cargo-pants',
      description: 'Tactical multi-pocket utility trousers with adjustable toggle hems.',
      image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1000&q=80',
    },
    {
      name: 'Jackets & Outerwear',
      slug: 'jackets-outerwear',
      description: 'Minimalist tech-nylon windbreakers and structured zip-ups.',
      image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1000&q=80',
    },
    {
      name: 'Accessories & Headwear',
      slug: 'accessories-headwear',
      description: 'Structured curved-brim caps, cross-body pouches and signature beanies.',
      image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=1000&q=80',
    },
  ];

  const catMap = {};
  for (const cat of categories) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
    catMap[cat.slug] = created.id;
  }
  console.log(`Seeded Unified Categories.`);

  // 5. Products (1,000 - 1,500 EGP, Unified Fashion Collection)
  const products = [
    {
      name: 'JOMRAYZ Signature Boxy Heavyweight Hoodie',
      slug: 'jomrayz-signature-boxy-hoodie',
      description: 'The definitive JOMRAYZ staple. Crafted from 460 GSM Egyptian combed cotton with double-layer hood, drop-shoulder tailoring, and tonal embroidered micro-branding. Designed with an ultra-clean drape for effortless daily styling.',
      material: '100% Premium Egyptian Combed Cotton (460 GSM French Terry)',
      care: 'Cold wash inside-out (30°C). Air dry only. Do not iron directly on tonal embroidery.',
      price: 1390,
      originalPrice: 1550,
      isNewDrop: true,
      isBestSeller: true,
      categorySlug: 'hoodies-sweatshirts',
      images: [
        'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1000&q=80',
      ],
      colors: [
        { name: 'Onyx Black', hex: '#111111' },
        { name: 'Washed Grey', hex: '#4B4D52' },
        { name: 'Raw Bone', hex: '#E6E2DD' },
      ],
      sizes: ['S', 'M', 'L', 'XL'],
    },
    {
      name: 'Vortex Heavyweight Acid-Wash Tee',
      slug: 'vortex-heavyweight-acid-wash-tee',
      description: 'Mineral-washed streetwear silhouette with high-density ribbed collar and signature boxy fit. Each piece features a unique artisan acid-wash finish executed in Cairo mills.',
      material: '100% Egyptian Giza Cotton (280 GSM Heavyweight Jersey)',
      care: 'Machine wash cold with like dark colors. Tumble dry delicate or hang dry.',
      price: 1050,
      originalPrice: 1200,
      isNewDrop: true,
      isBestSeller: true,
      categorySlug: 'oversized-tees',
      images: [
        'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=80',
      ],
      colors: [
        { name: 'Washed Charcoal', hex: '#2C2D30' },
        { name: 'Desert Dune', hex: '#C2B69D' },
        { name: 'Onyx Black', hex: '#0B0B0C' },
      ],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    },
    {
      name: 'Cyber-Tactical Wide Leg Cargo Pants',
      slug: 'cyber-tactical-wide-leg-cargo',
      description: 'Futuristic wide-leg cargo pants featuring deep geometric cargo pouches, articulated knee pleats, and dual-direction bungee drawcords at the hem for convertible tapered styling.',
      material: 'Durable Heavy Cotton Twill & Water-Repellent Matte Finish',
      care: 'Wash inside-out with cold water. Do not bleach. Cool iron if needed.',
      price: 1450,
      originalPrice: null,
      isNewDrop: true,
      isBestSeller: false,
      categorySlug: 'cargo-pants',
      images: [
        'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=1000&q=80',
      ],
      colors: [
        { name: 'Pitch Black', hex: '#000000' },
        { name: 'Military Olive', hex: '#495243' },
        { name: 'Washed Grey', hex: '#58595B' },
      ],
      sizes: ['S', 'M', 'L', 'XL'],
    },
    {
      name: 'Echo Tech Minimalist Windbreaker Jacket',
      slug: 'echo-tech-windbreaker-jacket',
      description: 'Clean architectural windbreaker with dual waterproof front zippers, hidden chest pocket, adjustable high-funnel storm collar, and tonal rubberized JOMRAYZ sleeve badge.',
      material: '100% Recycled Matte Taslan Nylon with Water-Resistant Coating',
      care: 'Gentle wipe down or machine wash delicate cold. Hang dry.',
      price: 1490,
      originalPrice: 1650,
      isNewDrop: false,
      isBestSeller: true,
      categorySlug: 'jackets-outerwear',
      images: [
        'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=1000&q=80',
      ],
      colors: [
        { name: 'Midnight Onyx', hex: '#131416' },
        { name: 'Frosted Stone', hex: '#D8D9D7' },
      ],
      sizes: ['M', 'L', 'XL'],
    },
    {
      name: 'Define Your Style Statement Crewneck',
      slug: 'define-your-style-crewneck',
      description: 'The signature youth statement sweatshirt showcasing high-definition puff-print typography on the back and tonal embroidered coordinates on the wrist cuff. Ultra-soft brushed fleece interior.',
      material: '100% Egyptian Combed Cotton Terry (400 GSM)',
      care: 'Machine wash cold. Do not iron directly on puff printing.',
      price: 1250,
      originalPrice: 1400,
      isNewDrop: true,
      isBestSeller: true,
      categorySlug: 'hoodies-sweatshirts',
      images: [
        'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1000&q=80',
      ],
      colors: [
        { name: 'Off-White Milk', hex: '#F0ECE1' },
        { name: 'Shadow Black', hex: '#161616' },
        { name: 'Steel Blue', hex: '#3B4D5C' },
      ],
      sizes: ['S', 'M', 'L', 'XL'],
    },
    {
      name: 'Monolith Drop-Shoulder Oversized Tee',
      slug: 'monolith-drop-shoulder-tee',
      description: 'Engineered with clean architectural proportions, seamless shoulder transitions, and a crisp 3.5cm ribbed crew collar that retains its shape indefinitely.',
      material: '100% Ultra-Fine Egyptian Cotton (260 GSM)',
      care: 'Machine wash 30°C. Medium iron.',
      price: 1000,
      originalPrice: null,
      isNewDrop: false,
      isBestSeller: true,
      categorySlug: 'oversized-tees',
      images: [
        'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80',
      ],
      colors: [
        { name: 'Pure Chalk', hex: '#FFFFFF' },
        { name: 'Pitch Black', hex: '#0B0B0C' },
        { name: 'Raw Olive', hex: '#3F4436' },
      ],
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
    },
    {
      name: 'Parachute Balloon Cargo Sweats',
      slug: 'parachute-balloon-cargo-sweats',
      description: 'Merging the relaxed drape of heavyweight sweatpants with the utility of streetwear parachute pants. Elasticated drawstring waistband with metallic toggles and twin bellow thigh pockets.',
      material: '100% Egyptian French Terry (420 GSM)',
      care: 'Machine wash inside out. Tumble dry low.',
      price: 1350,
      originalPrice: 1500,
      isNewDrop: false,
      isBestSeller: false,
      categorySlug: 'cargo-pants',
      images: [
        'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=1000&q=80',
      ],
      colors: [
        { name: 'Washed Black', hex: '#222224' },
        { name: 'Concrete Grey', hex: '#7E8085' },
      ],
      sizes: ['S', 'M', 'L', 'XL'],
    },
    {
      name: 'Star4 High-Crown Structured 6-Panel Cap',
      slug: 'star4-high-crown-structured-cap',
      description: 'Official JOMRAYZ @jomrayz_star4 capsule cap. Structured high crown with heavy-buckram backing, 3D embroidered star insignia, and brushed metallic rear closure clasp.',
      material: '100% Heavy Brushed Cotton Chino',
      care: 'Spot clean with damp cloth only. Do not machine wash.',
      price: 1100,
      originalPrice: 1250,
      isNewDrop: true,
      isBestSeller: true,
      categorySlug: 'accessories-headwear',
      images: [
        'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?auto=format&fit=crop&w=1000&q=80',
      ],
      colors: [
        { name: 'Onyx Black', hex: '#000000' },
        { name: 'Bone Cream', hex: '#EBE7DF' },
      ],
      sizes: ['ONE SIZE'],
    },
  ];

  for (const p of products) {
    const categoryId = catMap[p.categorySlug];
    const createdProduct = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        description: p.description,
        material: p.material,
        care: p.care,
        price: p.price,
        originalPrice: p.originalPrice,
        isNewDrop: p.isNewDrop,
        isBestSeller: p.isBestSeller,
        isPublished: true,
        categoryId: categoryId,
      },
      create: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        material: p.material,
        care: p.care,
        price: p.price,
        originalPrice: p.originalPrice,
        isNewDrop: p.isNewDrop,
        isBestSeller: p.isBestSeller,
        isPublished: true,
        categoryId: categoryId,
      },
    });

    // Delete existing images & variants to re-seed cleanly
    await prisma.productImage.deleteMany({ where: { productId: createdProduct.id } });
    await prisma.productVariant.deleteMany({ where: { productId: createdProduct.id } });

    // Add Images
    for (let i = 0; i < p.images.length; i++) {
      await prisma.productImage.create({
        data: {
          productId: createdProduct.id,
          url: p.images[i],
          alt: `${p.name} - View ${i + 1}`,
          sortOrder: i,
        },
      });
    }

    // Add Variants (Sizes x Colors) with realistic stock!
    for (const color of p.colors) {
      for (const size of p.sizes) {
        const stockQty = Math.floor(Math.random() * 15) + 3; // 3 to 18 in stock
        const sku = `JOM-${p.slug.substring(0, 4).toUpperCase()}-${color.name.substring(0, 3).toUpperCase()}-${size}`;
        await prisma.productVariant.create({
          data: {
            productId: createdProduct.id,
            size: size,
            colorName: color.name,
            colorHex: color.hex,
            stock: stockQty,
            sku: sku,
          },
        });
      }
    }

    // Add 2 realistic verified reviews
    await prisma.review.createMany({
      data: [
        {
          productId: createdProduct.id,
          authorName: 'Karim Mostafa (Cairo)',
          rating: 5,
          comment: 'The quality of the Egyptian cotton on this piece is insane! Super heavyweight drape and feels like a 3000 EGP international brand. Cash on delivery courier arrived in 24 hours in New Cairo.',
          isVerifiedPurchase: true,
          isApproved: true,
        },
        {
          productId: createdProduct.id,
          authorName: 'Salma Nour (Alexandria)',
          rating: 5,
          comment: 'Perfect boxy unisex cut! Fits oversized just like the TikTok reels show. Will definitely order the other color in the next drop.',
          isVerifiedPurchase: true,
          isApproved: true,
        },
      ],
    });
  }

  console.log(`Successfully seeded ${products.length} Unified Products with Variants, Images, and Reviews.`);

  // 6. Seed a sample Cash on Delivery order for demo customer
  const firstProduct = await prisma.product.findFirst({
    include: { variants: true },
  });

  if (firstProduct && firstProduct.variants.length > 0) {
    const variant = firstProduct.variants[0];
    const sampleOrderNumber = 'JOM-2026-98124';
    
    // Check if order exists
    const existingOrder = await prisma.order.findUnique({
      where: { orderNumber: sampleOrderNumber },
    });

    if (!existingOrder) {
      const order = await prisma.order.create({
        data: {
          orderNumber: sampleOrderNumber,
          userId: demoCustomer.id,
          customerName: 'Youssef El-Sayed',
          customerPhone: '01012345678',
          governorate: 'Cairo',
          city: 'Nasr City',
          address: 'Abbas El-Akkad St, Building 14',
          building: '14',
          floor: '4',
          apartment: '12',
          notes: 'Please call before delivering, cash is ready at home.',
          paymentMethod: 'COD',
          status: 'SHIPPED',
          subtotal: firstProduct.price,
          shippingFee: 50,
          discountAmount: 0,
          totalAmount: firstProduct.price + 50,
          items: {
            create: [
              {
                productId: firstProduct.id,
                variantId: variant.id,
                productName: firstProduct.name,
                size: variant.size,
                color: variant.colorName,
                quantity: 1,
                price: firstProduct.price,
                total: firstProduct.price,
              },
            ],
          },
        },
      });
      console.log('Sample COD Order created:', order.orderNumber);
    }
  }

  console.log('--- Database Seeding Complete! ---');
}

main()
  .catch((e) => {
    console.error('Seed Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
