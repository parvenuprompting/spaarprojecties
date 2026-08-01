import React, { useState } from 'react';
import { PiggyBank, Sliders, Trophy, ArrowLeftRight, LineChart, Table, Calculator, Target, Menu, X } from 'lucide-react';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="mobile-menu-toggle"
          aria-label="Navigatiemenu openen/sluiten"
        >
          {mobileMenuOpen ? <X className="w-5 h-5 text-slate-700" /> : <Menu className="w-5 h-5 text-slate-700" />}
        </button>

        {/* Navigation Menu */}
        <nav className={`bank-nav-menu ${mobileMenuOpen ? 'nav-menu-mobile-open' : ''}`}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.href}
                href={item.href}
                className="nav-link"
                onClick={() => setMobileMenuOpen(false)}
              >
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
