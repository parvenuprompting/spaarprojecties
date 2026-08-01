import React from 'react';
import { ArrowLeftRight, CheckCircle2 } from 'lucide-react';
import type { AllProjectionsResult, Frequency, CalculatorMode } from '../types/savings';
import { FREQUENCIES, formatCurrency } from '../utils/savingsCalculator';

interface FrequencyComparisonProps {
  projections: AllProjectionsResult;
  amount: number;
  selectedFrequency: Frequency;
  onSelectFrequency: (freq: Frequency) => void;
  mode: CalculatorMode;
}

export const FrequencyComparison: React.FC<FrequencyComparisonProps> = ({
  projections,
  amount,
  selectedFrequency,
  onSelectFrequency,
  mode,
}) => {
  const isSavings = mode === 'savings';

  const getAnnualEquivalent = (freq: Frequency): number => {
    const config = FREQUENCIES.find((f) => f.id === freq)!;
    return amount * config.periodsPerYear;
  };

  return (
    <section className="comparison-section">
      <div className="section-header-group">
        <h2 className="section-title">
          <ArrowLeftRight className="w-5 h-5 text-blue-600" />
          Vergelijking tussen Frequenties
        </h2>
        <p className="section-subtitle">
          {isSavings
            ? 'Zie direct het resultaat over 10 en 30 jaar afhankelijk van hoe vaak je spaart'
            : 'Zie wat je over 10 en 30 jaar uitgeeft bij verschillende betalingsfrequenties'}
        </p>
      </div>

      <div className="comparison-grid">
        {FREQUENCIES.map((freq) => {
          const freqData = projections.byFrequency[freq.id];
          const p10 = freqData.projections['10y'];
          const p30 = freqData.projections['30y'];
          const isSelected = selectedFrequency === freq.id;
          const annualCost = getAnnualEquivalent(freq.id);

          return (
            <div
              key={freq.id}
              onClick={() => onSelectFrequency(freq.id)}
              className={`comparison-card ${isSelected ? 'comparison-card-selected' : ''}`}
            >
              <div className="comparison-card-header">
                <div>
                  <h3 className="freq-title">{freq.label}</h3>
                  <p className="freq-subtext">€{amount} {freq.shortLabel}</p>
                </div>
                {isSelected && (
                  <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0" />
                )}
              </div>

              <div className="annual-badge">
                <span>{isSavings ? 'Jaarlijkse inleg:' : 'Jaarlijkse kosten:'} </span>
                <strong>{formatCurrency(annualCost)}</strong>
              </div>

              <div className="comp-stats">
                <div className="comp-stat-box">
                  <span className="stat-label">Na 10 Jaar</span>
                  <span className="stat-val">{formatCurrency(p10.totalValue)}</span>
                  {isSavings && (
                    <span className="stat-sub text-emerald-600">
                      +{formatCurrency(p10.totalInterest)} rente
                    </span>
                  )}
                </div>

                <div className="comp-stat-box">
                  <span className="stat-label">Na 30 Jaar</span>
                  <span className="stat-val text-blue-700">{formatCurrency(p30.totalValue)}</span>
                  {isSavings && (
                    <span className="stat-sub text-emerald-600">
                      +{formatCurrency(p30.totalInterest)} rente
                    </span>
                  )}
                </div>
              </div>

              <button
                type="button"
                className={`select-freq-btn ${isSelected ? 'btn-selected' : ''}`}
              >
                {isSelected ? 'Geselecteerde Frequentie' : 'Kies deze frequentie'}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
};
