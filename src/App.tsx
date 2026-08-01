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
import { Info } from 'lucide-react';

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
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <div>
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
      </div>

      {/* Disclaimers & Footer */}
      <footer className="w-full border-t border-slate-200 bg-white py-6 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-slate-500 text-xs flex flex-col gap-2">
          <div className="flex items-start gap-2 text-slate-600">
            <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <p>
              <strong>Disclaimers & Informatie:</strong> Alle weergegeven bedragen en projecties zijn <em>nominaal</em> en niet gecorrigeerd voor inflatie of eventuele vermogensrendementsheffing (Box 3 belasting). Deze tool is uitsluitend bedoeld voor indicatieve en educatieve doeleinden en vormt geen financieel advies.
            </p>
          </div>
          <p className="text-center text-slate-400 pt-3 border-t border-slate-100">
            © {new Date().getFullYear()} SpaarProjecties — Pure Client-side React & TypeScript App (100% Privacy & Geen Tracking).
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
