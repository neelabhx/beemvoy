import React from 'react';
import { Wifi, BatteryMedium, Signal } from 'lucide-react';

interface MobileViewportFrameProps {
  children: React.ReactNode;
}

export const MobileViewportFrame: React.FC<MobileViewportFrameProps> = ({ children }) => {
  return (
    <div className="min-h-screen w-full bg-[#0B0813] flex flex-col items-center justify-center p-0 sm:p-4 md:p-6 overflow-hidden select-none">
      {/* 390 x 844 px Mobile Viewport Shell */}
      <div className="relative w-[390px] h-[844px] max-h-screen sm:rounded-[50px] border-0 sm:border-[8px] sm:border-slate-800 bg-[#F9F9FF] shadow-[0_20px_70px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col">
        {/* Dynamic Island / Speaker Hardware Pill */}
        <div className="hidden sm:flex absolute top-2.5 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-50 items-center justify-between px-2 pointer-events-none">
          <div className="w-2 h-2 rounded-full bg-slate-950 ring-1 ring-slate-800" />
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/80" />
        </div>

        {/* Top iOS Status Bar */}
        <div className="absolute top-0 left-0 right-0 h-10 px-6 flex items-center justify-between z-40 pointer-events-none text-slate-800 text-[11px] font-bold">
          <span>09:41</span>
          <div className="flex items-center gap-1.5">
            <Signal className="w-3 h-3 stroke-[2.5]" />
            <Wifi className="w-3 h-3 stroke-[2.5]" />
            <div className="w-4 h-2.5 border border-slate-700 rounded-xs p-0.5 flex items-center">
              <div className="w-full h-full bg-slate-800 rounded-2xs" />
            </div>
          </div>
        </div>

        {/* Main Viewport Content Area */}
        <main className="relative flex-1 w-full h-full overflow-hidden">
          {children}
        </main>

        {/* Bottom iOS Home Indicator */}
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-900/30 rounded-full z-50 pointer-events-none" />
      </div>
    </div>
  );
};
