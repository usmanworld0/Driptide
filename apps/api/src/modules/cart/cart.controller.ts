import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Headers,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { OptionalAuthGuard } from '../../common/guards/supabase-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserProfile, ApiResponse } from '@driptide/contracts';

@Controller('cart')
@UseGuards(OptionalAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  private resolveKey(sessionId?: string, user?: UserProfile): string {
    return user ? `user-${user.id}` : sessionId || 'default-guest-session';
  }

  @Get()
  async getCart(
    @Headers('x-session-id') sessionId: string,
    @CurrentUser() user?: UserProfile,
  ): Promise<ApiResponse> {
    const key = this.resolveKey(sessionId, user);
    const cart = await this.cartService.getCart(key, user?.id);
    return { success: true, data: cart };
  }

  @Post('items')
  async addItem(
    @Headers('x-session-id') sessionId: string,
    @Body() body: { variantId: string; quantity: number },
    @CurrentUser() user?: UserProfile,
  ): Promise<ApiResponse> {
    const key = this.resolveKey(sessionId, user);
    const cart = await this.cartService.addItem(key, body.variantId, body.quantity || 1, user?.id);
    return { success: true, data: cart, message: 'Item added to bag' };
  }

  @Put('items/:itemId')
  async updateQuantity(
    @Headers('x-session-id') sessionId: string,
    @Param('itemId') itemId: string,
    @Body('quantity') quantity: number,
    @CurrentUser() user?: UserProfile,
  ): Promise<ApiResponse> {
    const key = this.resolveKey(sessionId, user);
    const cart = await this.cartService.updateQuantity(key, itemId, quantity, user?.id);
    return { success: true, data: cart };
  }

  @Delete('items/:itemId')
  async removeItem(
    @Headers('x-session-id') sessionId: string,
    @Param('itemId') itemId: string,
    @CurrentUser() user?: UserProfile,
  ): Promise<ApiResponse> {
    const key = this.resolveKey(sessionId, user);
    const cart = await this.cartService.removeItem(key, itemId, user?.id);
    return { success: true, data: cart, message: 'Item removed from bag' };
  }

  @Post('coupon')
  async applyCoupon(
    @Headers('x-session-id') sessionId: string,
    @Body('code') code: string,
    @CurrentUser() user?: UserProfile,
  ): Promise<ApiResponse> {
    const key = this.resolveKey(sessionId, user);
    const cart = await this.cartService.applyCoupon(key, code, user?.id);
    return { success: true, data: cart, message: 'Coupon applied successfully' };
  }

  @Delete('coupon')
  async removeCoupon(
    @Headers('x-session-id') sessionId: string,
    @CurrentUser() user?: UserProfile,
  ): Promise<ApiResponse> {
    const key = this.resolveKey(sessionId, user);
    const cart = await this.cartService.removeCoupon(key, user?.id);
    return { success: true, data: cart, message: 'Coupon removed' };
  }
}
