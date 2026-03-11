import { useState, useEffect, useRef } from 'react';
import { Search, PlayCircle, BookOpen } from 'lucide-react';

export default function HomeView() {
  const [sheikhs, setSheikhs] = useState([]);
  const [surahs, setSurahs] = useState([]);
  const [filteredSheikhs, setFilteredSheikhs] = useState([]);
  const [filteredSurahs, setFilteredSurahs] = useState([]);
  
  const [selectedSheikh, setSelectedSheikh] = useState("");
  const [selectedSurah, setSelectedSurah] = useState("");
  
  const [sheikhSearch, setSheikhSearch] = useState("");
  const [surahSearch, setSurahSearch] = useState("");
  
  const [surahText, setSurahText] = useState([]);
  const audioRef = useRef(null);

  // Fetch Sheikhs
  useEffect(() => {
    fetch("https://www.mp3quran.net/api/v3/reciters?language=ar")
      .then(res => res.json())
      .then(data => {
        setSheikhs(data.reciters);
        setFilteredSheikhs(data.reciters);
      });
  }, []);

  // Fetch Surahs
  useEffect(() => {
    fetch("https://api.alquran.cloud/v1/surah")
      .then(res => res.json())
      .then(data => {
        setSurahs(data.data);
        setFilteredSurahs(data.data);
      });
  }, []);

  // Handle Sheikh Search
  useEffect(() => {
    const v = sheikhSearch.toLowerCase();
    setFilteredSheikhs(sheikhs.filter(s => s.name.toLowerCase().includes(v)));
  }, [sheikhSearch, sheikhs]);

  // Handle Surah Search
  useEffect(() => {
    const v = surahSearch.toLowerCase();
    setFilteredSurahs(surahs.filter(s => s.name.toLowerCase().includes(v)));
  }, [surahSearch, surahs]);

  // Fetch Surah Text
  const loadSurahText = async (num) => {
    try {
      const res = await fetch(`https://api.alquran.cloud/v1/surah/${num}`);
      const data = await res.json();
      setSurahText(data.data.ayahs);
    } catch (err) {
      console.error(err);
    }
  };

  // Play Audio & load Text
  useEffect(() => {
    if (!selectedSheikh || !selectedSurah) return;

    fetch("https://www.mp3quran.net/api/v3/reciters?language=ar")
      .then(res => res.json())
      .then(data => {
        const sheikh = data.reciters.find(s => s.id == selectedSheikh);
        if (sheikh && sheikh.moshaf[0]) {
          const server = sheikh.moshaf[0].server;
          const surahNumPadded = selectedSurah.toString().padStart(3, "0");
          if (audioRef.current) {
            audioRef.current.src = `${server}${surahNumPadded}.mp3`;
            audioRef.current.play().catch(e => console.error("Audio playback failed:", e));
          }
          loadSurahText(selectedSurah);
        }
      });
  }, [selectedSheikh, selectedSurah]);

  return (
    <>
      {/* Controls Section */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        
        {/* Sheikh Selection */}
        <div className="glass-panel p-6 rounded-3xl animate-slide-up" style={{animationDelay: '0.1s'}}>
          <h3 className="text-lg font-bold mb-4 text-emerald-800 dark:text-amber-500 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-slate-700 flex items-center justify-center">🎤</span>
            اختيار القارئ
          </h3>
          
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute right-4 top-3.5 text-slate-400 w-5 h-5" />
              <input 
                type="text" 
                value={sheikhSearch} 
                onChange={(e) => setSheikhSearch(e.target.value)} 
                placeholder="ابحث عن اسم القارئ..." 
                className="premium-input pr-12"
              />
            </div>
            
            <select 
              value={selectedSheikh} 
              onChange={(e) => setSelectedSheikh(e.target.value)}
              className="premium-select"
            >
              <option value="">-- اضغط لاختيار القارئ --</option>
              {filteredSheikhs.map(sheikh => (
                <option key={sheikh.id} value={sheikh.id}>
                  {sheikh.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Surah Selection */}
        <div className="glass-panel p-6 rounded-3xl animate-slide-up" style={{animationDelay: '0.2s'}}>
          <h3 className="text-lg font-bold mb-4 text-emerald-800 dark:text-amber-500 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-slate-700 flex items-center justify-center">📖</span>
            اختيار السورة
          </h3>
          
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute right-4 top-3.5 text-slate-400 w-5 h-5" />
              <input 
                type="text" 
                value={surahSearch} 
                onChange={(e) => setSurahSearch(e.target.value)} 
                placeholder="ابحث عن اسم السورة..." 
                className="premium-input pr-12"
              />
            </div>
            
            <select 
              value={selectedSurah} 
              onChange={(e) => setSelectedSurah(e.target.value)}
              className="premium-select"
            >
              <option value="">-- اضغط لاختيار السورة --</option>
              {filteredSurahs.map(surah => (
                <option key={surah.number} value={surah.number}>
                  {surah.number} - {surah.name}
                </option>
              ))}
            </select>
          </div>
        </div>

      </div>

      {/* Audio Player */}
      <div className="glass-panel p-4 rounded-full mb-12 max-w-2xl mx-auto flex items-center shadow-lg border-2 border-emerald-500/20 dark:border-amber-500/20 animate-slide-up" style={{animationDelay: '0.3s'}}>
        <PlayCircle className="text-emerald-500 dark:text-amber-500 w-10 h-10 ml-4 hidden sm:block opacity-80" />
        <audio ref={audioRef} controls className="w-full premium-audio outline-none"></audio>
      </div>

      {/* Quran Text Box */}
      <div className="glass-panel p-8 md:p-12 rounded-3xl mx-auto shadow-2xl animate-slide-up" style={{animationDelay: '0.4s'}}>
        <div className="text-center mb-8 pb-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-emerald-700 dark:text-amber-500">
            ﴿ الآيات الكريمة ﴾
          </h2>
        </div>
        
        <div className="text-2xl md:text-3xl leading-[2.5] md:leading-[3] text-justify font-serif text-slate-800 dark:text-slate-100">
          {surahText.length > 0 ? (
            surahText.map((ayah) => (
              <span key={ayah.number} className="inline-block hover:bg-emerald-100/50 dark:hover:bg-amber-900/30 transition-colors duration-300 rounded px-1">
                {ayah.text} 
                <span className="inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 mx-2 text-sm md:text-base font-bold text-emerald-700 dark:text-amber-400 bg-emerald-100 dark:bg-slate-800 rounded-full border border-emerald-200 dark:border-slate-600 shadow-sm">
                  {ayah.numberInSurah}
                </span>
              </span>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 opacity-50 space-y-4">
              <BookOpen className="w-16 h-16 text-emerald-600 dark:text-amber-500" />
              <p className="text-center text-lg">يرجى اختيار السورة للبدء في التلاوة والقراءة</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
