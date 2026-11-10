import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CasesService } from './cases.service.js';
import { AuthenticatedRequest, SessionAuthGuard } from '../../common/guards.js';
import {
  CreateCaseDtoSchema,
  AddCaseMessageDtoSchema,
} from '@resolvepay/contracts';

@Controller('cases')
@UseGuards(SessionAuthGuard)
export class CasesController {
  constructor(private casesService: CasesService) {}

  @Post()
  async createCase(@Body() body: unknown, @Req() req: AuthenticatedRequest) {
    const dto = CreateCaseDtoSchema.parse(body);
    return await this.casesService.createCase(dto, req.sessionInfo!);
  }

  @Get()
  async listCases(@Req() req: AuthenticatedRequest) {
    return await this.casesService.listCases(req.tenantId!);
  }

  @Get(':id')
  async getCase(@Param('id') caseId: string, @Req() req: AuthenticatedRequest) {
    return await this.casesService.getCaseById(caseId, req.tenantId!);
  }

  @Post(':id/messages')
  async addMessage(
    @Param('id') caseId: string,
    @Body() body: unknown,
    @Req() req: AuthenticatedRequest
  ) {
    const dto = AddCaseMessageDtoSchema.parse(body);
    return await this.casesService.addMessage(caseId, dto, req.sessionInfo!);
  }

  @Get(':id/timeline')
  async getTimeline(@Param('id') caseId: string, @Req() req: AuthenticatedRequest) {
    return await this.casesService.getTimeline(caseId, req.tenantId!);
  }
}
