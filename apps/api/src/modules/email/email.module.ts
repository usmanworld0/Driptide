import { Global, Module } from '@nestjs/common';
import { EmailService } from './email.service';

/**
 * Global email module — provides EmailService to all NestJS modules
 * without requiring explicit import in each feature module.
 */
@Global()
@Module({
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
