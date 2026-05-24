import { Search, Sparkles, X } from 'lucide-react';
import { Filters } from '../Filters';
import { StatsInsights } from './StatsInsights';
import { useTranslation } from '../../utils/i18n';
import type { FilterState, JournalEntry } from '../../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  availableTools: string[];
  entries: JournalEntry[];
}

export function Sidebar({
  isOpen,
  onClose,
  filters,
  setFilters,
  availableTools,
  entries,
}: SidebarProps) {
  const { t } = useTranslation();

  return (
    <>
      <aside className={`
        fixed lg:relative inset-y-0 left-0 z-[60] w-[300px] bg-[#050505]/95 lg:bg-transparent backdrop-blur-2xl lg:backdrop-blur-0
        transform transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1)
        ${isOpen ? 'translate-x-0 shadow-[40px_0_100px_rgba(0,0,0,0.9)]' : '-translate-x-full lg:translate-x-0'}
        flex flex-col h-full overflow-hidden
      `}>
        <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-6 pr-2 lg:pr-0">
          <div className="lg:hidden flex items-center justify-between mb-2 p-6 pb-0">
            <div className="flex items-center gap-3">
              <Sparkles size={20} className="text-blue-500 animate-pulse" />
              <span className="text-[11px] font-black text-white uppercase tracking-[0.3em]">{t('filterSystem')}</span>
            </div>
            <button onClick={onClose} className="p-2 text-zinc-500 hover:text-white transition-colors">
              <X size={28} />
            </button>
          </div>

          <div className="flex-shrink-0 flex flex-col glass-card rounded-[2.5rem] overflow-hidden">
            <div className="p-6 border-b border-white/[0.05] bg-white/[0.02] flex items-center gap-4">
              <Search size={16} className="text-blue-500" />
              <h2 className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.3em]">{t('filterSystem')}</h2>
            </div>
            <div className="p-6">
              <Filters filters={filters} setFilters={setFilters} availableTools={availableTools} />
            </div>
          </div>

          <div className="flex-shrink-0">
            <StatsInsights entries={entries} availableTools={availableTools} />
          </div>
        </div>
      </aside>

      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 lg:hidden animate-in fade-in duration-500" 
          onClick={onClose} 
        />
      )}
    </>
  );
}
