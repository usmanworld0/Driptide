import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  Product,
  Category,
  Order,
  Cart,
  Coupon,
  UserProfile,
  UserRole,
  ProductStatus,
  OrderStatus,
  PaymentStatus,
  FulfillmentStatus,
  PaymentMethodType,
  InventoryMovementType,
  InventoryMovement,
} from '@driptide/contracts';

const additionalCatalog = [
  { slug: 'polos', name: 'Polos', description: 'Refined piqué polos and relaxed short sleeve staples.', image: 'https://outfitters.com.pk/cdn/shop/files/F1781106204-1.jpg?v=1791445296&width=700' },
  { slug: 'shirts', name: 'Shirts & Shackets', description: 'Easy overshirts and considered everyday button-downs.', image: 'https://outfitters.com.pk/cdn/shop/files/F1034103816.jpg?v=1785303610&width=700' },
  { slug: 'shorts', name: 'Shorts', description: 'Relaxed summer shorts with clean utility details.', image: 'https://outfitters.com.pk/cdn/shop/files/F0183110903LOWER3.jpg?v=1791445191&width=700' },
  { slug: 'activewear', name: 'Activewear', description: 'Lightweight performance layers for everyday movement.', image: 'https://outfitters.com.pk/cdn/shop/files/F0292125119-1.jpg?v=1789629335&width=700' },
  { slug: 'sweaters', name: 'Sweaters', description: 'Soft knit layers in versatile seasonal colors.', image: 'https://outfitters.com.pk/cdn/shop/files/F0183102901_2.jpg?v=1790570831&width=700' },
  { slug: 'footwear', name: 'Footwear', description: 'Everyday sneakers and versatile casual footwear.', image: 'https://outfitters.com.pk/cdn/shop/files/F0393112113_11.jpg?v=1775560116&width=700' },
  { slug: 'fragrances', name: 'Fragrances', description: 'Personal scents for day and after dark.', image: 'https://outfitters.com.pk/cdn/shop/files/F0102124998_3_copy.jpg?v=1755843658&width=700' },
  { slug: 'sale', name: 'Sale', description: 'Selected styles from previous seasonal edits.', image: 'https://outfitters.com.pk/cdn/shop/files/Men_Web_0cb72726-eac6-417c-a086-d902db00cc28.jpg?v=1792147448&width=700' },
];

const additionalProducts = [
  ['Everyday Piqué Polo', 'everyday-pique-polo', 'A clean piqué polo with a relaxed fit and ribbed collar.', 'polos', 'https://outfitters.com.pk/cdn/shop/files/F1781106204-1.jpg?v=1791445296&width=1200', 12900, 'Cloud White', '#f2f0eb'],
  ['Textured Resort Shirt', 'textured-resort-shirt', 'A breathable short sleeve shirt made for warm days and easy layering.', 'shirts', 'https://outfitters.com.pk/cdn/shop/files/F1034103816.jpg?v=1785303610&width=1200', 18900, 'Ink Print', '#282828'],
  ['Relaxed Utility Short', 'relaxed-utility-short', 'A lightweight cotton short with a drawcord waist and roomy pockets.', 'shorts', 'https://outfitters.com.pk/cdn/shop/files/F0183110903LOWER3.jpg?v=1791445191&width=1200', 14900, 'Stone Blue', '#9abfd8'],
  ['Active Track Jacket', 'active-track-jacket', 'A light zip-through layer with clean piping and an easy athletic shape.', 'activewear', 'https://outfitters.com.pk/cdn/shop/files/F0292125119-1.jpg?v=1789629335&width=1200', 22900, 'Black', '#111111'],
  ['Soft Rib Knit Sweater', 'soft-rib-knit-sweater', 'A soft-touch knit with a relaxed shoulder and neat rib finish.', 'sweaters', 'https://outfitters.com.pk/cdn/shop/files/F0183102901_2.jpg?v=1790570831&width=1200', 21900, 'Oatmeal', '#d9cdbb'],
  ['Court Low Sneaker', 'court-low-sneaker', 'A minimal low-top sneaker with tonal panels and a cushioned sole.', 'footwear', 'https://outfitters.com.pk/cdn/shop/files/F0393112113_11.jpg?v=1775560116&width=1200', 27900, 'Chalk', '#efede6'],
  ['No. 04 Eau de Parfum', 'no-04-eau-de-parfum', 'A warm, understated fragrance with woody notes for everyday wear.', 'fragrances', 'https://outfitters.com.pk/cdn/shop/files/F0102124998_3_copy.jpg?v=1755843658&width=1200', 19900, 'Amber', '#98724a'],
  ['Washed Graphic Tee', 'washed-graphic-tee', 'A soft washed cotton tee with a relaxed cut and understated chest graphic.', 'sale', 'https://outfitters.com.pk/cdn/shop/files/T_shirts_6314b1fd-2230-4dcb-8281-a2187f998bcc.jpg?v=1790321039&width=1200', 9900, 'Washed Olive', '#4b4d3c'],
  ['Heavyweight Boxy Tee', 'heavyweight-boxy-tee', 'A substantial cotton jersey tee with a structured neckline and boxy shape.', 't-shirts-tops', 'https://outfitters.com.pk/cdn/shop/files/T_shirts_6314b1fd-2230-4dcb-8281-a2187f998bcc.jpg?v=1790321039&width=1200', 15900, 'Obsidian', '#111111'],
  ['Zip Through Hoodie', 'zip-through-hoodie', 'A versatile zip hoodie in brushed fleece with a double-layer hood.', 'hoodies-sweats', 'https://outfitters.com.pk/cdn/shop/files/Sweatshirts_Web.jpg?v=1790321766&width=1200', 23900, 'Charcoal', '#373737'],
  ['Relaxed Denim Jean', 'relaxed-denim-jean', 'A relaxed straight-leg denim jean with a washed finish and classic five pockets.', 'trousers-denim', 'https://outfitters.com.pk/cdn/shop/files/Denim_107b72c8-518d-4227-b450-110df2eb2207.jpg?v=1790321131&width=1200', 25900, 'Mid Blue', '#54758c'],
  ['Canvas Field Jacket', 'canvas-field-jacket', 'A sturdy cotton field jacket with roomy patch pockets and an easy layered fit.', 'outerwear', 'https://outfitters.com.pk/cdn/shop/files/Outwears.jpg?v=1790321392&width=1200', 32900, 'Sage', '#828775'],
  ['Everyday Overshirt', 'everyday-overshirt', 'A substantial cotton overshirt designed to wear open over tees or buttoned up.', 'shirts', 'https://outfitters.com.pk/cdn/shop/files/F1034103816.jpg?v=1785303610&width=1200', 24900, 'Stone', '#b9b2a6'],
  ['Leather Crossbody Bag', 'leather-crossbody-bag', 'A compact crossbody bag with adjustable webbing and useful zipped storage.', 'accessories', 'https://outfitters.com.pk/cdn/shop/files/F0153122998_8_copy2.jpg?v=1771309367&width=1200', 18900, 'Black', '#111111'],
] as const;

function buildAdditionalProducts(): Product[] {
  const now = '2026-10-22T00:00:00.000Z';
  return additionalProducts.map(([name, slug, description, categorySlug, image, price, color, colorHex], index) => {
    const id = `prod-extra-${index + 1}`;
    const category = ({ 't-shirts-tops': 'c2', 'hoodies-sweats': 'c4', 'trousers-denim': 'c3', outerwear: 'c5', accessories: 'c6' } as Record<string, string>)[categorySlug] ?? `c-${categorySlug}`;
    const sizes = categorySlug === 'fragrances' ? ['One Size'] : categorySlug === 'footwear' ? ['40', '41', '42', '43', '44'] : ['S', 'M', 'L', 'XL'];
    const variants = sizes.map((size, variantIndex) => ({
      id: `${id}-v${variantIndex + 1}`, productId: id,
      sku: `${slug.toUpperCase().replace(/-/g, '').slice(0, 8)}-${size.toUpperCase().replace(/\s/g, '')}`,
      title: `${color} / ${size}`, size, color, colorHex, priceMinor: price,
      compareAtPriceMinor: categorySlug === 'sale' ? 12900 : null,
      stockQuantity: 12 + variantIndex * 4,
    }));
    return {
      id, name, slug, tagline: description.split('.')[0], description,
      details: ['Easy everyday fit', 'Thoughtful construction', 'Designed for repeat wear'],
      fabricCare: ['Machine wash cold with similar colors', 'Do not bleach', 'Cool iron if needed'],
      categoryId: category, status: ProductStatus.PUBLISHED, featured: index < 8,
      isNewArrival: index < 6, basePriceMinor: price,
      compareAtPriceMinor: categorySlug === 'sale' ? 12900 : null,
      images: [{ id: `${id}-image`, productId: id, url: image, altText: name, sortOrder: 1, isPrimary: true }],
      variants, totalStock: variants.reduce((sum, variant) => sum + variant.stockQuantity, 0),
      createdAt: now, updatedAt: now,
    } satisfies Product;
  });
}

@Injectable()
export class SupabaseService {
  private readonly logger = new Logger(SupabaseService.name);
  public client: SupabaseClient | null = null;
  public isLive = false;

  public categories: Category[] = [
    {
      id: 'c1',
      name: 'Best Sellers',
      slug: 'best-sellers',
      description: 'Most popular streetwear and tailored silhouettes.',
      imageUrl: 'https://outfitters.com.pk/cdn/shop/files/T_shirts_6314b1fd-2230-4dcb-8281-a2187f998bcc.jpg?v=1790321039&width=700',
      sortOrder: 1,
      isActive: true,
    },
    {
      id: 'c2',
      name: 'T-Shirts & Tops',
      slug: 't-shirts-tops',
      description: 'Vintage washed heavyweight cottons, mock necks, and boxy cuts.',
      imageUrl: 'https://outfitters.com.pk/cdn/shop/files/T_shirts_6314b1fd-2230-4dcb-8281-a2187f998bcc.jpg?v=1790321039&width=700',
      sortOrder: 2,
      isActive: true,
    },
    {
      id: 'c3',
      name: 'Trousers & Jeans',
      slug: 'trousers-denim',
      description: 'Wide-leg sartorial trousers, workwear, and raw denim.',
      imageUrl: 'https://outfitters.com.pk/cdn/shop/files/Denim_107b72c8-518d-4227-b450-110df2eb2207.jpg?v=1790321131&width=700',
      sortOrder: 3,
      isActive: true,
    },
    {
      id: 'c4',
      name: 'Jackets & Hoodies',
      slug: 'hoodies-sweats',
      description: '480GSM French terry fleece and technical outerwear.',
      imageUrl: 'https://outfitters.com.pk/cdn/shop/files/Sweatshirts_Web.jpg?v=1790321766&width=700',
      sortOrder: 4,
      isActive: true,
    },
    {
      id: 'c5',
      name: 'Coats & Outerwear',
      slug: 'outerwear',
      description: 'Italian virgin wool tailored overcoats and trench coats.',
      imageUrl: 'https://outfitters.com.pk/cdn/shop/files/Outwears.jpg?v=1790321392&width=700',
      sortOrder: 5,
      isActive: true,
    },
    {
      id: 'c6',
      name: 'Accessories',
      slug: 'accessories',
      description: 'Modular leather bags, caps, and hardware.',
      imageUrl: 'https://outfitters.com.pk/cdn/shop/files/menu_tile_men_2420934a-0943-458a-991a-7cbb3215983f.jpg?v=1790943560&width=700',
      sortOrder: 6,
      isActive: true,
    },
    ...additionalCatalog.map((category, index) => ({
      id: `c-${category.slug}`,
      name: category.name,
      slug: category.slug,
      description: category.description,
      imageUrl: category.image,
      sortOrder: 7 + index,
      isActive: true,
    })),
  ];

  public products: Product[] = [
    {
      id: 'prod-figma-1',
      name: 'Basic Slim Fit T-Shirt',
      slug: 'basic-slim-fit-t-shirt',
      tagline: 'Lightweight combed cotton with clean ribbed collar',
      description: 'Tailored slim-fit silhouette crafted from premium organic combed cotton. Features seamless neckband and tailored shoulder line.',
      details: ['100% Combed Organic Cotton', 'Reinforced double-stitched hem', 'Pre-shrunk fabric', 'Made in Portugal'],
      categoryId: 'c2',
      status: ProductStatus.PUBLISHED,
      featured: true,
      isNewArrival: true,
      basePriceMinor: 10900,
      images: [
        {
          id: 'img-f1',
          productId: 'prod-figma-1',
          url: 'https://outfitters.com.pk/cdn/shop/files/T_shirts_6314b1fd-2230-4dcb-8281-a2187f998bcc.jpg?v=1790321039&width=1200',
          altText: 'Basic Slim Fit T-Shirt in Raw Ecru with Orange Cap',
          sortOrder: 1,
          isPrimary: true,
        },
      ],
      variants: [
        { id: 'var-f1-xs', productId: 'prod-figma-1', sku: 'BSF-ECR-XS', title: 'Raw Ecru / XS', size: 'XS', color: 'Raw Ecru', colorHex: '#F0EBE1', priceMinor: 10900, stockQuantity: 20 },
        { id: 'var-f1-s', productId: 'prod-figma-1', sku: 'BSF-ECR-S', title: 'Raw Ecru / S', size: 'S', color: 'Raw Ecru', colorHex: '#F0EBE1', priceMinor: 10900, stockQuantity: 35 },
        { id: 'var-f1-m', productId: 'prod-figma-1', sku: 'BSF-ECR-M', title: 'Raw Ecru / M', size: 'M', color: 'Raw Ecru', colorHex: '#F0EBE1', priceMinor: 10900, stockQuantity: 50 },
        { id: 'var-f1-l', productId: 'prod-figma-1', sku: 'BSF-ECR-L', title: 'Raw Ecru / L', size: 'L', color: 'Raw Ecru', colorHex: '#F0EBE1', priceMinor: 10900, stockQuantity: 40 },
        { id: 'var-f1-xl', productId: 'prod-figma-1', sku: 'BSF-ECR-XL', title: 'Raw Ecru / XL', size: 'XL', color: 'Raw Ecru', colorHex: '#F0EBE1', priceMinor: 10900, stockQuantity: 15 },
        { id: 'var-f1-2x', productId: 'prod-figma-1', sku: 'BSF-ECR-2X', title: 'Raw Ecru / 2X', size: '2X', color: 'Raw Ecru', colorHex: '#F0EBE1', priceMinor: 10900, stockQuantity: 10 },
      ],
      totalStock: 170,
      createdAt: '2026-10-01T00:00:00.000Z',
      updatedAt: '2026-10-01T00:00:00.000Z',
    },
    {
      id: 'prod-figma-2',
      name: 'Basic Heavy Weight T-Shirt',
      slug: 'basic-heavy-weight-t-shirt',
      tagline: '320GSM custom heavyweight boxy crewneck tee',
      description: 'Structured boxy fit with dropped shoulders and dense 320GSM ringspun cotton. Retains its architectural structure through repeated washing.',
      details: ['320GSM Heavyweight Combed Cotton', 'Thick 1.25" ribbed mock collar', 'Relaxed boxy cut', 'Pre-shrunk'],
      categoryId: 'c2',
      status: ProductStatus.PUBLISHED,
      featured: true,
      isNewArrival: true,
      basePriceMinor: 15900,
      images: [
        {
          id: 'img-f2',
          productId: 'prod-figma-2',
          url: 'https://outfitters.com.pk/cdn/shop/files/T_shirts_6314b1fd-2230-4dcb-8281-a2187f998bcc.jpg?v=1790321039&width=1200',
          altText: 'Basic Heavy Weight T-Shirt with Sunglasses',
          sortOrder: 1,
          isPrimary: true,
        },
      ],
      variants: [
        { id: 'var-f2-xs', productId: 'prod-figma-2', sku: 'BHW-BLK-XS', title: 'Obsidian Black / XS', size: 'XS', color: 'Obsidian Black', colorHex: '#111111', priceMinor: 15900, stockQuantity: 15 },
        { id: 'var-f2-s', productId: 'prod-figma-2', sku: 'BHW-BLK-S', title: 'Obsidian Black / S', size: 'S', color: 'Obsidian Black', colorHex: '#111111', priceMinor: 15900, stockQuantity: 30 },
        { id: 'var-f2-m', productId: 'prod-figma-2', sku: 'BHW-BLK-M', title: 'Obsidian Black / M', size: 'M', color: 'Obsidian Black', colorHex: '#111111', priceMinor: 15900, stockQuantity: 45 },
        { id: 'var-f2-l', productId: 'prod-figma-2', sku: 'BHW-BLK-L', title: 'Obsidian Black / L', size: 'L', color: 'Obsidian Black', colorHex: '#111111', priceMinor: 15900, stockQuantity: 28 },
        { id: 'var-f2-xl', productId: 'prod-figma-2', sku: 'BHW-BLK-XL', title: 'Obsidian Black / XL', size: 'XL', color: 'Obsidian Black', colorHex: '#111111', priceMinor: 15900, stockQuantity: 14 },
      ],
      totalStock: 132,
      createdAt: '2026-10-02T00:00:00.000Z',
      updatedAt: '2026-10-02T00:00:00.000Z',
    },
    {
      id: 'prod-figma-3',
      name: 'Full Sleeve Zipper',
      slug: 'full-sleeve-zipper',
      tagline: 'Printed resort shirt with custom oxidized hardware',
      description: 'Camp collar overshirt featuring Japanese monochrome print and two-way YKK oxidized zipper closure.',
      details: ['100% Breathable Tencel Rayon', 'Two-way front zipper', 'Straight hem with side vents'],
      categoryId: 'c2',
      status: ProductStatus.PUBLISHED,
      featured: true,
      isNewArrival: false,
      basePriceMinor: 19900,
      images: [
        {
          id: 'img-f3',
          productId: 'prod-figma-3',
          url: 'https://outfitters.com.pk/cdn/shop/files/F1034103816.jpg?v=1785303610&width=1200',
          altText: 'Full Sleeve Zipper Camp Collar Printed Shirt',
          sortOrder: 1,
          isPrimary: true,
        },
      ],
      variants: [
        { id: 'var-f3-s', productId: 'prod-figma-3', sku: 'FSZ-PRT-S', title: 'Abstract Print / S', size: 'S', color: 'Abstract Print', colorHex: '#222222', priceMinor: 19900, stockQuantity: 15 },
        { id: 'var-f3-m', productId: 'prod-figma-3', sku: 'FSZ-PRT-M', title: 'Abstract Print / M', size: 'M', color: 'Abstract Print', colorHex: '#222222', priceMinor: 19900, stockQuantity: 25 },
        { id: 'var-f3-l', productId: 'prod-figma-3', sku: 'FSZ-PRT-L', title: 'Abstract Print / L', size: 'L', color: 'Abstract Print', colorHex: '#222222', priceMinor: 19900, stockQuantity: 18 },
        { id: 'var-f3-xl', productId: 'prod-figma-3', sku: 'FSZ-PRT-XL', title: 'Abstract Print / XL', size: 'XL', color: 'Abstract Print', colorHex: '#222222', priceMinor: 19900, stockQuantity: 10 },
      ],
      totalStock: 68,
      createdAt: '2026-10-03T00:00:00.000Z',
      updatedAt: '2026-10-03T00:00:00.000Z',
    },
    {
      id: 'prod-figma-4',
      name: 'Vintage Tinted Tee',
      slug: 'vintage-tinted-tee',
      tagline: 'Acid washed relaxed cotton crewneck',
      description: 'Garment washed with pumice stones for authentic patina and softness. Features blind stitching and relaxed proportions.',
      details: ['100% Cotton Jersey', 'Acid wash vintage finish', 'Made in Portugal'],
      categoryId: 'c2',
      status: ProductStatus.PUBLISHED,
      featured: true,
      isNewArrival: false,
      basePriceMinor: 12900,
      images: [
        {
          id: 'img-f4',
          productId: 'prod-figma-4',
          url: 'https://outfitters.com.pk/cdn/shop/files/T_shirts_6314b1fd-2230-4dcb-8281-a2187f998bcc.jpg?v=1790321039&width=1200',
          altText: 'Vintage Tinted Tee with Yellow Sunglasses',
          sortOrder: 1,
          isPrimary: true,
        },
      ],
      variants: [
        { id: 'var-f4-s', productId: 'prod-figma-4', sku: 'VTT-OLV-S', title: 'Washed Olive / S', size: 'S', color: 'Washed Olive', colorHex: '#4B4D3C', priceMinor: 12900, stockQuantity: 15 },
        { id: 'var-f4-m', productId: 'prod-figma-4', sku: 'VTT-OLV-M', title: 'Washed Olive / M', size: 'M', color: 'Washed Olive', colorHex: '#4B4D3C', priceMinor: 12900, stockQuantity: 22 },
        { id: 'var-f4-l', productId: 'prod-figma-4', sku: 'VTT-OLV-L', title: 'Washed Olive / L', size: 'L', color: 'Washed Olive', colorHex: '#4B4D3C', priceMinor: 12900, stockQuantity: 30 },
      ],
      totalStock: 67,
      createdAt: '2026-10-04T00:00:00.000Z',
      updatedAt: '2026-10-04T00:00:00.000Z',
    },
    {
      id: 'prod-figma-5',
      name: 'Essential Crew Neck Tee',
      slug: 'essential-crew-neck-tee',
      tagline: 'Dense combed jersey with tailored collar',
      description: 'A sartorial staple designed to layer effortlessly under tailored overcoats and casual work jackets.',
      details: ['300GSM ringspun organic cotton', 'Reinforced collar', 'Blind-stitched cuffs'],
      categoryId: 'c2',
      status: ProductStatus.PUBLISHED,
      featured: true,
      isNewArrival: true,
      basePriceMinor: 14900,
      images: [
        {
          id: 'img-f5',
          productId: 'prod-figma-5',
          url: 'https://outfitters.com.pk/cdn/shop/files/T_shirts_6314b1fd-2230-4dcb-8281-a2187f998bcc.jpg?v=1790321039&width=1200',
          altText: 'Essential Crew Neck Tee in Pure Black',
          sortOrder: 1,
          isPrimary: true,
        },
      ],
      variants: [
        { id: 'var-f5-s', productId: 'prod-figma-5', sku: 'CRM-BLK-S', title: 'Pure Black / S', size: 'S', color: 'Pure Black', colorHex: '#111111', priceMinor: 14900, stockQuantity: 18 },
        { id: 'var-f5-m', productId: 'prod-figma-5', sku: 'CRM-BLK-M', title: 'Pure Black / M', size: 'M', color: 'Pure Black', colorHex: '#111111', priceMinor: 14900, stockQuantity: 32 },
        { id: 'var-f5-l', productId: 'prod-figma-5', sku: 'CRM-BLK-L', title: 'Pure Black / L', size: 'L', color: 'Pure Black', colorHex: '#111111', priceMinor: 14900, stockQuantity: 24 },
      ],
      totalStock: 74,
      createdAt: '2026-10-05T00:00:00.000Z',
      updatedAt: '2026-10-05T00:00:00.000Z',
    },
    {
      id: 'prod-figma-6',
      name: 'Relaxed Sky Blue Tee',
      slug: 'relaxed-sky-blue-tee',
      tagline: 'Soft washed pastel jersey with relaxed drape',
      description: 'Mineral-dyed pale sky blue jersey tee with natural sun-faded drape and reinforced neckline.',
      details: ['100% Supima Cotton', 'Mineral dye technique', 'Ultra-soft hand feel'],
      categoryId: 'c2',
      status: ProductStatus.PUBLISHED,
      featured: true,
      isNewArrival: false,
      basePriceMinor: 13900,
      images: [
        {
          id: 'img-f6',
          productId: 'prod-figma-6',
          url: 'https://outfitters.com.pk/cdn/shop/files/T_shirts_6314b1fd-2230-4dcb-8281-a2187f998bcc.jpg?v=1790321039&width=1200',
          altText: 'Relaxed Sky Blue Tee',
          sortOrder: 1,
          isPrimary: true,
        },
      ],
      variants: [
        { id: 'var-f6-s', productId: 'prod-figma-6', sku: 'SBT-BLU-S', title: 'Sky Blue / S', size: 'S', color: 'Sky Blue', colorHex: '#9ABFD8', priceMinor: 13900, stockQuantity: 20 },
        { id: 'var-f6-m', productId: 'prod-figma-6', sku: 'SBT-BLU-M', title: 'Sky Blue / M', size: 'M', color: 'Sky Blue', colorHex: '#9ABFD8', priceMinor: 13900, stockQuantity: 30 },
        { id: 'var-f6-l', productId: 'prod-figma-6', sku: 'SBT-BLU-L', title: 'Sky Blue / L', size: 'L', color: 'Sky Blue', colorHex: '#9ABFD8', priceMinor: 13900, stockQuantity: 15 },
      ],
      totalStock: 65,
      createdAt: '2026-10-06T00:00:00.000Z',
      updatedAt: '2026-10-06T00:00:00.000Z',
    },
  ];

  public carts: Map<string, Cart> = new Map();
  public orders: Order[] = [];
  public inventoryMovements: InventoryMovement[] = [];
  public coupons: Coupon[] = [
    {
      id: 'cp1',
      code: 'DRIP15',
      discountType: 'percentage',
      discountValue: 15,
      minSpendMinor: 5000,
      maxDiscountMinor: 5000,
      usageLimit: 1000,
      usageCount: 42,
      isActive: true,
    },
    {
      id: 'cp2',
      code: 'WELCOME20',
      discountType: 'fixed',
      discountValue: 2000,
      minSpendMinor: 10000,
      maxDiscountMinor: 2000,
      usageLimit: 500,
      usageCount: 18,
      isActive: true,
    },
  ];

  public users: UserProfile[] = [
    {
      id: 'usr-admin-1',
      email: 'admin@driptide.com',
      role: UserRole.ADMIN,
      fullName: 'Admin Director',
      createdAt: '2026-10-01T00:00:00.000Z',
      updatedAt: '2026-10-01T00:00:00.000Z',
    },
    {
      id: 'usr-customer-1',
      email: 'customer@driptide.com',
      role: UserRole.CUSTOMER,
      fullName: 'James Vane',
      createdAt: '2026-10-05T00:00:00.000Z',
      updatedAt: '2026-10-05T00:00:00.000Z',
    },
  ];

  constructor(private readonly config: ConfigService) {
    this.products.push(...buildAdditionalProducts());
    const supabaseUrl = this.config.get<string>('database.supabaseUrl');
    const supabaseKey = this.config.get<string>('database.supabaseServiceKey');

    if (
      supabaseUrl &&
      supabaseKey &&
      supabaseUrl !== 'https://placeholder.supabase.co' &&
      !supabaseUrl.includes('placeholder')
    ) {
      try {
        this.client = createClient(supabaseUrl, supabaseKey);
        this.isLive = true;
        this.logger.log('Connected to live Supabase PostgreSQL instance');
      } catch (err) {
        this.logger.warn(`Failed to init Supabase client: ${(err as Error).message}`);
      }
    } else {
      this.logger.log('Running with in-memory persistence layer (no live Supabase credentials)');
    }
  }

  async verifyUserToken(token: string): Promise<UserProfile | null> {
    if (this.isLive && this.client) {
      const { data, error } = await this.client.auth.getUser(token);
      if (error || !data.user) return null;
      const found = this.users.find((u) => u.id === data.user.id || u.email === data.user.email);
      if (found) return found;
      return {
        id: data.user.id,
        email: data.user.email || '',
        role: UserRole.CUSTOMER,
        createdAt: data.user.created_at,
        updatedAt: data.user.created_at,
      };
    }

    if (token.includes('admin')) {
      return this.users.find((u) => u.role === UserRole.ADMIN) || null;
    }
    return this.users.find((u) => u.role === UserRole.CUSTOMER) || null;
  }

  async reserveAndDeductInventory(
    orderId: string,
    items: { variantId: string; quantity: number }[],
  ): Promise<void> {
    for (const item of items) {
      let foundVariant = false;
      for (const p of this.products) {
        const v = p.variants.find((v) => v.id === item.variantId);
        if (v) {
          foundVariant = true;
          if (v.stockQuantity < item.quantity) {
            throw new BadRequestException(
              `Insufficient stock for '${p.name} - ${v.title}'. Available: ${v.stockQuantity}, Requested: ${item.quantity}`,
            );
          }
          const prevQty = v.stockQuantity;
          v.stockQuantity -= item.quantity;
          p.totalStock -= item.quantity;

          this.inventoryMovements.push({
            id: `mov-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            variantId: v.id,
            sku: v.sku,
            type: InventoryMovementType.ORDER_RESERVATION,
            quantityDelta: -item.quantity,
            previousQuantity: prevQty,
            newQuantity: v.stockQuantity,
            orderId,
            reason: `Reserved for order ${orderId}`,
            createdAt: new Date().toISOString(),
          });
          break;
        }
      }
      if (!foundVariant) {
        throw new BadRequestException(`Variant '${item.variantId}' not found`);
      }
    }
  }

  async releaseInventoryOnCancellation(
    orderId: string,
    items: { variantId: string; quantity: number }[],
  ): Promise<void> {
    for (const item of items) {
      for (const p of this.products) {
        const v = p.variants.find((v) => v.id === item.variantId);
        if (v) {
          const prevQty = v.stockQuantity;
          v.stockQuantity += item.quantity;
          p.totalStock += item.quantity;

          this.inventoryMovements.push({
            id: `mov-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            variantId: v.id,
            sku: v.sku,
            type: InventoryMovementType.ORDER_CANCELLATION,
            quantityDelta: item.quantity,
            previousQuantity: prevQty,
            newQuantity: v.stockQuantity,
            orderId,
            reason: `Restored from cancelled order ${orderId}`,
            createdAt: new Date().toISOString(),
          });
          break;
        }
      }
    }
  }
}
