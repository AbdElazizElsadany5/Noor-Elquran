import { X, Home, Book, BookOpen, Heart } from 'lucide-react';

export default function Sidebar({ isOpen, setIsOpen, activeView, setActiveView }) {
  const menuItems = [
    { id: 'home', title: 'الرئيسية', icon: Home },
    { id: 'tafsir', title: 'تفسير القرآن', icon: Book },
    { id: 'quran', title: 'فهرس وقراءة', icon: BookOpen },
    { id: 'azkar', title: 'الأذكار', icon: Heart }
  ];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-72 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 flex justify-between items-center border-b border-emerald-100 dark:border-slate-800">
          <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-l from-emerald-600 to-emerald-800 dark:from-amber-400 dark:to-amber-600">القائمة</h2>
          <button onClick={() => setIsOpen(false)} className="p-2 rounded-full hover:bg-emerald-100 dark:hover:bg-slate-800 text-slate-500 transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <nav className="p-4 space-y-2">
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveView(item.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-amber-400 font-bold' 
                    : 'text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <Icon size={22} className={isActive ? 'text-emerald-600 dark:text-amber-500' : ''} />
                <span className="text-lg">{item.title}</span>
              </button>
            )
          })}
        </nav>
      </div>
    </>
  );
}
