import React, { useState } from 'react';
import { Sparkles, Heart, X, Check, BookOpen, Volume2, Flame, Moon } from 'lucide-react';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose }) => {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  if (!isOpen) return null;

  const handleStart = () => {
    if (dontShowAgain) {
      localStorage.setItem('subha_welcome_dismissed', 'true');
    }
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 select-none animate-in fade-in duration-300 font-sans"
      dir="rtl"
    >
      {/* Container with Islamic Glow & Border */}
      <div className="w-full max-w-md bg-[#0b101c] rounded-3xl border border-amber-500/40 shadow-2xl overflow-hidden relative flex flex-col text-right max-h-[92vh]">
        
        {/* Header with Emerald Gradient & App Avatar */}
        <div className="relative bg-gradient-to-b from-[#094d2a] via-[#0b3b22] to-[#0b101c] p-6 text-center text-white shrink-0 overflow-hidden">
          {/* Ambient light circles */}
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-emerald-400/20 rounded-full blur-2xl pointer-events-none" />
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 left-4 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 text-white/80 hover:text-white flex items-center justify-center transition cursor-pointer"
            title="إغلاق"
          >
            <X size={16} />
          </button>

          {/* Official App Avatar with Gold & Emerald Halo */}
          <div className="relative mx-auto w-24 h-24 rounded-3xl p-1 bg-gradient-to-br from-amber-300 via-amber-500 to-emerald-600 shadow-2xl mb-3 ring-4 ring-amber-400/20">
            <img
              src="/subha_icon.jpg"
              alt="سبحة نور الإسلام"
              className="w-full h-full object-cover rounded-[1.35rem]"
            />
          </div>

          <div className="inline-flex items-center gap-1.5 bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-bold px-3 py-1 rounded-full mb-1.5">
            <Sparkles size={12} className="text-amber-400" />
            <span>مرحباً بك في</span>
          </div>

          <h2 className="text-2xl font-black font-serif text-white tracking-wide">
            سبحة نور الإسلام
          </h2>
          <p className="text-xs text-emerald-300/90 mt-0.5 font-medium">
            مسبحة إلكترونية مباركة لذكر الله تعالى
          </p>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          
          {/* Quranic Verse Callout */}
          <div className="p-4 rounded-2xl bg-[#111928] border border-amber-500/25 text-center relative overflow-hidden">
            <div className="absolute -right-2 -bottom-2 text-amber-500/5 text-6xl font-serif pointer-events-none">
              ۞
            </div>
            <p className="text-amber-400 font-serif font-bold text-base sm:text-lg leading-relaxed">
              «أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ»
            </p>
            <p className="text-[11px] text-stone-400 mt-1 font-medium">
              سورة الرعد • آية ٢٨
            </p>
          </div>

          {/* Core Charity Dedication Message */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#0c2a1a] to-[#0e1d2c] border border-emerald-500/35 text-right space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
              <Heart size={15} className="fill-current text-emerald-400 shrink-0" />
              <span>مشروع خيري • صدقة جارية</span>
            </div>
            <p className="text-xs text-stone-200 leading-relaxed font-normal">
              تم تطوير هذا التطبيق ليكون <strong className="text-emerald-300 font-semibold">صدقة جارية</strong> عن <strong className="text-white font-bold">لؤي بن حسين</strong> وعن <strong className="text-white font-bold">والده رحمه الله وغفر له وأسكنه فسيح جناته</strong>، ولكل من يستخدمه في طاعة الله وذكره.
            </p>
            <p className="text-[11px] text-amber-300/90 font-medium pt-1">
              نسأل الله أن يتقبل منا ومنكم صالح الأعمال والدعاء.
            </p>
          </div>

          {/* Brief Feature Highlights in One Clean Grid */}
          <div className="grid grid-cols-3 gap-2 text-center pt-1">
            <div className="p-2.5 rounded-2xl bg-[#131b2c] border border-white/5 space-y-1">
              <span className="text-base">📿</span>
              <h4 className="text-[11px] font-bold text-stone-200">أذكار مأثورة</h4>
              <p className="text-[10px] text-stone-400 leading-tight">أهداف مخصصة ومفتوحة</p>
            </div>
            <div className="p-2.5 rounded-2xl bg-[#131b2c] border border-white/5 space-y-1">
              <span className="text-base">🔊</span>
              <h4 className="text-[11px] font-bold text-stone-200">أصوات واهتزاز</h4>
              <p className="text-[10px] text-stone-400 leading-tight">نقرات خشبية ومائية</p>
            </div>
            <div className="p-2.5 rounded-2xl bg-[#131b2c] border border-white/5 space-y-1">
              <span className="text-base">📊</span>
              <h4 className="text-[11px] font-bold text-stone-200">سجل الأوراد</h4>
              <p className="text-[10px] text-stone-400 leading-tight">متابعة يومية ومشاركة</p>
            </div>
          </div>

          {/* Don't show again preference toggle */}
          <label className="flex items-center gap-2.5 text-xs text-stone-400 cursor-pointer pt-1 select-none">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="rounded border-stone-700 bg-[#162033] text-amber-500 focus:ring-amber-500 w-4 h-4 cursor-pointer"
            />
            <span>عدم إظهار هذه الرسالة الترحيبية تلقائياً</span>
          </label>

          {/* Action Button */}
          <button
            onClick={handleStart}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-stone-950 font-black text-sm shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 transition active:scale-98 cursor-pointer"
          >
            <span>بِسْمِ اللَّهِ نَبْدَأُ التَّسْبِيح</span>
            <Sparkles size={16} />
          </button>

        </div>
      </div>
    </div>
  );
};
