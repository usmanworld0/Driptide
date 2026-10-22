import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SupabaseService } from '../../modules/database/supabase.service';
import { UserRole } from '@driptide/contracts';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  constructor(private readonly supabaseService: SupabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid Authorization header');
    }

    const token = authHeader.split(' ')[1];

    try {
      const user = await this.supabaseService.verifyUserToken(token);
      if (!user) {
        throw new UnauthorizedException('Invalid or expired authentication token');
      }
      request.user = user;
      return true;
    } catch {
      throw new UnauthorizedException('Failed to authenticate token');
    }
  }
}

@Injectable()
export class OptionalAuthGuard implements CanActivate {
  constructor(private readonly supabaseService: SupabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const user = await this.supabaseService.verifyUserToken(token);
        if (user) {
          request.user = user;
        }
      } catch {
        // Guest user proceeds
      }
    }

    return true;
  }
}
