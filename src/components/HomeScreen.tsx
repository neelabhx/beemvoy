import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  Plane,
  Hotel,
  Calendar,
  ArrowRight,
  MapPin,
  Clock,
  Compass,
  CheckCircle2,
  ChevronRight,
  SlidersHorizontal,
} from 'lucide-react';
import { CanonicalTrip, UserProfile } from '../types';
import { ImageSafe } from './ImageSafe';
import { travelImages } from '../utils/images';

interface HomeScreenProps {
  trip: CanonicalTrip;
  user: UserProfile;
  onUpdateTrip: (updated: CanonicalTrip) => void;
  onNavigateToTab: (tab: 'HOME' | 'EXPLORE' | 'MY TRIP' | 'TRAVEL' | 'PROFILE') => void;
  onOpenFlights: () => void;
  onOpenHotels: () => void;
}

const QUICK_PROMPTS = [
  '3 days in Goa under ₹15,000',
  '5-Day Munnar High Ridge Expedition',
  '4-Day Jaipur Royal Heritage under ₹25,000',
  'Weekend Trek in Manali',
];

export const HomeScreen: React.FC<HomeScreenProps> = ({
  trip,
  user,
  onUpdateTrip,
  onNavigateToTab,
  onOpenFlights,
  onOpenHotels,
}) => {
  const [promptInput, setPromptInput] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [parsedNotice, setParsedNotice] = useState<string | null>(null);

  const handleParsePrompt = async (inputPrompt: string) => {
    const textToParse = inputPrompt.trim();
    if (!textToParse) return;

    setIsParsing(true);
    setParsedNotice(null);

    try {
      const res = await fetch('/api/parse-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: textToParse }),
      });

      const data = await res.json();
      if (data.status === 'success' && data.intent) {
        const intent = data.intent;
        setParsedNotice(`Parsed: ${intent.duration_days} days in ${intent.destination} (₹${intent.budget_total_inr?.toLocaleString('en-IN') || 'Auto'})`);

        // Update canonical trip state
        onUpdateTrip({
          ...trip,
          destination: intent.destination,
          title: `${intent.duration_days}-Day ${intent.destination} Expedition`,
          days: intent.duration_days || trip.days,
          budget_total_inr: intent.budget_total_inr || trip.budget_total_inr,
          status: 'configuring',
        });
      }
    } catch (err) {
      console.error('Failed to parse intent:', err);
    } finally {
      setIsParsing(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-purple-300 pt-10 pb-28 px-4 bg-[#F9F9FF]">
      {/* Top App Bar Zone */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-md shadow-purple-600/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-black tracking-widest text-purple-950 uppercase block">
              BEEMVOY
            </span>
            <span className="text-[10px] text-purple-600 font-medium">Travel, handled.</span>
          </div>
        </div>

        <button
          onClick={() => onNavigateToTab('PROFILE')}
          className="flex items-center gap-2 bg-white/90 border border-purple-100 rounded-full py-1 pl-1 pr-2.5 shadow-2xs hover:shadow-xs transition-all min-h-[44px]"
        >
          <div className="w-7 h-7 rounded-full bg-purple-200 overflow-hidden ring-1 ring-purple-400">
            <ImageSafe
              src={user.avatarUrl || travelImages.avatar}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-[11px] font-bold text-slate-800 max-w-[80px] truncate">
            {user.name.split(' ')[0]}
          </span>
        </button>
      </div>

      {/* Natural Language Prompt Search Box (HOME-01) */}
      <div className="bg-white rounded-2xl p-3.5 shadow-md shadow-purple-900/5 border border-purple-100/80 mb-4">
        <label className="block text-[11px] font-bold text-slate-700 mb-1.5 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            Natural-Language Trip Planner
          </span>
          <span className="text-[9.5px] font-medium text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
            AI Intent Parser
          </span>
        </label>

        <div className="relative">
          <textarea
            rows={2}
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            placeholder="e.g., 3 days in Goa under ₹15,000 or 5-day Munnar expedition"
            className="w-full p-2.5 text-xs text-slate-800 bg-purple-50/30 border border-purple-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 font-medium resize-none placeholder:text-slate-400"
          />
          <button
            onClick={() => handleParsePrompt(promptInput)}
            disabled={isParsing || !promptInput.trim()}
            className="absolute right-2 bottom-2 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-lg text-[11px] font-bold shadow-xs flex items-center gap-1.5 transition-all min-h-[32px]"
          >
            {isParsing ? (
              <span className="animate-spin inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <Search className="w-3 h-3" />
            )}
            <span>Synthesize</span>
          </button>
        </div>

        {/* Quick prompt pills */}
        <div className="mt-2.5 pt-2 border-t border-slate-100">
          <span className="text-[10px] font-semibold text-slate-400 block mb-1.5">
            Quick Prompts:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_PROMPTS.map((qp) => (
              <button
                key={qp}
                onClick={() => {
                  setPromptInput(qp);
                  handleParsePrompt(qp);
                }}
                className="text-[10px] font-semibold bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200/60 rounded-full px-2.5 py-1 transition-colors min-h-[28px] text-left"
              >
                {qp}
              </button>
            ))}
          </div>
        </div>

        {parsedNotice && (
          <div className="mt-2 text-[10px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg p-2 flex items-center gap-1.5 animate-fadeIn">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>{parsedNotice}</span>
          </div>
        )}
      </div>

      {/* Active Trip Canonical Card */}
      <div className="bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-950 rounded-2xl p-4 text-white shadow-xl shadow-purple-950/20 mb-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-purple-300">
            Canonical Active Trip
          </span>
          <span className="text-[10px] font-semibold bg-white/10 backdrop-blur-xs px-2.5 py-0.5 rounded-full text-purple-200 border border-white/10">
            {trip.status.toUpperCase()}
          </span>
        </div>

        <h3 className="text-base font-extrabold text-white tracking-tight mb-1">
          {trip.title}
        </h3>
        <p className="text-[11px] text-purple-200/80 mb-3 flex items-center gap-2">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-purple-300" />
            {trip.destination}
          </span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-purple-300" />
            {trip.days} Days / {trip.days - 1} Nights
          </span>
        </p>

        {/* Selected Flight & Hotel Chips */}
        <div className="space-y-1.5 bg-black/20 backdrop-blur-xs rounded-xl p-2.5 border border-white/10 mb-3">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-purple-200">
              <Plane className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-[11px] font-semibold">Flight:</span>
            </div>
            {trip.selected_flight ? (
              <span className="text-[11px] font-bold text-white bg-purple-500/30 px-2 py-0.5 rounded">
                {trip.selected_flight.airline} ({trip.selected_flight.price})
              </span>
            ) : (
              <button
                onClick={onOpenFlights}
                className="text-[10.5px] font-bold text-purple-300 hover:text-white underline min-h-[30px] flex items-center"
              >
                Select Flight &rarr;
              </button>
            )}
          </div>

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-purple-200">
              <Hotel className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-[11px] font-semibold">Stay:</span>
            </div>
            {trip.selected_hotel ? (
              <span className="text-[11px] font-bold text-white bg-purple-500/30 px-2 py-0.5 rounded max-w-[170px] truncate">
                {trip.selected_hotel.name}
              </span>
            ) : (
              <button
                onClick={onOpenHotels}
                className="text-[10.5px] font-bold text-purple-300 hover:text-white underline min-h-[30px] flex items-center"
              >
                Select Stay &rarr;
              </button>
            )}
          </div>
        </div>

        {/* Direct Action Links */}
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={onOpenFlights}
            className="py-2 px-1.5 bg-white/10 hover:bg-white/20 rounded-xl text-[10.5px] font-bold text-white text-center transition-colors min-h-[40px] flex items-center justify-center gap-1"
          >
            <Plane className="w-3 h-3 text-purple-300" />
            <span>Flights</span>
          </button>
          <button
            onClick={onOpenHotels}
            className="py-2 px-1.5 bg-white/10 hover:bg-white/20 rounded-xl text-[10.5px] font-bold text-white text-center transition-colors min-h-[40px] flex items-center justify-center gap-1"
          >
            <Hotel className="w-3 h-3 text-purple-300" />
            <span>Hotels</span>
          </button>
          <button
            onClick={() => onNavigateToTab('MY TRIP')}
            className="py-2 px-1.5 bg-purple-500 hover:bg-purple-600 rounded-xl text-[10.5px] font-bold text-white text-center transition-colors shadow-sm min-h-[40px] flex items-center justify-center gap-1"
          >
            <Calendar className="w-3 h-3 text-white" />
            <span>Itinerary</span>
          </button>
        </div>
      </div>

      {/* Featured Regional Expeditions */}
      <div className="space-y-3 mb-2">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-800 tracking-tight">
            Featured Regional Expeditions
          </h4>
          <button
            onClick={() => onNavigateToTab('EXPLORE')}
            className="text-[10.5px] font-bold text-purple-600 hover:underline flex items-center gap-0.5"
          >
            <span>View All</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* Expedition Card 1: Munnar High Ridge */}
        <div
          onClick={() => {
            onUpdateTrip({
              ...trip,
              destination: 'Munnar',
              title: '5-Day Munnar High Ridge Expedition',
              days: 3,
            });
            onNavigateToTab('EXPLORE');
          }}
          className="bg-white rounded-2xl overflow-hidden border border-purple-100 shadow-xs hover:shadow-md transition-all cursor-pointer"
        >
          <div className="relative h-28 w-full">
            <ImageSafe
              src={travelImages.munnarRidge}
              alt="Munnar High Ridge Corridor"
              category="mountain"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
            <div className="absolute bottom-2.5 left-3 right-3 text-white">
              <span className="text-[9.5px] font-bold uppercase tracking-wider text-purple-300">
                Kerala High Ranges · Altitude 1,620m
              </span>
              <h5 className="text-xs font-bold text-white leading-tight">
                Munnar High Ridge Corridor & Lockhart Gap
              </h5>
            </div>
          </div>
          <div className="p-3 flex items-center justify-between text-[11px] text-slate-600">
            <span>3 Days · 1879 Orthodox Factory & Sunrise 4x4</span>
            <span className="font-bold text-purple-700">₹25,200 total</span>
          </div>
        </div>

        {/* Expedition Card 2: North Goa Heritage */}
        <div
          onClick={() => {
            onUpdateTrip({
              ...trip,
              destination: 'Goa',
              title: '3-Day Coastal Goa & Candolim Heritage',
              days: 3,
              budget_total_inr: 15000,
            });
            onNavigateToTab('EXPLORE');
          }}
          className="bg-white rounded-2xl overflow-hidden border border-purple-100 shadow-xs hover:shadow-md transition-all cursor-pointer"
        >
          <div className="relative h-28 w-full">
            <ImageSafe
              src={travelImages.goaBeach}
              alt="Goa Coastal Strip"
              category="activity"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
            <div className="absolute bottom-2.5 left-3 right-3 text-white">
              <span className="text-[9.5px] font-bold uppercase tracking-wider text-purple-300">
                Coastal Haven · Under ₹15,000
              </span>
              <h5 className="text-xs font-bold text-white leading-tight">
                Goa Candolim & Portuguese Villa Circuit
              </h5>
            </div>
          </div>
          <div className="p-3 flex items-center justify-between text-[11px] text-slate-600">
            <span>3 Days · Sunset beaches & spice plantations</span>
            <span className="font-bold text-purple-700">₹12,600 total</span>
          </div>
        </div>
      </div>
    </div>
  );
};
