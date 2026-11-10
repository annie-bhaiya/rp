import 'reflect-metadata';
import dotenv from 'dotenv';
import path from 'node:path';

dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { WorkerModule } from './worker.module.js';
import { WorkerRunnerService } from './runner.service.js';

async function run() {
  const isContinuous = process.argv.includes('--continuous') || process.env.WORKER_CONTINUOUS === 'true';

  const appContext = await NestFactory.createApplicationContext(WorkerModule, {
    logger: ['log', 'error', 'warn'],
  });

  const runner = appContext.get(WorkerRunnerService);

  if (isContinuous) {
    console.log('[ResolvePay Worker] Running in continuous polling mode (every 10s)...');
    const interval = setInterval(async () => {
      try {
        await runner.processBatch();
      } catch (err) {
        console.error('[ResolvePay Worker] Cycle error:', err);
      }
    }, 10000);

    const shutdown = async () => {
      clearInterval(interval);
      await appContext.close();
      process.exit(0);
    };
    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } else {
    // Single bounded job execution for Azure Container Apps Job (Plan §5.1)
    console.log('[ResolvePay Worker] Executing scheduled bounded batch run...');
    const result = await runner.processBatch();
    console.log('[ResolvePay Worker] Bounded batch run complete:', result);
    await appContext.close();
    process.exit(0);
  }
}

run().catch((err) => {
  console.error('[ResolvePay Worker] Fatal worker error:', err);
  process.exit(1);
});

