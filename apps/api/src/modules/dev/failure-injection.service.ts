import { Injectable } from '@nestjs/common';

export type FailureInjectionType = 'NONE' | 'REFUND_TIMEOUT_SIMULATION';

@Injectable()
export class FailureInjectionService {
  private activeSimulation: FailureInjectionType = 'NONE';
  private triggerCount = 0;

  getSimulation(): FailureInjectionType {
    return this.activeSimulation;
  }

  setSimulation(type: FailureInjectionType) {
    this.activeSimulation = type;
  }

  shouldSimulateRefundTimeout(): boolean {
    if (this.activeSimulation === 'REFUND_TIMEOUT_SIMULATION') {
      // Disarms after triggering once to allow subsequent recovery / retry
      this.activeSimulation = 'NONE';
      this.triggerCount++;
      return true;
    }
    return false;
  }

  getStatus() {
    return {
      activeSimulation: this.activeSimulation,
      triggerCount: this.triggerCount,
    };
  }
}

