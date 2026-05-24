import { useTranslation } from '../../utils/i18n';

interface TimelineHeaderProps {
  count: number;
}

export function TimelineHeader({ count }: TimelineHeaderProps) {
  const { t } = useTranslation();

  return (
    <div className="flex items-end justify-between mb-8 sm:mb-10 flex-shrink-0 px-2">
      <div className="animate-slide-up">
        <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tighter leading-none">{t('timeline')}</h2>
        <div className="flex items-center gap-3 mt-4">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.8)]" />
          <p className="text-[10px] sm:text-[12px] text-zinc-500 font-bold uppercase tracking-[0.3em]">
            {t('liveSync')}: <span className="text-white">{count}</span> {t('entriesActive')}
          </p>
        </div>
      </div>
    </div>
  );
}
