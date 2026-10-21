import { Controller, Get, Param, Query } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { ApiResponse } from '@driptide/contracts';

@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get('products')
  async getProducts(
    @Query('category') categorySlug?: string,
    @Query('search') search?: string,
    @Query('sort') sort?: 'featured' | 'price-asc' | 'price-desc' | 'newest',
    @Query('featured') featured?: string,
    @Query('newArrival') newArrival?: string,
  ): Promise<ApiResponse> {
    const products = await this.catalogService.getProducts({
      categorySlug,
      search,
      sort,
      featured: featured === 'true' ? true : undefined,
      isNewArrival: newArrival === 'true' ? true : undefined,
    });

    return {
      success: true,
      data: products,
      meta: {
        total: products.length,
      },
    };
  }

  @Get('products/:slug')
  async getProductBySlug(@Param('slug') slug: string): Promise<ApiResponse> {
    const product = await this.catalogService.getProductBySlug(slug);
    return {
      success: true,
      data: product,
    };
  }

  @Get('categories')
  async getCategories(): Promise<ApiResponse> {
    const categories = await this.catalogService.getCategories();
    return {
      success: true,
      data: categories,
    };
  }
}
