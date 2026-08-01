import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { ModeToggle } from './components/ModeToggle';
import { CalculatorInput } from './components/CalculatorInput';
import { HighlightCards } from './components/HighlightCards';
import { FrequencyComparison } from './components/FrequencyComparison';
import { ProjectionChart } from './components/ProjectionChart';
import { DetailedTable } from './components/DetailedTable';
import { CustomCalculator } from './components/CustomCalculator';
import type { Frequency, CalculatorMode } from './types/savings';
import { calculateAllProjections } from './utils/savingsCalculator';

export const App: React.FC = () => {
  const [mode, setMode] = useState<CalculatorMode>('savings');
  const [amount, setAmount] = useState<number>(50);
  const [interestRate, setInterestRate] = useState<number>(3.0);
  const [selectedFrequency, setSelectedFrequency] = useState<Frequency>('monthly');

  // Switch default amount when changing mode if it matches standard default
  const handleModeChange = (newMode: CalculatorMode) => {
    setMode(newMode);
    if (newMode === 'expenses' && amount === 50) {
      setAmount(15); // standard subscription cost example
    } else if (newMode === 'savings' && amount === 15) {
      setAmount(50);
    }
  };

  // Realtime calculation memorization
  const projections = useMemo(() => {
    return calculateAllProjections(amount, interestRate, mode);
  }, [amount, interestRate, mode]);

  const activeFrequencyProjection = projections.byFrequency[selectedFrequency];

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="app-container">
        {/* Step 0: Mode Toggle (Sparen vs Uitgaven) */}
        <ModeToggle mode={mode} onModeChange={handleModeChange} />

        {/* Step 1: Input controls */}
        <CalculatorInput
          amount={amount}
          onAmountChange={setAmount}
          interestRate={interestRate}
          onInterestRateChange={setInterestRate}
          selectedFrequency={selectedFrequency}
          onFrequencyChange={setSelectedFrequency}
          mode={mode}
        />

        {/* Step 2: Milestone Highlight cards (20y / 30y / 50y max) */}
        <HighlightCards projection={activeFrequencyProjection} mode={mode} />

        {/* Step 3: Frequency Comparison */}
        <FrequencyComparison
          projections={projections}
          amount={amount}
          selectedFrequency={selectedFrequency}
          onSelectFrequency={setSelectedFrequency}
          mode={mode}
        />

        {/* Step 4: Growth Chart */}
        <ProjectionChart
          projections={projections}
          selectedFrequency={selectedFrequency}
          mode={mode}
        />

        {/* Step 5: Full timeframe matrix table */}
        <DetailedTable
          projections={projections}
          selectedFrequency={selectedFrequency}
          onSelectFrequency={setSelectedFrequency}
          mode={mode}
        />

        {/* Step 6: Custom Realtime Calculator */}
        <CustomCalculator mode={mode} annualInterestRate={interestRate} />
      </main>
    </div>
  );
};

export default App;
