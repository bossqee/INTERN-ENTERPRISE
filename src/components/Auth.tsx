import { useState } from 'react';
import { BookOpen, Lock, ArrowRight, Loader2, BadgeCheck, IdCard, Users, Mail, Languages } from 'lucide-react';
import { supabase } from '../utils/supabase';
import { showAlert } from '../utils/swal';
import { useTranslation } from '../utils/i18n';

interface AuthProps {
  onLogin: (user: any) => void;
}

export function Auth({ onLogin }: AuthProps) {
  const { t, language, setLanguage } = useTranslation();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');

  const toggleLanguage = () => {
    setLanguage(language === 'th' ? 'en' : 'th');
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{4}$/.test(employeeId)) {
      showAlert.error(t('authError'), t('idError'));
      return;
    }
    setLoading(true);

    try {
      if (isLogin) {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('employee_id', employeeId)
          .eq('password', password)
          .single();

        if (error || !data) throw new Error(language === 'th' ? 'รหัสพนักงานหรือรหัสผ่านไม่ถูกต้อง' : 'Invalid Employee ID or Password');
        
        onLogin({
          id: data.id,
          email: data.email,
          firstName: data.first_name,
          lastName: data.last_name,
          employeeId: data.employee_id,
        });
        showAlert.success(t('loginSuccess'), t('loginWelcome'));
      } else {
        const { data: existingUser } = await supabase
          .from('users')
          .select('id')
          .eq('employee_id', employeeId)
          .single();

        if (existingUser) throw new Error(language === 'th' ? 'รหัสพนักงานนี้ถูกใช้งานแล้ว' : 'This Employee ID is already registered');

        const { data, error } = await supabase
          .from('users')
          .insert([{
            email,
            first_name: firstName,
            last_name: lastName,
            employee_id: employeeId,
            password: password
          }])
          .select()
          .single();

        if (error) throw error;
        if (data) {
          showAlert.success(t('registerSuccess'), t('registerMessage'));
          setIsLogin(true);
        }
      }
    } catch (error: any) {
      showAlert.error(t('authError'), error.message || (language === 'th' ? 'เกิดข้อผิดพลาดในการเชื่อมต่อ' : 'Connection Error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-[#020202] flex items-center justify-center p-4 relative overflow-hidden font-sans perspective-1000">
      {/* Language Toggle - Top Right */}
      <button 
        onClick={toggleLanguage}
        className="absolute top-6 right-6 z-50 flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[11px] font-bold text-zinc-400 hover:text-white hover:bg-white/10 transition-all backdrop-blur-md uppercase tracking-widest"
      >
        <Languages size={14} className="text-blue-500" />
        {language === 'th' ? 'English' : 'ไทย'}
      </button>

      {/* Background Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[120px] animate-glow" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[120px] animate-glow" style={{ animationDelay: '2s' }} />
      
      <div className="w-full max-w-[400px] relative z-10 animate-slide-up flex flex-col items-center">
        {/* Compact Header */}
        <div className="flex flex-col items-center mb-6 group cursor-default scale-90">
          <div className="relative mb-3">
            <div className="absolute inset-0 bg-blue-600 rounded-[1.5rem] blur-xl opacity-20 group-hover:opacity-40 transition-all duration-700" />
            <div className="relative w-16 h-16 bg-gradient-to-br from-zinc-800 to-black border border-white/10 rounded-[1.5rem] flex items-center justify-center shadow-2xl transform group-hover:rotate-6 transition-transform">
              <BookOpen size={32} className="text-blue-500" />
            </div>
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-white">
            Journal<span className="text-blue-500">Pro</span>
          </h1>
        </div>

        {/* Tight Glass Card */}
        <div className="glass-card w-full p-8 rounded-[2.5rem] border-t border-white/10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          
          <div className="mb-6 text-center">
            <h2 className="text-xl font-bold text-white mb-1 tracking-tight">
              {isLogin ? t('welcomeBack') : t('createAccount')}
            </h2>
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
              {isLogin ? t('signInDashboard') : t('joinCircle')}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-3.5">
            {!isLogin && (
              <>
                <div className="space-y-1 group">
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-blue-500 transition-colors" size={16} />
                    <input
                      type="email" required
                      value={email} onChange={(e) => setEmail(e.target.value)}
                      placeholder={t('email')}
                      className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl pl-11 pr-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all placeholder:text-zinc-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text" required
                    value={firstName} onChange={(e) => setFirstName(e.target.value)}
                    placeholder={t('firstName')}
                    className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all placeholder:text-zinc-700"
                  />
                  <input
                    type="text" required
                    value={lastName} onChange={(e) => setLastName(e.target.value)}
                    placeholder={t('lastName')}
                    className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all placeholder:text-zinc-700"
                  />
                </div>
              </>
            )}

            <div className="space-y-1 group">
              <div className="relative">
                <IdCard className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-blue-500 transition-colors" size={16} />
                <input
                  type="text" required
                  maxLength={4}
                  pattern="\d{4}"
                  value={employeeId} onChange={(e) => setEmployeeId(e.target.value.replace(/\D/g, ''))}
                  placeholder={t('employeeId')}
                  className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl pl-11 pr-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all placeholder:text-zinc-700 font-mono tracking-widest"
                />
              </div>
            </div>

            <div className="space-y-1 group">
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-blue-500 transition-colors" size={16} />
                <input
                  type="password" required
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('password')}
                  className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl pl-11 pr-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all placeholder:text-zinc-700"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full relative group/btn overflow-hidden mt-4"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 group-hover/btn:scale-105 transition-transform duration-500" />
              <div className="relative flex items-center justify-center gap-2 py-3 text-white font-bold tracking-wide transition-all active:scale-95 disabled:opacity-50">
                {loading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <>
                    <span className="text-sm">{isLogin ? t('signInBtn') : t('registerBtn')}</span>
                    <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-zinc-800/50 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-zinc-500 text-[10px] font-black hover:text-blue-400 transition-colors tracking-[0.2em] uppercase"
            >
              {isLogin ? t('requestAccount') : t('returnLogin')}
            </button>
          </div>
        </div>

        <p className="mt-6 text-[9px] text-zinc-800 uppercase tracking-[0.4em] font-black opacity-40">System Architecture V2.0</p>
      </div>
    </div>
  );
}
