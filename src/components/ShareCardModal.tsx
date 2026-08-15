import React from 'react';
import { 
  Sparkles, Award, CheckCircle2, Download, Copy, Check, 
  Share2, Heart, Flame 
} from 'lucide-react';

interface ShareCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalToday: number;
  roundsCompleted: number;
  streakDays: number;
  triggerNotification: (msg: string) => void;
}

export const ShareCardModal: React.FC<ShareCardModalProps> = ({
  isOpen,
  onClose,
  totalToday,
  roundsCompleted,
  streakDays,
  triggerNotification,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const shareText = `الحمد لله رب العالمين 📿✨\nأتممت اليوم ${totalToday.toLocaleString('ar-EG')} تسبيحة وذكر في تطبيق (سبحة نور الإسلام).\n«مَثَلُ الَّذِي يَذْكُرُ رَبَّهُ وَالَّذِي لا يَذْكُرُ رَبَّهُ، مَثَلُ الحَيِّ وَالمَيِّتِ»\n#تسبيح #أذكار #سبحة_نور_الإسلام`;

  const handleCopyText = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    triggerNotification('تم نسخ نص الإنجاز جاهزاً للمشاركة ✨');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'إنجاز تسبيح اليوم - سبحة نور الإسلام',
          text: shareText,
        });
      } catch {
        handleCopyText();
      }
    } else {
      handleCopyText();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white dark:bg-[#0c1220] rounded-3xl border border-amber-500/40 p-6 space-y-4 shadow-2xl relative select-none">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 flex items-center justify-center font-bold text-sm"
        >
          ✕
        </button>

        <h3 className="text-center font-bold text-lg text-stone-900 dark:text-stone-100">
          بطاقة إنجاز وثواب اليوم 📿
        </h3>

        {/* Visual Shareable Badge Preview */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-950 via-stone-900 to-amber-950 border-2 border-amber-400/80 shadow-2xl text-center space-y-3 relative overflow-hidden">
          {/* Subtle Islamic Arc background */}
          <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-amber-500/10 blur-xl" />
          <div className="absolute -bottom-12 -left-12 w-32 h-32 rounded-full bg-emerald-500/10 blur-xl" />

          {/* Logo & Title */}
          <div className="flex items-center justify-center gap-2">
            <img 
              src="/subha_icon.jpg" 
              alt="سبحة نور الإسلام" 
              className="w-10 h-10 rounded-2xl border border-amber-400 object-cover shadow-md"
            />
            <div className="text-right">
              <h4 className="font-bold text-sm text-stone-100 leading-tight">سبحة نور الإسلام</h4>
              <p className="text-[10px] text-amber-400 font-medium">بطاقة الأجر اليومية</p>
            </div>
          </div>

          <div className="py-2 border-y border-amber-500/20">
            <span className="text-xs text-stone-300 font-bold block mb-1">
              مجموع تسبيحات وذكر اليوم
            </span>
            <div className="text-4xl font-black font-mono text-amber-400">
              {totalToday.toLocaleString('ar-EG')}
            </div>
            <span className="text-[11px] text-emerald-400 font-bold">تسبيحة وتهليلة واستغفار</span>
          </div>

          {/* Sub Stats Grid */}
          <div className="grid grid-cols-2 gap-2 text-center text-xs">
            <div className="p-2 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[10px] text-stone-400 block">الدورات المكتملة</span>
              <span className="font-bold text-amber-300 font-mono text-sm">{roundsCompleted}</span>
            </div>
            <div className="p-2 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[10px] text-stone-400 block">المواظبة</span>
              <span className="font-bold text-rose-400 font-mono text-sm">{streakDays} أيام</span>
            </div>
          </div>

          {/* Ayah or Hadith Footer */}
          <p className="text-[11px] font-serif text-stone-300 italic pt-1">
            «أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ»
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={handleNativeShare}
            className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-stone-950 font-bold text-xs shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
          >
            <Share2 size={16} />
            <span>مشاركة فورية</span>
          </button>
          <button
            onClick={handleCopyText}
            className="px-4 py-3 rounded-2xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
          >
            {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
            <span>{copied ? 'تم النسخ' : 'نسخ'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
