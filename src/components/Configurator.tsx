import React, { useState, useRef } from 'react';
import { Shirt, Layers, Download, Loader2 } from 'lucide-react';
import { useDesignState, DEFAULT_JERSEY_CONFIG } from '../state/designState';
import { ConfiguratorPanel } from './ConfiguratorPanel';
import { JerseyViewer, JerseyViewerHandle } from './JerseyViewer';
import { TwoDPreview } from './TwoDPreview';
import { DesignSummary } from './DesignSummary';
import { UserHelpModal } from './UserHelpModal';

interface ConfiguratorProps {
  onNavigateToDeveloper?: () => void;
}

export const Configurator: React.FC<ConfiguratorProps> = ({ onNavigateToDeveloper }) => {
  const { config, updateConfig, resetConfig, serializeConfig } = useDesignState(DEFAULT_JERSEY_CONFIG);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const jerseyViewerRef = useRef<JerseyViewerHandle | null>(null);
  const [isExportingGLB, setIsExportingGLB] = useState(false);

  const handleExportGLB = async () => {
    if (jerseyViewerRef.current) {
      try {
        setIsExportingGLB(true);
        await jerseyViewerRef.current.exportCurrentJerseyGLB();
      } catch (err) {
        console.error('Failed to export GLB:', err);
      } finally {
        setIsExportingGLB(false);
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#f8fafc] text-[#0f172a] overflow-x-hidden overflow-y-auto font-sans">
      {/* 1. TOP HEADER (NAVIGASI + BRANDING) */}
      <header className="h-14 sm:h-16 border-b border-slate-800 bg-[#0f172a] px-3.5 sm:px-6 flex items-center z-30 flex-shrink-0 sticky top-0 shadow-sm">
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Back to Online Store Link */}
          <a
            id="btn-back-to-catalog"
            href="https://store.digidstudio.com"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] sm:text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700 transition-colors flex-shrink-0"
            title="Kembali ke DIGID Apparel Online Shop"
          >
            <span className="text-xs">←</span>
            <span className="hidden sm:inline">DIGID Apparel</span>
            <span className="sm:hidden">Katalog</span>
          </a>

          <div className="h-5 w-px bg-slate-700/80 mx-0.5 sm:mx-1 flex-shrink-0" />

          {/* DIGID ENGINE Logo & Brand Identity */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-sm ring-1 ring-white/10 flex-shrink-0">
              <span className="font-extrabold text-sm tracking-tighter">D</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-sm sm:text-base font-extrabold tracking-tight text-white uppercase font-sans">
                  DIGID <span className="text-indigo-400 font-bold">ENGINE</span>
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 hidden xs:inline-block uppercase tracking-wider flex-shrink-0">
                  V1.2
                </span>
              </div>
              <span className="text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase text-slate-400 font-mono -mt-0.5">
                3D CONFIGURATOR
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* 2. MAIN WORKSPACE */}
      {/* On mobile (< md): min-h-0, flows naturally down the page */}
      {/* On desktop (>= md): 2 columns side-by-side, md:h-[calc(100vh-3.5rem)] md:overflow-hidden */}
      <main className="flex-1 flex flex-col md:flex-row min-h-0 relative md:min-h-[calc(100vh-4rem)] md:overflow-hidden">
        {/* 3D VIEWPORT CONTAINER */}
        {/* On mobile: fixed height h-[360px], sits at top of content */}
        {/* On desktop: flex-1 full height right column with 3D viewer on top and 2D dock at bottom */}
        <div
          className="order-1 md:order-2 w-full md:flex-1 h-[360px] md:h-full flex-shrink-0 md:flex-shrink flex flex-col relative bg-[#f8fafc] border-b md:border-b-0 border-[#e2e8f0]"
        >
          {/* 3D Viewport Canvas */}
          <div className="flex-1 relative w-full h-full min-h-0">
            <JerseyViewer
              ref={jerseyViewerRef}
              config={config}
              onExportStatusChange={setIsExportingGLB}
            />
          </div>

          {/* Bottom Dock: 2D DESIGN DATA (Desktop only) */}
          <div className="hidden md:block h-56 lg:h-60 w-full flex-shrink-0 border-t border-[#e2e8f0] bg-white p-2 sm:p-3 overflow-hidden">
            <TwoDPreview config={config} className="h-full" />
          </div>
        </div>

        {/* CONFIGURATION PANEL CONTAINER */}
        {/* On mobile: placed directly below 3D canvas (order-2), completely open and scrolls naturally */}
        {/* On desktop: placed on the left side (order-1 md:w-80 lg:w-96 md:h-full) */}
        <div
          className="order-2 md:order-1 w-full md:w-80 lg:w-96 flex-shrink-0 bg-white md:border-r border-[#e2e8f0] flex flex-col md:h-full"
        >
          {/* Customizer Panel */}
          <ConfiguratorPanel
            config={config}
            onUpdate={updateConfig}
            onReset={resetConfig}
            onSave={() => setIsSummaryOpen(true)}
            onExportGLB={handleExportGLB}
            isExportingGLB={isExportingGLB}
          />

          {/* 2D Pattern View for Mobile (placed cleanly at the bottom of the page) */}
          <div className="md:hidden border-t-4 border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-2 mb-2.5">
              <div className="w-6 h-6 rounded bg-teal-50 border border-teal-200 flex items-center justify-center text-[#0D9488]">
                <Layers className="w-3.5 h-3.5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  2D Production Design Data
                </h3>
                <p className="text-[10px] text-slate-500">Representasi Pola Potongan & Artwork</p>
              </div>
            </div>
            <div className="h-72 bg-white border border-slate-200 rounded-lg p-2 overflow-hidden shadow-xs">
              <TwoDPreview config={config} className="h-full" />
            </div>
          </div>
        </div>
      </main>

      {/* 3. FOOTER */}
      <footer
        id="configurator-footer"
        className="w-full bg-[#0f172a] border-t border-slate-800/80 py-8 sm:py-10 px-4 sm:px-6 flex-shrink-0 z-20 text-center"
      >
        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center gap-4 sm:gap-5">
          {/* Brand & Subtitle */}
          <div className="flex flex-col items-center gap-1">
            <span className="text-sm sm:text-base font-extrabold tracking-tight text-white uppercase font-sans">
              DIGID ENGINE
            </span>
            <span className="text-xs sm:text-sm text-slate-400 font-medium">
              3D Apparel Configurator
            </span>
          </div>

          {/* Navigation Links: Bantuan   Hubungi Admin   Developer */}
          <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-8 text-xs sm:text-sm text-slate-300 font-medium">
            <button
              id="footer-link-help"
              type="button"
              onClick={() => setIsHelpOpen(true)}
              className="hover:text-white transition-colors cursor-pointer py-1 focus:outline-hidden focus:underline"
            >
              Bantuan
            </button>
            <a
              id="footer-link-admin"
              href="https://wa.me/6285141396021"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors cursor-pointer py-1 focus:outline-hidden focus:underline"
            >
              Hubungi Admin
            </a>
            <button
              id="footer-link-developer"
              type="button"
              onClick={() => onNavigateToDeveloper?.()}
              className="text-slate-400 hover:text-slate-200 transition-colors cursor-pointer py-1 focus:outline-hidden focus:underline"
            >
              Developer
            </button>
          </div>

          {/* Copyright */}
          <div className="pt-2 sm:pt-3 border-t border-slate-800/60 w-full max-w-xs">
            <p className="text-[11px] sm:text-xs text-slate-400 font-normal">
              © 2026 DIGID Studio
            </p>
          </div>
        </div>
      </footer>

      {/* 3. DESIGN SUMMARY MODAL (SAVE DESIGN) */}
      <DesignSummary
        isOpen={isSummaryOpen}
        onClose={() => setIsSummaryOpen(false)}
        config={config}
        onExportGLB={handleExportGLB}
        isExportingGLB={isExportingGLB}
      />

      {/* 4. USER HELP MODAL */}
      <UserHelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </div>
  );
};
