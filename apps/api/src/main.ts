import 'reflect-metadata';
import dotenv from 'dotenv';
import path from 'node:path';

// Load root .env
dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module.js';
import { runMigrations, runSeed } from '@resolvepay/db';
import { AllExceptionsFilter } from './common/filters.js';

async function bootstrap() {
  console.log('[ResolvePay API] Bootstrapping NestJS server...');

  // Ensure DB tables are ready
  try {
    await runMigrations();
  } catch (err) {
    console.warn('[ResolvePay API] Note on DB startup:', (err as Error).message);
  }

  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: [process.env.PUBLIC_WEB_URL || 'http://localhost:3000', 'http://localhost:3000'],
      credentials: true,
    },
  });

  app.useGlobalFilters(new AllExceptionsFilter());
  app.setGlobalPrefix('api/v1');

  // Swagger OpenAPI Setup
  const config = new DocumentBuilder()
    .setTitle('ResolvePay Rescue API')
    .setDescription('Autonomous commerce dispute, policy planning, and remedy resolution engine')
    .setVersion('1.0')
    .addServer('https://resolvepay-api.politetree-c3c2d975.centralindia.azurecontainerapps.io', 'Production & Demo API Gateway')
    .addServer('http://localhost:3001', 'Local Development Server')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: 'Session bearer token or authorization credential',
    })
    .addTag('Auth', 'Session management, persona authentication, and magic link access')
    .addTag('Catalog', 'Store catalog, product variants, and checkout order lifecycle')
    .addTag('Cases', 'Dispute case creation, messaging timeline, evidence uploads, and completeness checking')
    .addTag('Plans', 'AI-assisted and policy-guided remedy plan proposals, acceptance, and approval')
    .addTag('Returns', 'Physical item return tracking and merchant inspection gating')
    .addTag('Merchant', 'Operational recovery queue, policy publishing, analytics insights, and subledger reconciliation')
    .addTag('Webhooks', 'PayPal Orders v2 and Resend inbound event processing')
    .addTag('Dev', 'Development mailbox, health checks, seed fixtures, and failure injection simulator')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/docs', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`[ResolvePay API] HTTP server ready at http://localhost:${port}/api/v1`);
  console.log(`[ResolvePay API] Swagger OpenAPI docs at http://localhost:${port}/api/v1/docs`);
}

bootstrap().catch((err) => {
  console.error('[ResolvePay API] Fatal bootstrap error:', err);
  process.exit(1);
});

