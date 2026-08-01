import React from 'react';
import { PiggyBank } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bank-header">
      <div className="bank-header-container">
        <div className="bank-logo-group">
          <div className="bank-logo-icon">
            <PiggyBank className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="bank-title">SpaarProjecties</h1>
            <p className="bank-subtitle">
              Ontdek de kracht van maandelijks samengestelde rente op je vermogen
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
