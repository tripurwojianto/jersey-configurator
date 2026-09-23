import React, { useState, useRef } from 'react';
import { Shirt, FileCode, ShieldCheck, Layers, Download, Loader2 } from 'lucide-react';
import { useDesignState, DEFAULT_JERSEY_CONFIG } from '../state/designState';
import { ConfiguratorPanel } from './ConfiguratorPanel';
import { JerseyViewer, JerseyViewerHandle } from './JerseyViewer';
import { TwoDPreview } from './TwoDPreview';
import { DesignSummary } from './DesignSummary';

export const Configurator: React.FC = () => {
  const { config, updateConfig, resetConfig, serializeConfig } = useDesignState(DEFAULT_JERSEY_CONFIG);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [isDocsOpen, setIsDocsOpen] = useState(false);
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
    <div className="flex flex-col min-h-screen md:h-screen w-full bg-[#f8fafc] text-[#0f172a] overflow-y-auto md:overflow-hidden font-sans">
      {/* 1. TOP HEADER (BRANDING & STATUS) */}
      <header className="h-14 sm:h-16 border-b border-slate-800 bg-[#0f172a] px-3 sm:px-6 flex items-center justify-between z-30 flex-shrink-0 sticky top-0 shadow-sm">
        <div className="flex items-center gap-3">
          {/* Back to Online Store Link */}
          <a
            id="btn-back-to-catalog"
            href="https://store.digidstudio.com"
            className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-md text-[11px] font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700 transition-colors"
            title="Kembali ke DIGID Apparel Online Shop"
          >
            <span className="text-xs">←</span>
            <span className="hidden sm:inline">DIGID Apparel</span>
            <span className="sm:hidden">Katalog</span>
          </a>

          <div className="h-5 w-px bg-slate-700/80 mx-0.5 sm:mx-1" />

          {/* DIGID ENGINE Logo & Brand Identity */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-sm ring-1 ring-white/10">
              <span className="font-extrabold text-sm tracking-tighter">D</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-sm sm:text-base font-extrabold tracking-tight text-white uppercase font-sans">
                  DIGID <span className="text-indigo-400 font-bold">ENGINE</span>
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 hidden xs:inline-block uppercase tracking-wider">
                  V1.2
                </span>
              </div>
              <span className="text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase text-slate-400 font-mono -mt-0.5">
                3D CONFIGURATOR
              </span>
            </div>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Architecture & Guide Modal Trigger */}
          <button
            id="btn-open-architecture-docs"
            onClick={() => setIsDocsOpen(true)}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors"
            title="Lihat Arsitektur Teknis & Panduan Engine"
          >
            <FileCode className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Dokumentasi</span>
          </button>

          {/* Header Save CTA */}
          <button
            id="btn-header-save"
            onClick={() => setIsSummaryOpen(true)}
            className="flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>SAVE DESIGN</span>
          </button>
        </div>
      </header>

      {/* 2. MAIN WORKSPACE */}
      {/* On mobile (< md): min-h-0, flows naturally down the page */}
      {/* On desktop (>= md): 2 columns side-by-side, md:h-[calc(100vh-3.5rem)] md:overflow-hidden */}
      <main className="flex-1 flex flex-col md:flex-row min-h-0 relative md:overflow-hidden">
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

      {/* 3. DESIGN SUMMARY MODAL (SAVE DESIGN) */}
      <DesignSummary
        isOpen={isSummaryOpen}
        onClose={() => setIsSummaryOpen(false)}
        config={config}
        onExportGLB={handleExportGLB}
        isExportingGLB={isExportingGLB}
      />

      {/* 4. ARCHITECTURE & USER GUIDE MODAL */}
      {isDocsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white">
              <div className="flex items-center gap-2">
                <FileCode className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">
                  DIGID ENGINE — Technical Architecture & Integration Guide
                </h3>
              </div>
              <button
                onClick={() => setIsDocsOpen(false)}
                className="text-slate-400 hover:text-slate-800 text-sm font-semibold p-1 hover:bg-slate-100 rounded-md transition-colors"
              >
                ✕ Tutup
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700 leading-relaxed">
              {/* Section 1 */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-[#2563eb]">1. Struktur Folder</h4>
                <div className="bg-slate-900 p-3 rounded-lg font-mono text-[11px] text-slate-200 border border-slate-800">
                  ├── src/<br />
                  │   ├── components/<br />
                  │   │   ├── Configurator.tsx        # Orchestrator layout & header<br />
                  │   │   ├── ConfiguratorPanel.tsx   # Panel konfigurasi warna, motif, teks, logo<br />
                  │   │   ├── JerseyViewer.tsx        # Three.js canvas, OrbitControls & lighting<br />
                  │   │   ├── JerseyModel.ts          # 3D mesh model (prosedural & GLTF/GLB loader)<br />
                  │   │   ├── JerseyMaterial.ts       # Dynamic texture synthesizer (canvas to 3D)<br />
                  │   │   ├── TextOverlay.ts          # Logic render nama & nomor pemain<br />
                  │   │   ├── LogoOverlay.ts          # Logic render chest crest/logo<br />
                  │   │   ├── TwoDPreview.tsx         # 2D DESIGN DATA representasi pola potongan<br />
                  │   │   └── DesignSummary.tsx       # Ringkasan SAVE DESIGN & JSON serializer<br />
                  │   ├── state/<br />
                  │   │   └── designState.ts          # State management konfigurasi desain<br />
                  │   └── types/<br />
                  │       └── design.ts               # Interface TypeScript JerseyConfig & types
                </div>
              </div>

              {/* Section 2 */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-[#2563eb]">2. Cara Menjalankan Aplikasi</h4>
                <p>
                  Aplikasi dibangun dengan Vite, React, TypeScript, dan Three.js. Server dev berjalan di port 3000:
                </p>
                <div className="bg-slate-900 p-2.5 rounded font-mono text-emerald-400 border border-slate-800">
                  npm install<br />
                  npm run dev
                </div>
              </div>

              {/* Section 3 */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-[#2563eb]">3. Cara Mengganti Model GLB / GLTF</h4>
                <p>
                  Arsitektur tidak mengunci pada satu mesh. Di <code className="text-[#2563eb] font-semibold">JerseyModel.ts</code>, sistem memiliki kelas <code className="text-[#2563eb] font-semibold">loadExternalGlb(url, config)</code> menggunakan Three.js GLTFLoader.
                </p>
                <p>
                  Pengembang cukup memasukkan model GLB/GLTF dengan mesh bernama semantik seperti:
                  <br />- <code className="text-[#2563eb] font-semibold">frontTorso</code> atau <code className="text-[#2563eb] font-semibold">body</code>
                  <br />- <code className="text-[#2563eb] font-semibold">backTorso</code>
                  <br />- <code className="text-[#2563eb] font-semibold">sleeve_left</code> / <code className="text-[#2563eb] font-semibold">sleeve_right</code>
                  <br />- <code className="text-[#2563eb] font-semibold">collar</code>
                </p>
              </div>

              {/* Section 4 */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-[#2563eb]">4. Cara Menambahkan Material / Texture Baru</h4>
                <p>
                  Buka <code className="text-[#2563eb] font-semibold">JerseyMaterial.ts</code> pada fungsi <code className="text-[#2563eb] font-semibold">drawPattern</code>. Sistem menggunakan dynamic high-resolution HTML5 Canvas texture yang langsung dimapping ke Three.js CanvasTexture. Untuk menambah motif baru (misal: camo, hex grid, sash, geometric), tambahkan case baru pada generator pattern.
                </p>
              </div>

              {/* Section 5 */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-[#2563eb]">5. Cara Kerja State Konfigurasi</h4>
                <p>
                  Konsep inti: <strong>ONE DESIGN STATE → 3D PREVIEW + 2D DESIGN</strong>. Seluruh perubahan customer disimpan dalam satu single source of truth object <code className="text-[#2563eb] font-semibold">JerseyConfig</code>. Ketika state berubah, texture 3D dan diagram pola 2D diperbarui secara reaktif dan realtime.
                </p>
              </div>

              {/* Section 6 */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-[#2563eb]">6. Bagian yang Masih Berupa Prototype</h4>
                <p>
                  - Model 3D default menggunakan mesh prosedural geometris athletic jersey berstruktur multi-komponen (torso lengkung, lengan bersudut, ribbing kerah).
                  <br />- 2D layout adalah representasi desain/production data parametrik (bukan automatic unfolding seam jahitan).
                  <br />- Penyimpanan desain menghasilkan JSON yang diserialisasi (siap dikirim ke API backend saat database diimplementasikan).
                </p>
              </div>

              {/* Section 7 */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-[#2563eb]">7. Roadmap Menuju Production-Ready Configurator</h4>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Integrasi model 3D CAD jersey industri (Clo3D / Marvelous Designer ke GLTF).</li>
                  <li>Multi-zone customization (custom warna cuffs, side mesh panels, back collar tag).</li>
                  <li>Ekspor artwork print-ready vector PDF/SVG untuk mesin dye-sublimation.</li>
                  <li>Koneksi backend REST/GraphQL untuk customer design ID dan approval token.</li>
                </ul>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button
                onClick={() => setIsDocsOpen(false)}
                className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold transition-colors shadow-xs"
              >
                Tutup Panduan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
