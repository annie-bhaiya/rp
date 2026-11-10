import { Module } from '@nestjs/common';
import { ResolutionsController } from './resolutions.controller.js';
import { ResolutionsService } from './resolutions.service.js';

@Module({
  controllers: [ResolutionsController],
  providers: [ResolutionsService],
  exports: [ResolutionsService],
})
export class ResolutionsModule {}

