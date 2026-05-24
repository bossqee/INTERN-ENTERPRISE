import { Search, Filter, Calendar, X, Hash, RotateCcw } from 'lucide-react';
import type { FilterState } from '../types';
import { useTranslation } from '../utils/i18n';

interface FiltersProps {
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  availableTools: string[];
}

export function Filters({ filters, setFilters, availableTools }: FiltersProps) {
  const { t } = useTranslation();

  const resetFilters = () => {
    setFilters({
      search: '',
      tool: '',
      startDate: '',
      endDate: '',
    });
  };

  const hasActiveFilters = filters.search || filters.tool || filters.startDate || filters.endDate;

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Search Input */}
      <div className="space-y-2.5 group">
        <div className="flex items-center gap-2 ml-1 text-zinc-500 group-focus-within:text-blue-500 transition-colors">
          <Search size={14} />
          <label className="text-[10px] font-black uppercase tracking-[0.2em]">{t('keywords')}</label>
        </div>
        <div className="relative">
          <input
            type="text"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            placeholder="Search keywords..."
            className="w-full bg-zinc-950 border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-zinc-800 focus:outline-none focus:ring-1 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all font-medium"
          />
        </div>
      </div>

      {/* Tool Selector */}
      <div className="space-y-2.5 group">
        <div className="flex items-center gap-2 ml-1 text-zinc-500 group-focus-within:text-indigo-500 transition-colors">
          <Hash size={14} />
          <label className="text-[10px] font-black uppercase tracking-[0.2em]">{t('technology')}</label>
        </div>
        <div className="relative">
          <select
            value={filters.tool}
            onChange={(e) => setFilters({ ...filters, tool: e.target.value })}
            className="w-full bg-zinc-950 border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/40 focus:border-indigo-500/40 transition-all appearance-none cursor-pointer font-medium"
          >
            <option value="" className="bg-zinc-900">{t('allTech')}</option>
            {availableTools.map((tool) => (
              <option key={tool} value={tool} className="bg-zinc-900">
                {tool}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-600">
            <Filter size={14} />
          </div>
        </div>
      </div>

      {/* Date Range */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 ml-1 text-zinc-500">
          <Calendar size={14} />
          <label className="text-[10px] font-black uppercase tracking-[0.2em]">{t('timelineRange')}</label>
        </div>
        <div className="grid grid-cols-1 gap-2">
          <div className="relative group">
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              className="w-full bg-zinc-950 border border-white/[0.08] rounded-xl px-4 py-2.5 text-[11px] text-white focus:outline-none focus:ring-1 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all [color-scheme:dark] font-medium"
            />
          </div>
          <div className="relative group">
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              className="w-full bg-zinc-950 border border-white/[0.08] rounded-xl px-4 py-2.5 text-[11px] text-white focus:outline-none focus:ring-1 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all [color-scheme:dark] font-medium"
            />
          </div>
        </div>
      </div>

      {/* Reset Action */}
      {hasActiveFilters && (
        <button
          onClick={resetFilters}
          className="flex items-center justify-center gap-2 py-3 mt-1 rounded-xl bg-white/[0.03] hover:bg-red-500/10 text-zinc-500 hover:text-red-400 border border-white/[0.08] hover:border-red-500/30 transition-all duration-300 group"
        >
          <RotateCcw size={14} className="group-hover:-rotate-90 transition-transform duration-500" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">{t('clearFilters')}</span>
        </button>
      )}
    </div>
  );
}
