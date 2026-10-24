import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { SupabaseAuthGuard } from '../../common/guards/supabase-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import {
  UserRole,
  UserProfile,
  OrderStatus,
  CreateProductInput,
  UpdateProductInput,
  AdjustInventoryInput,
  ApiResponse,
  Coupon,
} from '@driptide/contracts';

@Controller('admin')
@UseGuards(SupabaseAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('metrics')
  async getMetrics(): Promise<ApiResponse> {
    const metrics = await this.adminService.getMetrics();
    return { success: true, data: metrics };
  }

  @Get('orders')
  async getOrders(@Query('status') status?: OrderStatus): Promise<ApiResponse> {
    const orders = await this.adminService.getAllOrders(status);
    return { success: true, data: orders };
  }

  @Post('orders/:id/fulfill')
  async fulfillOrder(
    @Param('id') id: string,
    @Body() body: { courier: string; trackingNumber: string },
  ): Promise<ApiResponse> {
    const order = await this.adminService.fulfillOrder(id, body.courier, body.trackingNumber);
    return { success: true, data: order, message: 'Order fulfilled successfully' };
  }

  @Put('orders/:id/status')
  async updateOrderStatus(
    @Param('id') id: string,
    @Body() body: { status: OrderStatus; notes?: string },
  ): Promise<ApiResponse> {
    const order = await this.adminService.updateOrderStatus(id, body.status, body.notes);
    return { success: true, data: order, message: 'Order status updated' };
  }

  @Get('products')
  async getProducts(): Promise<ApiResponse> {
    const products = await this.adminService.getAllProducts();
    return { success: true, data: products };
  }

  @Post('products')
  async createProduct(@Body() input: CreateProductInput): Promise<ApiResponse> {
    const product = await this.adminService.createProduct(input);
    return { success: true, data: product, message: 'Product created successfully' };
  }

  @Put('products/:id')
  async updateProduct(
    @Param('id') id: string,
    @Body() input: Partial<UpdateProductInput>,
  ): Promise<ApiResponse> {
    const product = await this.adminService.updateProduct(id, input);
    return { success: true, data: product, message: 'Product updated successfully' };
  }

  @Post('inventory/adjust')
  async adjustInventory(
    @Body() input: AdjustInventoryInput,
    @CurrentUser() user?: UserProfile,
  ): Promise<ApiResponse> {
    const movement = await this.adminService.adjustInventory(input, user?.id);
    return { success: true, data: movement, message: 'Inventory adjusted successfully' };
  }

  @Get('inventory/movements')
  async getInventoryMovements(): Promise<ApiResponse> {
    const movements = await this.adminService.getInventoryMovements();
    return { success: true, data: movements };
  }

  @Get('coupons')
  async getCoupons(): Promise<ApiResponse> {
    const coupons = await this.adminService.getCoupons();
    return { success: true, data: coupons };
  }

  @Post('coupons')
  async createCoupon(@Body() input: Partial<Coupon>): Promise<ApiResponse> {
    const coupon = await this.adminService.createCoupon(input);
    return { success: true, data: coupon, message: 'Coupon created successfully' };
  }

  @Put('coupons/:id/toggle')
  async toggleCoupon(@Param('id') id: string): Promise<ApiResponse> {
    const coupon = await this.adminService.toggleCoupon(id);
    return { success: true, data: coupon, message: 'Coupon status updated' };
  }
}
