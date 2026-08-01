import React from 'react';
import { PiggyBank, Sliders, Trophy, ArrowLeftRight, LineChart, Table, Calculator, Target } from 'lucide-react';

export const Header: React.FC = () => {
  const navItems = [
    { label: 'Invoer & Rente', href: '#invoer', icon: Sliders },
    { label: 'Highlights', href: '#highlights', icon: Trophy },
    { label: 'Vergelijking', href: '#vergelijking', icon: ArrowLeftRight },
    { label: 'Grafiek', href: '#grafiek', icon: LineChart },
    { label: 'Matrix Tabel', href: '#tabel', icon: Table },
    { label: 'Aangepaste Calc', href: '#custom-calc', icon: Calculator },
    { label: 'Spaardoel', href: '#spaardoel', icon: Target },
  ];

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

        {/* Navigation Menu */}
        <nav className="bank-nav-menu">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <a key={item.href} href={item.href} className="nav-link">
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
