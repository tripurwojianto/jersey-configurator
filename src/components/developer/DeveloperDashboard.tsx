import React, { useState } from 'react';
import { devAuth } from '../../services/devAuth';
import { DeveloperDocs } from './DeveloperDocs';
import {
  Box,
  Sparkles,
  BookOpen,
  Cpu,
  LogOut,
  ExternalLink,
  Shield,
  Layers,
  Activity,
  CheckCircle2,
} from 'lucide-react';

interface DeveloperDashboardProps {
  onLogout: () => void;
  onBackToConfigurator: () => void;
}

type TabType = 'models' | 'personalization' | 'docs' | 'system';

export const DeveloperDashboard: React.FC<DeveloperDashboardProps> = ({
  onLogout,
  onBackToConfigurator,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('docs');
  const user = devAuth.getUser();

  const handleLogoutClick = () => {
    devAuth.logout();
    onLogout();
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <header className="h-16 bg-slate-950/90 border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between flex-shrink-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-indigo-600/30 border border-indigo-500/40 rounded-lg flex items-center justify-center text-indigo-400">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold tracking-wide uppercase text-white">
                DIGID ENGINE
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Dev Portal
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Maintenance Machine & System Diagnostics
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden sm:flex flex-col items-end text-right">
            <span className="text-xs font-semibold text-slate-200">
              {user?.username || 'Developer'}
            </span>
            <span className="text-[10px] text-slate-400">
              {user?.role || 'Maintainer'}
            </span>
          </div>

          <button
            onClick={onBackToConfigurator}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors border border-slate-700 cursor-pointer"
            title="Buka Public Configurator"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Buka Configurator</span>
          </button>

          <button
            onClick={handleLogoutClick}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 rounded-lg text-xs font-medium transition-colors cursor-pointer"
            title="Keluar dari sesi Developer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto p-4 sm:p-6 gap-6">
        {/* Left Navigation Tabs */}
        <aside className="w-full md:w-56 flex-shrink-0">
          <nav className="bg-slate-950/60 border border-slate-800 rounded-xl p-2 flex md:flex-col gap-1 overflow-x-auto md:overflow-x-visible">
            <button
              onClick={() => setActiveTab('models')}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all w-full text-left whitespace-nowrap cursor-pointer ${
                activeTab === 'models'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Box className="w-4 h-4" />
              <span>3D MODELS</span>
            </button>

            <button
              onClick={() => setActiveTab('personalization')}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all w-full text-left whitespace-nowrap cursor-pointer ${
                activeTab === 'personalization'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>PERSONALIZATION</span>
            </button>

            <button
              onClick={() => setActiveTab('docs')}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all w-full text-left whitespace-nowrap cursor-pointer ${
                activeTab === 'docs'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>DOCUMENTATION</span>
            </button>

            <button
              onClick={() => setActiveTab('system')}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all w-full text-left whitespace-nowrap cursor-pointer ${
                activeTab === 'system'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span>SYSTEM</span>
            </button>
          </nav>
        </aside>

        {/* Right Tab Content */}
        <main className="flex-1 min-w-0">
          {/* TAB: 3D MODELS */}
          {activeTab === 'models' && (
            <div className="space-y-6">
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <Box className="w-5 h-5 text-indigo-400" />
                    <h2 className="text-base font-bold text-white">
                      3D Models Engine Status
                    </h2>
                  </div>
                  <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Model Active: SJ-01 Polo
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-lg">
                    <span className="text-[11px] text-slate-400 font-semibold uppercase">
                      Primary Production Asset
                    </span>
                    <p className="text-sm font-bold text-white mt-1">
                      /models/sujaya.glb
                    </p>
                    <p className="text-[11px] text-slate-400 mt-2">
                      Model GLB Polo Jersey SJ-01 dengan collar mesh terpisah dan high-detail athletic seams.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-lg">
                    <span className="text-[11px] text-slate-400 font-semibold uppercase">
                      Fallback Geometry
                    </span>
                    <p className="text-sm font-bold text-white mt-1">
                      Procedural Athletic Mesh
                    </p>
                    <p className="text-[11px] text-slate-400 mt-2">
                      Cylinder & angled sleeve procedurals bila file external GLB gagal diunduh atau offline.
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-800/80">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">
                    Active Mesh Hierarchy
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                    <div className="p-2.5 bg-slate-900 border border-slate-800 rounded text-slate-300">
                      body / frontTorso
                    </div>
                    <div className="p-2.5 bg-slate-900 border border-slate-800 rounded text-slate-300">
                      backTorso
                    </div>
                    <div className="p-2.5 bg-slate-900 border border-slate-800 rounded text-slate-300">
                      sleeve_L / sleeve_R
                    </div>
                    <div className="p-2.5 bg-slate-900 border border-slate-800 rounded text-slate-300">
                      collar_ribbing
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: PERSONALIZATION */}
          {activeTab === 'personalization' && (
            <div className="space-y-6">
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 sm:p-6">
                <div className="flex items-center gap-2.5 mb-4">
                  <Sparkles className="w-5 h-5 text-indigo-400" />
                  <h2 className="text-base font-bold text-white">
                    Personalization & Typography Offsets
                  </h2>
                </div>

                <div className="overflow-x-auto border border-slate-800 rounded-lg">
                  <table className="w-full text-xs text-left text-slate-300">
                    <thead className="bg-slate-900 text-slate-400 font-semibold border-b border-slate-800">
                      <tr>
                        <th className="p-3">Elemen</th>
                        <th className="p-3">Sumbu Horizontal (U)</th>
                        <th className="p-3">Sumbu Vertikal (V)</th>
                        <th className="p-3">Karakteristik Tipografi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      <tr>
                        <td className="p-3 font-semibold text-white">BACK NAME</td>
                        <td className="p-3 font-mono text-indigo-300">0.258 w (Center)</td>
                        <td className="p-3 font-mono text-emerald-400">0.525 h</td>
                        <td className="p-3">Arched curve / Straight uppercase, font size: 0.048 h</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-white">BACK NUMBER</td>
                        <td className="p-3 font-mono text-indigo-300">0.258 w (Center)</td>
                        <td className="p-3 font-mono text-emerald-400">0.640 h</td>
                        <td className="p-3">Scale: 0.85 horizontal compression, 800 weight with athletic outline</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-white">FRONT LOGO</td>
                        <td className="p-3 font-mono text-indigo-300">0.725 w (Viewer Left)</td>
                        <td className="p-3 font-mono text-emerald-400">0.590 h</td>
                        <td className="p-3">Max size: 0.052 w, aspect ratio preserved, shadow blur 5px</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-white">FRONT NUMBER</td>
                        <td className="p-3 font-mono text-indigo-300">0.585 w (Opposite)</td>
                        <td className="p-3 font-mono text-emerald-400">0.590 h</td>
                        <td className="p-3">Font size: 0.040 h, sejajar horizontal dengan logo</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: DOCUMENTATION */}
          {activeTab === 'docs' && (
            <div>
              <DeveloperDocs />
            </div>
          )}

          {/* TAB: SYSTEM */}
          {activeTab === 'system' && (
            <div className="space-y-6">
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 sm:p-6">
                <div className="flex items-center gap-2.5 mb-4">
                  <Cpu className="w-5 h-5 text-indigo-400" />
                  <h2 className="text-base font-bold text-white">
                    System Environment & Health
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Three.js Engine</span>
                      <span className="font-mono text-emerald-400">r185.1</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">TextureSynthesizer Resolution</span>
                      <span className="font-mono text-slate-200">2048 x 2048 px</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Rendering Mode</span>
                      <span className="font-mono text-indigo-400">WebGL 2.0 (CanvasTexture)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Framework</span>
                      <span className="font-mono text-slate-200">React 19 + Vite 6</span>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Configurator Mode</span>
                      <span className="font-mono text-emerald-400">Standalone Apparel Engine</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Active Session Token</span>
                      <span className="font-mono text-slate-200">Active</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Last Login Time</span>
                      <span className="font-mono text-slate-200">{user?.lastLogin || 'N/A'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Security Gate</span>
                      <span className="font-mono text-emerald-400">Isolated Route Guard</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap gap-3">
                  <button
                    onClick={onBackToConfigurator}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Kembali ke Configurator
                  </button>
                  <button
                    onClick={handleLogoutClick}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition-colors cursor-pointer border border-slate-700"
                  >
                    Akhiri Sesi Developer
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
