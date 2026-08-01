import React, { useState, useEffect } from 'react';
import { Calculator, Euro, Calendar } from 'lucide-react';
import type { Frequency, CalculatorMode } from '../types/savings';
import { calculateProjection, formatCurrency } from '../utils/savingsCalculator';

interface CustomCalculatorProps {
  mode: CalculatorMode;
  annualInterestRate: number;
  globalFrequency: Frequency;
  onFrequencyChange: (freq: Frequency) => void;
}

export const CustomCalculator: React.FC<CustomCalculatorProps> = ({
  mode,
  annualInterestRate,
  globalFrequency,
  onFrequencyChange,
}) => {
  const [customAmount, setCustomAmount] = useState<number>(100);
  const [customFrequency, setCustomFrequency] = useState<Frequency>(globalFrequency);
  const [durationValue, setDurationValue] = useState<number>(5);
  const [durationType, setDurationType] = useState<'years' | 'months'>('years');

  // Keep synced with global frequency when user changes primary frequency
  useEffect(() => {
    setCustomFrequency(globalFrequency);
  }, [globalFrequency]);

  const handleFrequencySelect = (freq: Frequency) => {
    setCustomFrequency(freq);
    onFrequencyChange(freq);
  };

  const isSavings = mode === 'savings';
  const yearsEquivalent = durationType === 'years' ? durationValue : durationValue / 12;

  const result = calculateProjection(
    customAmount,
    customFrequency,
    yearsEquivalent,
    annualInterestRate,
    mode
  );

  return (
    <section className="custom-calc-card">
      <div className="section-header-group">
        <h2 className="section-title">
          <Calculator className="w-5 h-5 text-blue-600" />
          Aangepaste Realtime Berekening
        </h2>
        <p className="section-subtitle">
          Stel je eigen bedrag, periode en exact aantal jaren of maanden in
        </p>
      </div>

      <div className="custom-calc-grid">
        {/* Amount input */}
        <div className="input-group">
          <label className="input-label">Bedrag</label>
          <div className="currency-input-wrapper">
            <div className="currency-symbol">
              <Euro className="w-5 h-5 text-slate-400" />
            </div>
            <input
              type="number"
              min="0"
              value={customAmount === 0 ? '' : customAmount}
              onChange={(e) => setCustomAmount(Math.max(0, parseFloat(e.target.value) || 0))}
              placeholder="Bijv. 150"
              className="currency-input"
            />
          </div>
        </div>

        {/* Frequency selector synced with primary frequency */}
        <div className="input-group">
          <label className="input-label">Periode ( Frequentie )</label>
          <select
            value={customFrequency}
            onChange={(e) => handleFrequencySelect(e.target.value as Frequency)}
            className="custom-select-input"
          >
            <option value="weekly">Wekelijks</option>
            <option value="monthly">Maandelijks</option>
            <option value="quarterly">Per Kwartaal</option>
            <option value="yearly">Jaarlijks</option>
          </select>
        </div>

        {/* Duration input & type toggle */}
        <div className="input-group">
          <label className="input-label">Looptijd / Aantal</label>
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
      </div>

      {/* Result Card */}
      <div className={`custom-result-box ${!isSavings ? 'result-box-expenses' : ''}`}>
        <div className="result-top">
          <div>
            <span className="result-tag">
              <Calendar className="w-3.5 h-3.5" />
              {durationValue} {durationType === 'years' ? (durationValue === 1 ? 'jaar' : 'jaar') : (durationValue === 1 ? 'maand' : 'maanden')}
            </span>
            <h3 className="result-val-title">
              {isSavings ? 'Verwacht Eindvermogen' : 'Totale Cumulatieve Kosten'}
            </h3>
          </div>
          <div className="result-big-number">
            {formatCurrency(result.totalValue)}
          </div>
        </div>

        <div className="result-details">
          <div className="detail-item">
            <span className="detail-lbl">{isSavings ? 'Totale eigen inleg:' : 'Totale uitgave:'}</span>
            <span className="detail-val">{formatCurrency(result.totalDeposit)}</span>
          </div>
          {isSavings && (
            <div className="detail-item">
              <span className="detail-lbl">Opgebouwde rente winst:</span>
              <span className="detail-val text-emerald-600 font-bold">
                +{formatCurrency(result.totalInterest)}
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
