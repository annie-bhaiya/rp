import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { SessionMiddleware } from './common/session.middleware.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { CatalogModule } from './modules/catalog/catalog.module.js';
import { CasesModule } from './modules/cases/cases.module.js';
import { PlansModule } from './modules/plans/plans.module.js';
import { ResolutionsModule } from './modules/resolutions/resolutions.module.js';
import { PoliciesModule } from './modules/policies/policies.module.js';
import { WebhooksModule } from './modules/webhooks/webhooks.module.js';
import { DevModule } from './modules/dev/dev.module.js';

@Module({
  imports: [
    AuthModule,
    CatalogModule,
    CasesModule,
    PlansModule,
    ResolutionsModule,
    PoliciesModule,
    WebhooksModule,
    DevModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(cookieParser(), SessionMiddleware)
      .forRoutes('*');
  }
}
