import React from 'react';
import { Trophy, Flame, Sparkles, ArrowUpRight } from 'lucide-react';
import type { FrequencyProjection } from '../types/savings';
import { formatCurrency } from '../utils/savingsCalculator';

interface HighlightCardsProps {
  projection: FrequencyProjection;
}

export const HighlightCards: React.FC<HighlightCardsProps> = ({ projection }) => {
  const p20 = projection.projections['20y'];
  const p30 = projection.projections['30y'];
  const p50 = projection.projections['50y'];

  const highlightItems = [
    {
      years: '20 Jaar',
      data: p20,
      icon: Flame,
      colorClass: 'card-20y',
      badge: 'Middellange Termijn',
      accentColor: 'text-amber-600',
    },
    {
      years: '30 Jaar',
      data: p30,
      icon: Trophy,
      colorClass: 'card-30y',
      badge: 'Pensioen Horizon',
      accentColor: 'text-blue-600',
    },
    {
      years: '50 Jaar (Max)',
      data: p50,
      icon: Sparkles,
      colorClass: 'card-50y',
      badge: 'Generationeel Vermogen',
      accentColor: 'text-indigo-600',
    },
  ];

  return (
    <section className="highlight-section">
      <div className="section-header-group">
        <h2 className="section-title">
          <Trophy className="w-5 h-5 text-amber-500" />
          Lange Termijn Highlights
        </h2>
        <p className="section-subtitle">
          Zie hoe het rente-op-rente (compound) effect exponentieel groeit op 20, 30 en 50 jaar
        </p>
      </div>

      <div className="highlight-grid">
        {highlightItems.map((item, idx) => {
          const Icon = item.icon;
          const interestMultiplier = item.data.totalDeposit > 0 
            ? ((item.data.totalValue / item.data.totalDeposit) - 1) * 100 
            : 0;

          return (
            <div key={idx} className={`highlight-card ${item.colorClass}`}>
              <div className="card-top-row">
                <span className="card-period-tag">{item.years}</span>
                <span className="card-badge">{item.badge}</span>
              </div>

              <div className="card-main-amount">
                <span className="amount-label">Verwacht Eindvermogen</span>
                <div className="amount-number">{formatCurrency(item.data.totalValue)}</div>
              </div>

              <div className="card-breakdown">
                <div className="breakdown-row">
                  <span className="text-slate-500">Totale inleg:</span>
                  <span className="font-semibold text-slate-700">
                    {formatCurrency(item.data.totalDeposit)}
                  </span>
                </div>
                <div className="breakdown-row">
                  <span className="text-slate-500">Opgebouwde rente:</span>
                  <span className="font-bold text-emerald-600">
                    +{formatCurrency(item.data.totalInterest)}
                  </span>
                </div>
              </div>

              <div className="card-footer-pill">
                <div className="flex items-center gap-1 text-emerald-700 font-medium text-xs">
                  <ArrowUpRight className="w-4 h-4" />
                  <span>+{interestMultiplier.toFixed(0)}% extra t.o.v. inleg</span>
                </div>
                <Icon className={`w-5 h-5 ${item.accentColor} opacity-80`} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
