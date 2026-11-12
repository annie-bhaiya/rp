import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { CasesService } from './cases.service.js';
import { AuthenticatedRequest, SessionAuthGuard, CaseAccessGuard } from '../../common/guards.js';
import {
  CreateCaseDtoSchema,
  AddCaseMessageDtoSchema,
  CreateEvidenceIntentDtoSchema,
  CompleteEvidenceUploadDtoSchema,
} from '@resolvepay/contracts';

@Controller('cases')
@UseGuards(SessionAuthGuard, CaseAccessGuard)
export class CasesController {
  constructor(private casesService: CasesService) {}

  @Post()
  async createCase(@Body() body: unknown, @Req() req: AuthenticatedRequest) {
    const dto = CreateCaseDtoSchema.parse(body);
    return await this.casesService.createCase(dto, req.sessionInfo!);
  }

  @Get()
  async listCases(@Req() req: AuthenticatedRequest) {
    const records = await this.casesService.listCases(req.tenantId!);
    return req.sessionInfo!.actorType === 'CUSTOMER' ? records.filter(record => record.orderId === req.sessionInfo!.orderId) : records;
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

  @Post(':id/evidence/upload-intent')
  async createEvidenceIntent(
    @Param('id') caseId: string,
    @Body() body: unknown,
    @Req() req: AuthenticatedRequest
  ) {
    const dto = CreateEvidenceIntentDtoSchema.parse(body);
    return await this.casesService.createEvidenceIntent(caseId, dto, req.sessionInfo!);
  }

  @Post(':id/evidence/:evidenceId/upload')
  async uploadEvidenceFile(
    @Param('id') caseId: string,
    @Param('evidenceId') evidenceId: string,
    @Body() body: { dataBase64?: string; mediaType?: string },
    @Req() req: AuthenticatedRequest
  ) {
    const buffer = body.dataBase64
      ? Buffer.from(body.dataBase64, 'base64')
      : Buffer.from('');
    return await this.casesService.storeEvidenceFile(
      caseId,
      evidenceId,
      buffer,
      body.mediaType || 'image/jpeg',
      req.tenantId!
    );
  }

  @Post(':id/evidence/:evidenceId/complete')
  async completeEvidenceUpload(
    @Param('id') caseId: string,
    @Param('evidenceId') evidenceId: string,
    @Body() body: unknown,
    @Req() req: AuthenticatedRequest
  ) {
    const dto = CompleteEvidenceUploadDtoSchema.parse(body);
    return await this.casesService.completeEvidenceUpload(caseId, evidenceId, dto, req.sessionInfo!);
  }

  @Get(':id/evidence/:evidenceId/file')
  async getEvidenceFile(
    @Param('id') caseId: string,
    @Param('evidenceId') evidenceId: string,
    @Req() req: AuthenticatedRequest,
    @Res() res: Response
  ) {
    const { buffer, mediaType } = await this.casesService.getEvidenceFile(caseId, evidenceId, req.tenantId!);
    res.setHeader('Content-Type', mediaType);
    res.setHeader('Cache-Control', 'private, no-store');
    res.end(buffer);
  }

  @Get(':id/completeness')
  async getCompleteness(@Param('id') caseId: string, @Req() req: AuthenticatedRequest) {
    return await this.casesService.assessCompleteness(caseId, req.tenantId!);
  }

  @Post(':id/completeness/answers')
  async saveCompletenessAnswers(
    @Param('id') caseId: string,
    @Body() body: { answers: Record<string, string> },
    @Req() req: AuthenticatedRequest
  ) {
    return await this.casesService.saveCompletenessAnswers(caseId, body.answers || {}, req.sessionInfo!);
  }
}

