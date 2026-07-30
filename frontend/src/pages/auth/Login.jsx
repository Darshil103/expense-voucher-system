import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PrachayLogo from '../../components/PrachayLogo';
import { Mail, Lock, ArrowRight, ShieldCheck, User, Building, Landmark, AlertCircle } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      const from = location.state?.from?.pathname;
      navigate(from && from !== '/login' ? from : `/${user.role}`, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to sign in. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('Password@123');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-amber-100 selection:text-amber-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-block mb-4">
          <PrachayLogo className="h-12" />
        </Link>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Corporate Portal Sign In
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Access your role-based expense management dashboard.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl rounded-3xl border border-slate-200/80 sm:px-10">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@pspl.com"
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1d5b96] focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1d5b96] focus:border-transparent transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 bg-[#1d5b96] hover:bg-[#14426f] text-white font-semibold py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In to Portal'}
              <ArrowRight className="w-4 h-4 text-[#f39c12]" />
            </button>
          </form>

          {/* Quick Demo Login Preset Buttons */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 text-center">
              Quick Demo One-Click Login
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('employee@pspl.com')}
                className="flex flex-col items-center justify-center p-2.5 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl transition-all text-center group"
              >
                <User className="w-4 h-4 text-[#1d5b96] group-hover:scale-110 transition-transform mb-1" />
                <span className="text-[11px] font-bold text-slate-700">Employee</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('director@pspl.com')}
                className="flex flex-col items-center justify-center p-2.5 bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 rounded-xl transition-all text-center group"
              >
                <Building className="w-4 h-4 text-[#f39c12] group-hover:scale-110 transition-transform mb-1" />
                <span className="text-[11px] font-bold text-slate-700">Director</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('accounts@pspl.com')}
                className="flex flex-col items-center justify-center p-2.5 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-xl transition-all text-center group"
              >
                <Landmark className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform mb-1" />
                <span className="text-[11px] font-bold text-slate-700">Accounts</span>
              </button>
            </div>
            <p className="text-[10px] text-slate-400 text-center mt-2">
              Auto-fills email & password (`Password@123`)
            </p>
          </div>

          <div className="mt-6 text-center text-xs text-slate-500">
            Need an employee account?{' '}
            <Link to="/register" className="font-semibold text-[#1d5b96] hover:underline">
              Register Here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
