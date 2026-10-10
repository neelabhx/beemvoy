import React from 'react';
import { Home, Compass, MapPin, Briefcase, User } from 'lucide-react';

export type NavTab = 'HOME' | 'EXPLORE' | 'MY TRIP' | 'TRAVEL' | 'PROFILE';

interface BottomNavProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  tripItemCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onTabChange,
  tripItemCount = 0,
}) => {
  const tabs: { id: NavTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'HOME', label: 'HOME', icon: Home },
    { id: 'EXPLORE', label: 'EXPLORE', icon: Compass },
    { id: 'MY TRIP', label: 'MY TRIP', icon: MapPin },
    { id: 'TRAVEL', label: 'TRAVEL', icon: Briefcase },
    { id: 'PROFILE', label: 'PROFILE', icon: User },
  ];

  return (
    <nav
      className="absolute bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-purple-100 shadow-[0_-4px_20px_rgba(147,51,234,0.06)] px-2 py-1.5"
      role="navigation"
      aria-label="Main Navigation"
    >
      <div className="grid grid-cols-5 items-center justify-items-center h-14">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center justify-center w-full h-full min-h-[44px] transition-all duration-200 select-none ${
                isActive ? 'text-purple-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <div
                className={`relative p-1 rounded-xl transition-all ${
                  isActive ? 'bg-purple-100/80 -translate-y-0.5' : ''
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
                {tab.id === 'MY TRIP' && tripItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-purple-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-xs">
                    {tripItemCount}
                  </span>
                )}
              </div>
              <span
                className={`text-[9.5px] font-semibold tracking-wide mt-0.5 whitespace-nowrap ${
                  isActive ? 'text-purple-700 font-bold' : 'text-slate-400'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
