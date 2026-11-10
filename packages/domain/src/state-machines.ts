import {
  CaseState,
  PlanState,
  ResolutionState,
  StepState,
  ReturnStatus,
  FulfillmentStatus,
} from '@resolvepay/contracts';

export class StateTransitionError extends Error {
  constructor(aggregate: string, from: string, to: string, reason?: string) {
    super(`Invalid ${aggregate} transition from "${from}" to "${to}"${reason ? `: ${reason}` : ''}`);
    this.name = 'StateTransitionError';
  }
}

// Case State Machine
const CASE_VALID_TRANSITIONS: Record<CaseState, CaseState[]> = {
  OPEN: ['NEEDS_INFORMATION', 'PLANNING', 'MANUAL_REVIEW', 'CLOSED'],
  NEEDS_INFORMATION: ['PLANNING', 'MANUAL_REVIEW', 'CLOSED'],
  PLANNING: ['OPTIONS_READY', 'NEEDS_INFORMATION', 'MANUAL_REVIEW'],
  OPTIONS_READY: ['AWAITING_APPROVALS', 'PLANNING', 'MANUAL_REVIEW', 'CLOSED'],
  AWAITING_APPROVALS: ['EXECUTING', 'OPTIONS_READY', 'MANUAL_REVIEW', 'CLOSED'],
  EXECUTING: ['RESOLVED', 'MANUAL_REVIEW'],
  RESOLVED: [], // Terminal
  MANUAL_REVIEW: ['PLANNING', 'EXECUTING', 'RESOLVED', 'CLOSED'],
  CLOSED: [], // Terminal
};

export function canTransitionCase(from: CaseState, to: CaseState): boolean {
  return CASE_VALID_TRANSITIONS[from]?.includes(to) ?? false;
}

export function transitionCase(current: CaseState, next: CaseState): CaseState {
  if (!canTransitionCase(current, next)) {
    throw new StateTransitionError('Case', current, next);
  }
  return next;
}

// Plan State Machine
const PLAN_VALID_TRANSITIONS: Record<PlanState, PlanState[]> = {
  DRAFT: ['VALIDATED', 'SUPERSEDED'],
  VALIDATED: ['OFFERED', 'SUPERSEDED', 'EXPIRED'],
  OFFERED: ['SELECTED', 'SUPERSEDED', 'EXPIRED', 'REJECTED'],
  SELECTED: ['READY', 'SUPERSEDED', 'EXPIRED', 'REJECTED'],
  READY: ['EXECUTING', 'SUPERSEDED', 'EXPIRED', 'REJECTED'],
  EXECUTING: ['COMPLETED', 'SUPERSEDED', 'REJECTED'],
  COMPLETED: [], // Terminal
  SUPERSEDED: [], // Terminal
  EXPIRED: [], // Terminal
  REJECTED: [], // Terminal
};

export function canTransitionPlan(from: PlanState, to: PlanState): boolean {
  return PLAN_VALID_TRANSITIONS[from]?.includes(to) ?? false;
}

export function transitionPlan(current: PlanState, next: PlanState): PlanState {
  if (!canTransitionPlan(current, next)) {
    throw new StateTransitionError('Plan', current, next);
  }
  return next;
}

// Resolution State Machine
const RESOLUTION_VALID_TRANSITIONS: Record<ResolutionState, ResolutionState[]> = {
  PREPARED: ['WAITING_RETURN', 'WAITING_PAYMENT', 'RUNNING', 'CANCELLED'],
  WAITING_RETURN: ['RUNNING', 'WAITING_PAYMENT', 'RECOVERY_REQUIRED', 'MANUAL_REVIEW', 'CANCELLED'],
  WAITING_PAYMENT: ['RUNNING', 'WAITING_RETURN', 'RECOVERY_REQUIRED', 'MANUAL_REVIEW', 'CANCELLED'],
  RUNNING: ['WAITING_PROVIDER', 'WAITING_FULFILLMENT', 'COMPLETED', 'RECOVERY_REQUIRED', 'MANUAL_REVIEW'],
  WAITING_PROVIDER: ['RUNNING', 'COMPLETED', 'RECOVERY_REQUIRED', 'MANUAL_REVIEW'],
  WAITING_FULFILLMENT: ['COMPLETED', 'RECOVERY_REQUIRED', 'MANUAL_REVIEW'],
  COMPLETED: [], // Terminal
  RECOVERY_REQUIRED: ['RUNNING', 'MANUAL_REVIEW', 'CANCELLED'],
  MANUAL_REVIEW: ['RUNNING', 'COMPLETED', 'CANCELLED'],
  CANCELLED: [], // Terminal
};

export function canTransitionResolution(from: ResolutionState, to: ResolutionState): boolean {
  return RESOLUTION_VALID_TRANSITIONS[from]?.includes(to) ?? false;
}

export function transitionResolution(current: ResolutionState, next: ResolutionState): ResolutionState {
  if (!canTransitionResolution(current, next)) {
    throw new StateTransitionError('Resolution', current, next);
  }
  return next;
}

// Step State Machine
const STEP_VALID_TRANSITIONS: Record<StepState, StepState[]> = {
  READY: ['CLAIMED', 'FAILED_FINAL'],
  CLAIMED: ['IN_FLIGHT', 'READY', 'UNKNOWN', 'FAILED_FINAL'],
  IN_FLIGHT: ['SUCCEEDED', 'RETRY_WAIT', 'UNKNOWN', 'FAILED_FINAL', 'COMPENSATING'],
  RETRY_WAIT: ['READY', 'FAILED_FINAL'],
  UNKNOWN: ['CLAIMED', 'SUCCEEDED', 'FAILED_FINAL', 'COMPENSATING'],
  SUCCEEDED: [], // Terminal
  FAILED_FINAL: ['COMPENSATING'],
  COMPENSATING: ['COMPENSATED', 'FAILED_FINAL'],
  COMPENSATED: [], // Terminal
};

export function canTransitionStep(from: StepState, to: StepState): boolean {
  return STEP_VALID_TRANSITIONS[from]?.includes(to) ?? false;
}

export function transitionStep(current: StepState, next: StepState): StepState {
  if (!canTransitionStep(current, next)) {
    throw new StateTransitionError('Step', current, next);
  }
  return next;
}

// Return State Machine
const RETURN_VALID_TRANSITIONS: Record<ReturnStatus, ReturnStatus[]> = {
  REQUIRED: ['AUTHORIZED'],
  AUTHORIZED: ['IN_TRANSIT'],
  IN_TRANSIT: ['RECEIVED'],
  RECEIVED: ['INSPECTION_PASSED', 'INSPECTION_FAILED'],
  INSPECTION_PASSED: [], // Terminal success for return gate
  INSPECTION_FAILED: [], // Terminal failure for return gate
};

export function canTransitionReturn(from: ReturnStatus, to: ReturnStatus): boolean {
  return RETURN_VALID_TRANSITIONS[from]?.includes(to) ?? false;
}

export function transitionReturn(current: ReturnStatus, next: ReturnStatus): ReturnStatus {
  if (!canTransitionReturn(current, next)) {
    throw new StateTransitionError('Return', current, next);
  }
  return next;
}

// Fulfillment State Machine
const FULFILLMENT_VALID_TRANSITIONS: Record<FulfillmentStatus, FulfillmentStatus[]> = {
  PLANNED: ['RESERVED', 'CANCELLED'],
  RESERVED: ['DISPATCH_READY', 'BLOCKED', 'CANCELLED'],
  DISPATCH_READY: ['SHIPPED', 'CANCELLED'],
  SHIPPED: ['DELIVERED', 'EXCEPTION'],
  DELIVERED: [], // Terminal success
  BLOCKED: ['RESERVED', 'CANCELLED'],
  CANCELLED: [],
  EXCEPTION: ['SHIPPED', 'DELIVERED', 'CANCELLED'],
};

export function canTransitionFulfillment(from: FulfillmentStatus, to: FulfillmentStatus): boolean {
  return FULFILLMENT_VALID_TRANSITIONS[from]?.includes(to) ?? false;
}

export function transitionFulfillment(current: FulfillmentStatus, next: FulfillmentStatus): FulfillmentStatus {
  if (!canTransitionFulfillment(current, next)) {
    throw new StateTransitionError('Fulfillment', current, next);
  }
  return next;
}
