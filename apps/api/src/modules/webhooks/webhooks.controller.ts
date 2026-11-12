import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Headers,
  Body,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { WebhooksService } from './webhooks.service.js';

@Controller('webhooks')
export class WebhooksController {
  constructor(private webhooksService: WebhooksService) {}

  @Post('paypal')
  async handlePayPalWebhook(
    @Headers() headers: Record<string, string>,
    @Body() body: Record<string, unknown>,
    @Req() req: Request
  ) {
    const rawBody = JSON.stringify(body);
    return await this.webhooksService.handlePayPalWebhook(headers, body, rawBody);
  }

  @Post('paypal/:connectionKey')
  async handlePayPalConnectionWebhook(
    @Param('connectionKey') connectionKey: string,
    @Headers() headers: Record<string, string>,
    @Body() body: Record<string, unknown>,
    @Req() req: Request
  ) {
    const rawBody = JSON.stringify(body);
    return await this.webhooksService.handlePayPalWebhook(headers, body, rawBody);
  }

  @Post('email')
  async handleEmailWebhook(
    @Headers() headers: Record<string, string>,
    @Body() body: any,
    @Req() req: Request
  ) {
    const rawBody = JSON.stringify(body);
    return await this.webhooksService.handleEmailWebhook(headers, body, rawBody);
  }

  @Post('email/:connectionKey')
  async handleEmailConnectionWebhook(
    @Param('connectionKey') connectionKey: string,
    @Headers() headers: Record<string, string>,
    @Body() body: any,
    @Req() req: Request
  ) {
    const rawBody = JSON.stringify(body);
    return await this.webhooksService.handleEmailWebhook(headers, body, rawBody);
  }
}

