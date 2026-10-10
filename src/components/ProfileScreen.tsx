import React, { useState } from 'react';
import {
  User,
  Mail,
  Compass,
  Wallet,
  Heart,
  Edit3,
  Phone,
  ShieldAlert,
  ChevronRight,
  Sparkles,
  MapPin,
  Calendar,
  LogOut,
} from 'lucide-react';
import { UserProfile } from '../types';
import { InlineProfileEditModal } from './InlineProfileEditModal';
import { ImageSafe } from './ImageSafe';
import { travelImages } from '../utils/images';

interface ProfileScreenProps {
  user: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onSignOut: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  user,
  onUpdateProfile,
  onSignOut,
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-purple-300 pt-10 pb-28 px-4 bg-[#F9F9FF]">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-[10px] font-bold text-purple-600 uppercase tracking-widest block">
            PROFILE SETTINGS
          </span>
          <h2 className="text-sm font-black text-slate-900">Traveler Identity</h2>
        </div>

        <span className="text-[10px] font-bold bg-purple-100 text-purple-800 px-2.5 py-1 rounded-full">
          Active Session
        </span>
      </div>

      {/* Main Profile Card with Inline Edit Trigger */}
      <div className="bg-white rounded-2xl p-4 border border-purple-100 shadow-sm mb-4 relative overflow-hidden">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-purple-100 overflow-hidden ring-2 ring-purple-400 shrink-0">
              <ImageSafe
                src={user.avatarUrl || travelImages.avatar}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <h3 className="text-sm font-extrabold text-slate-900 tracking-tight leading-tight">
                {user.name}
              </h3>
              <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                <Mail className="w-3 h-3 text-purple-400 shrink-0" />
                <span className="truncate max-w-[160px]">{user.email}</span>
              </p>
              <span className="inline-block mt-1 text-[9.5px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">
                {user.membershipTier}
              </span>
            </div>
          </div>
        </div>

        {/* Interactive "Edit" Button - opens InlineProfileEditModal */}
        <button
          onClick={() => setIsEditModalOpen(true)}
          className="w-full py-2 px-3 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200/80 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors min-h-[44px]"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Edit Profile & Preferences</span>
        </button>
      </div>

      {/* Active Travel Preferences Summary */}
      <div className="bg-white rounded-2xl p-3.5 border border-purple-100 shadow-2xs space-y-3 mb-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-800">Travel Preferences</h4>
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="text-[10px] font-bold text-purple-600 hover:underline"
          >
            Adjust
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-purple-50/50 border border-purple-100">
            <span className="text-[10px] text-slate-400 flex items-center gap-1 mb-0.5">
              <Compass className="w-3 h-3 text-purple-500" />
              Pacing
            </span>
            <span className="font-bold text-slate-900 capitalize">
              {user.pacing} Pacing
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-purple-50/50 border border-purple-100">
            <span className="text-[10px] text-slate-400 flex items-center gap-1 mb-0.5">
              <Wallet className="w-3 h-3 text-purple-500" />
              Daily Budget
            </span>
            <span className="font-bold text-slate-900 capitalize">
              {user.budgetTier} Tier
            </span>
          </div>
        </div>

        <div>
          <span className="text-[10px] text-slate-400 block mb-1.5 flex items-center gap-1">
            <Heart className="w-3 h-3 text-purple-500" />
            Curated Interests
          </span>
          <div className="flex flex-wrap gap-1.5">
            {user.interests.map((interest, idx) => (
              <span
                key={idx}
                className="text-[10px] font-medium bg-slate-50 text-slate-700 px-2 py-0.5 rounded-full border border-slate-200"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Past Expeditions & Saved Circuits */}
      <div className="bg-white rounded-2xl p-3.5 border border-purple-100 shadow-2xs space-y-2.5 mb-4">
        <h4 className="text-xs font-bold text-slate-800 mb-1">
          Past Expeditions & Saved Circuits
        </h4>

        <div className="space-y-2">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-slate-800 block">
                Wayanad Mist Ridge 2025
              </span>
              <span className="text-[10px] text-slate-400">
                4 Days · Chembra Peak & Treehouse Stay
              </span>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              Completed
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-slate-800 block">
                Coorg Coffee Trails 2024
              </span>
              <span className="text-[10px] text-slate-400">
                3 Days · Estate Harvest & River Rafting
              </span>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              Completed
            </span>
          </div>
        </div>
      </div>

      {/* Emergency ICE & Protocol */}
      <div className="bg-white rounded-2xl p-3.5 border border-purple-100 shadow-2xs space-y-2 mb-4">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-purple-600" />
          <h4 className="text-xs font-bold text-slate-800">
            Emergency ICE Contact & Protocol
          </h4>
        </div>

        <div className="p-2.5 rounded-xl bg-purple-50/40 border border-purple-100 text-xs">
          <span className="font-bold text-slate-800 block">
            Dr. Meera Nambiar (Primary ICE)
          </span>
          <span className="text-[10px] text-slate-500 block">
            Munnar District Hospital Liaison · +91 94471 20240
          </span>
        </div>
      </div>

      {/* Working Sign Out Action Button */}
      <div className="pt-1 pb-4">
        <button
          onClick={onSignOut}
          className="w-full py-3 px-4 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-2xs active:scale-95 min-h-[48px]"
        >
          <LogOut className="w-4 h-4 text-rose-600" />
          <span>Sign Out of Session</span>
        </button>
      </div>

      {/* Inline Profile Edit Modal */}
      <InlineProfileEditModal
        isOpen={isEditModalOpen}
        profile={user}
        onSave={(updated) => {
          onUpdateProfile(updated);
        }}
        onClose={() => setIsEditModalOpen(false)}
      />
    </div>
  );
};
