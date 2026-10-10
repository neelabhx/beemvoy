import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Plane,
  Hotel,
  Coffee,
  CheckCircle2,
  Circle,
  Plus,
  Compass,
  ArrowRight,
  Shield,
  Sparkles,
} from 'lucide-react';
import { CanonicalTrip, ItineraryDay, TimelineEvent } from '../types';
import mockDataset from '../data/mock-data.json';

interface ItineraryScreenProps {
  trip: CanonicalTrip;
  onExploreMore: () => void;
  onBookTravel: () => void;
}

export const ItineraryScreen: React.FC<ItineraryScreenProps> = ({
  trip,
  onExploreMore,
  onBookTravel,
}) => {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [visitedMap, setVisitedMap] = useState<Record<string, boolean>>({});
  const [transitBuffer, setTransitBuffer] = useState<number>(15);

  const itineraryDays = (mockDataset.itinerary_days as ItineraryDay[]) || [];
  const currentDay = itineraryDays[selectedDayIndex] || itineraryDays[0];

  const toggleVisited = (key: string) => {
    setVisitedMap((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'flight':
        return <Plane className="w-3.5 h-3.5 text-blue-600" />;
      case 'hotel':
        return <Hotel className="w-3.5 h-3.5 text-emerald-600" />;
      case 'food':
        return <Coffee className="w-3.5 h-3.5 text-amber-600" />;
      default:
        return <Compass className="w-3.5 h-3.5 text-purple-600" />;
    }
  };

  return (
    <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-purple-300 pt-10 pb-28 px-4 bg-[#F9F9FF]">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-[10px] font-bold text-purple-600 uppercase tracking-widest block">
            ITN-01 TIMELINE
          </span>
          <h2 className="text-sm font-black text-slate-900">Day-by-Day Expedition</h2>
        </div>

        <button
          onClick={onBookTravel}
          className="text-[10.5px] font-bold text-white bg-purple-600 hover:bg-purple-700 px-3 py-1.5 rounded-full flex items-center gap-1 shadow-xs min-h-[36px]"
        >
          <span>Ledger & Book</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Trip Header Summary Card */}
      <div className="bg-white rounded-2xl p-3 border border-purple-100 shadow-2xs mb-3.5">
        <div className="flex items-center justify-between text-[11px] mb-1">
          <span className="font-extrabold text-slate-900 truncate">
            {trip.title}
          </span>
          <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
            {trip.destination}
          </span>
        </div>
        <p className="text-[10.5px] text-slate-500">
          Chauffeur Innova Crysta · Private Mountain Guide Anand · High Ridge Circuit
        </p>
      </div>

      {/* Horizontal Day Selector Pills */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1 no-scrollbar">
        {itineraryDays.map((day, idx) => {
          const isSelected = selectedDayIndex === idx;
          return (
            <button
              key={day.day_number}
              onClick={() => setSelectedDayIndex(idx)}
              className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap min-h-[40px] flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-purple-200'
              }`}
            >
              <span>Day {day.day_number}</span>
              {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
            </button>
          );
        })}
      </div>

      {/* Day Overview Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 text-white rounded-2xl p-3.5 mb-4 shadow-sm">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300">
            {currentDay.date_label}
          </span>
          <span className="text-[9.5px] font-bold bg-white/10 px-2 py-0.5 rounded-full text-purple-200">
            On Track
          </span>
        </div>
        <h3 className="text-xs font-black tracking-tight mb-1">
          {currentDay.title}
        </h3>
        <p className="text-[10.5px] text-purple-200/90 leading-relaxed">
          {currentDay.summary}
        </p>
      </div>

      {/* Vertical Timeline */}
      <div className="relative pl-5 space-y-4 mb-6">
        {/* Continuous Connecting Line */}
        <div className="absolute left-2.5 top-2 bottom-4 w-0.5 bg-purple-200" />

        {currentDay.activities.map((item, idx) => {
          const itemKey = `day-${currentDay.day_number}-item-${idx}`;
          const isVisited = visitedMap[itemKey] || false;

          return (
            <div key={idx} className="relative group">
              {/* Timeline Node Dot */}
              <button
                onClick={() => toggleVisited(itemKey)}
                className={`absolute -left-5 top-1 w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center min-h-[24px] min-w-[24px] ${
                  isVisited
                    ? 'bg-purple-600 border-purple-600 text-white'
                    : 'bg-white border-purple-400 hover:border-purple-600'
                }`}
                title="Mark Visited"
              >
                {isVisited ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <Circle className="w-2.5 h-2.5 text-purple-400" />
                )}
              </button>

              {/* Event Card */}
              <div
                className={`bg-white rounded-2xl p-3 border transition-all shadow-2xs ${
                  isVisited
                    ? 'border-purple-200 opacity-80'
                    : 'border-purple-100 hover:border-purple-300'
                }`}
              >
                {/* Time & Category Badge */}
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-black text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Clock className="w-3 h-3 text-purple-600" />
                    {item.time}
                  </span>

                  {item.badge && (
                    <span className="text-[9.5px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                      {item.badge}
                    </span>
                  )}
                </div>

                <div className="flex items-start gap-2 mb-1">
                  <div className="p-1 rounded-lg bg-slate-50 mt-0.5">
                    {getEventIcon(item.type)}
                  </div>
                  <div>
                    <h4
                      className={`text-xs font-bold leading-tight ${
                        isVisited ? 'line-through text-slate-500' : 'text-slate-900'
                      }`}
                    >
                      {item.title}
                    </h4>
                    <span className="text-[10px] font-medium text-slate-400 block">
                      {item.subtitle}
                    </span>
                  </div>
                </div>

                {item.details && (
                  <p className="text-[10.5px] text-slate-600 mt-1.5 pl-6 leading-snug">
                    {item.details}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Transit Buffer Simulator & Add More Waypoints */}
      <div className="bg-white rounded-2xl p-3 border border-purple-100 shadow-2xs space-y-3 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-800 block">
              Transit Buffer Simulator
            </span>
            <span className="text-[10px] text-slate-400">
              High elevation ghat safety margin
            </span>
          </div>
          <span className="text-xs font-black text-purple-700">+{transitBuffer} mins</span>
        </div>

        <div className="flex gap-2">
          {[10, 15, 25].map((mins) => (
            <button
              key={mins}
              onClick={() => setTransitBuffer(mins)}
              className={`flex-1 py-1.5 text-[10.5px] font-bold rounded-lg border transition-colors min-h-[36px] ${
                transitBuffer === mins
                  ? 'bg-purple-600 text-white border-purple-600'
                  : 'bg-purple-50 text-purple-700 border-purple-100'
              }`}
            >
              +{mins} min
            </button>
          ))}
        </div>

        <button
          onClick={onExploreMore}
          className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-purple-700 border border-purple-100 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors min-h-[40px]"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Stop from Sights</span>
        </button>
      </div>
    </div>
  );
};
