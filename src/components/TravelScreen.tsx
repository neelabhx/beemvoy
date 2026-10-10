import React, { useState } from 'react';
import {
  Briefcase,
  CheckCircle2,
  Users,
  CreditCard,
  QrCode,
  ShieldCheck,
  ChevronRight,
  Plane,
  Hotel,
  Car,
  Ticket,
  Sparkles,
} from 'lucide-react';
import { CanonicalTrip } from '../types';

interface TravelScreenProps {
  trip: CanonicalTrip;
}

export const TravelScreen: React.FC<TravelScreenProps> = ({ trip }) => {
  const [smartSplit, setSmartSplit] = useState(true);
  const [selectedRail, setSelectedRail] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [paymentDone, setPaymentDone] = useState(false);

  const flightPrice = trip.selected_flight?.price_raw || 4180;
  const hotelPrice = trip.selected_hotel?.price_per_night_raw
    ? trip.selected_hotel.price_per_night_raw * 3
    : 25200;
  const chauffeurPrice = 12500;
  const permitsPrice = 2640;

  const totalExpedition = flightPrice + hotelPrice + chauffeurPrice + permitsPrice;
  const splitShare = Math.round(totalExpedition / 2);

  const amountToPay = smartSplit ? splitShare : totalExpedition;

  return (
    <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-purple-300 pt-10 pb-28 px-4 bg-[#F9F9FF]">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-3.5">
        <div>
          <span className="text-[10px] font-bold text-purple-600 uppercase tracking-widest block">
            TRAVEL BOOKINGS
          </span>
          <h2 className="text-sm font-black text-slate-900">Expedition Ledger & Passes</h2>
        </div>

        <span className="text-[10px] font-bold bg-purple-100 text-purple-800 px-2.5 py-1 rounded-full">
          Active Trip
        </span>
      </div>

      {/* Total Amount Overview Card */}
      <div className="bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-950 text-white rounded-2xl p-4 mb-4 shadow-lg shadow-purple-950/20">
        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300 block mb-1">
          Total Expedition Value
        </span>
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-2xl font-black tracking-tight">
            ₹{totalExpedition.toLocaleString('en-IN')}
          </span>
          {smartSplit && (
            <span className="text-xs font-bold text-purple-200 bg-white/10 px-2.5 py-1 rounded-full">
              Your Share: ₹{splitShare.toLocaleString('en-IN')}
            </span>
          )}
        </div>
        <p className="text-[10.5px] text-purple-200/90 flex items-center gap-2">
          <span>{trip.destination} High Ridge Expedition</span>
          <span>·</span>
          <span>3 Days / 2 Nights</span>
        </p>
      </div>

      {/* Itemized Ledger */}
      <div className="bg-white rounded-2xl p-3.5 border border-purple-100 shadow-2xs space-y-2.5 mb-4">
        <h4 className="text-xs font-bold text-slate-800 mb-1">Expedition Ledger Breakdown</h4>

        {/* Flight Item */}
        <div className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <Plane className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="font-bold text-slate-800 block">
                {trip.selected_flight
                  ? `${trip.selected_flight.airline} (${trip.selected_flight.flight_number})`
                  : 'IndiGo 6E-6247'}
              </span>
              <span className="text-[10px] text-slate-400">Non-stop Flights</span>
            </div>
          </div>
          <span className="font-black text-slate-800">
            ₹{flightPrice.toLocaleString('en-IN')}
          </span>
        </div>

        {/* Hotel Item */}
        <div className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <Hotel className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="font-bold text-slate-800 block truncate max-w-[160px]">
                {trip.selected_hotel ? trip.selected_hotel.name : 'Lockhart Heritage Bungalow'}
              </span>
              <span className="text-[10px] text-slate-400">3 Nights Colonial Suite</span>
            </div>
          </div>
          <span className="font-black text-slate-800">
            ₹{hotelPrice.toLocaleString('en-IN')}
          </span>
        </div>

        {/* Chauffeur Item */}
        <div className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
              <Car className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="font-bold text-slate-800 block">
                Private SUV Mountain Transfer
              </span>
              <span className="text-[10px] text-slate-400">Innova Crysta + Rajesh Nair</span>
            </div>
          </div>
          <span className="font-black text-slate-800">
            ₹{chauffeurPrice.toLocaleString('en-IN')}
          </span>
        </div>

        {/* Permits Item */}
        <div className="flex items-center justify-between text-xs py-1.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <Ticket className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="font-bold text-slate-800 block">
                Permit & Ridge Trail Passes
              </span>
              <span className="text-[10px] text-slate-400">Kolukkumalai & Factory Entry</span>
            </div>
          </div>
          <span className="font-black text-slate-800">
            ₹{permitsPrice.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Smart Split Ledger Toggle */}
      <div className="bg-white rounded-2xl p-3.5 border border-purple-100 shadow-2xs space-y-2 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-600" />
            <div>
              <h4 className="text-xs font-bold text-slate-900">Smart Split Ledger</h4>
              <p className="text-[10px] text-slate-400">Split costs 50/50 with co-traveler</p>
            </div>
          </div>

          <button
            onClick={() => setSmartSplit(!smartSplit)}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors min-h-[24px] ${
              smartSplit ? 'bg-purple-600' : 'bg-slate-300'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                smartSplit ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {smartSplit && (
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium">You (Sara Jenkins)</span>
            <span className="font-extrabold text-purple-700">
              ₹{splitShare.toLocaleString('en-IN')}
            </span>
          </div>
        )}
      </div>

      {/* Payment Rail Selector */}
      <div className="bg-white rounded-2xl p-3.5 border border-purple-100 shadow-2xs space-y-2.5 mb-6">
        <h4 className="text-xs font-bold text-slate-800 mb-1">Select Payment Rail</h4>

        <div className="space-y-1.5">
          <button
            onClick={() => setSelectedRail('upi')}
            className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between min-h-[44px] ${
              selectedRail === 'upi'
                ? 'border-purple-600 bg-purple-50/50'
                : 'border-slate-200 hover:border-purple-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <QrCode className="w-4 h-4 text-purple-600" />
              <div>
                <span className="text-xs font-bold text-slate-800 block">
                  UPI Instant (GPay / PhonePe)
                </span>
                <span className="text-[9.5px] text-slate-400">Zero surcharge instant lock</span>
              </div>
            </div>
            <span className="text-[9.5px] font-bold bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
              Recommended
            </span>
          </button>

          <button
            onClick={() => setSelectedRail('card')}
            className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between min-h-[44px] ${
              selectedRail === 'card'
                ? 'border-purple-600 bg-purple-50/50'
                : 'border-slate-200 hover:border-purple-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <CreditCard className="w-4 h-4 text-purple-600" />
              <div>
                <span className="text-xs font-bold text-slate-800 block">
                  Credit / Debit Card
                </span>
                <span className="text-[9.5px] text-slate-400">Visa, Mastercard, RuPay</span>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Confirmation Toast or Bottom Bar */}
      {paymentDone ? (
        <div className="fixed bottom-14 left-0 right-0 max-w-[390px] mx-auto p-3 z-30">
          <div className="bg-emerald-600 text-white rounded-2xl p-3 shadow-xl flex items-center gap-2.5 animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 text-emerald-200 shrink-0" />
            <div>
              <span className="text-xs font-bold block">Expedition Locked & Paid!</span>
              <span className="text-[10px] text-emerald-100">
                Tickets & hotel voucher synced to your profile
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="fixed bottom-14 left-0 right-0 max-w-[390px] mx-auto p-3 bg-gradient-to-t from-white via-white/95 to-transparent z-30 flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-slate-500 block">Total Due</span>
            <span className="text-base font-black text-slate-900">
              ₹{amountToPay.toLocaleString('en-IN')}
            </span>
          </div>

          <button
            onClick={() => setPaymentDone(true)}
            className="flex-1 py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl shadow-lg shadow-purple-600/30 text-xs font-bold flex items-center justify-center gap-1.5 transition-all min-h-[48px]"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Pay & Lock Share</span>
          </button>
        </div>
      )}
    </div>
  );
};
