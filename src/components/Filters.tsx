import { Search, Filter, Calendar, X } from 'lucide-react';
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
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            placeholder="Search titles or content..."
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
          />
        </div>

        {/* Tool Filter */}
        <div className="relative min-w-[200px]">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <select
            value={filters.tool}
            onChange={(e) => setFilters({ ...filters, tool: e.target.value })}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all appearance-none cursor-pointer"
          >
            <option value="">All Tools</option>
            {availableTools.map((tool) => (
              <option key={tool} value={tool}>
                {tool}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="flex items-center gap-2 flex-1 w-full">
          <Calendar className="text-zinc-500" size={18} />
          <div className="flex items-center gap-2 flex-1">
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
            />
            <span className="text-zinc-600">to</span>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
            />
          </div>
        </div>

        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-2 px-4 py-2 text-zinc-400 hover:text-white transition-colors text-sm"
          >
            <X size={14} /> Clear Filters
          </button>
        )}
      </div>
    </div>
  );
}
