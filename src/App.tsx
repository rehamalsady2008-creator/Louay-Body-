import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  RotateCcw, Volume2, VolumeX, Smartphone, Moon, Sun, 
  Plus, Check, ChevronDown, Sparkles, Settings, 
  BarChart3, Droplets, Disc, HelpCircle
} from 'lucide-react';
import { StatsView } from './components/StatsView';
import { ShareCardModal } from './components/ShareCardModal';
import { SettingsModal } from './components/SettingsModal';
import { CelebrationConfetti } from './components/CelebrationConfetti';
import { SplashScreen } from './components/SplashScreen';
import { WelcomeModal } from './components/WelcomeModal';
import { ISLAMIC_QUOTES } from './data/islamicQuotes';
import { playBeadSound, playCompletionChime, triggerHapticFeedback, CustomSoundMode } from './utils/audio';

interface DhikrPreset {
  id: string;
  text: string;
  transliteration?: string;
  target: number;
  virtue?: string;
}

const DEFAULT_PRESETS: DhikrPreset[] = [
  { id: '1', text: 'سُبْحَانَ اللَّهِ', target: 33, virtue: 'غراس الجنة وتمحو الخطايا' },
  { id: '2', text: 'الْحَمْدُ لِلَّهِ', target: 33, virtue: 'تملأ الميزان' },
  { id: '3', text: 'اللَّهُ أَكْبَرُ', target: 34, virtue: 'أحب الكلام إلى الله' },
  { id: '4', text: 'لَا إِلَهَ إِلَّا اللَّهُ', target: 100, virtue: 'أفضل الذكر وخير ما قال النبيون' },
  { id: '5', text: 'أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ', target: 100, virtue: 'مغفرة للذنوب وتفريج للهموم' },
  { id: '6', text: 'اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ', target: 10, virtue: 'من صلى عليّ صلاة صلى الله عليه بها عشراً' },
  { id: '7', text: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ', target: 33, virtue: 'كنز من كنوز الجنة' },
  { id: '8', text: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ ، سُبْحَانَ اللَّهِ الْعَظِيمِ', target: 100, virtue: 'كلمتان خفيفتان على اللسان ثقيلتان في الميزان' },
];

export default function App() {
  // Splash screen state (يظهر شاشة البداية الأنيقة بهوية التطبيق)
  const [showSplash, setShowSplash] = useState(true);

  // Welcome modal state (رسالة ترحيبية راقية)
  const [showWelcomeModal, setShowWelcomeModal] = useState<boolean>(() => {
    const dismissed = localStorage.getItem('subha_welcome_dismissed');
    return !dismissed;
  });

  // Navigation Tabs: 'tasbeeh' | 'stats'
  const [activeTab, setActiveTab] = useState<'tasbeeh' | 'stats'>('tasbeeh');

  // Theme & Sound & Vibration Settings
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('subha_theme');
    return saved ? saved === 'dark' : true;
  });

  const [soundMode, setSoundMode] = useState<CustomSoundMode>(() => {
    const saved = localStorage.getItem('subha_sound_mode');
    return (saved as CustomSoundMode) || 'wood';
  });

  const [vibrationEnabled, setVibrationEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('subha_vibration');
    return saved ? saved === 'true' : true;
  });

  // Dhikr State
  const [presets, setPresets] = useState<DhikrPreset[]>(() => {
    const saved = localStorage.getItem('subha_custom_presets');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_PRESETS;
      }
    }
    return DEFAULT_PRESETS;
  });

  const [selectedDhikr, setSelectedDhikr] = useState<DhikrPreset>(presets[0]);
  const [count, setCount] = useState<number>(0);
  const [target, setTarget] = useState<number>(presets[0].target);
  const [roundsCompleted, setRoundsCompleted] = useState<number>(0);
  
  // Daily Stats & History
  const [totalToday, setTotalToday] = useState<number>(() => {
    const saved = localStorage.getItem('subha_today_total');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [dailyHistory, setDailyHistory] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('subha_daily_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return {};
      }
    }
    return {};
  });

  const [streakDays, setStreakDays] = useState<number>(() => {
    const saved = localStorage.getItem('subha_streak_days');
    return saved ? parseInt(saved, 10) : 1;
  });

  // UI Modals / Notifications
  const [showPresetsMenu, setShowPresetsMenu] = useState(false);
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showSoundMenu, setShowSoundMenu] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const [newDhikrText, setNewDhikrText] = useState('');
  const [newDhikrTarget, setNewDhikrTarget] = useState(33);
  const [notification, setNotification] = useState<string | null>(null);
  const [isPressed, setIsPressed] = useState(false);

  // Rotating Daily Ayah / Hadith Quote
  const [quoteIndex, setQuoteIndex] = useState(() => Math.floor(Math.random() * ISLAMIC_QUOTES.length));

  const currentQuote = ISLAMIC_QUOTES[quoteIndex] || ISLAMIC_QUOTES[0];

  const handleRefreshQuote = useCallback(() => {
    setQuoteIndex((prev) => (prev + 1) % ISLAMIC_QUOTES.length);
  }, []);

  const showNotificationMessage = useCallback((msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((curr) => (curr === msg ? null : curr));
    }, 2500);
  }, []);

  // Persist Settings
  useEffect(() => {
    localStorage.setItem('subha_theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('subha_sound_mode', soundMode);
  }, [soundMode]);

  useEffect(() => {
    localStorage.setItem('subha_vibration', String(vibrationEnabled));
  }, [vibrationEnabled]);

  useEffect(() => {
    localStorage.setItem('subha_today_total', String(totalToday));
    const todayKey = new Date().toISOString().split('T')[0];
    setDailyHistory((prev) => {
      const updated = { ...prev, [todayKey]: totalToday };
      localStorage.setItem('subha_daily_history', JSON.stringify(updated));
      return updated;
    });
  }, [totalToday]);

  useEffect(() => {
    localStorage.setItem('subha_streak_days', String(streakDays));
  }, [streakDays]);

  // قفل مؤقت لمنع التكرار السريع جداً في أجزاء من الثانية (Debounce Lock)
  const isProcessingRef = useRef(false);

  // دالة الضغط على زر التسبيح (تضمن زيادة العداد بمقدار 1 حصراً ودون أي تضاعف)
  const handleTasbihClick = useCallback(() => {
    // إذا كانت العملية قيد التنفيذ، تجاهل الضغطة المتداخلة لمنع الدبل
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;

    // فتح قفل الضغط بعد 80 جزء من الثانية بلطف
    setTimeout(() => {
      isProcessingRef.current = false;
    }, 80);

    // تشغيل الصوت والاهتزاز
    playBeadSound(soundMode);
    triggerHapticFeedback(vibrationEnabled ? 25 : 0);

    // زيادة العداد بمقدار 1 حصراً ودون أي تضاعف
    setCount((prevCount) => {
      const nextCount = prevCount + 1;

      // التحقق من اكتمال الهدف المحدد
      if (target > 0 && nextCount >= target) {
        triggerHapticFeedback(vibrationEnabled ? [50, 40, 70, 40, 100] : 0);
        playCompletionChime();
        setShowConfetti(true);
        setRoundsCompleted((r) => r + 1);
        showNotificationMessage(`ما شاء الله! أتممت الورد (${target}) 🎉✨`);
        return 0; // إعادة التصفير للدورة الجديدة
      }

      return nextCount;
    });

    // زيادة إجمالي تسبيحات اليوم بمقدار 1 حصراً
    setTotalToday((prevTotal) => prevTotal + 1);

  }, [soundMode, vibrationEnabled, target, showNotificationMessage]);

  // Reset Counter
  const handleReset = () => {
    setCount(0);
    triggerHapticFeedback(vibrationEnabled ? 40 : 0);
    showNotificationMessage('تمت إعادة ضبط العداد');
  };

  // Select Preset Dhikr
  const handleSelectPreset = (preset: DhikrPreset) => {
    setSelectedDhikr(preset);
    setTarget(preset.target);
    setCount(0);
    setShowPresetsMenu(false);
    showNotificationMessage(`تم اختيار: ${preset.text}`);
  };

  // Add Custom Dhikr
  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDhikrText.trim()) return;

    const newPreset: DhikrPreset = {
      id: `custom_${Date.now()}`,
      text: newDhikrText.trim(),
      target: Number(newDhikrTarget) || 33,
    };

    const updated = [...presets, newPreset];
    setPresets(updated);
    localStorage.setItem('subha_custom_presets', JSON.stringify(updated));
    setSelectedDhikr(newPreset);
    setTarget(newPreset.target);
    setCount(0);
    setNewDhikrText('');
    setShowAddCustom(false);
    setShowPresetsMenu(false);
    showNotificationMessage('تمت إضافة الذكر بنجاح ✨');
  };

  // Progress Calculation
  const progressPercent = target > 0 ? Math.min(100, Math.round((count / target) * 100)) : 100;
  const strokeDashoffset = 565.48 - (565.48 * progressPercent) / 100;

  return (
    <div 
      className={`min-h-screen ${isDarkMode ? 'bg-[#090d16] text-stone-100' : 'bg-stone-100 text-stone-900'} font-sans select-none flex flex-col justify-between transition-colors duration-300 overflow-x-hidden`}
      dir="rtl"
    >
      {/* 0. شاشة الترحيب والبداية بشعار وأفتار التطبيق الفاخر */}
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}

      {/* Confetti Particle Shower on Target Completion */}
      <CelebrationConfetti 
        active={showConfetti} 
        onComplete={() => setShowConfetti(false)} 
      />

      {/* 1. Floating Banner Notification */}
      {notification && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 px-5 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 text-xs sm:text-sm font-bold border border-amber-300/40 animate-in fade-in slide-in-from-top-3 duration-200">
          <Sparkles size={16} className="shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* 2. Header with App Avatar & Controls */}
      <header className="w-full bg-[#0e1624] px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between border-b border-gray-800 font-sans sticky top-0 z-30 shadow-sm">
        
        {/* 1. الجهة اليمنى: صورة التطبيق أولاً وبجانبها الاسم والعبارة مع إزاحة متناسقة لليسار */}
        <div className="flex items-center gap-3.5 sm:gap-4 text-right shrink-0">
          
          {/* صورة الـ Avatar الخاصة بالتطبيق مع النقطة الخضراء */}
          <button
            onClick={() => setShowAvatarModal(true)}
            className="relative flex-shrink-0 cursor-pointer focus:outline-none"
            title="عرض شعار وهوية السبحة"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl p-0.5 bg-gradient-to-tr from-amber-500 to-amber-300 shadow-md hover:scale-105 transition-all">
              <img
                src="/subha_icon.jpg"
                alt="سبحة نور الإسلام"
                className="w-full h-full object-cover rounded-2xl bg-[#0b1320]"
              />
            </div>
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#0e1624] rounded-full"></span>
          </button>

          {/* النصوص: الاسم في سطر واحد والعبارة تحته بمسافة متناسقة ومريحة */}
          <div className="pr-0.5">
            <h1 className="text-white font-bold text-sm sm:text-base whitespace-nowrap leading-tight">
              سبحة نور الإسلام
            </h1>
            <p className="text-emerald-400 text-[11px] sm:text-xs font-medium mt-0.5 whitespace-nowrap">
              مسبحة إلكترونية مباركة
            </p>
          </div>

        </div>

        {/* 2. الجهة اليسرى: أفتارات الأيقونات المرتبة والمخصصة */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          
          {/* 1. أفتار المساعدة ودليل الاستخدام */}
          <button
            onClick={() => setShowWelcomeModal(true)}
            title="المساعدة ودليل الاستخدام"
            className="w-10 h-10 rounded-2xl bg-gradient-to-b from-[#182740] to-[#0e1726] hover:from-[#213554] hover:to-[#121f33] border border-amber-500/30 hover:border-amber-400/60 p-0.5 flex items-center justify-center text-amber-400 shadow-md shadow-black/30 hover:scale-105 active:scale-95 transition-all cursor-pointer group"
          >
            <div className="w-full h-full rounded-[14px] flex items-center justify-center bg-[#131f33]/60 group-hover:bg-[#131f33]/30 transition-colors">
              <HelpCircle className="h-5 w-5 drop-shadow-[0_0_6px_rgba(245,158,11,0.4)] group-hover:scale-110 transition-transform" />
            </div>
          </button>

          {/* 2. أفتار الإعدادات (أخضر زمردي ملكي مميز) */}
          <button
            onClick={() => setShowSettingsModal(true)}
            title="إعدادات التطبيق"
            className="w-10 h-10 rounded-2xl bg-gradient-to-b from-[#0e4f2c] to-[#062a17] hover:from-[#13683a] hover:to-[#093a20] border border-emerald-500/50 hover:border-emerald-400 p-0.5 flex items-center justify-center text-emerald-300 shadow-md shadow-emerald-950/40 hover:scale-105 active:scale-95 transition-all cursor-pointer group"
          >
            <div className="w-full h-full rounded-[14px] flex items-center justify-center bg-[#07331c]/50 group-hover:bg-[#07331c]/20 transition-colors">
              <Settings className="h-5 w-5 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)] group-hover:rotate-45 transition-transform duration-300" />
            </div>
          </button>

          {/* 3. أفتار أصوات المسبحة */}
          <div className="relative">
            <button
              onClick={() => setShowSoundMenu(!showSoundMenu)}
              title="أصوات المسبحة"
              className={`w-10 h-10 rounded-2xl p-0.5 flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer group ${
                soundMode !== 'silent'
                  ? 'bg-gradient-to-b from-[#243552] to-[#121c2d] border border-amber-500/40 hover:border-amber-400 text-amber-400 shadow-black/30'
                  : 'bg-gradient-to-b from-[#192231] to-[#0f1520] border border-gray-700/60 text-gray-400'
              }`}
            >
              <div className="w-full h-full rounded-[14px] flex items-center justify-center bg-[#131f33]/60 group-hover:bg-[#131f33]/30 transition-colors relative">
                {soundMode === 'silent' ? (
                  <VolumeX className="h-5 w-5 text-gray-400" />
                ) : soundMode === 'water' ? (
                  <Droplets className="h-5 w-5 text-cyan-400 drop-shadow-[0_0_6px_rgba(34,211,238,0.5)]" />
                ) : soundMode === 'wood' ? (
                  <Disc className="h-5 w-5 text-amber-300 drop-shadow-[0_0_6px_rgba(252,211,77,0.5)]" />
                ) : (
                  <Volume2 className="h-5 w-5 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.5)]" />
                )}
                {soundMode !== 'silent' && (
                  <span className="absolute top-1 left-1 w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping opacity-75" />
                )}
              </div>
            </button>

            {/* قائمة تخصيص الصوت */}
            {showSoundMenu && (
              <div className="absolute left-0 mt-2 w-48 bg-[#0c1422]/95 backdrop-blur-xl rounded-2xl border border-gray-700/80 shadow-2xl p-1.5 space-y-1 z-50 text-right animate-in fade-in duration-150">
                <div className="px-3 py-1.5 text-[11px] font-bold text-gray-400 border-b border-gray-800 flex items-center justify-between">
                  <span>نوع صوت التسبيح</span>
                  <Sparkles size={12} className="text-amber-400" />
                </div>
                {[
                  { mode: 'wood', label: 'نقرة خشبية تقليدية', icon: '🪵' },
                  { mode: 'water', label: 'قطرات ماء هادئة', icon: '💧' },
                  { mode: 'crystal', label: 'رنين بلوري ناعم', icon: '✨' },
                  { mode: 'tick', label: 'تكة إلكترونية خفيفة', icon: '⏱️' },
                  { mode: 'silent', label: 'صامت (بدون صوت)', icon: '🔇' },
                ].map((item) => (
                  <button
                    key={item.mode}
                    onClick={() => {
                      setSoundMode(item.mode as CustomSoundMode);
                      playBeadSound(item.mode as CustomSoundMode);
                      setShowSoundMenu(false);
                      showNotificationMessage(`تم اختيار: ${item.label}`);
                    }}
                    className={`w-full px-3 py-2 rounded-xl text-xs flex items-center justify-between text-right transition-colors cursor-pointer ${
                      soundMode === item.mode
                        ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                        : 'text-gray-300 hover:bg-gray-800/80'
                    }`}
                  >
                    <span>{item.icon} {item.label}</span>
                    {soundMode === item.mode && <Check size={14} className="text-amber-500" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 4. أفتار الاهتزاز / عدم الاهتزاز */}
          <button
            onClick={() => {
              setVibrationEnabled(!vibrationEnabled);
              showNotificationMessage(!vibrationEnabled ? 'تم تفعيل الاهتزاز 📳' : 'تم إيقاف الاهتزاز 📴');
            }}
            title={vibrationEnabled ? "الاهتزاز مفعل (اضغط للإيقاف)" : "الاهتزاز متوقف (اضغط للتفعيل)"}
            className={`w-10 h-10 rounded-2xl p-0.5 flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer group ${
              vibrationEnabled
                ? 'bg-gradient-to-b from-[#243552] to-[#121c2d] border border-amber-500/40 hover:border-amber-400 text-amber-400'
                : 'bg-gradient-to-b from-[#1c222e] to-[#111620] border border-gray-700/60 hover:border-gray-600 text-gray-400'
            }`}
          >
            <div className="w-full h-full rounded-[14px] flex items-center justify-center bg-[#131f33]/60 group-hover:bg-[#131f33]/30 transition-colors relative">
              <Smartphone className={`h-5 w-5 transition-transform ${vibrationEnabled ? 'text-amber-400 drop-shadow-[0_0_6px_rgba(245,158,11,0.5)] group-hover:scale-110' : 'text-gray-400'}`} />
              {!vibrationEnabled && (
                <span className="absolute w-5 h-0.5 bg-red-400/90 rotate-45 rounded-full shadow-sm" />
              )}
            </div>
          </button>

          {/* 5. أفتار الوضع الليلي والنهاري */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            title={isDarkMode ? "تفعيل الوضع النهاري" : "تفعيل الوضع الليلي"}
            className="w-10 h-10 rounded-2xl bg-gradient-to-b from-[#1b2a44] to-[#0e1726] hover:from-[#24385a] hover:to-[#142034] border border-amber-500/30 hover:border-amber-400/60 p-0.5 flex items-center justify-center text-amber-400 shadow-md shadow-black/30 hover:scale-105 active:scale-95 transition-all cursor-pointer group"
          >
            <div className="w-full h-full rounded-[14px] flex items-center justify-center bg-[#131f33]/60 group-hover:bg-[#131f33]/30 transition-colors">
              {isDarkMode ? (
                <Sun className="h-5 w-5 text-amber-300 drop-shadow-[0_0_8px_rgba(252,211,77,0.6)] group-hover:rotate-90 transition-transform duration-500" />
              ) : (
                <Moon className="h-5 w-5 text-amber-400 drop-shadow-[0_0_6px_rgba(245,158,11,0.5)] group-hover:-rotate-12 transition-transform duration-300" />
              )}
            </div>
          </button>

        </div>
      </header>

      {/* 3. Navigation View Switcher (Tasbeeh & Stats) */}
      <div className="px-4 pt-3 max-w-md mx-auto w-full">
        <div className="bg-white/80 dark:bg-stone-900/80 backdrop-blur-md p-1 rounded-2xl border border-stone-200 dark:border-stone-800 flex shadow-sm">
          <button
            onClick={() => setActiveTab('tasbeeh')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'tasbeeh'
                ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                : 'text-stone-600 dark:text-stone-400 hover:text-amber-500'
            }`}
          >
            <span>📿</span>
            <span>السبحة الإلكترونية</span>
          </button>

          <button
            onClick={() => setActiveTab('stats')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'stats'
                ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                : 'text-stone-600 dark:text-stone-400 hover:text-amber-500'
            }`}
          >
            <BarChart3 size={14} />
            <span>سجل الورد والإحصائيات</span>
          </button>
        </div>
      </div>

      {/* 4. Active Tab Content Canvas */}
      <main className="flex-1 flex flex-col items-center justify-start p-4 max-w-md mx-auto w-full">
        
        {/* TAB 1: Smart Tasbeeh Counter */}
        {activeTab === 'tasbeeh' && (
          <div className="w-full space-y-5 flex flex-col items-center animate-in fade-in duration-300">
            {/* Selected Dhikr Selector Card */}
            <div className="w-full">
              <button
                onClick={() => setShowPresetsMenu(true)}
                className="w-full p-4 rounded-3xl bg-white dark:bg-stone-900/90 border border-stone-200 dark:border-stone-800 shadow-lg hover:border-amber-500/40 transition-all flex items-center justify-between text-right group cursor-pointer"
              >
                <div className="flex-1">
                  <span className="text-[11px] text-amber-600 dark:text-amber-400 font-bold block mb-0.5">
                    الذكر المختار • الهدف: {target > 0 ? target : 'مفتوح'}
                  </span>
                  <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 font-serif leading-relaxed">
                    {selectedDhikr.text}
                  </h2>
                  {selectedDhikr.virtue && (
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 flex items-center gap-1">
                      <Sparkles size={12} className="text-amber-500 shrink-0" />
                      <span>{selectedDhikr.virtue}</span>
                    </p>
                  )}
                </div>
                <div className="p-2 rounded-2xl bg-stone-100 dark:bg-stone-800 text-stone-500 group-hover:text-amber-500 transition-colors mr-2">
                  <ChevronDown size={18} />
                </div>
              </button>
            </div>

            {/* Big Circular Tactile Tasbeeh Button */}
            <div className="relative flex items-center justify-center my-2">
              {/* Circular Progress Ring */}
              <svg className="w-64 h-64 sm:w-72 sm:h-72 -rotate-90 transform" viewBox="0 0 200 200">
                {/* Background Track */}
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  className="text-stone-200 dark:text-stone-800/80 stroke-current"
                  strokeWidth="6"
                  fill="transparent"
                />
                {/* Active Progress */}
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  className="text-amber-500 stroke-current transition-all duration-150 ease-out"
                  strokeWidth="6"
                  strokeDasharray="565.48"
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>

              {/* Center Touch Button */}
              <button
                id="tasbih-button"
                type="button"
                onClick={handleTasbihClick}
                onMouseDown={() => setIsPressed(true)}
                onMouseUp={() => setIsPressed(false)}
                onMouseLeave={() => setIsPressed(false)}
                onTouchStart={() => setIsPressed(true)}
                onTouchEnd={() => setIsPressed(false)}
                onTouchCancel={() => setIsPressed(false)}
                className={`absolute w-52 h-52 sm:w-56 sm:h-56 rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 dark:from-amber-500 dark:via-amber-600 dark:to-amber-700 text-stone-950 flex flex-col items-center justify-center shadow-2xl shadow-amber-500/30 border-4 border-amber-200 dark:border-amber-400/40 transition-all duration-100 cursor-pointer select-none touch-manipulation active:scale-95 active:brightness-90 active:ring-8 active:ring-amber-400/30 ${
                  isPressed ? 'scale-95 brightness-90 ring-8 ring-amber-400/30' : 'scale-100 hover:scale-[1.02]'
                }`}
              >
                <span id="tasbih-counter" className="text-5xl sm:text-6xl font-black font-mono tracking-tight leading-none">
                  {count}
                </span>
                <span className="text-xs sm:text-sm font-bold text-stone-950/80 mt-2">
                  اضغط للتسبيح
                </span>
                {target > 0 && (
                  <span className="text-[10px] bg-stone-950/20 text-stone-950 font-bold px-2 py-0.5 rounded-full mt-1">
                    {count} / {target}
                  </span>
                )}
              </button>
            </div>

            {/* Target Buttons & Reset Controls */}
            <div className="w-full flex items-center justify-between gap-2 px-1">
              {/* Target Quick Selectors */}
              <div className="flex items-center gap-1.5 bg-white dark:bg-stone-900 p-1 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm">
                {[33, 99, 100, 0].map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setTarget(t);
                      setCount(0);
                      showNotificationMessage(`الهدف: ${t === 0 ? 'مفتوح' : t}`);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      target === t
                        ? 'bg-amber-500 text-stone-950 shadow-sm'
                        : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
                    }`}
                  >
                    {t === 0 ? 'مفتوح' : t}
                  </button>
                ))}
              </div>

              {/* Reset Button */}
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:text-red-500 hover:border-red-500/40 text-xs font-bold shadow-sm active:scale-95 transition-all cursor-pointer"
                title="إعادة ضبط العداد"
              >
                <RotateCcw size={14} />
                <span>تصفير</span>
              </button>
            </div>

            {/* Stats Strip: Rounds & Total */}
            <div className="w-full grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-white dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 text-center shadow-sm">
                <span className="text-[11px] text-stone-500 dark:text-stone-400 block mb-0.5">
                  الدورات المكتملة
                </span>
                <span className="text-lg font-bold text-amber-600 dark:text-amber-400 font-mono">
                  {roundsCompleted}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 text-center shadow-sm">
                <span className="text-[11px] text-stone-500 dark:text-stone-400 block mb-0.5">
                  إجمالي تسبيحات اليوم
                </span>
                <span id="total-today" className="text-lg font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                  {totalToday}
                </span>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: Daily Streak & Weekly Stats & Share Card */}
        {activeTab === 'stats' && (
          <StatsView
            totalToday={totalToday}
            roundsCompleted={roundsCompleted}
            streakDays={streakDays}
            dailyHistory={dailyHistory}
            onShareBadge={() => setShowShareModal(true)}
            triggerNotification={showNotificationMessage}
          />
        )}

      </main>

      {/* 5. Presets Drawer / Modal */}
      {showPresetsMenu && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-stone-900 rounded-t-3xl sm:rounded-3xl border border-stone-200 dark:border-stone-800 p-5 space-y-4 max-h-[85vh] flex flex-col shadow-2xl">
            
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <img src="/subha_icon.jpg" alt="أذكار" className="w-7 h-7 rounded-lg object-cover border border-amber-500/40" />
                <h3 className="font-bold text-stone-900 dark:text-stone-100 text-base">
                  قائمة الأذكار والتسبيحات
                </h3>
              </div>
              <button
                onClick={() => setShowPresetsMenu(false)}
                className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Presets List */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
              {presets.map((item) => {
                const isSelected = selectedDhikr.id === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectPreset(item)}
                    className={`w-full p-3.5 rounded-2xl text-right transition-all flex items-center justify-between border cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500 text-amber-700 dark:text-amber-300 font-bold shadow-sm'
                        : 'bg-stone-50 dark:bg-stone-800/60 border-stone-200 dark:border-stone-700/60 text-stone-800 dark:text-stone-200 hover:border-amber-400'
                    }`}
                  >
                    <div>
                      <p className="text-sm font-serif">{item.text}</p>
                      {item.virtue && (
                        <p className="text-[11px] font-sans text-stone-500 dark:text-stone-400 mt-0.5">
                          {item.virtue}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0 mr-2">
                      <span className="text-xs bg-stone-200 dark:bg-stone-700 px-2 py-0.5 rounded-lg text-stone-700 dark:text-stone-300 font-mono">
                        {item.target}
                      </span>
                      {isSelected && <Check size={16} className="text-amber-500" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Add Custom Dhikr Button */}
            {!showAddCustom ? (
              <button
                onClick={() => setShowAddCustom(true)}
                className="w-full py-3 rounded-2xl bg-stone-100 dark:bg-stone-800 hover:bg-amber-500 hover:text-stone-950 text-stone-800 dark:text-stone-200 text-xs font-bold transition-all flex items-center justify-center gap-2 border border-stone-200 dark:border-stone-700 cursor-pointer"
              >
                <Plus size={16} />
                <span>إضافة ذكر مخصص</span>
              </button>
            ) : (
              <form onSubmit={handleAddCustom} className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 space-y-2.5">
                <input
                  type="text"
                  placeholder="اكتب نص الذكر (مثال: رَبِّ اغْفِرْ لِي)"
                  value={newDhikrText}
                  onChange={(e) => setNewDhikrText(e.target.value)}
                  className="w-full bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:border-amber-500"
                  required
                />
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="الهدف (مثال: 33)"
                    value={newDhikrTarget}
                    onChange={(e) => setNewDhikrTarget(Number(e.target.value))}
                    className="w-24 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:border-amber-500"
                    min={1}
                  />
                  <button
                    type="submit"
                    className="flex-1 bg-amber-500 text-stone-950 font-bold rounded-xl text-xs py-2 hover:bg-amber-400 transition cursor-pointer"
                  >
                    حفظ وإضافة
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddCustom(false)}
                    className="px-3 bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-xl text-xs cursor-pointer"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

      {/* 6. Avatar Showcase Modal */}
      {showAvatarModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white dark:bg-[#0c1220] rounded-3xl border border-amber-500/40 p-6 space-y-4 shadow-2xl relative text-center">
            <button
              onClick={() => setShowAvatarModal(false)}
              className="absolute top-4 left-4 w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 flex items-center justify-center font-bold text-sm cursor-pointer"
            >
              ✕
            </button>

            <div className="pt-2">
              <div className="relative mx-auto w-52 h-52 rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-400/80 ring-4 ring-emerald-500/20">
                <img
                  src="/subha_icon.jpg"
                  alt="شعار سبحة نور الإسلام"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100 font-serif">
                سبحة نور الإسلام
              </h3>
              <p className="text-xs text-amber-600 dark:text-amber-400 font-bold mt-1">
                الأفتار والشعار الرسمي للتطبيق 📿✨
              </p>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-2 leading-relaxed">
                «مَثَلُ الَّذِي يَذْكُرُ رَبَّهُ وَالَّذِي لا يَذْكُرُ رَبَّهُ، مَثَلُ الحَيِّ وَالمَيِّتِ»
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setShowAvatarModal(false)}
                className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
              >
                إغلاق والعودة للتسبيح
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. Settings & App Info Modal */}
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        triggerNotification={showNotificationMessage}
        currentQuote={currentQuote}
        onRefreshQuote={handleRefreshQuote}
        onOpenWelcome={() => setShowWelcomeModal(true)}
      />

      {/* 8. Welcome Greeting & Guide Modal */}
      <WelcomeModal
        isOpen={showWelcomeModal && !showSplash}
        onClose={() => setShowWelcomeModal(false)}
      />

      {/* 9. Share Achievement Card Modal */}
      <ShareCardModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        totalToday={totalToday}
        roundsCompleted={roundsCompleted}
        streakDays={streakDays}
        triggerNotification={showNotificationMessage}
      />

    </div>
  );
}
