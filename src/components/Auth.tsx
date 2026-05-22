import { useState } from 'react';
import { BookOpen, Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import { showAlert } from '../utils/swal';

interface AuthProps {
  onLogin: (user: any) => void;
}

export function Auth({ onLogin }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Mocking a delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setLoading(false);
    showAlert.success(
      isLogin ? 'Welcome Back!' : 'Account Created!',
      isLogin ? 'Successfully logged into your journal.' : 'You can now start logging your internship.'
    );
    
    onLogin({ name: name || 'Intern Student', email });
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
              {isLogin ? 'Welcome back! Please enter your details.' : 'Join us to track your professional growth.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-500 uppercase ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                  <input
                    type="text" required
                    value={name} onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full bg-black/50 border border-zinc-800 rounded-2xl pl-12 pr-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-zinc-700"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-500 uppercase ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                <input
                  type="email" required
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="intern@company.com"
                  className="w-full bg-black/50 border border-zinc-800 rounded-2xl pl-12 pr-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-zinc-700"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-500 uppercase ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                <input
                  type="password" required
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-black/50 border border-zinc-800 rounded-2xl pl-12 pr-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-zinc-700"
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
                  {isLogin ? 'Sign In' : 'Get Started'}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-zinc-800 text-center text-sm">
            <span className="text-zinc-500">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </span>
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="ml-2 text-blue-400 font-bold hover:text-blue-300 transition-colors"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
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
