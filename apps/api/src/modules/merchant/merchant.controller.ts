import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { MerchantService } from './merchant.service.js';
import { AuthenticatedRequest, SessionAuthGuard } from '../../common/guards.js';

@Controller('merchant')
@UseGuards(SessionAuthGuard)
export class MerchantController {
  constructor(private merchantService: MerchantService) {}

  @Get('insights')
  async getInsights(@Req() req: AuthenticatedRequest) {
    return await this.merchantService.getInsights(req.tenantId!);
  }

  @Get('reconciliation/export.csv')
  async exportReconciliationCsv(@Req() req: AuthenticatedRequest, @Res() res: Response) {
    const csv = await this.merchantService.generateReconciliationCsv(req.tenantId!);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="resolvepay-reconciliation-${new Date().toISOString().slice(0, 10)}.csv"`
    );
    res.send(csv);
  }
}

