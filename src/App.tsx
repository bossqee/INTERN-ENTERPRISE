import { useState, useMemo, useEffect } from 'react';
import { useJournal } from './hooks/useJournal';
import type { JournalEntry, FilterState, User as AppUser } from './types';
import { JournalCard } from './components/JournalCard';
import { JournalForm } from './components/JournalForm';
import { Filters } from './components/Filters';
import { Auth } from './components/Auth';
import { exportToPDF } from './utils/pdfExport';
import { Plus, BookOpen, FileDown, LogOut, Loader2, BarChart3, Search, Languages } from 'lucide-react';
import { showAlert } from './utils/swal';
import { useTranslation } from './utils/i18n';

function App() {
  const { t, language, setLanguage } = useTranslation();
  const [user, setUser] = useState<AppUser | null>(null);
  const { entries, loading, addEntry, updateEntry, deleteEntry } = useJournal(user?.id);
  const [isFormOpen, setIsFormOpen] = useState(false);
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
    <div className="fixed inset-0 w-screen h-screen bg-[#050505] text-zinc-100 flex flex-col overflow-hidden font-sans selection:bg-blue-500/30">
      {/* Background Glows */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Header */}
      <header className="h-16 flex-shrink-0 bg-zinc-950/70 backdrop-blur-3xl border-b border-white/[0.05] z-50">
        <div className="max-w-[1600px] mx-auto h-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
              <BookOpen size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight text-white leading-none mb-1">
                Journal<span className="text-blue-500">Pro</span>
              </h1>
              <span className="text-[9px] text-zinc-500 font-bold tracking-widest uppercase bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
                {user.firstName} {user.lastName}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-zinc-400 hover:text-white transition-all uppercase tracking-widest"
            >
              <Languages size={14} className="text-blue-500" />
              {language === 'th' ? 'EN' : 'TH'}
            </button>
            <div className="w-px h-6 bg-white/10 mx-1" />
            <button
              onClick={handleGlobalExport}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-xl transition-all border border-white/5"
            >
              <FileDown size={16} />
              <span className="text-[11px] font-black uppercase tracking-wider">{t('export')}</span>
            </button>
            <button
              onClick={handleAddNew}
              className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all shadow-lg shadow-blue-600/20 font-black active:scale-[0.98]"
            >
              <Plus size={18} />
              <span className="text-[11px] font-black uppercase tracking-wider">{t('createLog')}</span>
            </button>
            <div className="w-px h-6 bg-white/10 mx-1" />
            <button
              onClick={handleLogout}
              className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
              title={t('logout')}
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex-1 min-h-0 flex overflow-hidden max-w-[1600px] mx-auto w-full px-6 gap-6 py-6 z-10">
        <aside className="w-72 flex-shrink-0 flex flex-col gap-5 overflow-hidden">
          <div className="flex-1 min-h-0 flex flex-col glass-card rounded-[2.5rem] border border-white/[0.05] overflow-hidden">
            <div className="p-5 border-b border-white/[0.05] bg-white/[0.02] flex items-center gap-3 flex-shrink-0">
              <Search size={16} className="text-blue-500" />
              <h2 className="text-[11px] font-black text-zinc-300 uppercase tracking-[0.2em]">{t('filterSystem')}</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              <Filters
                filters={filters}
                setFilters={setFilters}
                availableTools={availableTools}
              />
            </div>
          </div>

          <div className="glass-card rounded-[2.5rem] p-5 border border-white/[0.05] flex-shrink-0">
            <div className="flex items-center gap-3 mb-4">
              <BarChart3 size={16} className="text-indigo-500" />
              <h3 className="text-[11px] font-black text-zinc-300 uppercase tracking-[0.2em]">{t('insights')}</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-zinc-950 p-4 rounded-2xl border border-white/[0.03] text-center">
                <p className="text-[9px] font-black text-zinc-600 uppercase mb-1">{t('records')}</p>
                <p className="text-2xl font-black text-white">{entries.length}</p>
              </div>
              <div className="bg-zinc-950 p-4 rounded-2xl border border-white/[0.03] text-center">
                <p className="text-[9px] font-black text-zinc-600 uppercase mb-1">{t('stack')}</p>
                <p className="text-2xl font-black text-white">{availableTools.length}</p>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 min-h-0 flex flex-col overflow-hidden">
          <div className="flex items-end justify-between mb-5 flex-shrink-0">
            <div>
              <h2 className="text-4xl font-black text-white tracking-tighter">{t('timeline')}</h2>
              <div className="flex items-center gap-2 mt-1.5">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                  {t('liveSync')}: {filteredEntries.length} {t('entriesActive')}
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-3 custom-scrollbar min-h-0">
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center glass-card rounded-[3rem]">
                <Loader2 className="animate-spin text-blue-500 mb-4" size={32} />
                <p className="text-[10px] text-zinc-500 font-bold tracking-[0.3em] uppercase animate-pulse">{t('decrypting')}</p>
              </div>
            ) : filteredEntries.length > 0 ? (
              <div className="space-y-6 pb-10">
                {filteredEntries.map((entry) => (
                  <div key={entry.id} className="animate-slide-up">
                    <JournalCard
                      entry={entry}
                      onEdit={handleEdit}
                      onDelete={deleteEntry}
                      onExport={exportToPDF}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center glass-card rounded-[3rem] border border-dashed border-white/10">
                <BookOpen size={32} className="text-zinc-800 mb-4" />
                <h3 className="text-white font-bold text-xl tracking-tight">{t('noResults')}</h3>
                <p className="text-zinc-600 text-sm mt-1">{t('refineSearch')}</p>
                <button
                  onClick={handleAddNew}
                  className="mt-8 px-8 py-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl transition-all font-bold text-xs uppercase tracking-widest border border-white/5"
                >
                  {t('createInitial')}
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      {isFormOpen && (
        <JournalForm
          initialEntry={editingEntry}
          onSave={addEntry}
          onUpdate={updateEntry}
          onClose={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
}

export default App;
