import { Module } from '@nestjs/common';
import { DevController } from './dev.controller.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [AuthModule],
  controllers: [DevController],
})
export class DevModule {}

