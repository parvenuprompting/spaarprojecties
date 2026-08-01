import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { LineChart, Layers, Eye } from 'lucide-react';
import type { AllProjectionsResult, Frequency, CalculatorMode } from '../types/savings';
import { FREQUENCIES, formatCurrency } from '../utils/savingsCalculator';

interface ProjectionChartProps {
  projections: AllProjectionsResult;
  selectedFrequency: Frequency;
  mode: CalculatorMode;
}

export const ProjectionChart: React.FC<ProjectionChartProps> = ({
  projections,
  selectedFrequency,
  mode,
}) => {
  const [showAllFrequencies, setShowAllFrequencies] = useState(false);
  const isSavings = mode === 'savings';
  const currentFreqConfig = FREQUENCIES.find((f) => f.id === selectedFrequency)!;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="chart-tooltip">
          <p className="tooltip-title">Tijdshorizon: {label}</p>
          <div className="tooltip-list">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="tooltip-item" style={{ color: entry.color }}>
                <span className="tooltip-name">{entry.name}:</span>
                <span className="tooltip-val">{formatCurrency(entry.value)}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  const chartPoints = projections.chartData.map((pt) => {
    const activeFreqKey = 
      selectedFrequency === 'weekly' ? 'valueWeekly' :
      selectedFrequency === 'monthly' ? 'valueMonthly' :
      selectedFrequency === 'quarterly' ? 'valueQuarterly' : 'valueYearly';

    const currentTotalValue = pt[activeFreqKey as keyof typeof pt] as number;
    const interest = Math.max(0, currentTotalValue - pt.deposit);

    return {
      label: pt.label,
      year: pt.year,
      deposit: pt.deposit,
      interest: interest,
      totalValue: currentTotalValue,
      weekly: pt.valueWeekly,
      monthly: pt.valueMonthly,
      quarterly: pt.valueQuarterly,
      yearly: pt.valueYearly,
    };
  });

  return (
    <section className="chart-section">
      <div className="chart-header-row">
        <div>
          <h2 className="section-title">
            <LineChart className="w-5 h-5 text-blue-600" />
            {isSavings ? 'Vermogensgroei over Tijd (0 tot 50 Jaar)' : 'Cumulatieve Kostenontwikkeling (0 tot 50 Jaar)'}
          </h2>
          <p className="section-subtitle">
            {isSavings
              ? `Visualisatie van je totale inleg versus opgebouwde samengestelde rente (${currentFreqConfig.label})`
              : `Visualisatie van je opgebouwde uitgaven over tijd (${currentFreqConfig.label})`}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAllFrequencies(!showAllFrequencies)}
          className="toggle-view-btn"
        >
          {showAllFrequencies ? (
            <>
              <Layers className="w-4 h-4 text-blue-600" />
              <span>{isSavings ? 'Toon Inleg vs Rente (Focus)' : 'Toon Totale Kosten (Focus)'}</span>
            </>
          ) : (
            <>
              <Eye className="w-4 h-4 text-indigo-600" />
              <span>Vergelijk Alle Frequenties</span>
            </>
          )}
        </button>
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={380}>
          {showAllFrequencies ? (
            <AreaChart data={chartPoints} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="gradWeekly" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="gradMonthly" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="label" stroke="#64748b" fontSize={12} />
              <YAxis
                stroke="#64748b"
                fontSize={12}
                tickFormatter={(val) => `€${(val / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" height={36} />
              <Area
                type="monotone"
                dataKey="weekly"
                name={isSavings ? 'Wekelijks Sparen' : 'Wekelijkse Uitgave'}
                stroke="#2563eb"
                fillOpacity={1}
                fill="url(#gradWeekly)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="monthly"
                name={isSavings ? 'Maandelijks Sparen' : 'Maandelijkse Uitgave'}
                stroke="#10b981"
                fillOpacity={1}
                fill="url(#gradMonthly)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="yearly"
                name={isSavings ? 'Jaarlijks Sparen' : 'Jaarlijkse Uitgave'}
                stroke="#f59e0b"
                fillOpacity={0.2}
                fill="#f59e0b"
                strokeWidth={2}
              />
            </AreaChart>
          ) : (
            <AreaChart data={chartPoints} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorDeposit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={isSavings ? '#94a3b8' : '#f59e0b'} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={isSavings ? '#94a3b8' : '#f59e0b'} stopOpacity={0.2} />
                </linearGradient>
                <linearGradient id="colorInterest" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.9} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.3} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="label" stroke="#64748b" fontSize={12} />
              <YAxis
                stroke="#64748b"
                fontSize={12}
                tickFormatter={(val) => `€${(val / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" height={36} />
              <Area
                type="monotone"
                dataKey="deposit"
                name={isSavings ? 'Totale Eigen Inleg' : 'Totale Cumulatieve Uitgaven'}
                stackId="1"
                stroke={isSavings ? '#64748b' : '#d97706'}
                fill="url(#colorDeposit)"
                strokeWidth={2}
              />
              {isSavings && (
                <Area
                  type="monotone"
                  dataKey="interest"
                  name="Opgebouwde Rente (Winst)"
                  stackId="1"
                  stroke="#059669"
                  fill="url(#colorInterest)"
                  strokeWidth={2}
                />
              )}
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </section>
  );
};
