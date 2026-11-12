import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PlansService } from './plans.service.js';
import {
  AuthenticatedRequest,
  SessionAuthGuard,
  MerchantRoleGuard,
  CaseAccessGuard,
} from '../../common/guards.js';
import {
  AcceptPlanDtoSchema,
  MerchantApprovePlanDtoSchema,
} from '@resolvepay/contracts';

@Controller()
@UseGuards(SessionAuthGuard)
export class PlansController {
  constructor(private plansService: PlansService) {}

  @Post('cases/:id/proposals')
  @UseGuards(CaseAccessGuard)
  async generateProposals(@Param('id') caseId: string, @Req() req: AuthenticatedRequest) {
    return await this.plansService.generateProposals(caseId, req.sessionInfo!);
  }

  @Get('cases/:id/plans')
  @UseGuards(CaseAccessGuard)
  async getPlans(@Param('id') caseId: string, @Req() req: AuthenticatedRequest) {
    return await this.plansService.getPlansByCase(caseId, req.tenantId!);
  }

  @Post('plans/:id/accept')
  async acceptPlan(@Param('id') planId: string, @Body() body: unknown, @Req() req: AuthenticatedRequest) {
    const parsed = AcceptPlanDtoSchema.parse({ ...(body as any), planId });
    return await this.plansService.acceptPlan(parsed, req.sessionInfo!);
  }

  @Post('plans/:id/approve')
  @UseGuards(MerchantRoleGuard)
  async approvePlan(@Param('id') planId: string, @Body() body: unknown, @Req() req: AuthenticatedRequest) {
    const parsed = MerchantApprovePlanDtoSchema.parse({ ...(body as any), planId, decision: 'APPROVED' });
    return await this.plansService.merchantDecision(parsed, req.sessionInfo!);
  }

  @Post('plans/:id/approve-and-execute')
  @UseGuards(MerchantRoleGuard)
  async approveAndExecute(@Param('id') planId: string, @Body() body: unknown, @Req() req: AuthenticatedRequest) {
    const parsed = MerchantApprovePlanDtoSchema.parse({ ...(body as any), planId, decision: 'APPROVED' });
    return this.plansService.approveAndExecute(parsed, req.sessionInfo!);
  }

  @Post('plans/:id/reject')
  @UseGuards(MerchantRoleGuard)
  async rejectPlan(@Param('id') planId: string, @Body() body: unknown, @Req() req: AuthenticatedRequest) {
    const parsed = MerchantApprovePlanDtoSchema.parse({ ...(body as any), planId, decision: 'REJECTED' });
    return await this.plansService.merchantDecision(parsed, req.sessionInfo!);
  }

  @Post('plans/:id/execute')
  @UseGuards(MerchantRoleGuard)
  async executePlan(@Param('id') planId: string, @Req() req: AuthenticatedRequest) {
    return await this.plansService.executePlan(planId, req.sessionInfo!);
  }
}

