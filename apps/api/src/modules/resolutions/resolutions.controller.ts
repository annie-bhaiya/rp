import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ResolutionsService } from './resolutions.service.js';
import {
  AuthenticatedRequest,
  SessionAuthGuard,
  MerchantRoleGuard,
} from '../../common/guards.js';
import { RecordInspectionDtoSchema } from '@resolvepay/contracts';

@Controller()
@UseGuards(SessionAuthGuard)
export class ResolutionsController {
  constructor(private resolutionsService: ResolutionsService) {}

  @Post('returns/:id/inspection')
  @UseGuards(MerchantRoleGuard)
  async recordInspection(
    @Param('id') returnId: string,
    @Body() body: unknown,
    @Req() req: AuthenticatedRequest
  ) {
    const parsed = RecordInspectionDtoSchema.parse({ ...(body as any), returnId });
    return await this.resolutionsService.recordInspection(parsed, req.sessionInfo!);
  }

  @Get('merchant/recovery')
  @UseGuards(MerchantRoleGuard)
  async getRecoveryQueue(@Req() req: AuthenticatedRequest) {
    return await this.resolutionsService.getRecoveryQueue(req.tenantId!);
  }

  @Post('merchant/recovery/:id/reconcile')
  @UseGuards(MerchantRoleGuard)
  async reconcileOperation(@Param('id') stepId: string, @Req() req: AuthenticatedRequest) {
    return await this.resolutionsService.reconcileOperation(stepId, req.sessionInfo!);
  }
}

