import { useState, useMemo, useEffect } from 'react';
import { useJournal } from './hooks/useJournal';
import type { JournalEntry, FilterState, User as AppUser } from './types';
import { JournalCard } from './components/JournalCard';
import { JournalForm } from './components/JournalForm';
import { Auth } from './components/Auth';
import { exportToPDF } from './utils/pdfExport';
import { showAlert } from './utils/swal';
import { useTranslation } from './utils/i18n';

// New Layout Components
import { LayoutDecorations } from './components/layout/LayoutDecorations';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { TimelineHeader } from './components/feed/TimelineHeader';
import { LoadingState } from './components/feed/LoadingState';
import { EmptyState } from './components/feed/EmptyState';

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
      <LayoutDecorations />

      <Header 
        user={user}
        language={language}
        toggleLanguage={toggleLanguage}
        onOpenMenu={() => setIsMobileMenuOpen(true)}
        onExport={handleGlobalExport}
        onAddNew={handleAddNew}
        onLogout={handleLogout}
      />

      <div className="flex-1 min-h-0 flex relative overflow-hidden max-w-[1600px] mx-auto w-full px-4 sm:px-8 gap-8 py-6 sm:py-10 z-10">
        <Sidebar 
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          filters={filters}
          setFilters={setFilters}
          availableTools={availableTools}
          entries={entries}
        />

        <main className="flex-1 min-h-0 flex flex-col overflow-hidden">
          <TimelineHeader count={filteredEntries.length} />

          <div className="flex-1 overflow-y-auto pr-2 sm:pr-6 custom-scrollbar min-h-0 relative z-20">
            {loading ? (
              <LoadingState />
            ) : filteredEntries.length > 0 ? (
              <div className="space-y-8 sm:space-y-10 pb-24">
                {filteredEntries.map((entry) => (
                  <div key={entry.id} className="animate-slide-up">
                    <JournalCard entry={entry} onEdit={handleEdit} onDelete={deleteEntry} onExport={exportToPDF} />
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState onAddNew={handleAddNew} />
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
