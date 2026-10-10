import React, { useState } from 'react';
import { Mountain, Hotel, Plane, Coffee, Compass } from 'lucide-react';

interface ImageSafeProps {
  src?: string;
  alt: string;
  className?: string;
  category?: 'mountain' | 'hotel' | 'flight' | 'tea' | 'activity' | 'general';
}

export const ImageSafe: React.FC<ImageSafeProps> = ({
  src,
  alt,
  className = '',
  category = 'mountain',
}) => {
  const [hasError, setHasError] = useState(false);

  const getGradient = () => {
    switch (category) {
      case 'hotel':
        return 'from-purple-800 via-indigo-900 to-slate-900';
      case 'flight':
        return 'from-blue-700 via-indigo-800 to-purple-900';
      case 'tea':
        return 'from-emerald-800 via-teal-900 to-slate-900';
      case 'activity':
        return 'from-amber-700 via-purple-900 to-slate-900';
      default:
        return 'from-purple-900 via-purple-950 to-slate-950';
    }
  };

  const getIcon = () => {
    switch (category) {
      case 'hotel':
        return <Hotel className="w-8 h-8 text-purple-200/60" />;
      case 'flight':
        return <Plane className="w-8 h-8 text-blue-200/60" />;
      case 'tea':
        return <Coffee className="w-8 h-8 text-emerald-200/60" />;
      case 'activity':
        return <Compass className="w-8 h-8 text-amber-200/60" />;
      default:
        return <Mountain className="w-8 h-8 text-purple-200/60" />;
    }
  };

  if (!src || hasError) {
    return (
      <div
        className={`relative flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br ${getGradient()} ${className}`}
      >
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="relative z-10 flex flex-col items-center text-center p-3">
          {getIcon()}
          <span className="text-[10px] font-medium text-white/80 mt-1 line-clamp-1">{alt}</span>
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={`object-cover ${className}`}
    />
  );
};
