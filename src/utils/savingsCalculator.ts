import type {
  Frequency,
  FrequencyOption,
  TimeframeId,
  TimeframeOption,
  ProjectionDetail,
  FrequencyProjection,
  GrowthChartPoint,
  AllProjectionsResult,
  CalculatorMode,
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
  { id: '25y', label: '25 jaar', years: 25 },
  { id: '30y', label: '30 jaar', years: 30 },
  { id: '35y', label: '35 jaar', years: 35 },
  { id: '45y', label: '45 jaar', years: 45 },
  { id: '50y', label: '50 jaar', years: 50 },
];

export function calculateProjection(
  amount: number,
  frequency: Frequency,
  years: number,
  annualInterestRatePct: number,
  mode: CalculatorMode = 'savings'
): ProjectionDetail {
  const cleanAmount = Math.max(0, isNaN(amount) ? 0 : amount);
  // In expenses mode, interest is strictly 0%
  const cleanRate = mode === 'expenses' ? 0 : Math.max(0, isNaN(annualInterestRatePct) ? 0 : annualInterestRatePct);
  
  const freqConfig = FREQUENCIES.find((f) => f.id === frequency)!;
  const periodsPerYear = freqConfig.periodsPerYear;
  
  const totalPeriods = years * periodsPerYear;
  const totalDeposit = cleanAmount * totalPeriods;

  if (cleanRate === 0) {
    return {
      timeframeId: '50y',
      label: '',
      years,
      totalDeposit: Math.round(totalDeposit * 100) / 100,
      totalInterest: 0,
      totalValue: Math.round(totalDeposit * 100) / 100,
    };
  }

  // Monthly compounding rate (strictly monthlyRate = annualRatePct / 100 / 12)
  const monthlyRate = cleanRate / 100 / 12;
  const totalMonths = Math.max(1, Math.round(years * 12));

  let currentBalance = 0;

  if (years < 1 / 12) {
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
    let depositsThisMonth = 0;
    if (frequency === 'monthly') {
      depositsThisMonth = 1;
    } else if (frequency === 'quarterly') {
      depositsThisMonth = m % 3 === 0 ? 1 : 0;
    } else if (frequency === 'yearly') {
      depositsThisMonth = m % 12 === 0 ? 1 : 0;
    } else if (frequency === 'weekly') {
      // Discrete week deposits falling into month m (summing to 52 per year)
      depositsThisMonth = Math.round(m * (52 / 12)) - Math.round((m - 1) * (52 / 12));
    }

    currentBalance += cleanAmount * depositsThisMonth;
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
  annualInterestRatePct: number,
  mode: CalculatorMode = 'savings'
): AllProjectionsResult {
  const byFrequency = {} as Record<Frequency, FrequencyProjection>;
  const effectiveRate = mode === 'expenses' ? 0 : annualInterestRatePct;

  FREQUENCIES.forEach((freq) => {
    const projections = {} as Record<TimeframeId, ProjectionDetail>;

    TIMEFRAMES.forEach((tf) => {
      const proj = calculateProjection(amount, freq.id, tf.years, effectiveRate, mode);
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
      const pWeekly = calculateProjection(amount, 'weekly', year, effectiveRate, mode);
      const pMonthly = calculateProjection(amount, 'monthly', year, effectiveRate, mode);
      const pQuarterly = calculateProjection(amount, 'quarterly', year, effectiveRate, mode);
      const pYearly = calculateProjection(amount, 'yearly', year, effectiveRate, mode);

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
    annualInterestRate: effectiveRate,
    mode,
    byFrequency,
    chartData,
  };
}

export function calculateRequiredDeposit(
  targetAmount: number,
  frequency: Frequency,
  years: number,
  annualInterestRatePct: number,
  mode: CalculatorMode = 'savings'
): {
  requiredDeposit: number;
  totalDeposit: number;
  totalInterest: number;
} {
  const cleanTarget = Math.max(0, isNaN(targetAmount) ? 0 : targetAmount);
  const cleanRate = mode === 'expenses' ? 0 : Math.max(0, isNaN(annualInterestRatePct) ? 0 : annualInterestRatePct);
  
  const freqConfig = FREQUENCIES.find((f) => f.id === frequency)!;
  const periodsPerYear = freqConfig.periodsPerYear;
  const totalPeriods = years * periodsPerYear;

  if (totalPeriods <= 0 || cleanTarget <= 0) {
    return { requiredDeposit: 0, totalDeposit: 0, totalInterest: 0 };
  }

  if (cleanRate === 0 || years < 1 / 12) {
    const requiredDeposit = cleanTarget / totalPeriods;
    return {
      requiredDeposit: Math.round(requiredDeposit * 100) / 100,
      totalDeposit: cleanTarget,
      totalInterest: 0,
    };
  }

  const monthlyRate = cleanRate / 100 / 12;
  const totalMonths = Math.max(1, Math.round(years * 12));

  let fvUnit = 0;
  for (let m = 1; m <= totalMonths; m++) {
    let depositsThisMonth = 0;
    if (frequency === 'monthly') {
      depositsThisMonth = 1;
    } else if (frequency === 'quarterly') {
      depositsThisMonth = m % 3 === 0 ? 1 : 0;
    } else if (frequency === 'yearly') {
      depositsThisMonth = m % 12 === 0 ? 1 : 0;
    } else if (frequency === 'weekly') {
      depositsThisMonth = Math.round(m * (52 / 12)) - Math.round((m - 1) * (52 / 12));
    }

    fvUnit += 1 * depositsThisMonth;
    fvUnit += fvUnit * monthlyRate;
  }

  const requiredDeposit = cleanTarget / fvUnit;
  const totalDeposit = requiredDeposit * totalPeriods;
  const totalInterest = Math.max(0, cleanTarget - totalDeposit);

  return {
    requiredDeposit: Math.round(requiredDeposit * 100) / 100,
    totalDeposit: Math.round(totalDeposit * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
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
