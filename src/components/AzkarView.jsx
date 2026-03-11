import { useState, useEffect } from 'react';
import { Heart, Search, CheckCircle } from 'lucide-react';

export default function AzkarView() {
  const [azkarData, setAzkarData] = useState({});
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("أذكار الصباح");
  const [currentAzkar, setCurrentAzkar] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [counters, setCounters] = useState({});

  useEffect(() => {
    // Fetch Azkar from a public repository
    const fetchAzkar = async () => {
      try {
        const res = await fetch("https://raw.githubusercontent.com/nawafalqari/azkar-api/56df51279ab6eb86dc2f6202c7de26c8948331c1/azkar.json");
        const data = await res.json();
        
        // Remove unwanted categories
        const excludedCategories = ['أدعية قرآنية', 'أدعية الأنبياء'];
        excludedCategories.forEach(cat => delete data[cat]);
        
        setAzkarData(data);
        const cats = Object.keys(data);
        setCategories(cats);
        
        if (cats.length > 0) {
          // If default category doesn't exist, pick the first one
          const defaultCat = cats.includes("أذكار الصباح") ? "أذكار الصباح" : cats[0];
          setSelectedCategory(defaultCat);
          setCurrentAzkar(data[defaultCat] || []);
        }
      } catch (err) {
        console.error("Failed to load Azkar:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAzkar();
  }, []);

  useEffect(() => {
    if (azkarData[selectedCategory]) {
      const azkar = azkarData[selectedCategory];
      const v = searchQuery.toLowerCase();
      // Filter by search query within the selected category
      const filtered = azkar.filter(z => 
        (z.content && z.content.includes(v)) || 
        (z.description && z.description.includes(v))
      );
      setCurrentAzkar(filtered);
      
      // Reset counters when category changes
      const initialCounters = {};
      filtered.forEach((_, idx) => {
        initialCounters[idx] = 0;
      });
      setCounters(initialCounters);
    }
  }, [selectedCategory, searchQuery, azkarData]);

  const handleIncrement = (index, maxCount) => {
    setCounters(prev => {
      const current = prev[index] || 0;
      const tMax = parseInt(maxCount) || 1;
      if (current < tMax) {
        return { ...prev, [index]: current + 1 };
      }
      return prev;
    });
  };

  const getFilteredCategories = () => {
    if (!searchQuery) return categories;
    return categories.filter(c => c.includes(searchQuery));
  };

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      
      {/* Header Section */}
      <div className="glass-panel p-6 md:p-8 rounded-3xl mx-auto flex flex-col md:flex-row gap-6 items-center justify-between">
        <h2 className="text-2xl font-bold text-emerald-800 dark:text-amber-500 flex items-center gap-3">
          <Heart className="w-8 h-8 text-emerald-600 dark:text-amber-500" fill="currentColor" opacity={0.2} />
          حصن المسلم (الأذكار)
        </h2>
        
        <div className="relative w-full md:w-96">
          <Search className="absolute right-4 top-3.5 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            placeholder="ابحث في الأذكار أو الأقسام..." 
            className="premium-input pr-12 w-full"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-12 h-12 border-4 border-emerald-200 dark:border-slate-700 border-t-emerald-600 dark:border-t-amber-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Categories Sidebar */}
          <div className="w-full md:w-72 shrink-0">
            <div className="glass-panel p-4 rounded-3xl sticky top-24 max-h-[70vh] overflow-y-auto hidden-scrollbar">
              <h3 className="font-bold text-lg mb-4 text-emerald-900 dark:text-amber-500 px-2 pb-2 border-b border-emerald-100 dark:border-slate-800">
                التصنيفات
              </h3>
              <div className="space-y-2">
                {getFilteredCategories().map(cat => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setSearchQuery(""); // clear search when switching
                    }}
                    className={`w-full text-right px-4 py-3 rounded-xl transition-all duration-200 ${
                      selectedCategory === cat 
                      ? 'bg-emerald-600 text-white dark:bg-amber-600 shadow-md font-bold' 
                      : 'text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
                {getFilteredCategories().length === 0 && (
                  <div className="text-sm text-slate-500 p-2">لا توجد تصنيفات مطابقة</div>
                )}
              </div>
            </div>
            
            {/* Mobile Category Select */}
            <div className="md:hidden glass-panel p-4 rounded-2xl mb-6">
              <select 
                value={selectedCategory} 
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setSearchQuery("");
                }}
                className="premium-select w-full"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Azkar List */}
          <div className="flex-1 space-y-6">
            <div className="glass-panel p-4 px-6 rounded-2xl mb-2 inline-block">
              <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-l from-emerald-600 to-emerald-800 dark:from-amber-400 dark:to-amber-600">
                {selectedCategory}
              </h3>
            </div>

            {currentAzkar.map((zikr, index) => {
              const maxCount = parseInt(zikr.count) || 1;
              const currentCount = counters[index] || 0;
              const isCompleted = currentCount >= maxCount;

              return (
                <div 
                  key={index} 
                  className={`glass-panel p-6 md:p-8 rounded-3xl transition-all duration-500 border-2 ${
                    isCompleted 
                      ? 'border-emerald-400 dark:border-amber-500 bg-emerald-50/50 dark:bg-amber-900/10 shadow-lg scale-[1.01]' 
                      : 'border-transparent hover:border-emerald-200 dark:hover:border-slate-700'
                  }`}
                  style={{animationDelay: `${index * 0.05}s`}}
                >
                  <div className="text-xl md:text-2xl leading-[2] md:leading-[2.2] font-serif text-slate-800 dark:text-slate-100 text-justify mb-6">
                    {zikr.content}
                  </div>
                  
                  {zikr.description && (
                    <div className="text-sm md:text-base text-emerald-700 dark:text-amber-200/80 bg-emerald-100/50 dark:bg-slate-800/50 p-3 rounded-lg mb-6">
                      <span className="font-bold">فضل الذكر: </span>
                      {zikr.description}
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-4 mt-8 pt-6 border-t border-slate-200 dark:border-slate-800/50">
                    <div className="text-sm text-slate-500 dark:text-slate-400 flex-1">
                      المصدر: {zikr.reference || 'غير محدد'}
                    </div>

                    <button 
                      onClick={() => handleIncrement(index, maxCount)}
                      disabled={isCompleted}
                      className={`relative overflow-hidden group flex items-center gap-3 px-6 py-3 rounded-2xl font-bold transition-all duration-300 ${
                        isCompleted
                          ? 'bg-emerald-100 dark:bg-slate-800 text-emerald-600 dark:text-amber-500 cursor-default'
                          : 'bg-gradient-to-l from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 dark:from-amber-500 dark:to-amber-600 dark:hover:from-amber-600 dark:hover:to-amber-700 text-white shadow-md hover:shadow-xl hover:-translate-y-1'
                      }`}
                    >
                      {isCompleted ? (
                        <>
                          <CheckCircle className="w-6 h-6 animate-scale-in" />
                          <span>اكتمل التكرار</span>
                        </>
                      ) : (
                        <>
                          <span className="relative z-10 flex items-center gap-2">
                            اضغط للتسبيح
                            <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                              {currentCount} / {maxCount}
                            </span>
                          </span>
                          {/* Ripple effect on hover */}
                          <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-active:scale-x-100 transition-transform origin-left duration-300"></div>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
            
            {currentAzkar.length === 0 && (
              <div className="text-center py-20 text-slate-500 dark:text-slate-400 glass-panel rounded-3xl">
                لا توجد أذكار في هذا القسم حالياً.
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
