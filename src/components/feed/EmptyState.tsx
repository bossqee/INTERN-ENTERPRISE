import { BookOpen } from 'lucide-react';
import { useTranslation } from '../../utils/i18n';

interface EmptyStateProps {
  onAddNew: () => void;
}

export function EmptyState({ onAddNew }: EmptyStateProps) {
  const { t } = useTranslation();

  return (
    <div className="h-full flex flex-col items-center justify-center glass-card rounded-[4rem] border border-dashed border-white/10 px-12 text-center animate-slide-up">
      <div className="w-24 h-24 bg-zinc-900/50 rounded-[2.5rem] flex items-center justify-center mb-10 border border-white/5 shadow-2xl relative">
        <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-10 animate-pulse" />
        <BookOpen size={40} className="text-zinc-700 relative" />
      </div>
      <h3 className="text-white font-black text-3xl tracking-tight mb-3">{t('noResults')}</h3>
      <p className="text-zinc-500 text-[15px] font-medium leading-relaxed max-w-[320px] mb-12">{t('refineSearch')}</p>
      <button
        onClick={onAddNew}
        className="relative group/empty-btn"
      >
        <div className="absolute inset-0 bg-blue-600 rounded-[2rem] blur-xl opacity-20 group-hover/empty-btn:opacity-40 transition-opacity" />
        <div className="relative px-12 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-[2rem] transition-all font-black text-xs uppercase tracking-[0.3em] shadow-2xl active:scale-95">
          {t('createInitial')}
        </div>
      </button>
    </div>
  );
}
