const { useEffect, useMemo, useRef, useState } = React;

const PALETTES = {
  emerald: {
    name: "زمردي",
    root:
      "min-h-screen bg-amber-50 bg-[radial-gradient(circle_at_top_right,_#fde68a_0,_transparent_30%),radial-gradient(circle_at_bottom_left,_#bbf7d0_0,_transparent_32%)] text-stone-800 transition-colors dark:bg-slate-950 dark:bg-[radial-gradient(circle_at_top_right,_#111827_0,_transparent_34%),radial-gradient(circle_at_bottom_left,_#052e2b_0,_transparent_35%)] dark:text-slate-100",
    header:
      "mb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-3xl border border-emerald-200/70 bg-gradient-to-l from-emerald-800 via-teal-700 to-amber-600 px-6 py-5 text-white shadow-xl shadow-emerald-900/20 dark:border-emerald-400/30 dark:from-slate-900 dark:via-slate-800 dark:to-emerald-900/80",
    subtitle: "mt-1 text-sm text-emerald-50/90 font-medium",
    card: "rounded-2xl border border-amber-200/80 bg-white/90 p-5 shadow-lg backdrop-blur dark:border-slate-700 dark:bg-slate-900/80",
    input:
      "mb-3 w-full rounded-xl border border-amber-200 bg-amber-50/60 px-4 py-2.5 text-sm outline-none ring-emerald-400 transition focus:ring-2 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100",
    select:
      "w-full rounded-xl border border-amber-200 bg-amber-50/60 px-4 py-2.5 text-sm outline-none ring-emerald-400 transition focus:ring-2 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100",
    sectionTitle: "text-xl font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-2",
    surahBadge:
      "rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200",
    countBadge: "rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-900 dark:bg-slate-800 dark:text-slate-200",
    ayahCard:
      "rounded-xl border border-amber-200/90 bg-amber-50/40 p-4 shadow-sm transition hover:shadow dark:border-slate-700 dark:bg-slate-800/70",
    ayahNum:
      "mr-3 inline-flex h-8 min-w-8 items-center justify-center rounded-full bg-emerald-700 text-white font-sans text-xs font-bold dark:bg-emerald-600 dark:text-slate-950",
    chip: "border-emerald-200 bg-white/80 text-emerald-900 hover:bg-emerald-50 dark:border-slate-600 dark:bg-slate-800/80 dark:text-slate-100",
    chipActive:
      "border-emerald-700 bg-emerald-700 text-white dark:border-emerald-400 dark:bg-emerald-500 dark:text-slate-950 font-bold",
    tabActive: "bg-emerald-700 text-white shadow-md dark:bg-emerald-500 dark:text-slate-950 font-bold",
    tabInactive: "bg-white/70 text-slate-700 hover:bg-emerald-50 dark:bg-slate-800/70 dark:text-slate-300 dark:hover:bg-slate-800",
    radioCard: "rounded-xl border border-amber-200 bg-white p-4 shadow-sm transition hover:border-emerald-500 hover:shadow-md cursor-pointer dark:border-slate-700 dark:bg-slate-800/80 dark:hover:border-emerald-400",
    radioCardActive: "rounded-xl border-2 border-emerald-600 bg-emerald-50/70 p-4 shadow-md dark:border-emerald-400 dark:bg-emerald-950/40",
    playerBtn: "bg-emerald-700 hover:bg-emerald-800 text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-slate-950"
  },
  royal: {
    name: "الملكي",
    root:
      "min-h-screen bg-blue-50 bg-[radial-gradient(circle_at_top_right,_#bfdbfe_0,_transparent_30%),radial-gradient(circle_at_bottom_left,_#c4b5fd_0,_transparent_32%)] text-slate-800 transition-colors dark:bg-slate-950 dark:bg-[radial-gradient(circle_at_top_right,_#1e1b4b_0,_transparent_34%),radial-gradient(circle_at_bottom_left,_#172554_0,_transparent_35%)] dark:text-slate-100",
    header:
      "mb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-3xl border border-blue-200/70 bg-gradient-to-l from-blue-800 via-indigo-700 to-violet-600 px-6 py-5 text-white shadow-xl shadow-indigo-900/20 dark:border-indigo-400/30 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900/80",
    subtitle: "mt-1 text-sm text-blue-50/90 font-medium",
    card: "rounded-2xl border border-blue-200/80 bg-white/90 p-5 shadow-lg backdrop-blur dark:border-slate-700 dark:bg-slate-900/80",
    input:
      "mb-3 w-full rounded-xl border border-blue-200 bg-blue-50/60 px-4 py-2.5 text-sm outline-none ring-indigo-400 transition focus:ring-2 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100",
    select:
      "w-full rounded-xl border border-blue-200 bg-blue-50/60 px-4 py-2.5 text-sm outline-none ring-indigo-400 transition focus:ring-2 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100",
    sectionTitle: "text-xl font-bold text-indigo-800 dark:text-indigo-300 flex items-center gap-2",
    surahBadge:
      "rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-200",
    countBadge: "rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-900 dark:bg-slate-800 dark:text-slate-200",
    ayahCard:
      "rounded-xl border border-blue-200/90 bg-blue-50/40 p-4 shadow-sm transition hover:shadow dark:border-slate-700 dark:bg-slate-800/70",
    ayahNum:
      "mr-3 inline-flex h-8 min-w-8 items-center justify-center rounded-full bg-indigo-700 text-white font-sans text-xs font-bold dark:bg-indigo-600 dark:text-slate-950",
    chip: "border-indigo-200 bg-white/80 text-indigo-900 hover:bg-indigo-50 dark:border-slate-600 dark:bg-slate-800/80 dark:text-slate-100",
    chipActive:
      "border-indigo-700 bg-indigo-700 text-white dark:border-indigo-400 dark:bg-indigo-500 dark:text-slate-950 font-bold",
    tabActive: "bg-indigo-700 text-white shadow-md dark:bg-indigo-500 dark:text-slate-950 font-bold",
    tabInactive: "bg-white/70 text-slate-700 hover:bg-indigo-50 dark:bg-slate-800/70 dark:text-slate-300 dark:hover:bg-slate-800",
    radioCard: "rounded-xl border border-blue-200 bg-white p-4 shadow-sm transition hover:border-indigo-500 hover:shadow-md cursor-pointer dark:border-slate-700 dark:bg-slate-800/80 dark:hover:border-indigo-400",
    radioCardActive: "rounded-xl border-2 border-indigo-600 bg-indigo-50/70 p-4 shadow-md dark:border-indigo-400 dark:bg-indigo-950/40",
    playerBtn: "bg-indigo-700 hover:bg-indigo-800 text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-slate-950"
  },
  desert: {
    name: "الذهبي",
    root:
      "min-h-screen bg-orange-50 bg-[radial-gradient(circle_at_top_right,_#fdba74_0,_transparent_30%),radial-gradient(circle_at_bottom_left,_#fde68a_0,_transparent_32%)] text-stone-800 transition-colors dark:bg-stone-950 dark:bg-[radial-gradient(circle_at_top_right,_#292524_0,_transparent_34%),radial-gradient(circle_at_bottom_left,_#3f2a17_0,_transparent_35%)] dark:text-stone-100",
    header:
      "mb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-3xl border border-orange-200/70 bg-gradient-to-l from-amber-800 via-orange-700 to-rose-700 px-6 py-5 text-white shadow-xl shadow-orange-900/20 dark:border-orange-400/30 dark:from-stone-900 dark:via-stone-800 dark:to-orange-900/80",
    subtitle: "mt-1 text-sm text-orange-50/90 font-medium",
    card: "rounded-2xl border border-orange-200/80 bg-white/90 p-5 shadow-lg backdrop-blur dark:border-stone-700 dark:bg-stone-900/80",
    input:
      "mb-3 w-full rounded-xl border border-orange-200 bg-orange-50/60 px-4 py-2.5 text-sm outline-none ring-amber-400 transition focus:ring-2 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100",
    select:
      "w-full rounded-xl border border-orange-200 bg-orange-50/60 px-4 py-2.5 text-sm outline-none ring-amber-400 transition focus:ring-2 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100",
    sectionTitle: "text-xl font-bold text-amber-800 dark:text-amber-300 flex items-center gap-2",
    surahBadge:
      "rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-800 dark:bg-orange-900/60 dark:text-orange-200",
    countBadge: "rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-900 dark:bg-stone-800 dark:text-stone-200",
    ayahCard:
      "rounded-xl border border-orange-200/90 bg-orange-50/40 p-4 shadow-sm transition hover:shadow dark:border-stone-700 dark:bg-stone-800/70",
    ayahNum:
      "mr-3 inline-flex h-8 min-w-8 items-center justify-center rounded-full bg-amber-700 text-white font-sans text-xs font-bold dark:bg-amber-600 dark:text-stone-950",
    chip: "border-orange-200 bg-white/80 text-orange-900 hover:bg-orange-50 dark:border-stone-600 dark:bg-stone-800/80 dark:text-stone-100",
    chipActive:
      "border-orange-700 bg-orange-700 text-white dark:border-orange-400 dark:bg-orange-500 dark:text-stone-950 font-bold",
    tabActive: "bg-orange-700 text-white shadow-md dark:bg-orange-500 dark:text-stone-950 font-bold",
    tabInactive: "bg-white/70 text-stone-700 hover:bg-orange-50 dark:bg-stone-800/70 dark:text-stone-300 dark:hover:bg-stone-800",
    radioCard: "rounded-xl border border-orange-200 bg-white p-4 shadow-sm transition hover:border-orange-500 hover:shadow-md cursor-pointer dark:border-stone-700 dark:bg-stone-800/80 dark:hover:border-amber-400",
    radioCardActive: "rounded-xl border-2 border-amber-600 bg-amber-50/70 p-4 shadow-md dark:border-amber-400 dark:bg-amber-950/40",
    playerBtn: "bg-amber-700 hover:bg-amber-800 text-white dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-stone-950"
  }
};

const EGYPT_QURAN_RADIO = {
  id: "egypt_cairo_radio",
  name: "إذاعة القرآن الكريم المصرية من القاهرة",
  url: "https://stream.zeno.fm/f3wvbbqmdg8uv",
  backupUrl: "https://stream.zeno.fm/0r0xa792kwzuv",
  backupUrls: [
    "https://stream.zeno.fm/f3wvbbqmdg8uv",
    "https://stream.zeno.fm/0r0xa792kwzuv"
  ],
  isEgypt: true
};

const AZKAR_DATA = [
  {
    category: "أذكار الصباح",
    items: [
      {
        id: 1,
        text: "آيَةُ الْكُرْسِيِّ: (اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ...)",
        count: 1,
        reward: "من قالها حين يصبح أُجير من الجن حتى يمسي"
      },
      {
        id: 2,
        text: "قُلْ هُوَ اللَّهُ أَحَدٌ، وَقُلْ أَعُوذُ بِرَبِّ الْفَلَقِ، وَقُلْ أَعُوذُ بِرَبِّ النَّاسِ",
        count: 3,
        reward: "تكفيه من كل شيء"
      },
      {
        id: 3,
        text: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
        count: 1,
        reward: "من أذكار الصباح العظيمة"
      },
      {
        id: 4,
        text: "اللَّهُمَّ أَنْتَ رَبِّي لاَ إِلَهَ إِلاَّ أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لاَ يَغْفِرُ الذُّنُوبَ إِلاَّ أَنْتَ",
        count: 1,
        reward: "سيد الاستغفار: من قالها موقناً بها ومات دخل الجنة"
      },
      {
        id: 5,
        text: "رَضِيتُ بِاللَّهِ رَبَّاً، وَبِالإِسْلاَمِ دِينَاً، وَبِمُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ نَبِيَّاً",
        count: 3,
        reward: "كان حقاً على الله أن يرضيه يوم القيامة"
      },
      {
        id: 6,
        text: "بِسْمِ اللَّهِ الَّذِي لاَ يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الأَرْضِ وَلاَ فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
        count: 3,
        reward: "لم يضره من الله شيء"
      },
      {
        id: 7,
        text: "حَسْبِيَ اللَّهُ لاَ إِلَهَ إِلاَّ هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ",
        count: 7,
        reward: "كفاه الله ما أهمه من أمر الدنيا والآخرة"
      },
      {
        id: 8,
        text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، عَدَدَ خَلْقِهِ، وَرِضَا نَفْسِهِ، وَزِنَةَ عَرْشِهِ، وَمِدَادَ كَلِمَاتِهِ",
        count: 3,
        reward: "تعدل ساعات طويلة من الذكر"
      },
      {
        id: 9,
        text: "أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ",
        count: 100,
        reward: "محو الذنوب وانشراح الصدر"
      }
    ]
  },
  {
    category: "أذكار المساء",
    items: [
      {
        id: 10,
        text: "آيَةُ الْكُرْسِيِّ: (اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ...)",
        count: 1,
        reward: "من قالها حين يمسي أُجير من الجن حتى يصبح"
      },
      {
        id: 11,
        text: "قُلْ هُوَ اللَّهُ أَحَدٌ، وَقُلْ أَعُوذُ بِرَبِّ الْفَلَقِ، وَقُلْ أَعُوذُ بِرَبِّ النَّاسِ",
        count: 3,
        reward: "تكفيه من كل شيء"
      },
      {
        id: 12,
        text: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ",
        count: 1,
        reward: "من أذكار المساء المباركة"
      },
      {
        id: 13,
        text: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
        count: 3,
        reward: "لم تضره حمة أو يضر شيء في تلك الليلة"
      },
      {
        id: 14,
        text: "يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ، أَصْلِحْ لِي شَأْنِي كُلَّهُ، وَلاَ تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ",
        count: 1,
        reward: "صلاح الشأن كله"
      },
      {
        id: 15,
        text: "اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لاَ إِلَهَ إِلاَّ أَنْتَ",
        count: 3,
        reward: "طلب العافية والسلامة في الجسد"
      }
    ]
  },
  {
    category: "أذكار النوم والاستيقاظ",
    items: [
      {
        id: 16,
        text: "بِاسْمِكَ رَبِّي وَضَعْتُ جَنْبِي، وَبِكَ أَرْفَعُهُ، فَإِنْ أَمْسَكْتَ نَفْسِي فَارْحَمْهَا، وَإِنْ أَرْسَلْتَهَا فَاحْفَظْهَا بِمَا تَحْفَظُ بِهِ عِبَادَكَ الصَّالِحِينَ",
        count: 1,
        reward: "حفظ النفس عند النوم"
      },
      {
        id: 17,
        text: "اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ",
        count: 3,
        reward: "تقال عند وضع اليد اليمنى تحت الخد عند النوم"
      },
      {
        id: 18,
        text: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
        count: 1,
        reward: "يقال عند الاستيقاظ من النوم"
      }
    ]
  },
  {
    category: "أذكار بعد الصلاة",
    items: [
      {
        id: 19,
        text: "أَسْتَغْفِرُ اللَّهَ (3 مرات) .. اللَّهُمَّ أَنْتَ السَّلاَمُ وَمِنْكَ السَّلاَمُ، تَبَارَكْتَ يَا ذَا الْجَلاَلِ وَالإِكْرَامِ",
        count: 1,
        reward: "تقال فور التسليم من الصلاة المكتوبة"
      },
      {
        id: 20,
        text: "سُبْحَانَ اللَّهِ (33) ، الْحَمْدُ لِلَّهِ (33) ، اللَّهُ أَكْبَرُ (33)",
        count: 33,
        reward: "تمام التسبيح بعد الصلاة"
      },
      {
        id: 21,
        text: "لَا إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
        count: 1,
        reward: "تمام المائة: غُفرت خطاياه وإن كانت مثل زبد البحر"
      }
    ]
  },
  {
    category: "أدعية قرآنية وشاملة",
    items: [
      {
        id: 22,
        text: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
        count: 1,
        reward: "أجمع دعاء للخير كله في الدنيا والآخرة"
      },
      {
        id: 23,
        text: "رَبَّنَا لاَ تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِنْ لَدُنْكَ رَحْمَةً إِنَّكَ أَنْتَ الْوَهَّابُ",
        count: 1,
        reward: "دعاء الثبات على الهداية"
      },
      {
        id: 24,
        text: "اللَّهُمَّ إِنَّكَ عَفُوٌّ كَرِيمٌ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي",
        count: 1,
        reward: "طلب العفو والمغفرة"
      }
    ]
  }
];

function formatTime(seconds) {
  if (!seconds || isNaN(seconds) || seconds === Infinity) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function App() {
  const [allSheikhs, setAllSheikhs] = useState([]);
  const [allRadios, setAllRadios] = useState([]);
  const [allSurahs, setAllSurahs] = useState([]);
  const [sheikhSearch, setSheikhSearch] = useState("");
  const [radioSearch, setRadioSearch] = useState("");
  const [surahSearch, setSurahSearch] = useState("");
  const [mushafSearch, setMushafSearch] = useState("");
  
  const [selectedSheikhId, setSelectedSheikhId] = useState("");
  const [selectedSurahNum, setSelectedSurahNum] = useState("");
  const [selectedRadioUrl, setSelectedRadioUrl] = useState("");
  const [selectedReadSurahNum, setSelectedReadSurahNum] = useState("1");
  
  const [activeTab, setActiveTab] = useState("surah");
  const [activeAzkarCategory, setActiveAzkarCategory] = useState("أذكار الصباح");
  const [azkarCounts, setAzkarCounts] = useState({});

  const [currentAudioTitle, setCurrentAudioTitle] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  const [quranAyahs, setQuranAyahs] = useState([]);
  const [readSurahAyahs, setReadSurahAyahs] = useState([]);
  const [fontSize, setFontSize] = useState(26);

  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved === "dark";
  });
  const [paletteKey, setPaletteKey] = useState(() => localStorage.getItem("palette") || "emerald");
  const [loadingAyahs, setLoadingAyahs] = useState(false);
  const [loadingReadAyahs, setLoadingReadAyahs] = useState(false);
  const [loadingAudio, setLoadingAudio] = useState(false);

  const audioRef = useRef(null);
  const palette = PALETTES[paletteKey] || PALETTES.emerald;

  useEffect(() => {
    localStorage.setItem("theme", isDark ? "dark" : "light");
    if (isDark) {
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark");
    }
  }, [isDark]);

  useEffect(() => {
    localStorage.setItem("palette", paletteKey);
  }, [paletteKey]);

  useEffect(() => {
    fetch("https://www.mp3quran.net/api/v3/reciters?language=ar")
      .then((res) => res.json())
      .then((data) => {
        const reciters = data.reciters || [];
        setAllSheikhs(reciters);
        if (reciters.length > 0) {
          setSelectedSheikhId(String(reciters[0].id));
        }
      })
      .catch((err) => console.error("Error fetching reciters:", err));

    fetch("https://www.mp3quran.net/api/v3/radios?language=ar")
      .then((res) => res.json())
      .then((data) => {
        const radiosList = data.radios || [];
        setAllRadios([EGYPT_QURAN_RADIO, ...radiosList]);
      })
      .catch((err) => {
        console.error("Error fetching radios:", err);
        setAllRadios([EGYPT_QURAN_RADIO]);
      });

    fetch("https://api.alquran.cloud/v1/surah")
      .then((res) => res.json())
      .then((data) => {
        const surahs = data.data || [];
        setAllSurahs(surahs);
        if (surahs.length > 0) {
          setSelectedSurahNum(String(surahs[0].number));
        }
      })
      .catch((err) => console.error("Error fetching surahs:", err));
  }, []);

  const filteredSheikhs = useMemo(() => {
    const search = sheikhSearch.trim().toLowerCase();
    if (!search) return allSheikhs;
    return allSheikhs.filter((s) => (s.name || "").toLowerCase().includes(search));
  }, [allSheikhs, sheikhSearch]);

  const filteredRadios = useMemo(() => {
    const search = radioSearch.trim().toLowerCase();
    if (!search) return allRadios;
    return allRadios.filter((r) => (r.name || "").toLowerCase().includes(search));
  }, [allRadios, radioSearch]);

  const filteredSurahs = useMemo(() => {
    const search = surahSearch.trim().toLowerCase();
    if (!search) return allSurahs;
    return allSurahs.filter(
      (s) =>
        (s.name || "").toLowerCase().includes(search) ||
        String(s.number).includes(search)
    );
  }, [allSurahs, surahSearch]);

  const filteredMushafSurahs = useMemo(() => {
    const search = mushafSearch.trim().toLowerCase();
    if (!search) return allSurahs;
    return allSurahs.filter(
      (s) =>
        (s.name || "").toLowerCase().includes(search) ||
        String(s.number).includes(search)
    );
  }, [allSurahs, mushafSearch]);

  useEffect(() => {
    if (filteredSheikhs.length > 0) {
      const exists = filteredSheikhs.some((s) => String(s.id) === String(selectedSheikhId));
      if (!exists) {
        setSelectedSheikhId(String(filteredSheikhs[0].id));
      }
    }
  }, [filteredSheikhs, selectedSheikhId]);

  useEffect(() => {
    if (filteredSurahs.length > 0) {
      const exists = filteredSurahs.some((s) => String(s.number) === String(selectedSurahNum));
      if (!exists) {
        setSelectedSurahNum(String(filteredSurahs[0].number));
      }
    }
  }, [filteredSurahs, selectedSurahNum]);

  const currentSurah = useMemo(
    () => allSurahs.find((surah) => String(surah.number) === String(selectedSurahNum)),
    [allSurahs, selectedSurahNum]
  );

  const currentReadSurah = useMemo(
    () => allSurahs.find((surah) => String(surah.number) === String(selectedReadSurahNum)),
    [allSurahs, selectedReadSurahNum]
  );

  const currentSheikh = useMemo(
    () => allSheikhs.find((s) => String(s.id) === String(selectedSheikhId)),
    [allSheikhs, selectedSheikhId]
  );

  function loadSurahText(num) {
    setLoadingAyahs(true);
    fetch(`https://api.alquran.cloud/v1/surah/${num}`)
      .then((res) => res.json())
      .then((data) => {
        setQuranAyahs((data.data && data.data.ayahs) || []);
      })
      .catch(() => setQuranAyahs([]))
      .finally(() => setLoadingAyahs(false));
  }

  function loadReadSurahText(num) {
    setLoadingReadAyahs(true);
    fetch(`https://api.alquran.cloud/v1/surah/${num}`)
      .then((res) => res.json())
      .then((data) => {
        setReadSurahAyahs((data.data && data.data.ayahs) || []);
      })
      .catch(() => setReadSurahAyahs([]))
      .finally(() => setLoadingReadAyahs(false));
  }

  useEffect(() => {
    if (activeTab === "mushaf" && selectedReadSurahNum) {
      loadReadSurahText(selectedReadSurahNum);
    }
  }, [selectedReadSurahNum, activeTab]);

  useEffect(() => {
    if (activeTab !== "surah" || !selectedSheikhId || !selectedSurahNum) return;

    const sheikh = allSheikhs.find((s) => String(s.id) === String(selectedSheikhId));
    if (!sheikh || !sheikh.moshaf || sheikh.moshaf.length === 0) return;

    const surahNumStr = String(selectedSurahNum);
    const chosenMoshaf =
      sheikh.moshaf.find(
        (m) => m.surah_list && m.surah_list.split(",").includes(surahNumStr)
      ) || sheikh.moshaf[0];

    const server = chosenMoshaf.server;
    const surahPadded = String(selectedSurahNum).padStart(3, "0");
    const audioSrc = `${server}${surahPadded}.mp3`;
    const surahObj = allSurahs.find((s) => String(s.number) === String(selectedSurahNum));

    setCurrentAudioTitle(`الشيخ ${sheikh.name} - سورة ${surahObj ? surahObj.name : selectedSurahNum}`);
    setSelectedRadioUrl("");

    if (audioRef.current) {
      setLoadingAudio(true);
      audioRef.current.src = audioSrc;
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false))
        .finally(() => setLoadingAudio(false));
    }

    loadSurahText(selectedSurahNum);
  }, [selectedSheikhId, selectedSurahNum, allSheikhs, activeTab]);

  function playRadioStation(radioObj) {
    if (!radioObj || !radioObj.url) return;
    setActiveTab("radio");
    setSelectedRadioUrl(radioObj.url);
    setCurrentAudioTitle(radioObj.name.includes("إذاعة") ? radioObj.name : `إذاعة القارئ ${radioObj.name}`);

    if (audioRef.current) {
      setLoadingAudio(true);
      audioRef.current.src = radioObj.url;
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false))
        .finally(() => setLoadingAudio(false));
    }
  }

  function togglePlayPause() {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
  }

  function handleSeek(e) {
    const time = Number(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  }

  function skipTime(seconds) {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.min(
      Math.max(0, audioRef.current.currentTime + seconds),
      duration || 0
    );
  }

  function handleVolumeChange(e) {
    const val = Number(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
      setIsMuted(val === 0);
    }
  }

  function toggleMute() {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.volume = volume || 0.8;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  }

  function changeSpeed(speed) {
    setPlaybackSpeed(speed);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  }

  function handleZikrClick(item) {
    setAzkarCounts((prev) => {
      const current = prev[item.id] !== undefined ? prev[item.id] : item.count;
      if (current <= 1) {
        return { ...prev, [item.id]: 0 };
      }
      return { ...prev, [item.id]: current - 1 };
    });
  }

  function resetZikrCount(itemId, initialCount) {
    setAzkarCounts((prev) => ({ ...prev, [itemId]: initialCount }));
  }

  const activeAzkarGroup = useMemo(() => {
    return AZKAR_DATA.find((g) => g.category === activeAzkarCategory) || AZKAR_DATA[0];
  }, [activeAzkarCategory]);

  const isLiveStream = duration === Infinity || selectedRadioUrl !== "";

  return (
    <div className={isDark ? "dark" : ""}>
      <div className={palette.root}>
        <audio
          ref={audioRef}
          onTimeUpdate={() => {
            if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
          }}
          onLoadedMetadata={() => {
            if (audioRef.current) setDuration(audioRef.current.duration);
          }}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
        />

        <main className="mx-auto w-[94%] max-w-6xl py-6 sm:py-10 pb-32">
          <header className={palette.header}>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur shadow-inner">
                <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight sm:text-3xl">نور القرآن الكريم</h1>
                <p className={palette.subtitle}>تلاوات، مصحف كامل، إذاعات قرآنية مباشرة، وأذكار المسلم اليومية</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 rounded-full border border-white/30 bg-white/20 p-1 backdrop-blur">
              <button
                type="button"
                onClick={() => setIsDark(false)}
                className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold transition ${
                  !isDark ? "bg-white text-slate-900 shadow-md" : "text-white/90 hover:bg-white/20"
                }`}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                الوضع النهاري
              </button>
              <button
                type="button"
                onClick={() => setIsDark(true)}
                className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold transition ${
                  isDark ? "bg-slate-900 text-white shadow-md" : "text-white/90 hover:bg-white/20"
                }`}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
                الوضع الليلي
              </button>
            </div>
          </header>

          <section className="mb-5 rounded-2xl border border-white/60 bg-white/70 p-3 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/70">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">مظاهر الألوان:</span>
                {Object.entries(PALETTES).map(([key, item]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setPaletteKey(key)}
                    className={`rounded-full border px-3 py-1 text-xs transition ${
                      paletteKey === key ? item.chipActive : item.chip
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-1.5 rounded-xl bg-stone-200/60 p-1 dark:bg-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveTab("surah")}
                  className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs transition ${
                    activeTab === "surah" ? palette.tabActive : palette.tabInactive
                  }`}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  السور والتلاوات
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("mushaf")}
                  className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs transition ${
                    activeTab === "mushaf" ? palette.tabActive : palette.tabInactive
                  }`}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  المصحف الشريف (قراءة)
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("radio")}
                  className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs transition ${
                    activeTab === "radio" ? palette.tabActive : palette.tabInactive
                  }`}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 100-6 3 3 0 000 6z" />
                  </svg>
                  إذاعات القرآن ({allRadios.length})
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("azkar")}
                  className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs transition ${
                    activeTab === "azkar" ? palette.tabActive : palette.tabInactive
                  }`}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  الأذكار والأدعية
                </button>
              </div>
            </div>
          </section>

          {activeTab === "surah" && (
            <section className="grid gap-5 md:grid-cols-2">
              <div className={palette.card}>
                <div className="mb-3 flex items-center justify-between">
                  <label className="text-sm font-bold text-stone-700 dark:text-slate-200 flex items-center gap-2">
                    <svg className="h-4 w-4 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    اختر القارئ (الشيوخ)
                  </label>
                  <span className="text-xs text-stone-500 dark:text-slate-400 font-medium">
                    {filteredSheikhs.length} قارئ متاح
                  </span>
                </div>
                <input
                  type="text"
                  value={sheikhSearch}
                  onChange={(e) => setSheikhSearch(e.target.value)}
                  placeholder="ابحث عن الشيخ (مثال: المنشاوي، عبد الباسط، الحصري...)"
                  className={palette.input}
                />
                <select
                  value={selectedSheikhId}
                  onChange={(e) => setSelectedSheikhId(e.target.value)}
                  className={palette.select}
                >
                  {filteredSheikhs.map((sheikh) => (
                    <option key={sheikh.id} value={sheikh.id}>
                      {sheikh.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className={palette.card}>
                <div className="mb-3 flex items-center justify-between">
                  <label className="text-sm font-bold text-stone-700 dark:text-slate-200 flex items-center gap-2">
                    <svg className="h-4 w-4 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    اختر السورة المباركة
                  </label>
                  <span className="text-xs text-stone-500 dark:text-slate-400 font-medium">
                    114 سورة
                  </span>
                </div>
                <input
                  type="text"
                  value={surahSearch}
                  onChange={(e) => setSurahSearch(e.target.value)}
                  placeholder="ابحث عن السورة بالحجم أو الاسم..."
                  className={palette.input}
                />
                <select
                  value={selectedSurahNum}
                  onChange={(e) => setSelectedSurahNum(e.target.value)}
                  className={palette.select}
                >
                  {filteredSurahs.map((surah) => (
                    <option key={surah.number} value={surah.number}>
                      {`${surah.number} - ${surah.name}`}
                    </option>
                  ))}
                </select>
              </div>
            </section>
          )}

          {activeTab === "mushaf" && (
            <section className="space-y-5">
              <div className={palette.card}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/60 pb-4 dark:border-slate-700">
                  <div>
                    <h2 className="text-lg font-bold text-stone-800 dark:text-slate-100 flex items-center gap-2">
                      <svg className="h-5 w-5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      المصحف الشريف كامل للقراءة
                    </h2>
                    <p className="text-xs text-stone-500 dark:text-slate-400 mt-0.5">
                      اقرأ القرآن الكريم كاملاً بوضوح مع إمكانية تكبير وتصغير الخط
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-1 rounded-xl bg-stone-100 px-3 py-1.5 text-xs dark:bg-slate-800">
                      <span className="font-bold text-stone-700 dark:text-slate-300">حجم الخط:</span>
                      <button
                        type="button"
                        onClick={() => setFontSize((prev) => Math.max(18, prev - 2))}
                        className="h-7 w-7 rounded-lg bg-white font-bold shadow-sm transition hover:bg-stone-200 dark:bg-slate-700 dark:hover:bg-slate-600"
                      >
                        -
                      </button>
                      <span className="w-6 text-center font-bold">{fontSize}</span>
                      <button
                        type="button"
                        onClick={() => setFontSize((prev) => Math.min(42, prev + 2))}
                        className="h-7 w-7 rounded-lg bg-white font-bold shadow-sm transition hover:bg-stone-200 dark:bg-slate-700 dark:hover:bg-slate-600"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      disabled={Number(selectedReadSurahNum) <= 1}
                      onClick={() => setSelectedReadSurahNum((prev) => String(Number(prev) - 1))}
                      className="rounded-xl border border-stone-200 bg-white px-3 py-1.5 text-xs font-bold transition hover:bg-stone-100 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800"
                    >
                      السورة السابقة
                    </button>

                    <button
                      type="button"
                      disabled={Number(selectedReadSurahNum) >= 114}
                      onClick={() => setSelectedReadSurahNum((prev) => String(Number(prev) + 1))}
                      className="rounded-xl border border-stone-200 bg-white px-3 py-1.5 text-xs font-bold transition hover:bg-stone-100 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800"
                    >
                      السورة التالية
                    </button>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-stone-700 dark:text-slate-300">
                      ابحث في المصحف:
                    </label>
                    <input
                      type="text"
                      value={mushafSearch}
                      onChange={(e) => setMushafSearch(e.target.value)}
                      placeholder="ابحث برقم أو اسم السورة..."
                      className={palette.input}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-stone-700 dark:text-slate-300">
                      اختر السورة لقراءتها:
                    </label>
                    <select
                      value={selectedReadSurahNum}
                      onChange={(e) => setSelectedReadSurahNum(e.target.value)}
                      className={palette.select}
                    >
                      {filteredMushafSurahs.map((surah) => (
                        <option key={surah.number} value={surah.number}>
                          {`${surah.number} - سورة ${surah.name}`}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className={palette.card + " p-6 sm:p-10 text-center"}>
                {currentReadSurah && (
                  <div className="mb-6 border-b border-stone-200/80 pb-4 dark:border-slate-700">
                    <h2 className="text-3xl font-black text-emerald-800 dark:text-emerald-300 font-amiri">
                      سُورَةُ {currentReadSurah.name}
                    </h2>
                    <div className="mt-2 flex flex-wrap items-center justify-center gap-3 text-xs font-semibold text-stone-600 dark:text-slate-300">
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200">
                        {currentReadSurah.revelationType === "Meccan" ? "مكـيـة" : "مدنـيـة"}
                      </span>
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-amber-900 dark:bg-slate-800 dark:text-slate-200">
                        عدد الآيات: {currentReadSurah.numberOfAyahs}
                      </span>
                      <span className="rounded-full bg-stone-100 px-3 py-1 text-stone-800 dark:bg-slate-800 dark:text-slate-200">
                        السورة رقم: {currentReadSurah.number}
                      </span>
                    </div>

                    {Number(selectedReadSurahNum) !== 9 && Number(selectedReadSurahNum) !== 1 && (
                      <div className="mt-6 text-2xl font-bold font-amiri text-emerald-700 dark:text-emerald-400">
                        بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
                      </div>
                    )}
                  </div>
                )}

                {loadingReadAyahs ? (
                  <div className="py-16 text-center text-sm font-bold text-stone-500 dark:text-slate-400">
                    جاري فتح المصحف الشريف...
                  </div>
                ) : (
                  <div
                    className="font-amiri text-stone-900 dark:text-slate-100 leading-[2.6] text-justify tracking-wide space-y-4"
                    style={{ fontSize: `${fontSize}px` }}
                  >
                    {readSurahAyahs.map((ayah) => (
                      <span key={ayah.numberInSurah} className="inline">
                        {ayah.text}{" "}
                        <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-emerald-700 text-white font-sans text-xs font-bold mx-1 align-middle dark:bg-emerald-600">
                          {ayah.numberInSurah}
                        </span>{" "}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}

          {activeTab === "radio" && (
            <section className="space-y-4">
              <div className={palette.card}>
                <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold text-stone-800 dark:text-slate-100 flex items-center gap-2">
                      <svg className="h-5 w-5 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 100-6 3 3 0 000 6z" />
                      </svg>
                      إذاعات القرآن الكريم لجميع القراء
                    </h2>
                    <p className="text-xs text-stone-500 dark:text-slate-400 mt-0.5">
                      اختر إذاعة القارئ المفضل لديك للاستماع المباشر المتواصل على مدار 24 ساعة
                    </p>
                  </div>
                  <div className="w-full sm:w-72">
                    <input
                      type="text"
                      value={radioSearch}
                      onChange={(e) => setRadioSearch(e.target.value)}
                      placeholder="ابحث عن إذاعة قارئ (نعينع، عبدالباسط، مصر...)"
                      className={palette.input}
                    />
                  </div>
                </div>

                <div className="grid gap-3.5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-h-[460px] overflow-y-auto p-1">
                  {filteredRadios.map((radio) => {
                    const isSelected = selectedRadioUrl === radio.url;
                    return (
                      <div
                        key={radio.id}
                        onClick={() => playRadioStation(radio)}
                        className={isSelected ? palette.radioCardActive : palette.radioCard}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${radio.isEgypt ? "bg-amber-500 text-white" : "bg-emerald-100 text-emerald-800 dark:bg-slate-700 dark:text-emerald-300"}`}>
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 000-7.072m-2.828 9.9a9 9 0 000-12.728M12 12h.01" />
                              </svg>
                            </div>
                            <div>
                              <h3 className="text-sm font-bold text-stone-800 dark:text-slate-100 leading-snug">
                                {radio.name}
                              </h3>
                              {radio.isEgypt && (
                                <span className="inline-block mt-0.5 rounded bg-amber-200 px-1.5 py-0.5 text-[10px] font-extrabold text-amber-900 dark:bg-amber-900/60 dark:text-amber-200">
                                  البث الرسمي
                                </span>
                              )}
                            </div>
                          </div>
                          {isSelected && (
                            <span className="flex h-2.5 w-2.5 relative">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          )}

          {activeTab === "azkar" && (
            <section className="space-y-5">
              <div className={palette.card}>
                <div className="mb-4">
                  <h2 className="text-lg font-bold text-stone-800 dark:text-slate-100 flex items-center gap-2">
                    <svg className="h-5 w-5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    أذكار المسلم اليومية وأدعيته
                  </h2>
                  <p className="text-xs text-stone-500 dark:text-slate-400 mt-0.5">
                    حصن نفسك بأذكار الصباح والمساء، والنوم، وادعُ بالأدعية القرآنية المباركة مع العداد التفاعلي
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 border-b border-stone-200/60 pb-4 dark:border-slate-700">
                  {AZKAR_DATA.map((group) => (
                    <button
                      key={group.category}
                      type="button"
                      onClick={() => setActiveAzkarCategory(group.category)}
                      className={`rounded-full border px-4 py-1.5 text-xs font-bold transition ${
                        activeAzkarCategory === group.category ? palette.chipActive : palette.chip
                      }`}
                    >
                      {group.category} ({group.items.length})
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                {activeAzkarGroup.items.map((item) => {
                  const countLeft = azkarCounts[item.id] !== undefined ? azkarCounts[item.id] : item.count;
                  const isDone = countLeft === 0;

                  return (
                    <div
                      key={item.id}
                      className={`${palette.card} transition ${
                        isDone ? "opacity-65 bg-emerald-50/50 dark:bg-slate-900/40" : ""
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="space-y-2 flex-1">
                          <p className="font-amiri text-xl leading-relaxed text-stone-900 dark:text-slate-100 font-bold">
                            {item.text}
                          </p>
                          {item.reward && (
                            <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                              فضل الذكر: {item.reward}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <button
                            type="button"
                            onClick={() => handleZikrClick(item)}
                            className={`flex h-12 min-w-28 items-center justify-center gap-2 rounded-xl text-sm font-bold text-white transition shadow-md ${
                              isDone
                                ? "bg-slate-400 dark:bg-slate-700 cursor-default"
                                : "bg-emerald-600 hover:bg-emerald-700 active:scale-95 dark:bg-emerald-500 dark:text-slate-950"
                            }`}
                          >
                            {isDone ? (
                              <span>تم الذكر</span>
                            ) : (
                              <>
                                <span>المتبقي:</span>
                                <span className="text-lg font-black">{countLeft}</span>
                              </>
                            )}
                          </button>

                          {azkarCounts[item.id] !== undefined && (
                            <button
                              type="button"
                              onClick={() => resetZikrCount(item.id, item.count)}
                              title="إعادة ضبط العداد"
                              className="h-10 w-10 rounded-xl border border-stone-200 bg-white text-stone-600 hover:bg-stone-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 flex items-center justify-center"
                            >
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {activeTab === "surah" && (
            <section className={palette.card + " mt-5 p-6"}>
              <div className="mb-5 flex flex-wrap items-center justify-between border-b border-stone-200/60 pb-4 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <h2 className={palette.sectionTitle}>
                    <svg className="h-5 w-5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    آيات السورة الكريمة
                  </h2>
                  {currentSurah ? (
                    <>
                      <span className={palette.surahBadge}>سورة {currentSurah.name}</span>
                      <span className={palette.countBadge}>{currentSurah.numberOfAyahs} آية</span>
                    </>
                  ) : null}
                </div>

                {currentSheikh && (
                  <span className="text-xs font-semibold text-stone-600 dark:text-slate-300">
                    بصوت القارئ: <strong className="text-emerald-700 dark:text-emerald-300">{currentSheikh.name}</strong>
                  </span>
                )}
              </div>

              {loadingAyahs ? (
                <div className="py-12 text-center text-sm font-semibold text-stone-500 dark:text-slate-400">
                  جاري تحميل آيات السورة المباركة...
                </div>
              ) : (
                <div className="space-y-4 font-amiri text-2xl leading-[2.4] text-stone-800 dark:text-slate-100">
                  {quranAyahs.map((ayah) => (
                    <div key={ayah.numberInSurah} className={palette.ayahCard}>
                      <span>{ayah.text}</span>
                      <span className={palette.ayahNum}>{ayah.numberInSurah}</span>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
        </main>

        <div className="fixed bottom-0 left-0 right-0 z-50 p-3 sm:p-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-amber-200/80 dark:border-slate-800 shadow-[0_-10px_30px_rgba(0,0,0,0.15)] transition-all">
          <div className="mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3 w-full md:w-1/3">
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${palette.playerBtn} shadow-md`}>
                {isPlaying ? (
                  <span className="flex h-3 w-3 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                  </span>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 .895-2 3-2c.38 0 .741.045 1.074.127M9 19l12-3M21 16c0 1.105-1.343 2-3 2s-3-.895-3-2 .895-2 3-2c.38 0 .741.045 1.074.127" />
                  </svg>
                )}
              </div>
              <div className="truncate">
                <span className="block text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                  {isLiveStream ? "بث مباشر الآن" : "جاري التشغيل"}
                </span>
                <h4 className="text-xs sm:text-sm font-bold text-stone-800 dark:text-slate-100 truncate">
                  {currentAudioTitle || "اختر تلاوة أو إذاعة للبدء"}
                </h4>
              </div>
            </div>

            <div className="flex flex-col items-center gap-1.5 w-full md:w-1/2">
              <div className="flex items-center gap-3">
                {!isLiveStream && (
                  <button
                    type="button"
                    onClick={() => skipTime(-10)}
                    title="تراجع 10 ثوانٍ"
                    className="p-1.5 text-stone-600 hover:text-stone-900 dark:text-slate-300 dark:hover:text-white transition"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.334 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
                    </svg>
                  </button>
                )}

                <button
                  type="button"
                  onClick={togglePlayPause}
                  disabled={loadingAudio}
                  className={`flex h-12 w-12 items-center justify-center rounded-full ${palette.playerBtn} shadow-lg transition transform hover:scale-105 active:scale-95 disabled:opacity-50`}
                >
                  {loadingAudio ? (
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : isPlaying ? (
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                    </svg>
                  ) : (
                    <svg className="h-6 w-6 mr-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  )}
                </button>

                {!isLiveStream && (
                  <button
                    type="button"
                    onClick={() => skipTime(10)}
                    title="تقديم 10 ثوانٍ"
                    className="p-1.5 text-stone-600 hover:text-stone-900 dark:text-slate-300 dark:hover:text-white transition"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.934 12.8a1 1 0 000-1.6l-5.334-4A1 1 0 005 8v8a1 1 0 001.6.8l5.334-4zM19.934 12.8a1 1 0 000-1.6l-5.334-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.334-4z" />
                    </svg>
                  </button>
                )}
              </div>

              {!isLiveStream ? (
                <div className="flex items-center gap-3 w-full">
                  <span className="text-[11px] font-mono font-bold text-stone-500 dark:text-slate-400 w-10 text-right">
                    {formatTime(currentTime)}
                  </span>
                  <input
                    type="range"
                    min="0"
                    max={duration || 100}
                    value={currentTime}
                    onChange={handleSeek}
                    className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-stone-200 accent-emerald-600 dark:bg-slate-700 dark:accent-emerald-400"
                  />
                  <span className="text-[11px] font-mono font-bold text-stone-500 dark:text-slate-400 w-10">
                    {formatTime(duration)}
                  </span>
                </div>
              ) : (
                <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  بث مباشر متواصل 24 ساعة
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 w-full md:w-1/3">
              {!isLiveStream && (
                <select
                  value={playbackSpeed}
                  onChange={(e) => changeSpeed(Number(e.target.value))}
                  className="rounded-lg border border-stone-200 bg-stone-100 px-2 py-1 text-xs font-bold outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 cursor-pointer"
                  title="سرعة التشغيل"
                >
                  <option value={0.75}>0.75x</option>
                  <option value={1.0}>1.0x (عادي)</option>
                  <option value={1.25}>1.25x</option>
                  <option value={1.5}>1.5x</option>
                </select>
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleMute}
                  className="text-stone-600 hover:text-stone-900 dark:text-slate-300 dark:hover:text-white"
                >
                  {isMuted || volume === 0 ? (
                    <svg className="h-5 w-5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="h-1.5 w-16 sm:w-20 cursor-pointer appearance-none rounded-lg bg-stone-200 accent-emerald-600 dark:bg-slate-700 dark:accent-emerald-400"
                />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
