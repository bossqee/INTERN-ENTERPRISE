import { BarChart3, TrendingUp, Cpu } from 'lucide-react';
import { useTranslation } from '../../utils/i18n';
import type { JournalEntry } from '../../types';
import { useMemo } from 'react';

interface StatsInsightsProps {
  entries: JournalEntry[];
  availableTools: string[];
}

export function StatsInsights({ entries, availableTools }: StatsInsightsProps) {
  const { t } = useTranslation();

  const toolStats = useMemo(() => {
    const counts: Record<string, number> = {};
    entries.forEach(entry => {
      entry.tools.forEach(tool => {
        counts[tool] = (counts[tool] || 0) + 1;
      });
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
  }, [entries]);

  return (
    <div className="glass-card rounded-[2.5rem] p-6 bg-gradient-to-br from-blue-600/[0.04] to-transparent space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-4">
          <BarChart3 size={18} className="text-indigo-500" />
          <h3 className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.3em]">{t('insights')}</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-black/60 p-4 rounded-2xl border border-white/[0.03] text-center group/stat hover:border-blue-500/30 transition-all">
            <p className="text-[8px] font-black text-zinc-600 uppercase mb-1 tracking-widest">{t('records')}</p>
            <p className="text-2xl font-black text-white group-hover/stat:text-blue-500 transition-colors">{entries.length}</p>
          </div>
          <div className="bg-black/60 p-4 rounded-2xl border border-white/[0.03] text-center group/stat hover:border-indigo-500/30 transition-all">
            <p className="text-[8px] font-black text-zinc-600 uppercase mb-1 tracking-widest">{t('stack')}</p>
            <p className="text-2xl font-black text-white group-hover/stat:text-indigo-500 transition-colors">{availableTools.length}</p>
          </div>
        </div>
      </div>

      {toolStats.length > 0 && (
        <div className="animate-reveal" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp size={16} className="text-emerald-500" />
            <h4 className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Top Technologies</h4>
          </div>
          <div className="space-y-2.5">
            {toolStats.map(([tool, count], index) => (
              <div key={tool} className="flex items-center gap-3 group/tool">
                <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-white/5 flex items-center justify-center text-[9px] font-black text-zinc-500 group-hover/tool:text-blue-400 group-hover/tool:border-blue-500/30 transition-all">
                  0{index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-bold text-zinc-300">{tool}</span>
                    <span className="text-[9px] font-black text-zinc-500">{count}</span>
                  </div>
                  <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-1000"
                      style={{ width: `${(count / entries.length) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="pt-4 border-t border-white/[0.03]">
        <div className="flex items-center gap-3 px-3 py-2.5 bg-white/[0.02] rounded-xl border border-white/[0.03]">
          <Cpu size={14} className="text-zinc-600" />
          <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">System Operational</span>
          <div className="ml-auto w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
}
