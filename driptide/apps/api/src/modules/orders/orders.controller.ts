import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Headers,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OptionalAuthGuard } from '../../common/guards/supabase-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserProfile, CheckoutInput, ApiResponse } from '@driptide/contracts';

@Controller('orders')
@UseGuards(OptionalAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  private resolveKey(sessionId?: string, user?: UserProfile): string {
    return user ? `user-${user.id}` : sessionId || 'default-guest-session';
  }

  @Post('checkout')
  async checkout(
    @Headers('x-session-id') sessionId: string,
    @Body() input: CheckoutInput,
    @CurrentUser() user?: UserProfile,
  ): Promise<ApiResponse> {
    const key = this.resolveKey(sessionId, user);
    const order = await this.ordersService.checkout(key, input, user);
    return {
      success: true,
      data: order,
      message: 'Order placed successfully',
    };
  }

  @Get('my-orders')
  async getMyOrders(@CurrentUser() user?: UserProfile): Promise<ApiResponse> {
    if (!user) {
      throw new UnauthorizedException('Authentication required');
    }
    const orders = await this.ordersService.getCustomerOrders(user.id);
    return {
      success: true,
      data: orders,
    };
  }

  @Get(':id')
  async getOrder(
    @Param('id') id: string,
    @CurrentUser() user?: UserProfile,
  ): Promise<ApiResponse> {
    const order = await this.ordersService.getOrderById(id, user);
    return {
      success: true,
      data: order,
    };
  }

  @Post(':id/cancel')
  async cancelOrder(
    @Param('id') id: string,
    @Body('reason') reason?: string,
    @CurrentUser() user?: UserProfile,
  ): Promise<ApiResponse> {
    const order = await this.ordersService.cancelOrder(id, user, reason);
    return {
      success: true,
      data: order,
      message: 'Order successfully cancelled and inventory restored',
    };
  }
}
