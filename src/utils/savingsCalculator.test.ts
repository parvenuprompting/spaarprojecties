import { describe, it, expect } from 'vitest';
import { calculateProjection, calculateAllProjections } from './savingsCalculator';

describe('Savings Calculator Utility', () => {
  it('calculates zero interest correctly for 1 year monthly savings of €50', () => {
    const result = calculateProjection(50, 'monthly', 1, 0);
    expect(result.totalDeposit).toBe(600);
    expect(result.totalInterest).toBe(0);
    expect(result.totalValue).toBe(600);
  });

  it('calculates compound interest for 10 years at 3%', () => {
    const result = calculateProjection(50, 'monthly', 10, 3);
    // 50 * 12 * 10 = 6000 total deposit
    expect(result.totalDeposit).toBe(6000);
    expect(result.totalValue).toBeGreaterThan(6000);
    expect(result.totalInterest).toBe(Math.round((result.totalValue - 6000) * 100) / 100);
  });

  it('generates all projections without NaN or errors', () => {
    const all = calculateAllProjections(100, 3);
    expect(all.amount).toBe(100);
    expect(all.byFrequency.weekly.projections['50y'].totalValue).toBeGreaterThan(0);
    expect(all.byFrequency.monthly.projections['50y'].totalValue).toBeGreaterThan(0);
    expect(all.chartData.length).toBe(13);
  });
});
