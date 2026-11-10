import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PoliciesService } from './policies.service.js';
import {
  AuthenticatedRequest,
  SessionAuthGuard,
  MerchantRoleGuard,
} from '../../common/guards.js';
import { CreatePolicyDraftDtoSchema } from '@resolvepay/contracts';

@Controller('merchant/policies')
@UseGuards(SessionAuthGuard, MerchantRoleGuard)
export class PoliciesController {
  constructor(private policiesService: PoliciesService) {}

  @Get()
  async getPolicies(@Req() req: AuthenticatedRequest) {
    return await this.policiesService.getPolicies(req.tenantId!);
  }

  @Post('publish')
  async publishPolicy(@Body() body: unknown, @Req() req: AuthenticatedRequest) {
    const dto = CreatePolicyDraftDtoSchema.parse(body);
    return await this.policiesService.publishPolicy(dto, req.sessionInfo!);
  }
}

