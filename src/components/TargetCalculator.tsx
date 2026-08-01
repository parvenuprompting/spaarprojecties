import React, { useState } from 'react';
import { Target, Euro, Sparkles } from 'lucide-react';
import type { Frequency, CalculatorMode } from '../types/savings';
import { calculateRequiredDeposit, formatCurrency, formatCurrencyPrecise } from '../utils/savingsCalculator';

interface TargetCalculatorProps {
  mode: CalculatorMode;
  annualInterestRate: number;
  globalFrequency: Frequency;
  onFrequencyChange: (freq: Frequency) => void;
  initialDeposit?: number;
}

export const TargetCalculator: React.FC<TargetCalculatorProps> = ({
  mode,
  annualInterestRate,
  globalFrequency,
  onFrequencyChange,
  initialDeposit = 0,
}) => {
  const [targetAmount, setTargetAmount] = useState<number>(10000);
  const [durationValue, setDurationValue] = useState<number>(5);
  const [durationType, setDurationType] = useState<'years' | 'months'>('years');

  const isSavings = mode === 'savings';
  const yearsEquivalent = durationType === 'years' ? durationValue : durationValue / 12;

  const resultMonthly = calculateRequiredDeposit(targetAmount, 'monthly', yearsEquivalent, annualInterestRate, mode, initialDeposit);
  const resultWeekly = calculateRequiredDeposit(targetAmount, 'weekly', yearsEquivalent, annualInterestRate, mode, initialDeposit);
  const resultQuarterly = calculateRequiredDeposit(targetAmount, 'quarterly', yearsEquivalent, annualInterestRate, mode, initialDeposit);
  const resultYearly = calculateRequiredDeposit(targetAmount, 'yearly', yearsEquivalent, annualInterestRate, mode, initialDeposit);

  const activeResult = 
    globalFrequency === 'weekly' ? resultWeekly :
    globalFrequency === 'monthly' ? resultMonthly :
    globalFrequency === 'quarterly' ? resultQuarterly : resultYearly;

  return (
    <section className="target-calc-card">
      <div className="section-header-group">
        <h2 className="section-title">
          <Target className="w-5 h-5 text-indigo-600" />
          Spaardoel Calculator (Wat moet ik inleggen?)
        </h2>
        <p className="section-subtitle">
          Voer je gewenste eindbedrag en termijn in om te berekenen hoeveel je periodiek opzij moet zetten
        </p>
      </div>

      <div className="target-calc-grid">
        {/* Target Amount */}
        <div className="input-group">
          <label className="input-label">Gewenst Spaardoel Bedrag</label>
          <div className="currency-input-wrapper">
            <div className="currency-symbol">
              <Euro className="w-5 h-5 text-slate-400" />
            </div>
            <input
              type="number"
              min="0"
              value={targetAmount === 0 ? '' : targetAmount}
              onChange={(e) => setTargetAmount(Math.max(0, parseFloat(e.target.value) || 0))}
              placeholder="Bijv. 10000"
              className="currency-input"
            />
          </div>
          <div className="preset-buttons mt-1">
            {[1000, 5000, 10000, 25000, 50000].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setTargetAmount(preset)}
                className={`preset-btn ${targetAmount === preset ? 'preset-btn-active' : ''}`}
              >
                €{preset >= 1000 ? `${preset / 1000}k` : preset}
              </button>
            ))}
          </div>
        </div>

        {/* Duration input */}
        <div className="input-group">
          <label className="input-label">Gewenste Spaartermijn</label>
          <div className="duration-input-wrapper">
            <input
              type="number"
              min="1"
              max={durationType === 'years' ? 100 : 1200}
              value={durationValue}
              onChange={(e) => setDurationValue(Math.max(1, parseInt(e.target.value) || 1))}
              className="duration-num-input"
            />
            <div className="duration-type-buttons">
              <button
                type="button"
                onClick={() => setDurationType('years')}
                className={`dur-btn ${durationType === 'years' ? 'dur-btn-active' : ''}`}
              >
                Jaren
              </button>
              <button
                type="button"
                onClick={() => setDurationType('months')}
                className={`dur-btn ${durationType === 'months' ? 'dur-btn-active' : ''}`}
              >
                Maanden
              </button>
            </div>
          </div>
        </div>

        {/* Primary Frequency Output Selector */}
        <div className="input-group">
          <label className="input-label">Inlegfrequentie Focus</label>
          <select
            value={globalFrequency}
            onChange={(e) => onFrequencyChange(e.target.value as Frequency)}
            className="custom-select-input"
          >
            <option value="weekly">Wekelijks Sparen</option>
            <option value="monthly">Maandelijks Sparen</option>
            <option value="quarterly">Per Kwartaal Sparen</option>
            <option value="yearly">Jaarlijks Sparen</option>
          </select>
        </div>
      </div>

      {/* Primary Result Banner */}
      <div className="target-result-banner">
        <div className="banner-left">
          <span className="target-badge">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            Vereiste Inleg voor €{targetAmount.toLocaleString('nl-NL')} over {durationValue} {durationType === 'years' ? 'jaar' : 'maanden'}
          </span>
          <div className="target-big-amount">
            {formatCurrencyPrecise(activeResult.requiredDeposit)}{' '}
            <span className="target-period-label">
              / {globalFrequency === 'weekly' ? 'week' : globalFrequency === 'monthly' ? 'maand' : globalFrequency === 'quarterly' ? 'kwartaal' : 'jaar'}
            </span>
          </div>
        </div>

        {isSavings && activeResult.totalInterest > 0 && (
          <div className="banner-right">
            <div className="breakdown-pill">
              <span className="pill-lbl">Totale inleg:</span>
              <span className="pill-val">{formatCurrency(activeResult.totalDeposit)}</span>
            </div>
            <div className="breakdown-pill pill-interest">
              <span className="pill-lbl">Rente winst:</span>
              <span className="pill-val text-emerald-700 font-bold">
                +{formatCurrency(activeResult.totalInterest)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Grid of all frequencies */}
      <div className="target-freq-grid mt-4">
        <button type="button" className={`target-freq-card ${globalFrequency === 'weekly' ? 'active' : ''}`} onClick={() => onFrequencyChange('weekly')}>
          <span className="freq-lbl">Wekelijks</span>
          <span className="freq-val">{formatCurrencyPrecise(resultWeekly.requiredDeposit)}</span>
          <span className="freq-sub">per week</span>
        </button>

        <button type="button" className={`target-freq-card ${globalFrequency === 'monthly' ? 'active' : ''}`} onClick={() => onFrequencyChange('monthly')}>
          <span className="freq-lbl">Maandelijks</span>
          <span className="freq-val">{formatCurrencyPrecise(resultMonthly.requiredDeposit)}</span>
          <span className="freq-sub">per maand</span>
        </button>

        <button type="button" className={`target-freq-card ${globalFrequency === 'quarterly' ? 'active' : ''}`} onClick={() => onFrequencyChange('quarterly')}>
          <span className="freq-lbl">Per Kwartaal</span>
          <span className="freq-val">{formatCurrencyPrecise(resultQuarterly.requiredDeposit)}</span>
          <span className="freq-sub">per kwartaal</span>
        </button>

        <button type="button" className={`target-freq-card ${globalFrequency === 'yearly' ? 'active' : ''}`} onClick={() => onFrequencyChange('yearly')}>
          <span className="freq-lbl">Jaarlijks</span>
          <span className="freq-val">{formatCurrencyPrecise(resultYearly.requiredDeposit)}</span>
          <span className="freq-sub">per jaar</span>
        </button>
      </div>
    </section>
  );
};
