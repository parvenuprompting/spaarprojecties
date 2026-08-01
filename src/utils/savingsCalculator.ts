import type {
  Frequency,
  FrequencyOption,
  TimeframeId,
  TimeframeOption,
  ProjectionDetail,
  FrequencyProjection,
  GrowthChartPoint,
  AllProjectionsResult,
} from '../types/savings';

export const FREQUENCIES: FrequencyOption[] = [
  { id: 'weekly', label: 'Wekelijks', shortLabel: 'per week', periodsPerYear: 52 },
  { id: 'monthly', label: 'Maandelijks', shortLabel: 'per maand', periodsPerYear: 12 },
  { id: 'quarterly', label: 'Per Kwartaal', shortLabel: 'per kwartaal', periodsPerYear: 4 },
  { id: 'yearly', label: 'Jaarlijks', shortLabel: 'per jaar', periodsPerYear: 1 },
];

export const TIMEFRAMES: TimeframeOption[] = [
  { id: '1w', label: '1 week', years: 1 / 52 },
  { id: '1m', label: '1 maand', years: 1 / 12 },
  { id: '3m', label: '3 maanden', years: 0.25 },
  { id: '6m', label: '6 maanden', years: 0.5 },
  { id: '1y', label: '1 jaar', years: 1 },
  { id: '2y', label: '2 jaar', years: 2 },
  { id: '5y', label: '5 jaar', years: 5 },
  { id: '10y', label: '10 jaar', years: 10 },
  { id: '15y', label: '15 jaar', years: 15 },
  { id: '20y', label: '20 jaar', years: 20 },
  { id: '30y', label: '30 jaar', years: 30 },
  { id: '50y', label: '50 jaar', years: 50 },
];

/**
 * Calculates compound interest for periodic deposits.
 * Standard financial compounding: Monthly compounding.
 * 
 * Formula for monthly compounding:
 * Monthly rate = (1 + annualRate)^(1/12) - 1  (or annualRate / 12 for nominal)
 * Standard in banking: r_monthly = annualRate / 12.
 * 
 * For each month (m = 1..totalMonths):
 * 1. Add deposits that occurred during month m.
 * 2. Apply monthly interest (balance * r_monthly).
 */
export function calculateProjection(
  amount: number,
  frequency: Frequency,
  years: number,
  annualInterestRatePct: number
): ProjectionDetail {
  const cleanAmount = Math.max(0, isNaN(amount) ? 0 : amount);
  const cleanRate = Math.max(0, isNaN(annualInterestRatePct) ? 0 : annualInterestRatePct);
  
  const freqConfig = FREQUENCIES.find((f) => f.id === frequency)!;
  const periodsPerYear = freqConfig.periodsPerYear;
  
  const totalPeriods = years * periodsPerYear;
  const totalDeposit = cleanAmount * totalPeriods;

  if (cleanRate === 0) {
    return {
      timeframeId: '50y', // fallback placeholder, caller assigns exact timeframeId
      label: '',
      years,
      totalDeposit: Math.round(totalDeposit * 100) / 100,
      totalInterest: 0,
      totalValue: Math.round(totalDeposit * 100) / 100,
    };
  }

  const monthlyRate = cleanRate / 100 / 12;
  const totalMonths = Math.max(1, Math.round(years * 12));

  let currentBalance = 0;
  
  // Calculate simulation month by month for exact precision matching monthly compounding standard
  // Number of deposits per month
  const depositsPerMonth = periodsPerYear / 12;

  if (years < 1 / 12) {
    // Less than 1 month (e.g. 1 week)
    const depositCount = Math.max(1, Math.round(years * periodsPerYear));
    const deposit = cleanAmount * depositCount;
    return {
      timeframeId: '1w',
      label: '',
      years,
      totalDeposit: Math.round(deposit * 100) / 100,
      totalInterest: 0,
      totalValue: Math.round(deposit * 100) / 100,
    };
  }

  for (let m = 1; m <= totalMonths; m++) {
    // Add deposits for this month
    currentBalance += cleanAmount * depositsPerMonth;
    // Apply monthly interest
    currentBalance += currentBalance * monthlyRate;
  }

  const totalValue = Math.round(currentBalance * 100) / 100;
  const roundedDeposit = Math.round(totalDeposit * 100) / 100;
  const totalInterest = Math.max(0, Math.round((totalValue - roundedDeposit) * 100) / 100);

  return {
    timeframeId: '50y',
    label: '',
    years,
    totalDeposit: roundedDeposit,
    totalInterest,
    totalValue,
  };
}

export function calculateAllProjections(
  amount: number,
  annualInterestRatePct: number
): AllProjectionsResult {
  const byFrequency = {} as Record<Frequency, FrequencyProjection>;

  FREQUENCIES.forEach((freq) => {
    const projections = {} as Record<TimeframeId, ProjectionDetail>;

    TIMEFRAMES.forEach((tf) => {
      const proj = calculateProjection(amount, freq.id, tf.years, annualInterestRatePct);
      proj.timeframeId = tf.id;
      proj.label = tf.label;
      projections[tf.id] = proj;
    });

    byFrequency[freq.id] = {
      frequency: freq.id,
      frequencyLabel: freq.label,
      periodsPerYear: freq.periodsPerYear,
      projections,
    };
  });

  // Generate timeline chart points for 0 to 50 years
  const chartData: GrowthChartPoint[] = [];
  const keyYears = [0, 1, 2, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50];

  keyYears.forEach((year) => {
    if (year === 0) {
      chartData.push({
        year: 0,
        label: 'Start',
        deposit: 0,
        valueWeekly: 0,
        valueMonthly: 0,
        valueQuarterly: 0,
        valueYearly: 0,
      });
    } else {
      const pWeekly = calculateProjection(amount, 'weekly', year, annualInterestRatePct);
      const pMonthly = calculateProjection(amount, 'monthly', year, annualInterestRatePct);
      const pQuarterly = calculateProjection(amount, 'quarterly', year, annualInterestRatePct);
      const pYearly = calculateProjection(amount, 'yearly', year, annualInterestRatePct);

      chartData.push({
        year,
        label: `${year}j`,
        deposit: pMonthly.totalDeposit,
        valueWeekly: pWeekly.totalValue,
        valueMonthly: pMonthly.totalValue,
        valueQuarterly: pQuarterly.totalValue,
        valueYearly: pYearly.totalValue,
      });
    }
  });

  return {
    amount,
    annualInterestRate: annualInterestRatePct,
    byFrequency,
    chartData,
  };
}

export function formatCurrency(val: number): string {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(val);
}

export function formatCurrencyPrecise(val: number): string {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val);
}
