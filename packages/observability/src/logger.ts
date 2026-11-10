import { redactObject } from './redaction.js';

export interface LogContext {
  traceId?: string;
  tenantId?: string;
  caseId?: string;
  orderId?: string;
  step?: string;
  provider?: string;
  durationMs?: number;
  [key: string]: unknown;
}

export class JsonLogger {
  constructor(private context: LogContext = {}) {}

  withContext(extra: LogContext): JsonLogger {
    return new JsonLogger({ ...this.context, ...extra });
  }

  private log(level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG', message: string, data?: Record<string, unknown>): void {
    const entry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context: this.context,
      data: data ? redactObject(data) : undefined,
    };
    const jsonStr = JSON.stringify(entry);
    if (level === 'ERROR') {
      console.error(jsonStr);
    } else if (level === 'WARN') {
      console.warn(jsonStr);
    } else {
      console.log(jsonStr);
    }
  }

  info(message: string, data?: Record<string, unknown>): void {
    this.log('INFO', message, data);
  }

  warn(message: string, data?: Record<string, unknown>): void {
    this.log('WARN', message, data);
  }

  error(message: string, data?: Record<string, unknown>): void {
    this.log('ERROR', message, data);
  }

  debug(message: string, data?: Record<string, unknown>): void {
    this.log('DEBUG', message, data);
  }
}

export const logger = new JsonLogger();
