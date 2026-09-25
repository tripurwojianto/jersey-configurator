import React, { useState } from 'react';
import { devAuth } from '../../services/devAuth';
import { Shield, Lock, User, ArrowLeft, AlertCircle } from 'lucide-react';

interface DeveloperLoginProps {
  onLoginSuccess: () => void;
  onBackToConfigurator: () => void;
}

export const DeveloperLogin: React.FC<DeveloperLoginProps> = ({
  onLoginSuccess,
  onBackToConfigurator,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await devAuth.login(username, password);
      if (res.success) {
        onLoginSuccess();
      } else {
        setError(res.error || 'Login gagal. Periksa username dan password.');
      }
    } catch {
      setError('Terjadi kendala autentikasi. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center items-center p-4">
      {/* Back to Public Configurator */}
      <button
        onClick={onBackToConfigurator}
        className="mb-6 flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Jersey Configurator
      </button>

      {/* Login Card */}
      <div className="w-full max-w-sm bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-sm">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 bg-indigo-600/20 border border-indigo-500/30 rounded-xl flex items-center justify-center text-indigo-400 mb-3">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-lg font-extrabold tracking-wide uppercase font-sans text-white">
            DEVELOPER LOGIN
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            DIGID Engine Maintenance & Diagnostics
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg flex items-start gap-2.5 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Email / Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                id="dev-input-username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="developer / admin"
                className="w-full pl-9 pr-3 py-2 bg-slate-900/80 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="dev-input-password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 bg-slate-900/80 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>

          <button
            id="dev-btn-submit"
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-50 text-white font-bold rounded-lg text-xs tracking-wider uppercase transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? 'Memverifikasi...' : 'LOGIN'}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-700/60 text-center">
          <p className="text-[11px] text-slate-500">
            Akses khusus tim teknis pengembang mesin 3D DIGID.
          </p>
        </div>
      </div>
    </div>
  );
};
