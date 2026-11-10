import { Module } from '@nestjs/common';
import { WorkerRunnerService } from './runner.service.js';

@Module({
  providers: [WorkerRunnerService],
  exports: [WorkerRunnerService],
})
export class WorkerModule {}
