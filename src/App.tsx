import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { ModeToggle } from './components/ModeToggle';
import { CalculatorInput } from './components/CalculatorInput';
import { HighlightCards } from './components/HighlightCards';
import { FrequencyComparison } from './components/FrequencyComparison';
import { ProjectionChart } from './components/ProjectionChart';
import { DetailedTable } from './components/DetailedTable';
import { CustomCalculator } from './components/CustomCalculator';
import { TargetCalculator } from './components/TargetCalculator';
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
        <div id="invoer">
          <CalculatorInput
            amount={amount}
            onAmountChange={setAmount}
            interestRate={interestRate}
            onInterestRateChange={setInterestRate}
            selectedFrequency={selectedFrequency}
            onFrequencyChange={setSelectedFrequency}
            mode={mode}
          />
        </div>

        {/* Step 2: Milestone Highlight cards (20y / 30y / 50y max) */}
        <div id="highlights">
          <HighlightCards projection={activeFrequencyProjection} mode={mode} />
        </div>

        {/* Step 3: Frequency Comparison */}
        <div id="vergelijking">
          <FrequencyComparison
            projections={projections}
            amount={amount}
            selectedFrequency={selectedFrequency}
            onSelectFrequency={setSelectedFrequency}
            mode={mode}
          />
        </div>

        {/* Step 4: Growth Chart */}
        <div id="grafiek">
          <ProjectionChart
            projections={projections}
            selectedFrequency={selectedFrequency}
            mode={mode}
          />
        </div>

        {/* Step 5: Full timeframe matrix table */}
        <div id="tabel">
          <DetailedTable
            projections={projections}
            selectedFrequency={selectedFrequency}
            onSelectFrequency={setSelectedFrequency}
            mode={mode}
          />
        </div>

        {/* Step 6: Custom Realtime Calculator */}
        <div id="custom-calc">
          <CustomCalculator mode={mode} annualInterestRate={interestRate} />
        </div>

        {/* Step 7: Spaardoel Target Calculator */}
        <div id="spaardoel">
          <TargetCalculator mode={mode} annualInterestRate={interestRate} />
        </div>
      </main>
    </div>
  );
};

export default App;
