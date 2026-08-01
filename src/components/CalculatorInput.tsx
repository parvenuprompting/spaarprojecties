import React from 'react';
import { Euro, Percent, Sparkles } from 'lucide-react';
import type { Frequency } from '../types/savings';
import { FREQUENCIES } from '../utils/savingsCalculator';

interface CalculatorInputProps {
  amount: number;
  onAmountChange: (newAmount: number) => void;
  interestRate: number;
  onInterestRateChange: (newRate: number) => void;
  selectedFrequency: Frequency;
  onFrequencyChange: (freq: Frequency) => void;
}

const PRESET_AMOUNTS = [10, 25, 50, 100, 250, 500];

export const CalculatorInput: React.FC<CalculatorInputProps> = ({
  amount,
  onAmountChange,
  interestRate,
  onInterestRateChange,
  selectedFrequency,
  onFrequencyChange,
}) => {
  const handleAmountInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    onAmountChange(isNaN(val) ? 0 : val);
  };

  const handleRateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    onInterestRateChange(isNaN(val) ? 0 : val);
  };

  return (
    <div className="input-card">
      <div className="input-card-grid">
        {/* Primary Deposit Input */}
        <div className="input-group full-width-sm">
          <div className="label-with-tooltip">
            <label htmlFor="savings-amount" className="input-label">
              Periodiek Spaarbedrag
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
              placeholder="Vul een bedrag in (bijv. 50)"
              className="currency-input"
              autoFocus
            />
          </div>

          {/* Quick Presets */}
          <div className="preset-container">
            <span className="preset-label">Snelkiezer:</span>
            <div className="preset-buttons">
              {PRESET_AMOUNTS.map((preset) => (
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
          <label className="input-label">Inlegfrequentie</label>
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

        {/* Interest rate slider & input */}
        <div className="input-group col-span-full">
          <div className="flex-between">
            <label htmlFor="interest-slider" className="input-label flex items-center gap-1.5">
              <Percent className="w-4 h-4 text-blue-600" />
              Verwacht Jaarlijks Rendement / Rente
            </label>
            <div className="rate-badge">
              <span>{interestRate}% per jaar</span>
              {interestRate === 3 && (
                <span className="tag-std">
                  <Sparkles className="w-3 h-3 text-amber-500" /> Standaard
                </span>
              )}
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
      </div>
    </div>
  );
};
