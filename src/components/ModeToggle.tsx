import React from 'react';
import { PiggyBank, ReceiptEuro } from 'lucide-react';
import type { CalculatorMode } from '../types/savings';

interface ModeToggleProps {
  mode: CalculatorMode;
  onModeChange: (newMode: CalculatorMode) => void;
}

export const ModeToggle: React.FC<ModeToggleProps> = ({ mode, onModeChange }) => {
  return (
    <div className="mode-toggle-card">
      <div className="mode-toggle-container">
        <button
          type="button"
          onClick={() => onModeChange('savings')}
          className={`mode-btn ${mode === 'savings' ? 'mode-btn-active-savings' : ''}`}
        >
          <PiggyBank className="w-5 h-5" />
          <div className="text-left">
            <div className="mode-btn-title">Sparen & Investeren</div>
            <div className="mode-btn-sub">Met samengestelde rente (rendement)</div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onModeChange('expenses')}
          className={`mode-btn ${mode === 'expenses' ? 'mode-btn-active-expenses' : ''}`}
        >
          <ReceiptEuro className="w-5 h-5" />
          <div className="text-left">
            <div className="mode-btn-title">Uitgaven & Kosten</div>
            <div className="mode-btn-sub">Puur totale kosten (zonder rente)</div>
          </div>
        </button>
      </div>
    </div>
  );
};
