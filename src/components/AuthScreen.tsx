import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Check,
  Smartphone,
  RefreshCw,
  Sliders,
  UserCheck,
} from 'lucide-react';
import { UserProfile } from '../types';
import { ImageSafe } from './ImageSafe';
import { travelImages } from '../utils/images';
import { supabase } from '../lib/supabase';

interface AuthScreenProps {
  onComplete: (profile: UserProfile) => void;
  onBack?: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onComplete, onBack }) => {
  const [step, setStep] = useState<'welcome' | 'otp' | 'preferences'>('welcome');
  const [fullName, setFullName] = useState('Sara Jenkins');
  const [phoneNumber, setPhoneNumber] = useState('9876543210');
  const [email, setEmail] = useState('sara.jenkins@voyage.io');
  const [otpCode, setOtpCode] = useState(['4', '8', '2', '9']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Preferences (AUTH-02)
  const [pacing, setPacing] = useState<'relaxed' | 'balanced' | 'fast-paced'>('balanced');
  const [budgetTier, setBudgetTier] = useState<'economy' | 'comfort' | 'luxury'>('comfort');
  const [interests, setInterests] = useState<string[]>([
    'Mountain Treks',
    'Tea Plantations',
    'Heritage',
  ]);
  const [offlineSync, setOfflineSync] = useState(true);

  const allInterests = [
    'Mountain Treks',
    'Tea Plantations',
    'Wildlife Safari',
    'Heritage',
    'Culinary Trails',
    'Beach & Coast',
    'Ayurvedic Wellness',
  ];

  // Trigger Google OAuth via Supabase
  const handleGoogleAuth = async () => {
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (error) {
        console.warn('Supabase OAuth notice:', error.message);
        // Fallback gracefully for preview / mock environment
        setFullName('Sara Jenkins');
        setEmail('sara.jenkins@voyage.io');
        setStep('preferences');
      }
    } catch (err) {
      console.warn('OAuth fallback triggered:', err);
      setFullName('Sara Jenkins');
      setEmail('sara.jenkins@voyage.io');
      setStep('preferences');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick Guest Pass: sets guest session and proceeds to preferences (AUTH-02)
  const handleGuestPass = () => {
    setFullName('Guest Explorer');
    setEmail('guest@beemvoy.app');
    setStep('preferences');
  };

  // Mobile OTP triggers
  const handleSendOtp = () => {
    const clean = phoneNumber.replace(/\D/g, '');
    if (clean.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number');
      return;
    }
    setErrorMessage('');
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep('otp');
    }, 250);
  };

  const handleVerifyOtp = () => {
    const code = otpCode.join('');
    if (code.length < 4) {
      setErrorMessage('Please enter the 4-digit verification code');
      return;
    }
    setErrorMessage('');
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep('preferences');
    }, 250);
  };

  const toggleInterest = (interest: string) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter((i) => i !== interest));
    } else {
      setInterests([...interests, interest]);
    }
  };

  // Persist session and finish setup
  const handleFinishSetup = () => {
    const profile: UserProfile = {
      id: 'usr-1',
      name: fullName.trim() || 'Sara Jenkins',
      email: email.trim() || 'sara.jenkins@voyage.io',
      phone: `+91 ${phoneNumber}`,
      membershipTier: fullName.includes('Guest') ? 'Beemvoy Guest Pass' : 'Beemvoy Elite Pioneer',
      pacing,
      budgetTier,
      interests,
    };

    // Store active session token & profile locally
    localStorage.setItem(
      'beemvoy_session',
      JSON.stringify({
        userId: profile.id,
        name: profile.name,
        email: profile.email,
        timestamp: Date.now(),
      })
    );
    localStorage.setItem('beemvoy_profile', JSON.stringify(profile));

    onComplete(profile);
  };

  // STEP 1: WELCOME & AUTH OPTIONS (AUTH-01)
  if (step === 'welcome') {
    return (
      <div className="flex flex-col h-full bg-[#F9F9FF] overflow-y-auto scrollbar-thin scrollbar-thumb-purple-300 pt-8 pb-16 px-5 select-none">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-2">
          {onBack ? (
            <button
              onClick={onBack}
              aria-label="Back"
              className="w-9 h-9 rounded-full flex items-center justify-center text-purple-950 hover:bg-[#F3E8FF] transition-all min-h-[44px] min-w-[44px]"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
            </button>
          ) : (
            <div className="w-9 h-9" />
          )}

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F3E8FF] text-[#9333EA] text-xs font-semibold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#9333EA]" />
            <span>BEEMVOY MVP</span>
          </div>

          <div className="w-9 h-9" />
        </div>

        {/* Brand Headline */}
        <div className="text-center pt-1 pb-2">
          <h1 className="text-2xl font-black text-purple-950 tracking-tight">
            BEEMVOY
          </h1>
          <p className="text-xs text-purple-800/80 font-medium mt-0.5">
            Travel, handled. India-first natural-language planner.
          </p>
        </div>

        {/* Hero Card Image */}
        <div className="my-2">
          <div className="relative h-36 w-full rounded-3xl overflow-hidden shadow-sm border border-purple-200/60">
            <ImageSafe
              src={travelImages.munnarRidge}
              alt="Munnar Hills"
              category="mountain"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-purple-950/85 via-purple-950/30 to-transparent" />
            <div className="absolute bottom-3 left-4 right-4 text-white">
              <span className="text-[10px] uppercase font-bold tracking-wider text-purple-200">
                Curated High-Elevation Circuits
              </span>
              <p className="text-sm font-bold leading-tight mt-0.5">
                Find the best circuit for your next journey
              </p>
            </div>
          </div>
        </div>

        {/* Primary Auth Actions (Prominent Google & Guest Pass buttons) */}
        <div className="space-y-2.5 pt-2">
          {/* 1. Continue with Google */}
          <button
            onClick={handleGoogleAuth}
            disabled={isSubmitting}
            className="w-full py-3 rounded-2xl bg-white hover:bg-purple-50/50 text-slate-800 border-2 border-purple-200 text-xs font-bold flex items-center justify-center gap-2.5 shadow-sm active:scale-95 transition-all cursor-pointer min-h-[48px]"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* 2. Quick Guest Pass */}
          <button
            onClick={handleGuestPass}
            className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-purple-600/25 active:scale-95 transition-all cursor-pointer min-h-[48px]"
          >
            <UserCheck className="w-4 h-4" />
            <span>Quick Guest Pass (Instant Access)</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Divider */}
          <div className="relative my-2 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-purple-200/70" />
            </div>
            <span className="relative bg-[#F9F9FF] px-2 text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
              Or Sign In With Mobile OTP
            </span>
          </div>

          {/* Mobile OTP Option */}
          <div className="space-y-2">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Your Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g., Sara Jenkins"
                className="w-full text-xs text-slate-900 font-medium p-2.5 rounded-2xl bg-white border border-purple-200/90 shadow-2xs focus:outline-none focus:border-[#9333EA] focus:ring-2 focus:ring-purple-200 transition-all min-h-[44px]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Mobile Number (India)
              </label>
              <div className="flex items-center rounded-2xl bg-white border border-purple-200/90 px-3.5 py-2 shadow-2xs focus-within:border-[#9333EA] focus-within:ring-2 focus-within:ring-purple-200 transition-all min-h-[44px]">
                <div className="flex items-center gap-1.5 shrink-0 whitespace-nowrap select-none">
                  <span className="w-5 h-3.5 rounded-xs overflow-hidden inline-flex flex-col border border-slate-200/80 shrink-0">
                    <span className="h-1/3 bg-[#FF9933] w-full" />
                    <span className="h-1/3 bg-white w-full flex items-center justify-center">
                      <span className="w-1 h-1 rounded-full bg-[#000080]" />
                    </span>
                    <span className="h-1/3 bg-[#138808] w-full" />
                  </span>
                  <span className="text-xs font-bold text-slate-800 font-mono tracking-tight shrink-0">
                    +91
                  </span>
                </div>

                <div className="h-5 w-px bg-purple-200 mx-2.5 shrink-0" />
                <input
                  type="tel"
                  maxLength={10}
                  value={phoneNumber}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value.replace(/\D/g, ''));
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="Enter 10-digit number"
                  className="w-full text-xs text-slate-900 font-semibold focus:outline-none tracking-wider font-mono"
                />
              </div>
              {errorMessage && (
                <p className="text-[10px] text-red-600 font-semibold mt-1 ml-1">{errorMessage}</p>
              )}
            </div>

            <button
              onClick={handleSendOtp}
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-900 font-bold text-xs border border-purple-200 shadow-2xs flex items-center justify-center gap-2 active:scale-95 transition-all min-h-[44px]"
            >
              {isSubmitting ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Smartphone className="w-4 h-4 text-purple-700" />
                  <span>Send Verification Code</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // STEP 2: OTP VERIFICATION
  if (step === 'otp') {
    return (
      <div className="flex flex-col h-full bg-[#F9F9FF] px-5 pt-8 pb-16 justify-between select-none">
        <div>
          {/* Back button */}
          <button
            onClick={() => setStep('welcome')}
            aria-label="Back"
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-700 hover:bg-[#F3E8FF] transition-all mb-4 -ml-1 min-h-[44px] min-w-[44px]"
          >
            <ArrowLeft className="w-5 h-5 text-purple-950" />
          </button>

          <div className="space-y-4">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-[#F3E8FF] text-[#9333EA] flex items-center justify-center mx-auto mb-2 shadow-xs">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-black text-purple-950">
                Verification Code
              </h2>
              <p className="text-xs text-slate-500">
                We sent a 4-digit code to <span className="font-bold text-slate-800 font-mono">+91 {phoneNumber}</span>
              </p>
            </div>

            {/* OTP 4-Digit Inputs */}
            <div className="flex justify-center gap-3 my-4">
              {otpCode.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    const updated = [...otpCode];
                    updated[index] = val;
                    setOtpCode(updated);
                    if (val && index < 3) {
                      const next = document.getElementById(`otp-${index + 1}`);
                      if (next) next.focus();
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
                      const prev = document.getElementById(`otp-${index - 1}`);
                      if (prev) prev.focus();
                    }
                  }}
                  className="w-12 h-14 rounded-2xl bg-white border-2 border-purple-300 focus:border-[#9333EA] focus:ring-2 focus:ring-purple-200 text-center text-lg font-bold text-purple-950 font-mono shadow-xs focus:outline-none"
                />
              ))}
            </div>

            {errorMessage && (
              <p className="text-[11px] text-red-600 text-center font-semibold">{errorMessage}</p>
            )}

            <div className="text-center">
              <button
                onClick={() => setOtpCode(['4', '8', '2', '9'])}
                className="text-xs text-[#9333EA] font-semibold hover:underline transition-all min-h-[36px]"
              >
                Resend Code (Demo Code: 4829)
              </button>
            </div>
          </div>
        </div>

        <div>
          <button
            onClick={handleVerifyOtp}
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-full bg-[#9333EA] hover:bg-[#7E22CE] text-white font-bold text-xs shadow-md shadow-purple-200 active:scale-95 transition-all flex items-center justify-center gap-2 min-h-[48px]"
          >
            {isSubmitting ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>Verify & Continue</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  // STEP 3: PREFERENCES (AUTH-02)
  return (
    <div className="flex flex-col h-full bg-[#F9F9FF] overflow-y-auto scrollbar-thin scrollbar-thumb-purple-300 px-5 pt-8 pb-16 select-none justify-between">
      {/* Top bar with Back and Skip Button */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setStep('welcome')}
            aria-label="Back"
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-700 hover:bg-[#F3E8FF] transition-all -ml-1 min-h-[44px] min-w-[44px]"
          >
            <ArrowLeft className="w-5 h-5 text-purple-950" />
          </button>

          <button
            onClick={handleFinishSetup}
            className="px-3.5 py-1.5 rounded-full text-xs font-bold text-[#9333EA] bg-white hover:bg-[#F3E8FF] border border-purple-200 shadow-2xs active:scale-95 transition-all flex items-center gap-1.5 min-h-[36px]"
          >
            <span>Skip</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div>
          <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#9333EA] uppercase tracking-wider mb-0.5">
            <Sliders className="w-3.5 h-3.5" />
            <span>Profile Preferences (AUTH-02)</span>
          </div>
          <h2 className="text-xl font-black text-purple-950 leading-tight">
            Personalize your Journey
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            BEEMVOY calibrates flight buffers and itinerary density to your style.
          </p>
        </div>
      </div>

      {/* Middle Sections */}
      <div className="py-3 space-y-4">
        {/* Travel Pacing - Pill Layout */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800 block">
              Travel Pacing
            </label>
            <span className="text-[10px] font-semibold text-purple-700 capitalize">
              {pacing === 'relaxed'
                ? 'Leisurely & Unhurried'
                : pacing === 'balanced'
                ? 'Balanced Flow'
                : 'Packed Explorer'}
            </span>
          </div>
          <div className="flex gap-2">
            {(['relaxed', 'balanced', 'fast-paced'] as const).map((pace) => {
              const isSelected = pacing === pace;
              const label =
                pace === 'relaxed' ? 'Relaxed' : pace === 'balanced' ? 'Balanced' : 'Fast-Paced';
              return (
                <button
                  key={pace}
                  onClick={() => setPacing(pace)}
                  className={`flex-1 py-2.5 px-2 rounded-2xl text-center border text-xs font-bold transition-all flex items-center justify-center gap-1 min-h-[44px] ${
                    isSelected
                      ? 'bg-[#9333EA] text-white border-[#9333EA] shadow-xs'
                      : 'bg-white text-slate-700 border-purple-100 hover:bg-[#F3E8FF]'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Daily Budget Target */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800 block">
              Daily Budget Target
            </label>
            <span className="text-[10px] font-semibold text-purple-700 capitalize">
              {budgetTier === 'economy'
                ? 'Value Focused'
                : budgetTier === 'comfort'
                ? 'Comfort & Style'
                : 'Premium Luxury'}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'economy', label: 'Economy ₹' },
              { id: 'comfort', label: 'Mid-Tier ₹₹' },
              { id: 'luxury', label: 'Luxury ₹₹₹' },
            ].map((tier) => {
              const isSelected = budgetTier === tier.id;
              return (
                <button
                  key={tier.id}
                  onClick={() => setBudgetTier(tier.id as any)}
                  className={`py-2.5 px-2 rounded-2xl text-center border text-xs font-bold transition-all min-h-[44px] ${
                    isSelected
                      ? 'bg-[#9333EA] text-white border-[#9333EA] shadow-xs'
                      : 'bg-white text-slate-700 border-purple-100 hover:bg-[#F3E8FF]'
                  }`}
                >
                  {tier.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Travel Interests */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800 block">
              Travel Interests
            </label>
            <span className="text-[10px] text-slate-400 font-medium">
              Select multiple
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {allInterests.map((interest) => {
              const isSelected = interests.includes(interest);
              return (
                <button
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all flex items-center gap-1.5 min-h-[36px] ${
                    isSelected
                      ? 'bg-[#9333EA] text-white border-[#9333EA] shadow-xs font-bold'
                      : 'bg-white text-slate-700 border-purple-100 hover:bg-[#F3E8FF]'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 text-white" />}
                  <span>{interest}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Offline Sync Toggle */}
        <div className="p-3 bg-white rounded-2xl border border-purple-100 flex items-center justify-between shadow-2xs">
          <div>
            <span className="text-xs font-bold text-slate-900 block">
              Offline Auto-Sync
            </span>
            <span className="text-[10px] text-slate-500">
              Pre-cache vouchers & itineraries for remote ghat valleys
            </span>
          </div>
          <button
            onClick={() => setOfflineSync(!offlineSync)}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors min-h-[24px] ${
              offlineSync ? 'bg-[#9333EA]' : 'bg-slate-300'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                offlineSync ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="space-y-2 pt-2">
        <button
          onClick={handleFinishSetup}
          className="w-full py-3.5 rounded-full bg-[#9333EA] hover:bg-[#7E22CE] text-white font-bold text-xs shadow-md shadow-purple-200 flex items-center justify-center gap-2 active:scale-95 transition-all min-h-[48px]"
        >
          <span>Complete Setup & Open Home</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={handleFinishSetup}
          className="w-full py-2.5 rounded-full bg-white hover:bg-[#F3E8FF] text-purple-900 border border-purple-200 font-bold text-xs shadow-2xs flex items-center justify-center gap-2 active:scale-95 transition-all min-h-[44px]"
        >
          <span>Skip for Now</span>
        </button>
      </div>
    </div>
  );
};
