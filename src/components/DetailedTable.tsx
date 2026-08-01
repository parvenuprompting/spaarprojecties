import React, { useState } from 'react';
import { Table } from 'lucide-react';
import type { AllProjectionsResult, Frequency, TimeframeId, CalculatorMode } from '../types/savings';
import { FREQUENCIES, TIMEFRAMES, formatCurrency } from '../utils/savingsCalculator';

interface DetailedTableProps {
  projections: AllProjectionsResult;
  selectedFrequency: Frequency;
  onSelectFrequency: (freq: Frequency) => void;
  mode: CalculatorMode;
}

export const DetailedTable: React.FC<DetailedTableProps> = ({
  projections,
  selectedFrequency,
  onSelectFrequency,
  mode,
}) => {
  const [activeTab, setActiveTab] = useState<'totalValue' | 'interest' | 'deposit'>('totalValue');
  const isSavings = mode === 'savings';

  return (
    <section className="table-section">
      <div className="table-header-row">
        <div>
          <h2 className="section-title">
            <Table className="w-5 h-5 text-blue-600" />
            Uitgebreid Overzicht per Tijdsperiode
          </h2>
          <p className="section-subtitle">
            Matrix van alle 12 vereiste termijnen (1 week t/m 50 jaar) over de 4 spaarfrequenties
          </p>
        </div>

        {/* View switcher tabs - only show interest tab in savings mode */}
        {isSavings && (
          <div className="table-tab-group">
            <button
              type="button"
              onClick={() => setActiveTab('totalValue')}
              className={`table-tab ${activeTab === 'totalValue' ? 'table-tab-active' : ''}`}
            >
              Totale Waarde
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('interest')}
              className={`table-tab ${activeTab === 'interest' ? 'table-tab-active' : ''}`}
            >
              Alleen Rente (Winst)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('deposit')}
              className={`table-tab ${activeTab === 'deposit' ? 'table-tab-active' : ''}`}
            >
              Totale Inleg
            </button>
          </div>
        )}
      </div>

      <div className="table-wrapper">
        <table className="bank-table">
          <thead>
            <tr>
              <th className="th-left">Tijdsperiode</th>
              {FREQUENCIES.map((f) => (
                <th
                  key={f.id}
                  className={`th-clickable ${selectedFrequency === f.id ? 'th-selected' : ''}`}
                >
                  <button
                    type="button"
                    onClick={() => onSelectFrequency(f.id)}
                    className="w-full h-full flex items-center justify-center gap-1 bg-transparent border-none font-bold text-inherit cursor-pointer p-0"
                  >
                    <span>{f.label}</span>
                    {selectedFrequency === f.id && <span className="active-dot"></span>}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TIMEFRAMES.map((tf) => {
              const isHighlightYear = ['20y', '25y', '30y', '35y', '45y', '50y'].includes(tf.id);

              return (
                <tr
                  key={tf.id}
                  className={`table-row ${isHighlightYear ? 'row-highlight' : ''}`}
                >
                  <td className="td-timeframe">
                    <div className="td-timeframe-content">
                      <span className="font-semibold text-slate-800">{tf.label}</span>
                      {isHighlightYear && (
                        <span className="pill-star">★ Major Milestone</span>
                      )}
                    </div>
                  </td>

                  {FREQUENCIES.map((freq) => {
                    const data = projections.byFrequency[freq.id].projections[tf.id as TimeframeId];
                    const isSelectedFreq = selectedFrequency === freq.id;

                    let displayValue = data.totalValue;
                    if (isSavings) {
                      if (activeTab === 'interest') displayValue = data.totalInterest;
                      if (activeTab === 'deposit') displayValue = data.totalDeposit;
                    }

                    return (
                      <td
                        key={freq.id}
                        className={`td-val ${isSelectedFreq ? 'td-selected-col' : ''}`}
                      >
                        <div className="cell-content">
                          <span
                            className={`cell-main ${
                              isSavings && activeTab === 'interest' ? 'text-emerald-600 font-semibold' : ''
                            } ${isHighlightYear ? 'font-bold text-slate-900' : ''}`}
                          >
                            {formatCurrency(displayValue)}
                          </span>
                          {isSavings && activeTab === 'totalValue' && data.totalInterest > 0 && (
                            <span className="cell-sub text-emerald-600">
                              +{formatCurrency(data.totalInterest)} rente
                            </span>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};
