import { useState, useEffect } from 'react';
import { Moon, Sun, Menu, BookOpen } from 'lucide-react';
import Sidebar from './components/Sidebar';
import HomeView from './components/HomeView';
import TafsirView from './components/TafsirView';
import QuranIndexView from './components/QuranIndexView';
import AzkarView from './components/AzkarView';
import './App.css';

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [activeView, setActiveView] = useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Apply theme to body
  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const renderView = () => {
    switch (activeView) {
      case 'home': return <HomeView />;
      case 'tafsir': return <TafsirView />;
      case 'quran': return <QuranIndexView />;
      case 'azkar': return <AzkarView />;
      default: return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-slate-50 to-emerald-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-850 transition-colors duration-500 pb-20 font-sans" dir="rtl">
      
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
        activeView={activeView}
        setActiveView={setActiveView}
      />

      {/* Header */}
      <header className="sticky top-0 z-40 glass-panel border-b border-emerald-100 dark:border-slate-800 px-4 md:px-6 py-4 flex justify-between items-center mb-6">
        <div className="flex items-center gap-3 md:gap-4">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-full hover:bg-emerald-100 dark:hover:bg-slate-800 text-emerald-700 dark:text-amber-500 transition-colors"
          >
            <Menu size={28} />
          </button>
          <BookOpen className="text-emerald-600 dark:text-amber-500 w-7 h-7 hidden sm:block" />
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-l from-emerald-600 to-emerald-800 dark:from-amber-400 dark:to-amber-600">
            نور القرآن
          </h1>
        </div>
        <button 
          onClick={toggleTheme} 
          className="p-2 rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-slate-800 dark:text-amber-400 dark:hover:bg-slate-700 transition-all duration-300 hover:scale-110 active:scale-95 shadow-sm"
          aria-label="Toggle Dark Mode"
        >
          {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
        </button>
      </header>

      <main className="container mx-auto px-4 max-w-5xl animate-fade-in relative z-10 min-h-[70vh]">
        {renderView()}
      </main>
    </div>
  );
}

export default App;
