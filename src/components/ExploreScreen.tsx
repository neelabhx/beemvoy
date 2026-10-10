import React, { useState } from 'react';
import {
  Compass,
  MapPin,
  Clock,
  Star,
  Check,
  Plus,
  X,
  Sparkles,
  Mountain,
  FileText,
  Shield,
  ChevronRight,
} from 'lucide-react';
import { ActivityItem, CanonicalTrip } from '../types';
import mockDataset from '../data/mock-data.json';
import { ImageSafe } from './ImageSafe';
import { travelImages } from '../utils/images';

interface ExploreScreenProps {
  trip: CanonicalTrip;
  onToggleActivity: (activity: ActivityItem) => void;
  onViewItinerary: () => void;
}

export const ExploreScreen: React.FC<ExploreScreenProps> = ({
  trip,
  onToggleActivity,
  onViewItinerary,
}) => {
  const [selectedDetail, setSelectedDetail] = useState<ActivityItem | null>(null);
  const activities = (mockDataset.activities as ActivityItem[]) || [];

  const isActivityAdded = (id: string) => {
    return trip.selected_activities.some((a) => a.id === id);
  };

  const getImageSrc = (act: ActivityItem) => {
    if (act.id.includes('tea') || act.id.includes('lockhart')) return travelImages.teaTasting;
    if (act.id.includes('sunrise') || act.id.includes('kolukkumalai')) return travelImages.kolukkumalaiSunrise;
    return travelImages.munnarRidge;
  };

  return (
    <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-purple-300 pt-10 pb-28 px-4 bg-[#F9F9FF]">
      {/* Top App Bar */}
      <div className="flex items-center justify-between mb-3.5">
        <div>
          <span className="text-[10px] font-bold text-purple-600 uppercase tracking-widest block">
            EXPLORE SIGHTS
          </span>
          <h2 className="text-sm font-black text-slate-900">Featured Regional Circuits</h2>
        </div>

        <button
          onClick={onViewItinerary}
          className="text-[10.5px] font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-3 py-1.5 rounded-full flex items-center gap-1 min-h-[36px]"
        >
          <span>My Timeline</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Featured Circuit Hero Card */}
      <div className="bg-white rounded-2xl overflow-hidden border border-purple-100 shadow-sm mb-4">
        <div className="relative h-36 w-full">
          <ImageSafe
            src={travelImages.munnarRidge}
            alt="Munnar High Ridge Corridor"
            category="mountain"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-3 left-3 right-3 text-white">
            <span className="text-[9.5px] font-bold uppercase tracking-wider text-purple-300">
              High Altitude Trail · 7,900ft
            </span>
            <h3 className="text-sm font-black text-white leading-tight">
              Munnar High Ridge & Tea Master Corridor
            </h3>
            <p className="text-[10px] text-white/80 mt-0.5">
              1879 Orthodox factories, 4x4 cloud climbs, and cardamom groves
            </p>
          </div>
        </div>
      </div>

      {/* Activity Cards List */}
      <div className="space-y-3 mb-6">
        <h4 className="text-xs font-bold text-slate-800">Trending Experiences</h4>

        {activities.map((act) => {
          const added = isActivityAdded(act.id);

          return (
            <div
              key={act.id}
              className="bg-white rounded-2xl p-3 border border-purple-100/90 shadow-2xs hover:shadow-xs transition-all flex flex-col gap-2.5"
            >
              <div className="flex gap-3">
                <div
                  onClick={() => setSelectedDetail(act)}
                  className="w-20 h-20 rounded-xl overflow-hidden shrink-0 cursor-pointer relative"
                >
                  <ImageSafe
                    src={getImageSrc(act)}
                    alt={act.title}
                    category="activity"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-1 left-1 bg-black/50 backdrop-blur-xs text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                    <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                    <span>{act.rating || 4.8}</span>
                  </div>
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div onClick={() => setSelectedDetail(act)} className="cursor-pointer">
                    <span className="text-[9.5px] font-bold text-purple-600 uppercase tracking-wide block truncate">
                      {act.category}
                    </span>
                    <h5 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">
                      {act.title}
                    </h5>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span className="flex items-center gap-1 font-medium">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {act.duration}
                    </span>
                    <span className="font-extrabold text-purple-700">{act.price}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                <button
                  onClick={() => setSelectedDetail(act)}
                  className="flex-1 py-1.5 px-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-[10.5px] font-bold rounded-xl transition-colors min-h-[36px]"
                >
                  View Details
                </button>
                <button
                  onClick={() => onToggleActivity(act)}
                  className={`flex-1 py-1.5 px-2 rounded-xl text-[10.5px] font-bold transition-all flex items-center justify-center gap-1 min-h-[36px] ${
                    added
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-purple-50 hover:bg-purple-100 text-purple-700'
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-3 h-3 stroke-[3]" />
                      <span>In Trip</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3 h-3" />
                      <span>Add to Trip</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Activity Detail Modal */}
      {selectedDetail && (
        <div
          className="absolute inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-xs animate-fadeIn"
          onClick={() => setSelectedDetail(null)}
        >
          <div
            className="w-full max-h-[88%] bg-white rounded-t-3xl shadow-2xl flex flex-col overflow-hidden animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Grab handle */}
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-3 mb-1" />

            <div className="relative h-40 w-full shrink-0">
              <ImageSafe
                src={getImageSrc(selectedDetail)}
                alt={selectedDetail.title}
                category="activity"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
              <button
                onClick={() => setSelectedDetail(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center min-h-[44px] min-w-[44px]"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-3 left-4 right-4 text-white">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300">
                  {selectedDetail.category} · {selectedDetail.duration}
                </span>
                <h3 className="text-sm font-black leading-tight drop-shadow-xs">
                  {selectedDetail.title}
                </h3>
              </div>
            </div>

            <div className="overflow-y-auto p-4 space-y-3.5 scrollbar-thin flex-1 text-slate-800">
              <div>
                <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  The Experience
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {selectedDetail.experience ||
                    'Comprehensive guided mountain experience led by local naturalist guides.'}
                </p>
              </div>

              {selectedDetail.practical_logistics && (
                <div>
                  <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Practical Logistics
                  </h4>
                  <ul className="space-y-1">
                    {selectedDetail.practical_logistics.map((log, i) => (
                      <li key={i} className="text-[11px] text-slate-600 flex items-start gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                        <span>{log}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedDetail.field_note && (
                <div className="bg-purple-50 rounded-xl p-3 border border-purple-100">
                  <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wide block mb-1">
                    Field Note from Guide
                  </span>
                  <p className="text-[11px] text-purple-900 italic leading-snug">
                    {selectedDetail.field_note}
                  </p>
                </div>
              )}

              {/* Action Bar */}
              <div className="pt-2 pb-6 flex gap-2">
                <button
                  onClick={() => setSelectedDetail(null)}
                  className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors min-h-[44px]"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    onToggleActivity(selectedDetail);
                    setSelectedDetail(null);
                  }}
                  className={`flex-2 py-2.5 px-4 font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-1.5 min-h-[44px] ${
                    isActivityAdded(selectedDetail.id)
                      ? 'bg-purple-700 text-white shadow-purple-700/20'
                      : 'bg-purple-600 text-white shadow-purple-600/30'
                  }`}
                >
                  {isActivityAdded(selectedDetail.id) ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Remove from Trip</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Add to Trip ({selectedDetail.price})</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
