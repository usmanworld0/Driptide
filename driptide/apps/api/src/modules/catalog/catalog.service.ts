import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../database/supabase.service';
import { Product, Category, ProductStatus } from '@driptide/contracts';

@Injectable()
export class CatalogService {
  constructor(private readonly db: SupabaseService) {}

  async getProducts(params: {
    categorySlug?: string;
    search?: string;
    sort?: 'featured' | 'price-asc' | 'price-desc' | 'newest';
    featured?: boolean;
    isNewArrival?: boolean;
  }): Promise<Product[]> {
    let result = [...this.db.products].filter(
      (p) => p.status === ProductStatus.PUBLISHED,
    );

    if (params.categorySlug) {
      const cat = this.db.categories.find((c) => c.slug === params.categorySlug);
      if (cat) {
        result = params.categorySlug === 'best-sellers'
          ? result.filter((p) => p.featured)
          : result.filter((p) => p.categoryId === cat.id);
      }
    }

    if (params.search) {
      const q = params.search.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.tagline && p.tagline.toLowerCase().includes(q)),
      );
    }

    if (params.featured !== undefined) {
      result = result.filter((p) => p.featured === params.featured);
    }

    if (params.isNewArrival !== undefined) {
      result = result.filter((p) => p.isNewArrival === params.isNewArrival);
    }

    if (params.sort) {
      switch (params.sort) {
        case 'price-asc':
          result.sort((a, b) => a.basePriceMinor - b.basePriceMinor);
          break;
        case 'price-desc':
          result.sort((a, b) => b.basePriceMinor - a.basePriceMinor);
          break;
        case 'newest':
          result.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          );
          break;
        case 'featured':
        default:
          result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
          break;
      }
    }

    return result;
  }

  async getProductBySlug(slug: string): Promise<Product> {
    const product = this.db.products.find(
      (p) => p.slug === slug && p.status === ProductStatus.PUBLISHED,
    );
    if (!product) {
      throw new NotFoundException(`Product '${slug}' not found`);
    }
    return product;
  }

  async getCategories(): Promise<Category[]> {
    return this.db.categories.filter((c) => c.isActive);
  }
}
