import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { CalculatorInput } from './components/CalculatorInput';
import { HighlightCards } from './components/HighlightCards';
import { FrequencyComparison } from './components/FrequencyComparison';
import { ProjectionChart } from './components/ProjectionChart';
import { DetailedTable } from './components/DetailedTable';
import type { Frequency } from './types/savings';
import { calculateAllProjections } from './utils/savingsCalculator';

export const App: React.FC = () => {
  const [amount, setAmount] = useState<number>(50);
  const [interestRate, setInterestRate] = useState<number>(3.0);
  const [selectedFrequency, setSelectedFrequency] = useState<Frequency>('monthly');

  // Realtime calculation memorization
  const projections = useMemo(() => {
    return calculateAllProjections(amount, interestRate);
  }, [amount, interestRate]);

  const activeFrequencyProjection = projections.byFrequency[selectedFrequency];

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="app-container">
        {/* Step 1: Input controls */}
        <CalculatorInput
          amount={amount}
          onAmountChange={setAmount}
          interestRate={interestRate}
          onInterestRateChange={setInterestRate}
          selectedFrequency={selectedFrequency}
          onFrequencyChange={setSelectedFrequency}
        />

        {/* Step 2: Milestone Highlight cards (20y / 30y / 50y max) */}
        <HighlightCards projection={activeFrequencyProjection} />

        {/* Step 3: Frequency Comparison */}
        <FrequencyComparison
          projections={projections}
          amount={amount}
          selectedFrequency={selectedFrequency}
          onSelectFrequency={setSelectedFrequency}
        />

        {/* Step 4: Growth Chart */}
        <ProjectionChart
          projections={projections}
          selectedFrequency={selectedFrequency}
        />

        {/* Step 5: Full 12-timeframe matrix table */}
        <DetailedTable
          projections={projections}
          selectedFrequency={selectedFrequency}
          onSelectFrequency={setSelectedFrequency}
        />
      </main>
    </div>
  );
};

export default App;
