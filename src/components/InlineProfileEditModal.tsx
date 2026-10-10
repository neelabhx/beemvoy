import React, { useState } from 'react';
import { X, Check, Sparkles, User, Mail, Phone, Compass, Wallet } from 'lucide-react';
import { UserProfile } from '../types';

interface InlineProfileEditModalProps {
  isOpen: boolean;
  profile: UserProfile;
  onSave: (updated: UserProfile) => void;
  onClose: () => void;
}

const AVAILABLE_INTERESTS = [
  'Mountain Treks',
  'Tea Plantations',
  'Culinary Trails',
  'Wildlife Safari',
  'Heritage',
  'Beaches',
  'Ayurvedic Wellness',
  'Photography',
];

export const InlineProfileEditModal: React.FC<InlineProfileEditModalProps> = ({
  isOpen,
  profile,
  onSave,
  onClose,
}) => {
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone || '+91 98765 43210');
  const [pacing, setPacing] = useState(profile.pacing);
  const [budgetTier, setBudgetTier] = useState(profile.budgetTier);
  const [interests, setInterests] = useState<string[]>(profile.interests);

  if (!isOpen) return null;

  const toggleInterest = (interest: string) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter((i) => i !== interest));
    } else {
      setInterests([...interests, interest]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...profile,
      name: name.trim() || profile.name,
      email: email.trim() || profile.email,
      phone: phone.trim(),
      pacing,
      budgetTier,
      interests,
    });
    onClose();
  };

  return (
    <div
      className="absolute inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-xs transition-opacity duration-200 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-h-[85%] bg-white rounded-t-3xl shadow-2xl flex flex-col overflow-hidden animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Grab Handle */}
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-3 mb-1" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-purple-50">
          <div>
            <h3 className="text-base font-bold text-slate-900">Edit Traveler Profile</h3>
            <p className="text-[11px] text-slate-500">Update preferences without leaving page</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors min-h-[44px] min-w-[44px]"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body (Scrollable with custom slim scrollbar) */}
        <form onSubmit={handleSave} className="overflow-y-auto px-5 py-4 space-y-4 scrollbar-thin flex-1">
          {/* Identity Fields */}
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-purple-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-purple-50/40 border border-purple-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 font-medium text-slate-900"
                  placeholder="Your Name"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-purple-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-purple-50/40 border border-purple-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 font-medium text-slate-900"
                  placeholder="traveler@voyage.io"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Mobile / WhatsApp (Optional)</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-purple-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-purple-50/40 border border-purple-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 font-medium text-slate-900"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>
          </div>

          {/* Travel Pacing */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1.5 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-purple-600" />
              Travel Pacing
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['relaxed', 'balanced', 'fast-paced'] as const).map((p) => {
                const active = pacing === p;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPacing(p)}
                    className={`py-2 px-2 text-[11px] font-semibold rounded-xl border transition-all capitalize min-h-[44px] flex items-center justify-center ${
                      active
                        ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                        : 'bg-purple-50/40 text-slate-700 border-purple-100 hover:bg-purple-100/50'
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Daily Budget Target */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1.5 flex items-center gap-1.5">
              <Wallet className="w-3.5 h-3.5 text-purple-600" />
              Daily Budget Target
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'economy', label: 'Economy', desc: '< ₹10k' },
                { id: 'comfort', label: 'Comfort', desc: '₹10k-₹25k' },
                { id: 'luxury', label: 'Luxury', desc: '> ₹25k' },
              ].map((tier) => {
                const active = budgetTier === tier.id;
                return (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => setBudgetTier(tier.id as any)}
                    className={`p-2 rounded-xl border text-center transition-all min-h-[44px] ${
                      active
                        ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                        : 'bg-purple-50/40 text-slate-700 border-purple-100 hover:bg-purple-100/50'
                    }`}
                  >
                    <div className="text-[11px] font-bold">{tier.label}</div>
                    <div className={`text-[9.5px] ${active ? 'text-purple-100' : 'text-slate-400'}`}>
                      {tier.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Travel Interests Chips */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              Travel Interests
            </label>
            <div className="flex flex-wrap gap-1.5">
              {AVAILABLE_INTERESTS.map((item) => {
                const isSelected = interests.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleInterest(item)}
                    className={`px-3 py-1.5 text-[11px] font-medium rounded-full border transition-all flex items-center gap-1.5 min-h-[36px] ${
                      isSelected
                        ? 'bg-purple-100 text-purple-800 border-purple-300 font-semibold'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 text-purple-700" />}
                    <span>{item}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 pb-6 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors min-h-[44px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-2 py-2.5 px-4 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-md shadow-purple-600/20 transition-all min-h-[44px] flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              Save Preferences
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
