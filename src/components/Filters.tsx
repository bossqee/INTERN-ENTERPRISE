import { Search, Filter, Calendar, X, Hash } from 'lucide-react';
import type { FilterState } from '../types';

interface FiltersProps {
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  availableTools: string[];
}

export function Filters({ filters, setFilters, availableTools }: FiltersProps) {
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
    <div className="flex flex-col gap-6 w-full max-w-full overflow-x-hidden">
      {/* Search Input - Elite Minimalist */}
      <div className="space-y-2 group">
        <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] ml-1 group-focus-within:text-blue-500 transition-colors">Keywords</label>
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within:text-blue-500 transition-colors" size={14} />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            placeholder="Title, Content..."
            className="w-full bg-zinc-950/50 border border-white/[0.05] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-zinc-800 focus:outline-none focus:ring-1 focus:ring-blue-500/30 focus:border-blue-500/30 transition-all"
          />
        </div>
      </div>

      {/* Tool Selector - Ultra Compact Grid */}
      <div className="space-y-2 group">
        <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] ml-1 group-focus-within:text-blue-500 transition-colors">Technology</label>
        <div className="relative">
          <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within:text-blue-500 transition-colors" size={14} />
          <select
            value={filters.tool}
            onChange={(e) => setFilters({ ...filters, tool: e.target.value })}
            className="w-full bg-zinc-950/50 border border-white/[0.05] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500/30 focus:border-blue-500/30 transition-all appearance-none cursor-pointer"
          >
            <option value="" className="bg-zinc-900">All Technologies</option>
            {availableTools.map((tool) => (
              <option key={tool} value={tool} className="bg-zinc-900">
                {tool}
              </option>
            ))}
          </select>
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
            <Filter size={10} className="text-white" />
          </div>
        </div>
      </div>

      {/* Date Range - Precision Vertical Layout */}
      <div className="space-y-3">
        <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] ml-1">Timeline Range</label>
        <div className="flex flex-col gap-2">
          <div className="relative group">
            <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within:text-blue-500 transition-colors" size={14} />
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              className="w-full bg-zinc-950/50 border border-white/[0.05] rounded-xl pl-10 pr-4 py-2.5 text-[11px] text-white focus:outline-none focus:ring-1 focus:ring-blue-500/30 focus:border-blue-500/30 transition-all [color-scheme:dark]"
            />
          </div>
          <div className="relative group">
            <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within:text-blue-500 transition-colors" size={14} />
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              className="w-full bg-zinc-950/50 border border-white/[0.05] rounded-xl pl-10 pr-4 py-2.5 text-[11px] text-white focus:outline-none focus:ring-1 focus:ring-blue-500/30 focus:border-blue-500/30 transition-all [color-scheme:dark]"
            />
          </div>
        </div>
      </div>

      {/* Reset Action */}
      {hasActiveFilters && (
        <button
          onClick={resetFilters}
          className="flex items-center justify-center gap-2 py-3 mt-2 rounded-xl bg-white/[0.02] hover:bg-red-500/10 text-zinc-500 hover:text-red-400 border border-white/[0.05] hover:border-red-500/20 transition-all duration-300 group"
        >
          <X size={12} className="group-hover:rotate-90 transition-transform duration-300" />
          <span className="text-[10px] font-black uppercase tracking-widest">Clear All Parameters</span>
        </button>
      )}
    </div>
  );
}
