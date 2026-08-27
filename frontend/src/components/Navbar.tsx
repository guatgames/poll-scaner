import React from 'react';
import { ScanLine, PieChart, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  activeTab: 'scan' | 'dashboard';
  setActiveTab: (tab: 'scan' | 'dashboard') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <header className="bg-surfaceContainerLow/80 backdrop-blur-md border-b border-outlineVariant/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Header */}
        <div className="flex items-center space-x-3.5">
          <div className="bg-primary/10 text-primary border border-primary/20 p-2.5 rounded-2xl shadow-inner">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-onSurface tracking-tight">KINAL Scanner</h1>
            <p className="text-xs text-outline font-medium">Investigación Cafetería — PE5AV</p>
          </div>
        </div>

        {/* Material 3 Segmented Control / Tabs */}
        <nav className="flex space-x-1.5 bg-surfaceContainerHigh/60 p-1.5 rounded-full border border-outlineVariant/60">
          <button
            onClick={() => setActiveTab('scan')}
            className={`flex items-center space-x-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
              activeTab === 'scan'
                ? 'bg-primary text-onPrimary shadow-lg shadow-primary/25 scale-105'
                : 'text-outline hover:text-onSurface hover:bg-surfaceContainerHighest/50'
            }`}
          >
            <ScanLine className="w-4 h-4" />
            <span>Escáner OMR</span>
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center space-x-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
              activeTab === 'dashboard'
                ? 'bg-primary text-onPrimary shadow-lg shadow-primary/25 scale-105'
                : 'text-outline hover:text-onSurface hover:bg-surfaceContainerHighest/50'
            }`}
          >
            <PieChart className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
        </nav>
      </div>
    </header>
  );
};