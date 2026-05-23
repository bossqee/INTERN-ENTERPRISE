import { useState, useMemo, useEffect } from 'react';
import { useJournal } from './hooks/useJournal';
import type { JournalEntry, FilterState, User as AppUser } from './types';
import { JournalCard } from './components/JournalCard';
import { JournalForm } from './components/JournalForm';
import { Filters } from './components/Filters';
import { Auth } from './components/Auth';
import { exportToPDF } from './utils/pdfExport';
import { Plus, BookOpen, FileDown, LogOut, Loader2, BarChart3, Search, Languages, Menu, X, User as UserIcon, Sparkles } from 'lucide-react';
import { showAlert } from './utils/swal';
import { useTranslation } from './utils/i18n';

function App() {
  const { t, language, setLanguage } = useTranslation();
  const [user, setUser] = useState<AppUser | null>(null);
  const { entries, loading, addEntry, updateEntry, deleteEntry } = useJournal(user?.id);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    tool: '',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('journal_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLoginSuccess = (userData: AppUser) => {
    setUser(userData);
    localStorage.setItem('journal_user', JSON.stringify(userData));
  };

  const toggleLanguage = () => {
    setLanguage(language === 'th' ? 'en' : 'th');
  };

  const availableTools = useMemo(() => {
    const tools = new Set<string>();
    entries.forEach((e) => e.tools?.forEach((t) => tools.add(t)));
    return Array.from(tools).sort();
  }, [entries]);

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const matchesSearch =
        filters.search === '' ||
        entry.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        entry.content.toLowerCase().includes(filters.search.toLowerCase());

      const matchesTool = filters.tool === '' || entry.tools.includes(filters.tool);

      const entryDate = new Date(entry.date);
      const matchesStartDate = filters.startDate === '' || entryDate >= new Date(filters.startDate);
      const matchesEndDate = filters.endDate === '' || entryDate <= new Date(filters.endDate);

      return matchesSearch && matchesTool && matchesStartDate && matchesEndDate;
    });
  }, [entries, filters]);

  const handleEdit = (entry: JournalEntry) => {
    setEditingEntry(entry);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setEditingEntry(null);
    setIsFormOpen(true);
  };

  const handleGlobalExport = () => {
    if (filteredEntries.length === 0) {
      showAlert.error('Export Error', 'No entries to export with current filters.');
      return;
    }
    exportToPDF(filteredEntries);
  };

  const handleLogout = async () => {
    const confirmed = await showAlert.confirm(t('logoutConfirm'), t('logoutMessage'));
    if (confirmed) {
      localStorage.removeItem('journal_user');
      setUser(null);
    }
  };

  if (!user) {
    return <Auth onLogin={handleLoginSuccess} />;
  }

  return (
    <div className="fixed inset-0 w-full h-full bg-[#020202] text-zinc-100 flex flex-col overflow-hidden font-sans selection:bg-blue-500/30">
      
      {/* LUXURY DECORATIONS */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Animated Grid Mesh */}
        <div className="absolute inset-0 grid-mesh animate-mesh" />
        
        {/* Dynamic Glows */}
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-glow" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px] animate-glow" style={{ animationDelay: '3s' }} />
        
        {/* Floating Glass Orbs */}
        <div className="absolute top-[20%] left-[10%] w-32 h-32 bg-white/[0.01] border border-white/5 rounded-full backdrop-blur-3xl animate-float opacity-30" />
        <div className="absolute bottom-[30%] right-[15%] w-24 h-24 bg-blue-500/[0.02] border border-blue-500/10 rounded-full backdrop-blur-2xl animate-float opacity-20" style={{ animationDelay: '2s' }} />
      </div>

      {/* HEADER */}
      <header className="h-16 sm:h-20 flex-shrink-0 bg-zinc-950/40 backdrop-blur-3xl border-b border-white/[0.05] z-50">
        <div className="max-w-[1600px] mx-auto h-full px-4 sm:px-8 flex items-center justify-between">
          
          <div className="flex items-center gap-3 sm:gap-6 group">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2.5 text-zinc-400 hover:text-white bg-white/5 rounded-xl border border-white/5 transition-all active:scale-90"
            >
              <Menu size={20} />
            </button>
            
            <div className="flex items-center gap-3 sm:gap-4 cursor-default">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-600 blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
                <div className="relative w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-tr from-blue-600 to-indigo-700 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-2xl transition-transform group-hover:rotate-12 duration-500">
                  <BookOpen size={22} className="text-white" />
                </div>
              </div>
              <div className="flex flex-col">
                <h1 className="text-lg sm:text-2xl font-black tracking-tighter text-white leading-none mb-1.5 animate-reveal">
                  Journal<span className="text-blue-500 drop-shadow-[0_0_10px_rgba(59,130,246,0.3)]">Pro</span>
                </h1>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                  <span className="text-[9px] sm:text-[10px] text-zinc-500 font-black tracking-[0.2em] uppercase truncate max-w-[100px] sm:max-w-none">
                    {user.firstName} {user.lastName}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-5">
            <button 
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-zinc-400 hover:text-white hover:bg-white/10 transition-all uppercase tracking-widest backdrop-blur-md"
            >
              <Languages size={14} className="text-blue-500" />
              <span className="hidden xs:inline">{language === 'th' ? 'EN' : 'TH'}</span>
            </button>

            <div className="hidden sm:flex items-center gap-3">
              <button
                onClick={handleGlobalExport}
                className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-xl transition-all border border-white/5 group/btn"
              >
                <FileDown size={16} className="group-hover/btn:-translate-y-0.5 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-widest">{t('export')}</span>
              </button>
            </div>

            <button
              onClick={handleAddNew}
              className="relative group/add"
            >
              <div className="absolute inset-0 bg-blue-600 rounded-xl sm:rounded-2xl blur-lg opacity-20 group-hover/add:opacity-40 transition-opacity" />
              <div className="relative flex items-center justify-center w-10 h-10 sm:w-auto sm:px-6 sm:py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl sm:rounded-2xl transition-all shadow-lg active:scale-95 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/add:translate-x-full transition-transform duration-1000" />
                <Plus size={20} className="group-hover/add:rotate-90 transition-transform duration-500" />
                <span className="hidden sm:inline ml-2 text-[10px] font-black uppercase tracking-widest">{t('createLog')}</span>
              </div>
            </button>

            <button
              onClick={handleLogout}
              className="p-2.5 text-zinc-600 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all active:scale-90"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* DASHBOARD BODY */}
      <div className="flex-1 min-h-0 flex relative overflow-hidden max-w-[1600px] mx-auto w-full px-4 sm:px-8 gap-8 py-6 sm:py-10 z-10">
        
        {/* Sidebar */}
        <aside className={`
          fixed lg:relative inset-y-0 left-0 z-[60] w-[320px] bg-[#050505]/95 lg:bg-transparent backdrop-blur-2xl lg:backdrop-blur-0
          transform transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1)
          ${isMobileMenuOpen ? 'translate-x-0 shadow-[40px_0_100px_rgba(0,0,0,0.9)]' : '-translate-x-full lg:translate-x-0'}
          flex flex-col gap-8 p-10 lg:p-0
        `}>
          <div className="lg:hidden flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <Sparkles size={20} className="text-blue-500 animate-pulse" />
              <span className="text-[11px] font-black text-white uppercase tracking-[0.3em]">{t('filterSystem')}</span>
            </div>
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-zinc-500 hover:text-white transition-colors">
              <X size={28} />
            </button>
          </div>

          <div className="flex-1 min-h-0 flex flex-col glass-card rounded-[3rem] overflow-hidden">
            <div className="p-7 border-b border-white/[0.05] bg-white/[0.02] flex items-center gap-4">
              <Search size={18} className="text-blue-500" />
              <h2 className="text-[11px] font-black text-zinc-300 uppercase tracking-[0.3em]">{t('filterSystem')}</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <Filters filters={filters} setFilters={setFilters} availableTools={availableTools} />
            </div>
          </div>

          <div className="glass-card rounded-[3rem] p-8 bg-gradient-to-br from-blue-600/[0.04] to-transparent">
            <div className="flex items-center gap-4 mb-6">
              <BarChart3 size={20} className="text-indigo-500" />
              <h3 className="text-[11px] font-black text-zinc-300 uppercase tracking-[0.3em]">{t('insights')}</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/60 p-6 rounded-[2rem] border border-white/[0.03] text-center group/stat hover:border-blue-500/30 transition-all">
                <p className="text-[9px] font-black text-zinc-600 uppercase mb-2 tracking-widest">{t('records')}</p>
                <p className="text-3xl font-black text-white group-hover/stat:text-blue-500 transition-colors">{entries.length}</p>
              </div>
              <div className="bg-black/60 p-6 rounded-[2rem] border border-white/[0.03] text-center group/stat hover:border-indigo-500/30 transition-all">
                <p className="text-[9px] font-black text-zinc-600 uppercase mb-2 tracking-widest">{t('stack')}</p>
                <p className="text-3xl font-black text-white group-hover/stat:text-indigo-500 transition-colors">{availableTools.length}</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Backdrop overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 lg:hidden animate-in fade-in duration-500" onClick={() => setIsMobileMenuOpen(false)} />
        )}

        {/* Main Feed */}
        <main className="flex-1 min-h-0 flex flex-col overflow-hidden">
          <div className="flex items-end justify-between mb-8 sm:mb-10 flex-shrink-0 px-2">
            <div className="animate-slide-up">
              <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tighter leading-none">{t('timeline')}</h2>
              <div className="flex items-center gap-3 mt-4">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.8)]" />
                <p className="text-[10px] sm:text-[12px] text-zinc-500 font-bold uppercase tracking-[0.3em]">
                  {t('liveSync')}: <span className="text-white">{filteredEntries.length}</span> {t('entriesActive')}
                </p>
              </div>
            </div>
          </div>

          {/* Feed Scroll Zone */}
          <div className="flex-1 overflow-y-auto pr-2 sm:pr-6 custom-scrollbar min-h-0 relative z-20">
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center glass-card rounded-[4rem] p-12">
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20 animate-pulse" />
                  <Loader2 className="animate-spin text-blue-500 relative" size={56} />
                </div>
                <p className="text-[12px] text-zinc-500 font-black tracking-[0.5em] uppercase animate-pulse">{t('decrypting')}</p>
              </div>
            ) : filteredEntries.length > 0 ? (
              <div className="space-y-8 sm:space-y-10 pb-24">
                {filteredEntries.map((entry) => (
                  <div key={entry.id} className="animate-slide-up">
                    <JournalCard entry={entry} onEdit={handleEdit} onDelete={deleteEntry} onExport={exportToPDF} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center glass-card rounded-[4rem] border border-dashed border-white/10 px-12 text-center animate-slide-up">
                <div className="w-24 h-24 bg-zinc-900/50 rounded-[2.5rem] flex items-center justify-center mb-10 border border-white/5 shadow-2xl relative">
                  <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-10 animate-pulse" />
                  <BookOpen size={40} className="text-zinc-700 relative" />
                </div>
                <h3 className="text-white font-black text-3xl tracking-tight mb-3">{t('noResults')}</h3>
                <p className="text-zinc-500 text-[15px] font-medium leading-relaxed max-w-[320px] mb-12">{t('refineSearch')}</p>
                <button
                  onClick={handleAddNew}
                  className="relative group/empty-btn"
                >
                  <div className="absolute inset-0 bg-blue-600 rounded-[2rem] blur-xl opacity-20 group-hover/empty-btn:opacity-40 transition-opacity" />
                  <div className="relative px-12 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-[2rem] transition-all font-black text-xs uppercase tracking-[0.3em] shadow-2xl active:scale-95">
                    {t('createInitial')}
                  </div>
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      {isFormOpen && (
        <JournalForm initialEntry={editingEntry} onSave={addEntry} onUpdate={updateEntry} onClose={() => setIsFormOpen(false)} />
      )}
    </div>
  );
}

export default App;
