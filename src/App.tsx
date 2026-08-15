import React, { useState, useEffect, useMemo } from 'react';
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

const LOCAL_STORAGE_KEY = 'spaarprojecties_user_state_v1';

export const App: React.FC = () => {
  // Load saved state or defaults
  const [mode, setMode] = useState<CalculatorMode>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.mode || 'savings';
      } catch { /* ignore */ }
    }
    return 'savings';
  });

  const [amount, setAmount] = useState<number>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return typeof parsed.amount === 'number' ? parsed.amount : 50;
      } catch { /* ignore */ }
    }
    return 50;
  });

  const [initialDeposit, setInitialDeposit] = useState<number>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return typeof parsed.initialDeposit === 'number' ? parsed.initialDeposit : 0;
      } catch { /* ignore */ }
    }
    return 0;
  });

  const [interestRate, setInterestRate] = useState<number>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return typeof parsed.interestRate === 'number' ? parsed.interestRate : 3.0;
      } catch { /* ignore */ }
    }
    return 3.0;
  });

  const [selectedFrequency, setSelectedFrequency] = useState<Frequency>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.selectedFrequency || 'monthly';
      } catch { /* ignore */ }
    }
    return 'monthly';
  });

  // Save to localStorage on state changes
  useEffect(() => {
    localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify({
        mode,
        amount,
        initialDeposit,
        interestRate,
        selectedFrequency,
      })
    );
  }, [mode, amount, initialDeposit, interestRate, selectedFrequency]);

  // Switch default amount when changing mode if it matches standard default
  const handleModeChange = (newMode: CalculatorMode) => {
    setMode(newMode);
    if (newMode === 'expenses' && amount === 50) {
      setAmount(15);
    } else if (newMode === 'savings' && amount === 15) {
      setAmount(50);
    }
  };

  // Realtime calculation memorization
  const projections = useMemo(() => {
    return calculateAllProjections(amount, interestRate, mode, initialDeposit);
  }, [amount, interestRate, mode, initialDeposit]);

  const activeFrequencyProjection = projections.byFrequency[selectedFrequency];

  return (
    <div className="app-root">
      <Header />

      <main className="app-container">
        {/* Step 0: Mode Toggle (Sparen vs Uitgaven) */}
        <ModeToggle mode={mode} onModeChange={handleModeChange} />

          {/* Step 1: Input controls */}
          <div id="invoer">
            <CalculatorInput
              amount={amount}
              onAmountChange={setAmount}
              initialDeposit={initialDeposit}
              onInitialDepositChange={setInitialDeposit}
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
            <CustomCalculator
              mode={mode}
              annualInterestRate={interestRate}
              globalFrequency={selectedFrequency}
              initialDeposit={initialDeposit}
            />
          </div>

          {/* Step 7: Spaardoel Target Calculator */}
          <div id="spaardoel">
            <TargetCalculator
              mode={mode}
              annualInterestRate={interestRate}
              globalFrequency={selectedFrequency}
              onFrequencyChange={setSelectedFrequency}
              initialDeposit={initialDeposit}
            />
          </div>
        </main>

      {/* Disclaimers & Footer */}
      <footer className="app-footer">
        <div className="app-footer-content">
          <p>
            <strong>Disclaimer:</strong> Alle bedragen en projecties zijn nominaal (niet gecorrigeerd voor inflatie of Box 3 heffing). Uitsluitend bedoeld voor educatieve en indicatieve doeleinden.
          </p>
          <p className="app-footer-copy">
            © {new Date().getFullYear()} SpaarProjecties • Pure Client-Side App (100% Privacy & Geen Tracking)
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
