import React from 'react';
import { Euro, Percent, CreditCard } from 'lucide-react';
import type { Frequency, CalculatorMode } from '../types/savings';
import { FREQUENCIES } from '../utils/savingsCalculator';

interface CalculatorInputProps {
  amount: number;
  onAmountChange: (newAmount: number) => void;
  interestRate: number;
  onInterestRateChange: (newRate: number) => void;
  selectedFrequency: Frequency;
  onFrequencyChange: (freq: Frequency) => void;
  mode: CalculatorMode;
}

const SAVINGS_PRESETS = [10, 25, 50, 100, 250, 500];
const EXPENSE_PRESETS = [5, 10, 15, 30, 50, 100]; // Common subscription & recurring costs

export const CalculatorInput: React.FC<CalculatorInputProps> = ({
  amount,
  onAmountChange,
  interestRate,
  onInterestRateChange,
  selectedFrequency,
  onFrequencyChange,
  mode,
}) => {
  const isSavings = mode === 'savings';
  const presets = isSavings ? SAVINGS_PRESETS : EXPENSE_PRESETS;

  const handleAmountInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    onAmountChange(isNaN(val) ? 0 : val);
  };

  const handleRateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    onInterestRateChange(isNaN(val) ? 0 : val);
  };

  return (
    <div className={`input-card ${!isSavings ? 'input-card-expenses' : ''}`}>
      <div className="input-card-grid">
        {/* Primary Deposit / Expense Input */}
        <div className="input-group full-width-sm">
          <div className="label-with-tooltip">
            <label htmlFor="savings-amount" className="input-label flex items-center gap-1.5">
              {isSavings ? (
                <>Periodiek Spaarbedrag</>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 text-amber-600" />
                  Periodieke Uitgave / Kosten
                </>
              )}
            </label>
            <span className="live-indicator">
              <span className="live-dot"></span>
              Realtime
            </span>
          </div>

          <div className="currency-input-wrapper">
            <div className="currency-symbol">
              <Euro className="w-5 h-5 text-slate-400" />
            </div>
            <input
              id="savings-amount"
              type="number"
              min="0"
              step="5"
              value={amount === 0 ? '' : amount}
              onChange={handleAmountInputChange}
              placeholder={isSavings ? 'Bijv. 50 (sparen)' : 'Bijv. 15 (Netflix/Sportschool)'}
              className="currency-input"
              autoFocus
            />
          </div>

          {/* Quick Presets */}
          <div className="preset-container">
            <span className="preset-label">Snelkiezer ({isSavings ? 'Sparen' : 'Kosten'}):</span>
            <div className="preset-buttons">
              {presets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => onAmountChange(preset)}
                  className={`preset-btn ${amount === preset ? 'preset-btn-active' : ''}`}
                >
                  €{preset}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Frequency selector */}
        <div className="input-group">
          <label className="input-label">
            {isSavings ? 'Inlegfrequentie' : 'Betaalfrequentie'}
          </label>
          <div className="frequency-selector">
            {FREQUENCIES.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => onFrequencyChange(f.id)}
                className={`freq-btn ${selectedFrequency === f.id ? 'freq-btn-active' : ''}`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Interest rate slider - Only in Savings mode */}
        {isSavings ? (
          <div className="input-group col-span-full">
            <div className="flex-between">
              <label htmlFor="interest-slider" className="input-label flex items-center gap-1.5">
                <Percent className="w-4 h-4 text-blue-600" />
                Verwacht Jaarlijks Rendement / Rente
              </label>
              <div className="rate-badge">
                <span>{interestRate}% per jaar</span>
              </div>
            </div>

            <div className="slider-wrapper">
              <input
                id="interest-slider"
                type="range"
                min="0"
                max="10"
                step="0.1"
                value={interestRate}
                onChange={handleRateInputChange}
                className="custom-range-slider"
              />
              <div className="slider-ticks">
                <span>0% (Geen rente)</span>
                <span className="font-semibold text-blue-700">3% (Standaard Bank)</span>
                <span>5% (Indexfonds)</span>
                <span>10% (Max)</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="input-group col-span-full expense-notice">
            <span className="text-amber-800 text-xs font-medium">
              💡 <strong>Uitgaven Modus:</strong> In deze modus wordt geen rente berekend (0%). Je ziet puur de cumulatieve totale uitgaven die dit abonnement of deze gewoonte kost over tijd.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
