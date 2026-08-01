export type Frequency = 'weekly' | 'monthly' | 'quarterly' | 'yearly';
export type CalculatorMode = 'savings' | 'expenses';

export interface FrequencyOption {
  id: Frequency;
  label: string;
  shortLabel: string;
  periodsPerYear: number;
}

export type TimeframeId = 
  | '1w'
  | '1m'
  | '3m'
  | '6m'
  | '1y'
  | '2y'
  | '5y'
  | '10y'
  | '15y'
  | '20y'
  | '25y'
  | '30y'
  | '35y'
  | '45y'
  | '50y';

export interface TimeframeOption {
  id: TimeframeId;
  label: string;
  years: number;
}

export interface ProjectionDetail {
  timeframeId: TimeframeId;
  label: string;
  years: number;
  totalDeposit: number;
  totalInterest: number;
  totalValue: number;
}

export interface FrequencyProjection {
  frequency: Frequency;
  frequencyLabel: string;
  periodsPerYear: number;
  projections: Record<TimeframeId, ProjectionDetail>;
}

export interface GrowthChartPoint {
  year: number;
  label: string;
  deposit: number;
  valueWeekly: number;
  valueMonthly: number;
  valueQuarterly: number;
  valueYearly: number;
}

export interface AllProjectionsResult {
  amount: number;
  annualInterestRate: number;
  mode: CalculatorMode;
  byFrequency: Record<Frequency, FrequencyProjection>;
  chartData: GrowthChartPoint[];
}
