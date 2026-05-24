import { BookOpen, FileDown, LogOut, Plus, Languages, Menu } from 'lucide-react';
import { useTranslation } from '../../utils/i18n';
import type { User } from '../../types';

interface HeaderProps {
  user: User;
  onOpenMenu: () => void;
  toggleLanguage: () => void;
  language: string;
  onExport: () => void;
  onAddNew: () => void;
  onLogout: () => void;
}

export function Header({
  user,
  onOpenMenu,
  toggleLanguage,
  language,
  onExport,
  onAddNew,
  onLogout,
}: HeaderProps) {
  const { t } = useTranslation();

  return (
    <header className="h-16 sm:h-20 flex-shrink-0 bg-zinc-950/40 backdrop-blur-3xl border-b border-white/[0.05] z-50">
      <div className="max-w-[1600px] mx-auto h-full px-4 sm:px-8 flex items-center justify-between">
        
        <div className="flex items-center gap-3 sm:gap-6 group">
          <button 
            onClick={onOpenMenu}
            className="lg:hidden p-2.5 text-zinc-400 hover:text-white bg-white/5 rounded-xl border border-white/5 transition-all active:scale-90"
          >
            <Menu size={20} />
          </button>
          
          <div className="flex items-center gap-3 sm:gap-4 cursor-default">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-600 blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-2xl transition-transform group-hover:rotate-12 duration-500">
                <BookOpen size={22} className="text-white" />
              </div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg sm:text-2xl font-black tracking-tighter text-white leading-none mb-1.5 animate-reveal">
                Journal<span className="text-blue-500 drop-shadow-[0_0_10px_rgba(59,130,246,0.3)]">Pro</span>
              </h1>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                <span className="text-[9px] sm:text-[10px] text-zinc-500 font-black tracking-[0.2em] uppercase truncate max-w-[100px] sm:max-w-none">
                  {user.firstName} {user.lastName}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-5">
          <button 
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-zinc-400 hover:text-white hover:bg-white/10 transition-all uppercase tracking-widest backdrop-blur-md"
          >
            <Languages size={14} className="text-blue-500" />
            <span className="hidden xs:inline">{language === 'th' ? 'EN' : 'TH'}</span>
          </button>

          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={onExport}
              className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-xl transition-all border border-white/5 group/btn"
            >
              <FileDown size={16} className="group-hover/btn:-translate-y-0.5 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-widest">{t('export')}</span>
            </button>
          </div>

          <button
            onClick={onAddNew}
            className="relative group/add"
          >
            <div className="absolute inset-0 bg-blue-600 rounded-xl sm:rounded-2xl blur-lg opacity-20 group-hover/add:opacity-40 transition-opacity" />
            <div className="relative flex items-center justify-center w-10 h-10 sm:w-auto sm:px-6 sm:py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl sm:rounded-2xl transition-all shadow-lg active:scale-95 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/add:translate-x-full transition-transform duration-1000" />
              <Plus size={20} className="group-hover/add:rotate-90 transition-transform duration-500" />
              <span className="hidden sm:inline ml-2 text-[10px] font-black uppercase tracking-widest">{t('createLog')}</span>
            </div>
          </button>

          <button
            onClick={onLogout}
            className="p-2.5 text-zinc-600 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all active:scale-90"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
