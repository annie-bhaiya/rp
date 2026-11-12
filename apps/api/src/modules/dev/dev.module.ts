import { Module } from '@nestjs/common';
import { DevController } from './dev.controller.js';
import { AuthModule } from '../auth/auth.module.js';
import { WebhooksModule } from '../webhooks/webhooks.module.js';
import { FailureInjectionService } from './failure-injection.service.js';

@Module({
  imports: [AuthModule, WebhooksModule],
  controllers: [DevController],
  providers: [FailureInjectionService],
  exports: [FailureInjectionService],
})
export class DevModule {}


