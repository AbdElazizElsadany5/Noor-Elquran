import { useState, useEffect } from 'react';
import { Search, Book } from 'lucide-react';

export default function TafsirView() {
  const [surahs, setSurahs] = useState([]);
  const [filteredSurahs, setFilteredSurahs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [selectedSurah, setSelectedSurah] = useState("");
  const [ayahs, setAyahs] = useState([]);
  const [tafsir, setTafsir] = useState([]);
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

  useEffect(() => {
    if (!selectedSurah) return;

    const loadTafsir = async () => {
      setIsLoading(true);
      setAyahs([]);
      setTafsir([]);
      try {
        const [quranRes, tafsirRes] = await Promise.all([
          fetch(`https://api.alquran.cloud/v1/surah/${selectedSurah}`),
          fetch(`https://api.alquran.cloud/v1/surah/${selectedSurah}/ar.muyassar`)
        ]);
        const quranData = await quranRes.json();
        const tafsirData = await tafsirRes.json();
        
        setAyahs(quranData.data.ayahs);
        setTafsir(tafsirData.data.ayahs);
      } catch (err) {
        console.error(err);
      }
      setIsLoading(false);
    };

    loadTafsir();
  }, [selectedSurah]);

  return (
    <div className="space-y-8 animate-fade-in pb-10 container mx-auto px-2 sm:px-4 max-w-5xl">

      <div className="glass-panel p-6 md:p-8 rounded-3xl mx-auto flex flex-col items-center max-w-2xl bg-white/60 dark:bg-slate-900/60 shadow-xl">
        <h2 className="text-2xl font-bold text-emerald-800 dark:text-amber-500 flex items-center gap-3 mb-6 w-full justify-center">
          <Book className="w-8 h-8" />
          تفسير القرآن الكريم (الميسر)
        </h2>
        
        <div className="w-full space-y-4">
          <div className="relative">
            <Search className="absolute right-4 top-3.5 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              placeholder="ابحث عن اسم السورة..." 
              className="premium-input pr-12 w-full"
            />
          </div>
          
          <select 
            value={selectedSurah} 
            onChange={(e) => setSelectedSurah(e.target.value)}
            className="premium-select w-full"
          >
            <option value="">-- اضغط لاختيار السورة للتفسير --</option>
            {filteredSurahs.map(surah => (
              <option key={surah.number} value={surah.number}>
                {surah.number} - {surah.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center py-20">
          <div className="w-12 h-12 border-4 border-emerald-200 dark:border-slate-700 border-t-emerald-600 dark:border-t-amber-500 rounded-full animate-spin"></div>
        </div>
      )}

      {!isLoading && ayahs.length > 0 && tafsir.length > 0 && (
        <div className="space-y-6">
          {ayahs.map((ayah, index) => (
            <div key={ayah.number} className="glass-panel p-6 md:p-8 rounded-2xl hover:shadow-xl transition-shadow border border-emerald-50 dark:border-slate-800/50">
              
              {/* Ayah Text */}
              <div className="mb-6 flex items-start gap-4 justify-between">
                <div className="text-2xl md:text-3xl leading-[2.2] font-serif text-slate-800 dark:text-slate-100 flex-1 text-justify">
                  {ayah.text}
                </div>
                <div className="shrink-0 font-bold bg-emerald-100 dark:bg-slate-800 text-emerald-700 dark:text-amber-400 w-12 h-12 flex items-center justify-center rounded-full border-2 border-emerald-200 dark:border-slate-700 shadow-sm mt-2">
                  {ayah.numberInSurah}
                </div>
              </div>
              
              {/* Tafsir separator */}
              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-emerald-100 dark:border-slate-700/50 mix-blend-multiply dark:mix-blend-normal"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-[#f8fcf9] dark:bg-slate-900 px-4 text-sm font-medium text-emerald-500 dark:text-amber-500/70">
                    التفسير الميسر
                  </span>
                </div>
              </div>

              {/* Tafsir Text */}
              <div className="text-lg md:text-xl leading-[1.8] font-sans text-slate-700 dark:text-slate-300 bg-emerald-50/50 dark:bg-slate-800/30 p-5 rounded-xl border border-emerald-100/50 dark:border-slate-800/50 text-justify">
                {tafsir[index]?.text || "التفسير غير متوفر"}
              </div>

            </div>
          ))}
        </div>
      )}
      
      {!isLoading && selectedSurah && ayahs.length === 0 && (
        <div className="text-center py-20 text-slate-500 dark:text-slate-400">
          لم يتم العثور على التفسير لهذه السورة.
        </div>
      )}
    </div>
  );
}
