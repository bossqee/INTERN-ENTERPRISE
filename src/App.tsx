import { useState, useMemo } from 'react';
import { useJournal } from './hooks/useJournal';
import type { JournalEntry, FilterState } from './types';
import { JournalCard } from './components/JournalCard';
import { JournalForm } from './components/JournalForm';
import { Filters } from './components/Filters';
import { exportToPDF } from './utils/pdfExport';
import { Plus, BookOpen, FileDown } from 'lucide-react';

function App() {
  const { entries, addEntry, updateEntry, deleteEntry } = useJournal();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    tool: '',
    startDate: '',
    endDate: '',
  });

  const availableTools = useMemo(() => {
    const tools = new Set<string>();
    entries.forEach((e) => e.tools.forEach((t) => tools.add(t)));
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
      alert('No entries to export with current filters.');
      return;
    }
    exportToPDF(filteredEntries);
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 selection:bg-blue-500/30">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
              <BookOpen size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
                Internship Journal
              </h1>
              <p className="text-xs text-zinc-500 font-medium tracking-wider uppercase">Professional Logbook</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleGlobalExport}
              className="hidden sm:flex items-center gap-2 px-4 py-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition-all border border-transparent hover:border-zinc-700"
            >
              <FileDown size={18} />
              <span className="text-sm font-medium">Export All</span>
            </button>
            <button
              onClick={handleAddNew}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all shadow-lg shadow-blue-600/20 font-semibold active:scale-[0.98]"
            >
              <Plus size={20} />
              <span className="hidden sm:inline">New Entry</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Sidebar Filters */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="sticky top-28">
              <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-widest mb-4">Filters</h2>
              <Filters
                filters={filters}
                setFilters={setFilters}
                availableTools={availableTools}
              />
              
              <div className="mt-8 p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
                <h3 className="text-sm font-semibold text-zinc-300 mb-2">Statistics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-500">Total Logs</span>
                    <span className="text-zinc-100 font-mono">{entries.length}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-500">Filtered</span>
                    <span className="text-zinc-100 font-mono">{filteredEntries.length}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-500">Tech Stack</span>
                    <span className="text-zinc-100 font-mono">{availableTools.length} tools</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Timeline / List */}
          <div className="lg:col-span-8 space-y-8">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold text-zinc-100">Journal Feed</h2>
              <div className="text-sm text-zinc-500">
                {loading ? 'Loading...' : `Showing ${filteredEntries.length} entries`}
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-32 bg-zinc-900/30 border border-zinc-800 rounded-3xl animate-pulse">
                <p className="text-zinc-500 font-medium">Fetching your journal...</p>
              </div>
            ) : filteredEntries.length > 0 ? (
              <div className="space-y-6">
                {filteredEntries.map((entry) => (
                  <JournalCard
                    key={entry.id}
                    entry={entry}
                    onEdit={handleEdit}
                    onDelete={deleteEntry}
                    onExport={exportToPDF}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-32 bg-zinc-900/30 border border-dashed border-zinc-800 rounded-3xl">
                <BookOpen size={48} className="text-zinc-700 mb-4" />
                <p className="text-zinc-400 font-medium">No journal entries found</p>
                <p className="text-zinc-600 text-sm mt-1">Try adjusting your filters or create a new log.</p>
                <button
                  onClick={handleAddNew}
                  className="mt-6 px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-xl transition-colors text-sm font-medium"
                >
                  Create your first entry
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="border-t border-zinc-800 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center border border-zinc-800">
              <BookOpen size={16} className="text-zinc-400" />
            </div>
            <span className="text-zinc-500 text-sm">© 2026 Internship Journal System</span>
          </div>
          
          <div className="flex items-center gap-8 text-sm text-zinc-500">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Documentation</a>
            <a href="https://github.com" className="flex items-center gap-2 hover:text-white transition-colors">
              <BookOpen size={16} />
              GitHub
            </a>
          </div>
        </div>
      </footer>

      {/* Modal Form */}
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
