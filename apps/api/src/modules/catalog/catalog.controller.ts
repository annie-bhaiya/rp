import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CatalogService } from './catalog.service.js';
import { AuthenticatedRequest, SessionAuthGuard } from '../../common/guards.js';
import {
  CreateCheckoutOrderDtoSchema,
  CaptureCheckoutOrderDtoSchema,
} from '@resolvepay/contracts';

@Controller()
export class CatalogController {
  constructor(private catalogService: CatalogService) {}

  @Get('catalog')
  async getCatalog(@Query('tenantSlug') tenantSlug?: string) {
    return await this.catalogService.getCatalog(tenantSlug || 'default-merchant');
  }

  @Post('checkout/orders')
  async createCheckoutOrder(@Body() body: unknown) {
    const dto = CreateCheckoutOrderDtoSchema.parse(body);
    return await this.catalogService.createCheckoutOrder(dto);
  }

  @Post('checkout/orders/:id/capture')
  async captureCheckoutOrder(@Param('id') orderId: string, @Body() body: unknown) {
    const dto = CaptureCheckoutOrderDtoSchema.parse(body || {});
    return await this.catalogService.captureCheckoutOrder(orderId, dto);
  }

  @Get('orders/:id')
  @UseGuards(SessionAuthGuard)
  async getOrder(@Param('id') orderId: string, @Req() req: AuthenticatedRequest) {
    return await this.catalogService.getOrderById(orderId, req.tenantId);
  }
}
