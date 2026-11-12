import { Controller, Post, Get, Body, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { z } from 'zod';
import { AuthService } from './auth.service.js';
import { AuthRateGuard, DemoOnlyGuard, demoEnabled } from './auth.security.js';
import { AuthenticatedRequest } from '../../common/guards.js';
import { CustomerAccessRequestDtoSchema, CustomerAccessRedeemDtoSchema } from '@resolvepay/contracts';

const merchantRequest = z.object({ tenantSlug: z.string().trim().min(1).max(64).default('default-merchant'), email: z.string().trim().email().max(255) });
const demoRequest = z.object({ persona: z.enum(['OWNER', 'APPROVER', 'JUDGE', 'CUSTOMER']), tenantSlug: z.string().max(64).default('default-merchant'), orderId: z.string().max(64).optional(), email: z.string().email().optional() });

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  private async establish(result: Awaited<ReturnType<AuthService['redeemCustomerAccess']>>, req: AuthenticatedRequest, res: Response) {
    await this.authService.revokeSession(req.sessionInfo?.sessionId);
    res.setHeader('Cache-Control', 'no-store');
    res.cookie('resolvepay_session', result.token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 86_400_000 });
    return { session: result.session };
  }

  @Get('config')
  config() { return { demoEnabled: demoEnabled() }; }

  @Post('customer/access/request')
  @UseGuards(AuthRateGuard)
  requestAccess(@Body() body: unknown) {
    return this.authService.requestCustomerAccess(CustomerAccessRequestDtoSchema.parse(body));
  }

  @Post('customer/access/redeem')
  @UseGuards(AuthRateGuard)
  async redeemAccess(@Body() body: unknown, @Req() req: AuthenticatedRequest, @Res({ passthrough: true }) res: Response) {
    return this.establish(await this.authService.redeemCustomerAccess(CustomerAccessRedeemDtoSchema.parse(body)), req, res);
  }

  @Post('merchant/access/request')
  @UseGuards(AuthRateGuard)
  requestMerchant(@Body() body: unknown) { return this.authService.requestMerchantAccess(merchantRequest.parse(body)); }

  @Post('merchant/access/redeem')
  @UseGuards(AuthRateGuard)
  async redeemMerchant(@Body() body: unknown, @Req() req: AuthenticatedRequest, @Res({ passthrough: true }) res: Response) {
    const dto = CustomerAccessRedeemDtoSchema.parse(body);
    return this.establish(await this.authService.redeemMerchantAccess(dto.token), req, res);
  }

  @Post('login-dev')
  @UseGuards(DemoOnlyGuard, AuthRateGuard)
  async loginDev(@Body() body: unknown, @Req() req: AuthenticatedRequest, @Res({ passthrough: true }) res: Response) {
    const dto = demoRequest.parse(body);
    return this.establish(await this.authService.loginDevPersona(dto.persona, dto.tenantSlug, dto.orderId, dto.email), req, res);
  }

  @Get('session')
  getSession(@Req() req: AuthenticatedRequest, @Res({ passthrough: true }) res: Response) {
    res.setHeader('Cache-Control', 'no-store');
    if (!req.sessionInfo) throw new UnauthorizedException('Please sign in to continue.');
    return req.sessionInfo;
  }

  @Post('logout')
  async logout(@Req() req: AuthenticatedRequest, @Res({ passthrough: true }) res: Response) {
    await this.authService.revokeSession(req.sessionInfo?.sessionId);
    res.clearCookie('resolvepay_session', { path: '/', httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });
    return { success: true };
  }
}
