import { Module } from '@nestjs/common';
import { DevController } from './dev.controller.js';
import { AuthModule } from '../auth/auth.module.js';
import { WebhooksModule } from '../webhooks/webhooks.module.js';

@Module({
  imports: [AuthModule, WebhooksModule],
  controllers: [DevController],
})
export class DevModule {}

