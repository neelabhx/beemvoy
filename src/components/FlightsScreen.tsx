import React, { useState } from 'react';
import {
  Plane,
  ArrowRight,
  Check,
  Clock,
  Sparkles,
  ArrowLeft,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { CanonicalTrip, FlightItem } from '../types';
import mockDataset from '../data/mock-data.json';

interface FlightsScreenProps {
  trip: CanonicalTrip;
  onSelectFlight: (flight: FlightItem) => void;
  onContinueToHotels: () => void;
  onBack: () => void;
}

export const FlightsScreen: React.FC<FlightsScreenProps> = ({
  trip,
  onSelectFlight,
  onContinueToHotels,
  onBack,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'cheapest' | 'fastest'>('all');
  const availableFlights = (mockDataset.flights as FlightItem[]) || [];

  const filteredFlights = availableFlights.filter((flight) => {
    if (activeFilter === 'cheapest') return flight.badge.toLowerCase().includes('cheap');
    if (activeFilter === 'fastest') return flight.badge.toLowerCase().includes('fast');
    return true;
  });

  return (
    <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-purple-300 pt-10 pb-28 px-4 bg-[#F9F9FF]">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={onBack}
          className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-slate-50 transition-colors min-h-[44px] min-w-[44px]"
          aria-label="Back"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="text-center">
          <span className="text-[10px] font-bold text-purple-600 uppercase tracking-widest block">
            FLT-01 Search
          </span>
          <h2 className="text-sm font-black text-slate-900">Flights Explorer</h2>
        </div>

        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-xs">
          <Plane className="w-4 h-4" />
        </div>
      </div>

      {/* Route Badge Strip */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white rounded-2xl p-3 shadow-md shadow-purple-900/10 mb-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-extrabold tracking-wide">
              {trip.origin || 'BLR'}
            </span>
            <div className="flex items-center text-purple-300">
              <span className="w-4 h-[1px] bg-purple-300 inline-block" />
              <Plane className="w-3.5 h-3.5 mx-1" />
              <span className="w-4 h-[1px] bg-purple-300 inline-block" />
            </div>
            <span className="text-sm font-extrabold tracking-wide">
              {trip.destination.toLowerCase().includes('goa') ? 'GOI' : 'COK'}
            </span>
          </div>

          <span className="text-[10px] font-bold bg-white/10 px-2 py-0.5 rounded-full text-purple-200">
            {trip.destination} Gateway
          </span>
        </div>
        <p className="text-[10px] text-purple-200/80 mt-1 flex items-center gap-2">
          <span>Non-stop flights verified</span>
          <span>·</span>
          <span>Baggage included</span>
        </p>
      </div>

      {/* Category Filter Buttons */}
      <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-purple-100/80 mb-3.5 shadow-2xs">
        {[
          { id: 'all', label: 'All Flights' },
          { id: 'cheapest', label: 'Cheapest' },
          { id: 'fastest', label: 'Fastest' },
        ].map((filter) => {
          const isActive = activeFilter === filter.id;
          return (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id as any)}
              className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition-all min-h-[36px] flex items-center justify-center ${
                isActive
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      {/* Flight Cards List */}
      <div className="space-y-3 mb-6">
        {filteredFlights.map((flight) => {
          const isSelected = trip.selected_flight?.id === flight.id;

          return (
            <div
              key={flight.id}
              className={`bg-white rounded-2xl p-3.5 border transition-all shadow-xs ${
                isSelected
                  ? 'border-purple-600 ring-2 ring-purple-600/20 shadow-md'
                  : 'border-purple-100 hover:border-purple-300'
              }`}
            >
              {/* Category Badges */}
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-[9.5px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded-md ${
                    flight.badge === 'Cheapest'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : flight.badge === 'Fastest'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'bg-purple-50 text-purple-700 border border-purple-200'
                  }`}
                >
                  {flight.badge}
                </span>

                <span className="text-sm font-black text-slate-900 tracking-tight">
                  {flight.price}
                </span>
              </div>

              {/* Airline & Times */}
              <div className="flex items-center justify-between py-1 border-y border-slate-100 my-2">
                <div>
                  <span className="text-[11px] font-bold text-slate-800 block">
                    {flight.airline}
                  </span>
                  <span className="text-[9.5px] text-slate-400 font-mono">
                    {flight.flight_number}
                  </span>
                </div>

                {/* Departure -> Duration -> Arrival */}
                <div className="flex items-center gap-3 text-center">
                  <div>
                    <span className="text-xs font-black text-slate-900 block">
                      {flight.departure}
                    </span>
                    <span className="text-[9px] text-slate-400 font-medium">
                      {flight.origin}
                    </span>
                  </div>

                  <div className="flex flex-col items-center">
                    <span className="text-[9px] text-purple-600 font-bold">
                      {flight.duration}
                    </span>
                    <div className="w-12 h-[1px] bg-slate-200 relative my-0.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500 absolute -top-0.5 left-1/2 -translate-x-1/2" />
                    </div>
                    <span className="text-[9px] text-slate-400">{flight.stops}</span>
                  </div>

                  <div>
                    <span className="text-xs font-black text-slate-900 block">
                      {flight.arrival}
                    </span>
                    <span className="text-[9px] text-slate-400 font-medium">
                      {flight.destination}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tagline / Note */}
              {flight.tagline && (
                <p className="text-[10px] text-slate-500 mb-2.5">
                  {flight.tagline} {flight.note && `· ${flight.note}`}
                </p>
              )}

              {/* Select Button */}
              <button
                onClick={() => onSelectFlight(flight)}
                className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 min-h-[40px] ${
                  isSelected
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-purple-50 hover:bg-purple-100 text-purple-700'
                }`}
              >
                {isSelected ? (
                  <>
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Selected Flight</span>
                  </>
                ) : (
                  <span>Select {flight.airline} ({flight.flight_number})</span>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Sticky Bottom Next Step CTA Bar */}
      <div className="fixed bottom-14 left-0 right-0 max-w-[390px] mx-auto p-3 bg-gradient-to-t from-white via-white/95 to-transparent z-30">
        <button
          onClick={onContinueToHotels}
          className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl shadow-lg shadow-purple-600/30 text-xs font-bold flex items-center justify-center gap-2 transition-all min-h-[48px]"
        >
          <span>Lock Flights & Choose Hotel</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
