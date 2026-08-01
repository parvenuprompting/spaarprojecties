import React from 'react';
import { Trophy, Flame, Sparkles, ArrowUpRight, ReceiptEuro } from 'lucide-react';
import type { FrequencyProjection, CalculatorMode } from '../types/savings';
import { formatCurrency } from '../utils/savingsCalculator';

interface HighlightCardsProps {
  projection: FrequencyProjection;
  mode: CalculatorMode;
}

export const HighlightCards: React.FC<HighlightCardsProps> = ({ projection, mode }) => {
  const isSavings = mode === 'savings';
  const p20 = projection.projections['20y'];
  const p30 = projection.projections['30y'];
  const p50 = projection.projections['50y'];

  const highlightItems = [
    {
      years: '20 Jaar',
      data: p20,
      icon: Flame,
      colorClass: isSavings ? 'card-20y' : 'card-expense-20y',
      badge: isSavings ? 'Middellange Termijn' : '20 Jaar Kosten',
      accentColor: isSavings ? 'text-amber-600' : 'text-amber-700',
    },
    {
      years: '30 Jaar',
      data: p30,
      icon: Trophy,
      colorClass: isSavings ? 'card-30y' : 'card-expense-30y',
      badge: isSavings ? 'Pensioen Horizon' : '30 Jaar Cumulatief',
      accentColor: isSavings ? 'text-blue-600' : 'text-orange-600',
    },
    {
      years: '50 Jaar (Max)',
      data: p50,
      icon: Sparkles,
      colorClass: isSavings ? 'card-50y' : 'card-expense-50y',
      badge: isSavings ? 'Generationeel Vermogen' : 'Levenslange Kosten',
      accentColor: isSavings ? 'text-indigo-600' : 'text-red-600',
    },
  ];

  return (
    <section className="highlight-section">
      <div className="section-header-group">
        <h2 className="section-title">
          {isSavings ? (
            <>
              <Trophy className="w-5 h-5 text-amber-500" />
              Lange Termijn Highlights
            </>
          ) : (
            <>
              <ReceiptEuro className="w-5 h-5 text-amber-600" />
              Cumulatieve Kosten Highlights
            </>
          )}
        </h2>
        <p className="section-subtitle">
          {isSavings
            ? 'Zie hoe het rente-op-rente (compound) effect exponentieel groeit op 20, 30 en 50 jaar'
            : 'Zie wat een vaste uitgave op de lange termijn in totaal kost over 20, 30 en 50 jaar'}
        </p>
      </div>

      <div className="highlight-grid">
        {highlightItems.map((item, idx) => {
          const Icon = item.icon;
          const interestMultiplier = isSavings && item.data.totalDeposit > 0 
            ? ((item.data.totalValue / item.data.totalDeposit) - 1) * 100 
            : 0;

          return (
            <div key={idx} className={`highlight-card ${item.colorClass}`}>
              <div className="card-top-row">
                <span className="card-period-tag">{item.years}</span>
                <span className="card-badge">{item.badge}</span>
              </div>

              <div className="card-main-amount">
                <span className="amount-label">
                  {isSavings ? 'Verwacht Eindvermogen' : 'Totale Cumulatieve Kosten'}
                </span>
                <div className={`amount-number ${!isSavings ? 'text-slate-800' : ''}`}>
                  {formatCurrency(item.data.totalValue)}
                </div>
              </div>

              <div className="card-breakdown">
                <div className="breakdown-row">
                  <span className="text-slate-500">{isSavings ? 'Totale inleg:' : 'Directe inleg/kosten:'}</span>
                  <span className="font-semibold text-slate-700">
                    {formatCurrency(item.data.totalDeposit)}
                  </span>
                </div>
                {isSavings && (
                  <div className="breakdown-row">
                    <span className="text-slate-500">Opgebouwde rente:</span>
                    <span className="font-bold text-emerald-600">
                      +{formatCurrency(item.data.totalInterest)}
                    </span>
                  </div>
                )}
              </div>

              {isSavings ? (
                <div className="card-footer-pill">
                  <div className="flex items-center gap-1 text-emerald-700 font-medium text-xs">
                    <ArrowUpRight className="w-4 h-4" />
                    <span>+{interestMultiplier.toFixed(0)}% extra t.o.v. inleg</span>
                  </div>
                  <Icon className={`w-5 h-5 ${item.accentColor} opacity-80`} />
                </div>
              ) : (
                <div className="card-footer-pill expense-footer-pill">
                  <span className="text-xs text-amber-900 font-medium">
                    Puur netto uitgave (geen rente)
                  </span>
                  <Icon className={`w-5 h-5 ${item.accentColor} opacity-80`} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
