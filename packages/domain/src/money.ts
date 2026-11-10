import { Money } from '@resolvepay/contracts';

export function createMoney(minorUnits: number | string | bigint, currency: string = 'USD'): Money {
  const minorStr = typeof minorUnits === 'bigint' ? minorUnits.toString() : String(minorUnits);
  if (!/^-?\d+$/.test(minorStr)) {
    throw new Error(`Invalid minor units string for money: ${minorStr}`);
  }
  return {
    currency: currency.toUpperCase(),
    minor: minorStr,
  };
}

export function zeroMoney(currency: string = 'USD'): Money {
  return { currency: currency.toUpperCase(), minor: '0' };
}

export function addMoney(a: Money, b: Money): Money {
  if (a.currency !== b.currency) {
    throw new Error(`Currency mismatch: ${a.currency} vs ${b.currency}`);
  }
  const result = BigInt(a.minor) + BigInt(b.minor);
  return { currency: a.currency, minor: result.toString() };
}

export function subtractMoney(a: Money, b: Money): Money {
  if (a.currency !== b.currency) {
    throw new Error(`Currency mismatch: ${a.currency} vs ${b.currency}`);
  }
  const result = BigInt(a.minor) - BigInt(b.minor);
  return { currency: a.currency, minor: result.toString() };
}

export function multiplyMoney(a: Money, quantity: number): Money {
  if (!Number.isInteger(quantity) || quantity < 0) {
    throw new Error(`Quantity must be a non-negative integer: ${quantity}`);
  }
  const result = BigInt(a.minor) * BigInt(quantity);
  return { currency: a.currency, minor: result.toString() };
}

export function compareMoney(a: Money, b: Money): number {
  if (a.currency !== b.currency) {
    throw new Error(`Cannot compare different currencies: ${a.currency} and ${b.currency}`);
  }
  const diff = BigInt(a.minor) - BigInt(b.minor);
  if (diff > 0n) return 1;
  if (diff < 0n) return -1;
  return 0;
}

export function isZeroMoney(a: Money): boolean {
  return BigInt(a.minor) === 0n;
}

export function isPositiveMoney(a: Money): boolean {
  return BigInt(a.minor) > 0n;
}

export function formatMoney(m: Money): string {
  const minor = BigInt(m.minor);
  const isNegative = minor < 0n;
  const absMinor = isNegative ? -minor : minor;
  const dollars = absMinor / 100n;
  const cents = absMinor % 100n;
  const paddedCents = cents.toString().padStart(2, '0');
  const sign = isNegative ? '-' : '';
  const symbol = m.currency === 'USD' ? '$' : `${m.currency} `;
  return `${sign}${symbol}${dollars.toString()}.${paddedCents}`;
}

/**
 * Largest-remainder allocation rule to allocate total minor units proportionally
 * ensuring the sum of allocations exactly equals total minor units.
 */
export function allocateLargestRemainder(total: Money, ratios: number[]): Money[] {
  if (ratios.length === 0) return [];
  const totalMinor = BigInt(total.minor);
  const ratioSum = ratios.reduce((sum, r) => sum + r, 0);
  if (ratioSum === 0) {
    throw new Error('Sum of ratios cannot be zero');
  }

  const exactAllocations = ratios.map((r) => (Number(totalMinor) * r) / ratioSum);
  const flooredAllocations = exactAllocations.map((a) => BigInt(Math.floor(a)));
  const sumFloored = flooredAllocations.reduce((acc, curr) => acc + curr, 0n);
  let remainder = Number(totalMinor - sumFloored);

  // Distribute remainder by highest fractional parts
  const fractions = exactAllocations.map((a, i) => ({
    index: i,
    fraction: a - Math.floor(a),
  }));
  fractions.sort((a, b) => b.fraction - a.fraction);

  const result = [...flooredAllocations];
  for (let i = 0; i < remainder; i++) {
    const targetIdx = fractions[i % fractions.length].index;
    result[targetIdx] += 1n;
  }

  return result.map((minor) => ({ currency: total.currency, minor: minor.toString() }));
}

