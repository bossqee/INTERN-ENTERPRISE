import { useState } from 'react';
import { BookOpen, User, Lock, ArrowRight, Loader2, BadgeCheck, IdCard, Users } from 'lucide-react';
import { supabase } from '../utils/supabase';
import { showAlert } from '../utils/swal';

interface AuthProps {
  onLogin: (user: any) => void;
}

export function Auth({ onLogin }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  
  // Registration fields
  const [accountName, setAccountName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Map employeeId to a virtual email for Supabase Auth
    const email = `${employeeId.trim()}@intern.system`;

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        
        if (data.user) {
          const metadata = data.user.user_metadata;
          onLogin({
            id: data.user.id,
            accountName: metadata.account_name,
            firstName: metadata.first_name,
            lastName: metadata.last_name,
            employeeId: metadata.employee_id,
          });
          showAlert.success('ยินดีต้อนรับกลับ!', 'เข้าสู่ระบบสำเร็จ');
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              account_name: accountName,
              first_name: firstName,
              last_name: lastName,
              employee_id: employeeId,
            }
          }
        });

        if (error) throw error;

        if (data.user) {
          showAlert.success('ลงทะเบียนสำเร็จ!', 'คุณสามารถเข้าสู่ระบบได้แล้ว');
          setIsLogin(true);
        }
      }
    } catch (error: any) {
      showAlert.error('เกิดข้อผิดพลาด', error.message || 'กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 selection:bg-blue-500/30">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-600/30 mb-6 animate-bounce-slow">
            <BookOpen size={36} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-500">
            Internship Journal
          </h1>
          <p className="text-zinc-500 mt-2 text-sm tracking-widest uppercase font-medium">Professional Logbook</p>
        </div>

        {/* Auth Card */}
        <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl backdrop-blur-xl shadow-2xl">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-1">
              {isLogin ? 'Sign In' : 'Create Account'}
            </h2>
            <p className="text-zinc-400 text-sm">
              {isLogin ? 'ยินดีต้อนรับ! กรุณากรอกรหัสพนักงานและรหัสผ่าน' : 'กรอกข้อมูลด้านล่างเพื่อสมัครสมาชิก'}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && (
              <>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-500 uppercase ml-1">Account Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                    <input
                      type="text" required
                      value={accountName} onChange={(e) => setAccountName(e.target.value)}
                      placeholder="เช่น intern_01"
                      className="w-full bg-black/50 border border-zinc-800 rounded-2xl pl-12 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-zinc-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-zinc-500 uppercase ml-1">ชื่อจริง</label>
                    <div className="relative">
                      <BadgeCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                      <input
                        type="text" required
                        value={firstName} onChange={(e) => setFirstName(e.target.value)}
                        placeholder="สมชาย"
                        className="w-full bg-black/50 border border-zinc-800 rounded-2xl pl-12 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-zinc-700"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-zinc-500 uppercase ml-1">นามสกุล</label>
                    <div className="relative">
                      <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                      <input
                        type="text" required
                        value={lastName} onChange={(e) => setLastName(e.target.value)}
                        placeholder="ใจดี"
                        className="w-full bg-black/50 border border-zinc-800 rounded-2xl pl-12 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-zinc-700"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-500 uppercase ml-1">รหัสพนักงาน</label>
              <div className="relative">
                <IdCard className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                <input
                  type="text" required
                  value={employeeId} onChange={(e) => setEmployeeId(e.target.value)}
                  placeholder="EMP12345"
                  className="w-full bg-black/50 border border-zinc-800 rounded-2xl pl-12 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-zinc-700"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-500 uppercase ml-1">รหัสผ่าน</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                <input
                  type="password" required
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-black/50 border border-zinc-800 rounded-2xl pl-12 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-zinc-700"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98] mt-4 flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  {isLogin ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-zinc-800 text-center text-sm">
            <span className="text-zinc-500">
              {isLogin ? "ยังไม่มีบัญชี?" : "มีบัญชีอยู่แล้ว?"}
            </span>
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="ml-2 text-blue-400 font-bold hover:text-blue-300 transition-colors"
            >
              {isLogin ? 'สมัครสมาชิกที่นี่' : 'เข้าสู่ระบบที่นี่'}
            </button>
          </div>
        </div>

        <p className="text-center text-zinc-600 text-xs mt-8">
          © 2026 Internship Journal System. Secure Data Architecture.
        </p>
      </div>
    </div>
  );
}
