import React, { useState } from 'react';
import { Share2, Sparkles, X, Heart, RotateCcw, MessageSquare, ExternalLink, HelpCircle, Download, FolderArchive, Loader2 } from 'lucide-react';
import { IslamicQuote } from '../data/islamicQuotes';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  triggerNotification: (msg: string) => void;
  currentQuote?: IslamicQuote;
  onRefreshQuote?: () => void;
  onOpenWelcome?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  triggerNotification,
  currentQuote,
  onRefreshQuote,
  onOpenWelcome,
}) => {
  if (!isOpen) return null;

  const [isExportingZip, setIsExportingZip] = useState(false);

  const handleDownloadZip = async () => {
    try {
      setIsExportingZip(true);
      triggerNotification('جاري تجهيز وضغط ملفات المشروع بصيغة ZIP... 📦');
      
      const response = await fetch('/api/export-zip');
      if (!response.ok) {
        throw new Error('فشل في تصدير ملفات المشروع');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Subha_Nour_Al_Islam_Source_Code.zip';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      triggerNotification('تم تنزيل ملف ZIP بنجاح! 🎉📦');
    } catch (err) {
      console.error(err);
      triggerNotification('تعذر التنزيل، يرجى المحاولة مرة أخرى.');
    } finally {
      setIsExportingZip(false);
    }
  };

  const handleShareApp = async () => {
    const shareData = {
      title: 'تطبيق سبحة نور الإسلام',
      text: 'تطبيق مسبحة نور الإسلام - صدقة جارية عن لؤي بن حسين وعن والده رحمه الله وغفر له، أنصحكم باستخدامه والتسبيح به:',
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // Fallback or user cancelled
      }
    } else {
      navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
      triggerNotification('تم نسخ رابط التطبيق بنجاح! 📋✨');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 font-sans select-none animate-in fade-in duration-200" dir="rtl">
      
      {/* الحاوية الأساسية للنافذة */}
      <div className="bg-[#0f1624] border border-[#212e45] w-full max-w-md rounded-3xl overflow-hidden shadow-2xl relative text-right max-h-[90vh] flex flex-col">
        
        {/* شريط العنوان العلوي */}
        <div className="bg-[#0b5c33] px-6 py-4 flex items-center justify-between shrink-0">
          {/* زر إغلاق النافذة (X) */}
          <button 
            onClick={onClose}
            className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors cursor-pointer"
            title="إغلاق النافذة"
          >
            <X className="h-5 w-5" />
          </button>
          
          {/* عنوان النافذة مع الأيقونة */}
          <div className="flex items-center gap-2 text-white font-bold text-base sm:text-lg">
            <span>إعدادات ومعلومات التطبيق</span>
            <span className="text-amber-400">✨</span>
          </div>
        </div>

        {/* محتوى النافذة القابل للتمرير */}
        <div className="p-5 sm:p-6 flex flex-col items-center text-center overflow-y-auto space-y-4">
          
          {/* شعار وأفتار التطبيق الفاخر */}
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden shadow-xl border-2 border-amber-400/80 ring-4 ring-emerald-500/20 mb-0.5">
            <img
              src="/subha_icon.jpg"
              alt="شعار سبحة نور الإسلام"
              className="w-full h-full object-cover"
            />
          </div>

          {/* شارة صدقة جارية */}
          <span className="bg-[#0b5c33]/30 text-[#22c55e] text-xs font-bold px-4 py-1.5 rounded-full border border-[#0b5c33]/50 flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 fill-current text-emerald-400" />
            <span>صدقة جارية</span>
          </span>

          {/* اسم التطبيق */}
          <h2 className="text-2xl font-black text-[#22c55e] font-serif">سبحة نور الإسلام</h2>

          {/* النص الخيري والتوضيحي */}
          <p className="text-gray-300 text-xs sm:text-sm leading-relaxed px-2 font-medium">
            صدقة جارية بإذن الله عن <strong className="text-white">لؤي بن حسين</strong> وعن <strong className="text-white">والده رحمه الله وغفر له</strong> ولجميع المسلمين والمسلمات الأحياء منهم والأموات.
          </p>

          {/* زر عرض الرسالة الترحيبية والتعريفية */}
          {onOpenWelcome && (
            <button
              onClick={() => {
                onClose();
                onOpenWelcome();
              }}
              className="w-full py-2.5 px-4 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-400 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <HelpCircle size={15} />
              <span>عرض الرسالة الترحيبية ودليل الاستخدام 📖</span>
            </button>
          )}

          {/* بطاقة الآية الكريمة / الحديث النبوي الشريف داخل الإعدادات */}
          {currentQuote && (
            <div className="w-full p-4 rounded-2xl bg-[#090f1a] border border-amber-500/30 text-center relative group">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-amber-400/90 flex items-center gap-1">
                  <Sparkles size={12} className="text-amber-400" />
                  <span>آية وحديث اليوم</span>
                </span>
                {onRefreshQuote && (
                  <button
                    onClick={() => {
                      onRefreshQuote();
                      triggerNotification('تم تحديث الآية / الحديث ✨');
                    }}
                    className="p-1.5 rounded-xl bg-stone-800/90 hover:bg-stone-700 text-stone-400 hover:text-amber-400 transition-colors text-[10px] flex items-center gap-1 cursor-pointer"
                    title="تغيير الآية / الحديث"
                  >
                    <RotateCcw size={11} />
                    <span>تغيير</span>
                  </button>
                )}
              </div>
              <p className="font-serif font-bold text-stone-100 text-sm sm:text-base leading-relaxed">
                «{currentQuote.text.replace(/^[«"]|[»"]$/g, '')}»
              </p>
              <p className="text-[11px] text-amber-400/90 font-medium mt-2">
                — {currentQuote.source}
              </p>
            </div>
          )}

          {/* قسم خاص: عن التطبيق والتواصل */}
          <div className="w-full p-4 rounded-2xl bg-[#121c2e] border border-[#223554] text-right space-y-3">
            <div className="flex items-center justify-between border-b border-gray-700/60 pb-2">
              <h3 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <MessageSquare size={14} />
                <span>عن التطبيق والتواصل</span>
              </h3>
              <span className="text-[10px] text-gray-400 font-mono">v1.2</span>
            </div>

            {/* معلومات المطور */}
            <div className="flex items-center justify-between text-xs text-gray-300">
              <span className="text-gray-400">مطور التطبيق:</span>
              <span className="text-amber-400 font-bold">لؤي بن حسين</span>
            </div>

            {/* أزرار المشاركة والتواصل والتحميل المدمجة معاً */}
            <div className="space-y-2.5 pt-1">
              {/* زر تحميل المشروع بالكامل بصيغة ZIP */}
              <button 
                onClick={handleDownloadZip}
                disabled={isExportingZip}
                className="w-full bg-gradient-to-r from-emerald-700 to-emerald-600 hover:from-emerald-600 hover:to-emerald-500 disabled:opacity-60 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all border border-emerald-500/40 shadow-lg shadow-emerald-950/30 active:scale-98 cursor-pointer text-xs sm:text-sm"
                title="تنزيل جميع ملفات المشروع والأكواد في ملف مضغوط"
              >
                {isExportingZip ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-emerald-200" />
                    <span>جاري ضغط الملفات وتحميل الـ ZIP...</span>
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 text-emerald-200" />
                    <span>تحميل كود المشروع بالكامل (ملف ZIP) 📦</span>
                  </>
                )}
              </button>

              {/* زر مشاركة التطبيق */}
              <button 
                onClick={handleShareApp} 
                className="w-full bg-[#1b2537] hover:bg-[#233148] text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all border border-gray-700/80 shadow-md active:scale-98 cursor-pointer text-xs sm:text-sm"
              >
                <Share2 className="h-4 w-4 text-amber-400" />
                <span>مشاركة التطبيق مع الأصدقاء</span>
              </button>

              {/* زر تابعني على سناب شات */}
              <a 
                href="https://snapchat.com/t/0TR6EleV" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-gray-950 font-black py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20 active:scale-98 cursor-pointer text-xs sm:text-sm"
              >
                <span>تابعني على سناب شات</span>
                <span className="text-lg">👻</span>
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
