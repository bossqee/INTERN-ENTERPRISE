import { useState } from 'react';
import { BookOpen, Mail, Lock, ArrowRight, Loader2, BadgeCheck, IdCard, Users, ShieldCheck } from 'lucide-react';
import { supabase } from '../utils/supabase';
import { showAlert } from '../utils/swal';

interface AuthProps {
  onLogin: (user: any) => void;
}

export function Auth({ onLogin }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  
  // Registration fields
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate 4-digit Employee ID
    if (!/^\d{4}$/.test(employeeId)) {
      showAlert.error('ข้อมูลไม่ถูกต้อง', 'รหัสพนักงานต้องเป็นตัวเลข 4 หลักเท่านั้น');
      return;
    }

    setLoading(true);

    // Create a unique internal identifier that won't trigger standard email verification rate limits as easily
    // We use @internal.pro to distinguish it from real email providers
    const loginIdentifier = `${employeeId.trim()}@internal.pro`;

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: loginIdentifier,
          password,
        });

        if (error) throw error;
        
        if (data.user) {
          const metadata = data.user.user_metadata;
          onLogin({
            id: data.user.id,
            email: metadata.email,
            firstName: metadata.first_name,
            lastName: metadata.last_name,
            employee_id: metadata.employee_id,
          });
          showAlert.success('Access Granted', 'Welcome to your professional dashboard.');
        }
      } else {
        // IMPORTANT: To fix "Email rate limit exceeded" PERMANENTLY:
        // You MUST go to Supabase Dashboard -> Auth -> Providers -> Email -> Toggle OFF "Confirm email"
        const { data, error } = await supabase.auth.signUp({
          email: loginIdentifier,
          password,
          options: {
            data: {
              email: email, // Real contact email stored in metadata
              first_name: firstName,
              last_name: lastName,
              employee_id: employeeId,
            }
          }
        });

        if (error) throw error;

        if (data.user) {
          showAlert.success('Account Initialized', 'Registration successful. You can now sign in.');
          setIsLogin(true);
        }
      }
    } catch (error: any) {
      let errorMessage = error.message;
      
      if (errorMessage.includes('Email rate limit exceeded')) {
        errorMessage = 'SYSTEM ALERT: Email Confirmation is ACTIVE on Supabase. \n\n' + 
                       'To fix this forever: \n' +
                       '1. Open Supabase Dashboard \n' +
                       '2. Go to Authentication > Providers > Email \n' +
                       '3. Turn OFF "Confirm email" \n' +
                       '4. Save changes.';
      }
      
      showAlert.error('Authentication Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px]" />
      
      <div className="w-full max-w-[440px] relative z-10">
        {/* Header Section */}
        <div className="flex flex-col items-center mb-10 group">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-600 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className="relative w-20 h-20 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl mb-6 transform group-hover:scale-105 transition-transform duration-500">
              <BookOpen size={40} className="text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">
            Journal<span className="text-blue-500">Pro</span>
          </h1>
          <div className="flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span className="text-[10px] text-zinc-400 uppercase tracking-[0.2em] font-bold">Enterprise Secure</span>
          </div>
        </div>

        {/* Main Auth Card */}
        <div className="bg-zinc-900/40 border border-white/5 p-10 rounded-[2.5rem] backdrop-blur-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)]">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold text-white mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-zinc-500 text-sm leading-relaxed">
              {isLogin 
                ? 'Sign in to access your professional dashboard' 
                : 'Join our elite circle of professional interns'}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            {!isLogin && (
              <>
                <div className="space-y-2 group">
                  <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest ml-1 group-focus-within:text-blue-500 transition-colors">Contact Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-blue-500 transition-colors" size={20} />
                    <input
                      type="email" required
                      value={email} onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all placeholder:text-zinc-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 group">
                    <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest ml-1 group-focus-within:text-blue-500 transition-colors">First Name</label>
                    <div className="relative">
                      <BadgeCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-blue-500 transition-colors" size={20} />
                      <input
                        type="text" required
                        value={firstName} onChange={(e) => setFirstName(e.target.value)}
                        placeholder="John"
                        className="w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all placeholder:text-zinc-700 font-medium"
                      />
                    </div>
                  </div>
                  <div className="space-y-2 group">
                    <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest ml-1 group-focus-within:text-blue-500 transition-colors">Last Name</label>
                    <div className="relative">
                      <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-blue-500 transition-colors" size={20} />
                      <input
                        type="text" required
                        value={lastName} onChange={(e) => setLastName(e.target.value)}
                        placeholder="Doe"
                        className="w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all placeholder:text-zinc-700 font-medium"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="space-y-2 group">
              <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest ml-1 group-focus-within:text-blue-500 transition-colors">Employee ID (4 Digits)</label>
              <div className="relative">
                <IdCard className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input
                  type="text" required
                  maxLength={4}
                  pattern="\d{4}"
                  value={employeeId} onChange={(e) => setEmployeeId(e.target.value.replace(/\D/g, ''))}
                  placeholder="0000"
                  className="w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all placeholder:text-zinc-700 font-mono tracking-widest"
                />
              </div>
            </div>

            <div className="space-y-2 group">
              <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest ml-1 group-focus-within:text-blue-500 transition-colors">Secure Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input
                  type="password" required
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all placeholder:text-zinc-700"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full relative group/btn overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 group-hover/btn:scale-105 transition-transform duration-500" />
              <div className="relative flex items-center justify-center gap-3 py-4 text-white font-bold tracking-wide transition-all active:scale-95 disabled:opacity-50">
                {loading ? (
                  <Loader2 className="animate-spin" size={22} />
                ) : (
                  <>
                    <span className="text-base">{isLogin ? 'Sign In Now' : 'Initialize Account'}</span>
                    <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-zinc-800/50 flex flex-col items-center gap-4">
            <p className="text-zinc-500 text-[13px]">
              {isLogin ? "New to the platform?" : "Already have access?"}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 text-blue-500 font-bold hover:text-blue-400 transition-colors hover:underline decoration-2 underline-offset-4"
              >
                {isLogin ? 'Create Account' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-8 flex items-center justify-center gap-6 opacity-40 hover:opacity-100 transition-opacity duration-500">
          <p className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] font-medium italic">© 2026 Journal Pro System</p>
        </div>
      </div>
    </div>
  );
}
