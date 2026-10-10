import React from 'react';
import {
  Hotel,
  Star,
  MapPin,
  Check,
  ArrowRight,
  ArrowLeft,
  Coffee,
  Wifi,
  Sparkles,
} from 'lucide-react';
import { CanonicalTrip, HotelItem } from '../types';
import mockDataset from '../data/mock-data.json';
import { ImageSafe } from './ImageSafe';
import { travelImages } from '../utils/images';

interface HotelsScreenProps {
  trip: CanonicalTrip;
  onSelectHotel: (hotel: HotelItem) => void;
  onContinueToActivities: () => void;
  onBack: () => void;
}

export const HotelsScreen: React.FC<HotelsScreenProps> = ({
  trip,
  onSelectHotel,
  onContinueToActivities,
  onBack,
}) => {
  const availableHotels = (mockDataset.hotels as HotelItem[]) || [];

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
            HOT-01 Search
          </span>
          <h2 className="text-sm font-black text-slate-900">Hotels Explorer</h2>
        </div>

        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-xs">
          <Hotel className="w-4 h-4" />
        </div>
      </div>

      {/* Destination Subtitle Banner */}
      <div className="bg-white rounded-2xl p-3 border border-purple-100 shadow-2xs mb-3.5 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600">
            Selected Destination
          </span>
          <h3 className="text-xs font-black text-slate-900">
            {trip.destination} Tea Valleys & Lockhart Gap
          </h3>
          <p className="text-[10px] text-slate-500">
            {trip.days - 1} Nights Stay · Altitude 1,550m–1,780m
          </p>
        </div>

        <span className="text-[10.5px] font-bold bg-purple-50 text-purple-700 border border-purple-200 px-2 py-1 rounded-lg">
          {availableHotels.length} Handpicked
        </span>
      </div>

      {/* Hotel Cards List */}
      <div className="space-y-3.5 mb-6">
        {availableHotels.map((hotel) => {
          const isSelected = trip.selected_hotel?.id === hotel.id;

          const getImageSrc = () => {
            if (hotel.id.includes('lockhart')) return travelImages.heritageBungalow;
            if (hotel.id.includes('goa')) return travelImages.goaBeach;
            return travelImages.teaPlantation;
          };

          return (
            <div
              key={hotel.id}
              className={`bg-white rounded-2xl overflow-hidden border transition-all shadow-xs ${
                isSelected
                  ? 'border-purple-600 ring-2 ring-purple-600/20 shadow-md'
                  : 'border-purple-100 hover:border-purple-300'
              }`}
            >
              {/* Hotel Image with Badges */}
              <div className="relative h-32 w-full">
                <ImageSafe
                  src={getImageSrc()}
                  alt={hotel.name}
                  category="hotel"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

                {hotel.badge && (
                  <span className="absolute top-2.5 left-2.5 text-[9.5px] font-extrabold uppercase tracking-wide bg-purple-600 text-white px-2 py-0.5 rounded-md shadow-xs">
                    {hotel.badge}
                  </span>
                )}

                <div className="absolute top-2.5 right-2.5 bg-black/50 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>{hotel.rating}</span>
                  <span className="text-white/70">({hotel.reviews_count})</span>
                </div>

                <div className="absolute bottom-2 left-3 right-3 text-white">
                  <h4 className="text-xs font-black tracking-tight drop-shadow-xs line-clamp-1">
                    {hotel.name}
                  </h4>
                  <p className="text-[10px] text-white/90 drop-shadow-xs flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-purple-300 shrink-0" />
                    <span className="truncate">{hotel.location}</span>
                  </p>
                </div>
              </div>

              {/* Property Details */}
              <div className="p-3">
                {/* Rates Breakdown */}
                <div className="flex items-baseline justify-between mb-2 pb-2 border-b border-slate-100">
                  <div>
                    <span className="text-sm font-black text-slate-900">
                      {hotel.price_per_night}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium"> / night</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">
                      {hotel.nights || trip.days - 1} nights total
                    </span>
                    <span className="text-xs font-bold text-purple-700">
                      {hotel.total_price}
                    </span>
                  </div>
                </div>

                {/* Amenities */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {hotel.amenities.map((amenity, idx) => (
                    <span
                      key={idx}
                      className="text-[9.5px] font-medium bg-purple-50 text-purple-800 px-2 py-0.5 rounded-md border border-purple-100"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>

                {/* Selection Button */}
                <button
                  onClick={() => onSelectHotel(hotel)}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 min-h-[40px] ${
                    isSelected
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-purple-50 hover:bg-purple-100 text-purple-700'
                  }`}
                >
                  {isSelected ? (
                    <>
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Selected Stay</span>
                    </>
                  ) : (
                    <span>Choose {hotel.name.split(' ')[0]}</span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sticky Bottom Next Step CTA Bar */}
      <div className="fixed bottom-14 left-0 right-0 max-w-[390px] mx-auto p-3 bg-gradient-to-t from-white via-white/95 to-transparent z-30">
        <button
          onClick={onContinueToActivities}
          className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl shadow-lg shadow-purple-600/30 text-xs font-bold flex items-center justify-center gap-2 transition-all min-h-[48px]"
        >
          <span>Confirm Stay & Explore Activities</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
