export class MetricRegistry {
  private counters = new Map<string, number>();

  increment(metricName: string, value: number = 1): void {
    const current = this.counters.get(metricName) || 0;
    this.counters.set(metricName, current + value);
  }

  get(metricName: string): number {
    return this.counters.get(metricName) || 0;
  }

  snapshot(): Record<string, number> {
    const result: Record<string, number> = {};
    for (const [key, val] of this.counters.entries()) {
      result[key] = val;
    }
    return result;
  }
}

export const metrics = new MetricRegistry();
