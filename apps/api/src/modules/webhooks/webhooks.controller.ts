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

  @Post(['paypal', 'paypal/:connectionKey'])
  async handlePayPalWebhook(
    @Headers() headers: Record<string, string>,
    @Body() body: Record<string, unknown>,
    @Req() req: Request
  ) {
    const rawBody = JSON.stringify(body);
    return await this.webhooksService.handlePayPalWebhook(headers, body, rawBody);
  }

  @Get(['whatsapp', 'whatsapp/:connectionKey'])
  verifyWhatsApp(
    @Query('hub.mode') mode: string,
    @Query('hub.verify_token') token: string,
    @Query('hub.challenge') challenge: string
  ) {
    return this.webhooksService.verifyWhatsAppChallenge(mode, token, challenge);
  }

  @Post(['whatsapp', 'whatsapp/:connectionKey'])
  async handleWhatsAppWebhook(
    @Headers() headers: Record<string, string>,
    @Body() body: any,
    @Req() req: Request
  ) {
    const rawBody = JSON.stringify(body);
    return await this.webhooksService.handleWhatsAppWebhook(headers, body, rawBody);
  }

  @Post(['email', 'email/:connectionKey'])
  async handleEmailWebhook(
    @Headers() headers: Record<string, string>,
    @Body() body: any,
    @Req() req: Request
  ) {
    const rawBody = JSON.stringify(body);
    return await this.webhooksService.handleEmailWebhook(headers, body, rawBody);
  }
}

