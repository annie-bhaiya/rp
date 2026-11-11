import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service.js';
import { AuthenticatedRequest } from '../../common/guards.js';
import {
  CustomerAccessRequestDtoSchema,
  CustomerAccessRedeemDtoSchema,
} from '@resolvepay/contracts';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('customer/access/request')
  async requestAccess(@Body() body: unknown) {
    const dto = CustomerAccessRequestDtoSchema.parse(body);
    return await this.authService.requestCustomerAccess(dto);
  }

  @Post('customer/access/redeem')
  async redeemAccess(@Body() body: unknown, @Res({ passthrough: true }) res: Response) {
    const dto = CustomerAccessRedeemDtoSchema.parse(body);
    const result = await this.authService.redeemCustomerAccess(dto);

    res.cookie('resolvepay_session', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });

    return result;
  }

  @Post('login-dev')
  async loginDev(
    @Body('persona') persona: 'OWNER' | 'APPROVER' | 'JUDGE' | 'CUSTOMER',
    @Body('tenantSlug') tenantSlug: string,
    @Body('orderId') orderId: string,
    @Body('email') email: string,
    @Res({ passthrough: true }) res: Response
  ) {
    const result = await this.authService.loginDevPersona(
      persona || 'OWNER',
      tenantSlug || 'default-merchant',
      orderId,
      email
    );

    res.cookie('resolvepay_session', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });

    return result;
  }

  @Get('session')
  getSession(@Req() req: AuthenticatedRequest) {
    if (!req.sessionInfo) {
      throw new UnauthorizedException('No active session');
    }
    return req.sessionInfo;
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('resolvepay_session');
    return { success: true };
  }
}

