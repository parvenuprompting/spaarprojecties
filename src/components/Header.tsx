import React from 'react';
import { PiggyBank, TrendingUp, ShieldCheck, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bank-header">
      <div className="bank-header-container">
        <div className="bank-logo-group">
          <div className="bank-logo-icon">
            <PiggyBank className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="bank-title">SpaarProjecties</h1>
              <span className="badge-pill">
                <Sparkles className="w-3 h-3 text-amber-500" />
                Live Berekening
              </span>
            </div>
            <p className="bank-subtitle">
              Ontdek de kracht van maandelijks samengestelde rente op je vermogen
            </p>
          </div>
        </div>

        <div className="bank-trust-badges">
          <div className="trust-badge">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>100% Offline & Veilig</span>
          </div>
          <div className="trust-badge">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <span>Samengesteld (3% std)</span>
          </div>
        </div>
      </div>
    </header>
  );
};
