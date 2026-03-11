import { useState, useEffect } from 'react';
import { Search, BookOpen, ArrowRight } from 'lucide-react';

export default function QuranIndexView() {
  const [surahs, setSurahs] = useState([]);
  const [filteredSurahs, setFilteredSurahs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [readingSurah, setReadingSurah] = useState(null);
  const [surahText, setSurahText] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch Surahs List
  useEffect(() => {
    fetch("https://api.alquran.cloud/v1/surah")
      .then(res => res.json())
      .then(data => {
        setSurahs(data.data);
        setFilteredSurahs(data.data);
      });
  }, []);

  // Handle Search
  useEffect(() => {
    const v = searchQuery.toLowerCase();
    setFilteredSurahs(surahs.filter(s => s.name.toLowerCase().includes(v)));
  }, [searchQuery, surahs]);

  // Load a specific Surah for reading
  const handleReadSurah = async (surah) => {
    setReadingSurah(surah);
    setIsLoading(true);
    try {
      const res = await fetch(`https://api.alquran.cloud/v1/surah/${surah.number}`);
      const data = await res.json();
      setSurahText(data.data.ayahs);
    } catch (err) {
      console.error(err);
    }
    setIsLoading(false);
  };

  const calculateTotalAyahs = (type) => type === 'Meccan' ? 'مكية' : 'مدنية';

  if (readingSurah) {
    return (
      <div className="animate-fade-in relative">
        <button 
          onClick={() => setReadingSurah(null)}
          className="mb-6 flex items-center gap-2 text-emerald-700 dark:text-amber-500 hover:text-emerald-800 dark:hover:text-amber-400 font-bold transition-colors bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm px-4 py-2 rounded-xl w-fit"
        >
          <ArrowRight size={20} />
          العودة للفهرس
        </button>

        <div className="glass-panel p-8 md:p-12 rounded-3xl mx-auto shadow-2xl">
          <div className="text-center mb-10 pb-6 border-b border-slate-200 dark:border-slate-700">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-l from-emerald-600 to-emerald-800 dark:from-amber-400 dark:to-amber-600 mb-4">
              {readingSurah.name}
            </h2>
            <div className="flex items-center justify-center gap-4 text-emerald-800 dark:text-amber-200/80 text-sm">
              <span>آياتها: {readingSurah.numberOfAyahs}</span>
              <span>•</span>
              <span>{calculateTotalAyahs(readingSurah.revelationType)}</span>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-12 h-12 border-4 border-emerald-200 dark:border-slate-700 border-t-emerald-600 dark:border-t-amber-500 rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="text-2xl md:text-3xl leading-[2.5] md:leading-[3] text-justify font-serif text-slate-800 dark:text-slate-100 pb-10">
              {surahText.map((ayah) => (
                <span key={ayah.number} className="inline-block hover:bg-emerald-100/50 dark:hover:bg-amber-900/30 transition-colors duration-300 rounded px-1">
                  {ayah.text} 
                  <span className="inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 mx-2 text-sm md:text-base font-bold text-emerald-700 dark:text-amber-400 bg-emerald-100 dark:bg-slate-800 rounded-full border border-emerald-200 dark:border-slate-600 shadow-sm">
                    {ayah.numberInSurah}
                  </span>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in relative z-10 min-h-[70vh]">
      <div className="glass-panel p-6 rounded-3xl mb-8 flex flex-col md:flex-row gap-6 items-center justify-between">
        <h2 className="text-xl md:text-2xl font-bold text-emerald-800 dark:text-amber-500 flex items-center gap-3">
          <BookOpen className="w-8 h-8" />
          فهرس السور المجيد
        </h2>
        
        <div className="relative w-full md:w-96">
          <Search className="absolute right-4 top-3.5 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            placeholder="ابحث عن اسم السورة..." 
            className="premium-input pr-12 w-full"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pb-10">
        {filteredSurahs.map((surah, index) => (
          <button
            key={surah.number}
            onClick={() => handleReadSurah(surah)}
            className="group glass-panel p-5 rounded-2xl hover:bg-emerald-50 dark:hover:bg-slate-800 flex items-center justify-between transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-emerald-300 dark:hover:border-amber-500/50"
            style={{animationDelay: `${index * 0.02}s`}}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-emerald-100 dark:bg-slate-800 text-emerald-700 dark:text-amber-400 font-bold border border-emerald-200 dark:border-slate-700 group-hover:bg-emerald-600 group-hover:text-white dark:group-hover:bg-amber-600 dark:group-hover:text-amber-50 transition-colors">
                {surah.number}
              </div>
              <div className="text-right">
                <h3 className="font-bold text-lg text-emerald-900 dark:text-slate-100">{surah.name}</h3>
                <p className="text-sm text-emerald-600/80 dark:text-slate-400">
                  {calculateTotalAyahs(surah.revelationType)} • {surah.numberOfAyahs} آيات
                </p>
              </div>
            </div>
          </button>
        ))}
        {filteredSurahs.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500 dark:text-slate-400">
            لا توجد نتائج تطابق بحثك
          </div>
        )}
      </div>
    </div>
  );
}
