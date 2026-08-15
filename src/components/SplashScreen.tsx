import React, { useEffect, useState } from 'react';
import { Sparkles, Heart } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [fadeState, setFadeState] = useState<'entering' | 'visible' | 'exiting'>('entering');

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setFadeState('visible');
    }, 50);

    const timer2 = setTimeout(() => {
      setFadeState('exiting');
    }, 1800);

    const timer3 = setTimeout(() => {
      onFinish();
    }, 2250);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-[100] bg-[#070b13] flex flex-col items-center justify-center p-6 text-center select-none transition-opacity duration-500 ease-in-out ${
        fadeState === 'exiting' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      dir="rtl"
    >
      {/* Ambient Lighting & Islamic Geometric Glow */}
      <div className="absolute w-96 h-96 rounded-full bg-emerald-600/15 blur-3xl pointer-events-none -top-10" />
      <div className="absolute w-80 h-80 rounded-full bg-amber-500/15 blur-3xl pointer-events-none -bottom-10" />

      {/* Main Container */}
      <div className="relative z-10 flex flex-col items-center animate-in zoom-in-90 duration-500 max-w-sm">
        
        {/* Prominent Official App Avatar Card */}
        <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-[2.8rem] p-1.5 bg-gradient-to-br from-amber-300 via-amber-500 to-emerald-700 shadow-2xl shadow-emerald-950/80 mb-6 ring-4 ring-amber-500/20">
          <div className="w-full h-full rounded-[2.5rem] overflow-hidden bg-[#090e18] relative shadow-inner">
            <img
              src="/subha_icon.jpg"
              alt="شعار سبحة نور الإسلام"
              className="w-full h-full object-cover select-none"
            />
          </div>
          
          {/* Subtle Golden Verified Badge */}
          <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center text-stone-950 shadow-lg border-2 border-[#070b13]">
            <Sparkles size={14} className="fill-stone-950" />
          </div>
        </div>

        {/* Application Title */}
        <h1 className="text-3xl font-black text-stone-100 font-serif tracking-wide mb-1.5 flex items-center gap-2">
          <span>سبحة نور الإسلام</span>
          <Sparkles className="text-amber-400 w-5 h-5" />
        </h1>

        <p className="text-xs sm:text-sm text-emerald-400 font-medium mb-4">
          مسبحة إلكترونية مباركة • صدقة جارية
        </p>

        {/* Dedication Tag */}
        <div className="inline-flex items-center gap-1.5 bg-[#0b5c33]/30 border border-[#0b5c33]/60 text-[#22c55e] text-xs font-semibold px-4 py-1.5 rounded-full shadow-sm">
          <Heart size={12} className="fill-current text-emerald-400" />
          <span>عن لؤي بن حسين ولوالده رحمه الله</span>
        </div>

        {/* Loading Indicator */}
        <div className="mt-8 flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
};
