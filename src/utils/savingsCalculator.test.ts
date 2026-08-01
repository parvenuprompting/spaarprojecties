import { describe, it, expect } from 'vitest';
import { calculateProjection, calculateAllProjections, calculateRequiredDeposit } from './savingsCalculator';

describe('Savings Calculator Utility', () => {
  it('calculates zero interest correctly for 1 year monthly savings of €50', () => {
    const result = calculateProjection(50, 'monthly', 1, 0, 'savings');
    expect(result.totalDeposit).toBe(600);
    expect(result.totalInterest).toBe(0);
    expect(result.totalValue).toBe(600);
  });

  it('calculates compound interest for 10 years at 3%', () => {
    const result = calculateProjection(50, 'monthly', 10, 3, 'savings');
    expect(result.totalDeposit).toBe(6000);
    expect(result.totalValue).toBeGreaterThan(6000);
    expect(result.totalInterest).toBe(Math.round((result.totalValue - 6000) * 100) / 100);
  });

  it('calculates expenses correctly with zero interest regardless of rate input', () => {
    const result = calculateProjection(15, 'monthly', 10, 5, 'expenses');
    expect(result.totalDeposit).toBe(1800);
    expect(result.totalInterest).toBe(0);
    expect(result.totalValue).toBe(1800);
  });

  it('generates all projections for expenses mode without NaN or errors', () => {
    const all = calculateAllProjections(15, 5, 'expenses');
    expect(all.amount).toBe(15);
    expect(all.annualInterestRate).toBe(0);
    expect(all.byFrequency.monthly.projections['50y'].totalValue).toBe(15 * 12 * 50);
    expect(all.chartData.length).toBe(13);
  });

  it('calculates required deposit for target amount correctly', () => {
    // €12,000 target over 10 years at 0% interest monthly = €100/month
    const targetZeroRate = calculateRequiredDeposit(12000, 'monthly', 10, 0, 'savings');
    expect(targetZeroRate.requiredDeposit).toBe(100);
    expect(targetZeroRate.totalDeposit).toBe(12000);
    expect(targetZeroRate.totalInterest).toBe(0);

    // €12,000 target over 10 years at 3% interest monthly -> required monthly deposit should be less than €100
    const targetWithRate = calculateRequiredDeposit(12000, 'monthly', 10, 3, 'savings');
    expect(targetWithRate.requiredDeposit).toBeLessThan(100);
    expect(targetWithRate.totalInterest).toBeGreaterThan(0);
  });
});
