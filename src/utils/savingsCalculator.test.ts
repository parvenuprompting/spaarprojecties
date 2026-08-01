import { describe, it, expect } from 'vitest';
import { calculateProjection, calculateAllProjections, calculateRequiredDeposit } from './savingsCalculator';

describe('Savings Calculator Utility - Exact Deposit Timing with Monthly Compounding', () => {
  it('verifies yearly deposit timing: €1000/year over 10 years at 3% interest equals €11.514,58', () => {
    const result = calculateProjection(1000, 'yearly', 10, 3, 'savings');
    expect(result.totalDeposit).toBe(10000);
    // Reference value calculated via monthly compounding loop: €11.514,58
    expect(result.totalValue).toBeCloseTo(11514.58, 1);
    expect(result.totalInterest).toBeCloseTo(1514.58, 1);
  });

  it('verifies quarterly deposit timing: €250/quarter over 10 years at 3% interest equals €11.645,10', () => {
    const result = calculateProjection(250, 'quarterly', 10, 3, 'savings');
    expect(result.totalDeposit).toBe(10000);
    // Reference value calculated via monthly compounding loop: €11.645,10
    expect(result.totalValue).toBeCloseTo(11645.10, 1);
    expect(result.totalInterest).toBeCloseTo(1645.10, 1);
  });

  it('verifies monthly frequency yields exact same result as before the change', () => {
    const result = calculateProjection(50, 'monthly', 10, 3, 'savings');
    expect(result.totalDeposit).toBe(6000);
    // Monthly deposit timing is unchanged: (balance + amount) * (1 + 0.03/12) per month
    expect(result.totalValue).toBe(7004.54);
    expect(result.totalInterest).toBe(1004.54);
  });

  it('verifies calculateRequiredDeposit inverse calculation for yearly target', () => {
    // Target €11.514,58 over 10 years at 3% interest yearly deposit
    const result = calculateRequiredDeposit(11514.58, 'yearly', 10, 3, 'savings');
    expect(result.requiredDeposit).toBeCloseTo(1000, 0);
  });

  it('verifies expenses mode yields zero interest across all frequencies', () => {
    const resultYearly = calculateProjection(1000, 'yearly', 10, 5, 'expenses');
    expect(resultYearly.totalDeposit).toBe(10000);
    expect(resultYearly.totalInterest).toBe(0);
    expect(resultYearly.totalValue).toBe(10000);
  });

  it('generates all projections without NaN or errors', () => {
    const all = calculateAllProjections(100, 3, 'savings');
    expect(all.amount).toBe(100);
    expect(all.byFrequency.weekly.projections['50y'].totalValue).toBeGreaterThan(0);
    expect(all.byFrequency.monthly.projections['50y'].totalValue).toBeGreaterThan(0);
    expect(all.chartData.length).toBe(13);
  });
});

describe('Startkapitaal (Initial Deposit) Functionality Tests', () => {
  it('correctly attributes initial deposit: €1000 initial + €0 periodic over 10y at 3% interest', () => {
    const result = calculateProjection(0, 'monthly', 10, 3, 'savings', 1000);
    // Total deposit must be €1.000 (NOT €0)
    expect(result.totalDeposit).toBe(1000);
    // 1000 * (1.0025)^120 = 1349.35
    expect(result.totalValue).toBeCloseTo(1349.35, 2);
    // Opgebouwde rente must be ONLY the interest gain: 1349.35 - 1000 = 349.35 (NOT 1349.35)
    expect(result.totalInterest).toBeCloseTo(349.35, 2);
  });

  it('correctly calculates initial deposit combined with periodic deposit: €5000 initial + €100/mo over 5y at 3%', () => {
    const result = calculateProjection(100, 'monthly', 5, 3, 'savings', 5000);
    // 5000 initial + (100 * 60) periodic = 11.000 total deposit
    expect(result.totalDeposit).toBe(11000);
    expect(result.totalValue).toBeGreaterThan(11000);
    expect(result.totalInterest).toBe(Math.round((result.totalValue - 11000) * 100) / 100);
  });

  it('calculates exact required deposit values without initial deposit (target 10000, 5y, 3%)', () => {
    const result = calculateRequiredDeposit(10000, 'monthly', 5, 3, 'savings', 0);
    expect(result.requiredDeposit).toBeCloseTo(154.30, 2);
    expect(result.totalDeposit).toBeCloseTo(9258.07, 2);
    expect(result.totalInterest).toBeCloseTo(741.93, 2);
  });

  it('calculates exact required deposit values with €2000 initial deposit (target 10000, 5y, 3%)', () => {
    const result = calculateRequiredDeposit(10000, 'monthly', 5, 3, 'savings', 2000);
    expect(result.requiredDeposit).toBeCloseTo(118.45, 2);
    expect(result.totalDeposit).toBeCloseTo(9107.20, 2);
    expect(result.totalInterest).toBeCloseTo(892.80, 2);
  });
});
