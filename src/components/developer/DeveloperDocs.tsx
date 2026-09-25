import React, { useState } from 'react';
import {
  FileCode,
  Box,
  Layers,
  Sparkles,
  AlertTriangle,
  BookOpen,
  Terminal,
  Cpu,
  ChevronRight,
} from 'lucide-react';

export const DeveloperDocs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'started' | 'model' | 'uv' | 'personalization' | 'troubleshooting' | 'notes'
  >('started');

  const navItems = [
    { id: 'started', label: '1. Getting Started', icon: BookOpen },
    { id: 'model', label: '2. 3D Model / GLB', icon: Box },
    { id: 'uv', label: '3. UV Mapping', icon: Layers },
    { id: 'personalization', label: '4. Personalization', icon: Sparkles },
    { id: 'troubleshooting', label: '5. Troubleshooting', icon: AlertTriangle },
    { id: 'notes', label: '6. Developer Notes', icon: FileCode },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col md:flex-row min-h-[580px]">
      {/* Sidebar Documentation Sub-menu */}
      <div className="w-full md:w-64 bg-slate-50 border-r border-slate-200 p-3 flex md:flex-col gap-1 overflow-x-auto md:overflow-x-visible">
        <div className="px-3 py-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider hidden md:block">
          Daftar Topik
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-xs font-medium transition-all text-left whitespace-nowrap md:whitespace-normal cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-200/70 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-indigo-600'}`} />
                <span>{item.label}</span>
              </div>
              <ChevronRight
                className={`w-3.5 h-3.5 hidden md:block opacity-60 ${isActive ? 'text-white' : ''}`}
              />
            </button>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 md:p-8 overflow-y-auto max-h-[750px]">
        {/* TAB 1: GETTING STARTED */}
        {activeTab === 'started' && (
          <div className="space-y-6">
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 mb-2">
                <BookOpen className="w-3.5 h-3.5" /> Getting Started
              </span>
              <h3 className="text-xl font-bold text-slate-900">Arsitektur & Setup Engine</h3>
              <p className="text-xs text-slate-600 mt-1">
                Ikhtisar sistem, struktur folder, dan instruksi runtime jersey configurator.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                1. Struktur Direktori Utama
              </h4>
              <div className="bg-slate-950 p-4 rounded-xl font-mono text-[11px] text-slate-200 border border-slate-800 leading-relaxed overflow-x-auto">
                ├── src/<br />
                │   ├── components/<br />
                │   │   ├── Configurator.tsx        # Public UI orchestrator & layout<br />
                │   │   ├── ConfiguratorPanel.tsx   # Panel kontrol warna, motif, teks, logo<br />
                │   │   ├── JerseyViewer.tsx        # Three.js canvas, OrbitControls & lighting<br />
                │   │   ├── JerseyModel.ts          # 3D mesh manager (GLB loader & procedural)<br />
                │   │   ├── JerseyMaterial.ts       # Dynamic texture synthesizer (2048px canvas)<br />
                │   │   ├── TwoDPreview.tsx         # 2D flat pattern layout representation<br />
                │   │   ├── DesignSummary.tsx       # SAVE DESIGN modal & JSON serializer<br />
                │   │   └── developer/              # Developer Area & Maintenance Dashboard<br />
                │   ├── services/<br />
                │   │   └── devAuth.ts              # Isolated developer authentication<br />
                │   ├── state/<br />
                │   │   └── designState.ts          # React state hook & initial config<br />
                │   └── types/<br />
                │       └── design.ts               # JerseyConfig interfaces & types
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                2. Cara Menjalankan Engine
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Aplikasi dibangun dengan Vite, React 19, TypeScript, dan Three.js. Server dev berjalan pada port 3000:
              </p>
              <div className="bg-slate-950 p-3.5 rounded-xl font-mono text-xs text-emerald-400 border border-slate-800 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>npm install && npm run dev</span>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                3. Siklus Render Reaktif (One Design State)
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Prinsip inti: <strong className="text-slate-800">ONE DESIGN STATE → 3D PREVIEW + 2D DESIGN</strong>. Seluruh interaksi pengguna tersimpan dalam objek konfigurasi tunggal <code className="text-indigo-600 font-semibold bg-indigo-50 px-1 py-0.5 rounded">JerseyConfig</code>. Begitu state diperbarui, <code className="text-indigo-600 font-semibold bg-indigo-50 px-1 py-0.5 rounded">JerseyMaterial.ts</code> merefresh canvas texture 2048x2048 dan mengupdate Three.js material secara instan tanpa merekonstruksi mesh 3D.
              </p>
            </div>
          </div>
        )}

        {/* TAB 2: 3D MODEL / GLB */}
        {activeTab === 'model' && (
          <div className="space-y-6">
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 mb-2">
                <Box className="w-3.5 h-3.5" /> 3D Model & GLTF Loader
              </span>
              <h3 className="text-xl font-bold text-slate-900">Spesifikasi Model GLB / GLTF</h3>
              <p className="text-xs text-slate-600 mt-1">
                Panduan integrasi file GLB produksi, penamaan mesh semantik, dan fallback prosedural.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                1. Penamaan Sub-Mesh Semantik
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Ketika mengekspor model jersey dari Blender atau Clo3D ke GLB, gunakan penamaan node mesh berikut agar dikenali otomatis oleh <code className="text-indigo-600 font-semibold">JerseyModel.ts</code>:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="font-mono text-xs font-bold text-slate-900">frontTorso / body</span>
                  <p className="text-[11px] text-slate-600 mt-1">Panel dada depan dengan mapping UV untuk logo dan nomor dada.</p>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="font-mono text-xs font-bold text-slate-900">backTorso</span>
                  <p className="text-[11px] text-slate-600 mt-1">Panel punggung belakang dengan mapping UV untuk nama dan nomor punggung.</p>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="font-mono text-xs font-bold text-slate-900">sleeve_left / sleeve_right</span>
                  <p className="text-[11px] text-slate-600 mt-1">Panel lengan kiri dan kanan untuk pola atau warna sekunder.</p>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="font-mono text-xs font-bold text-slate-900">collar / cuffs</span>
                  <p className="text-[11px] text-slate-600 mt-1">Mesh kerah polo atau round neck serta ribbing ujung lengan.</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                2. Cara Mengganti Model GLB Aktif
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                File model produksi disimpan di <code className="text-indigo-600 font-mono bg-indigo-50 px-1 py-0.5 rounded">public/models/</code>. Buka <code className="text-indigo-600 font-mono bg-indigo-50 px-1 py-0.5 rounded">src/components/JerseyModel.ts</code> untuk menyesuaikan jalur file:
              </p>
              <div className="bg-slate-950 p-3.5 rounded-xl font-mono text-[11px] text-slate-200 border border-slate-800">
                const MODEL_PATH = '/models/sujaya.glb';<br />
                loader.load(MODEL_PATH, (gltf) =&gt; &#123; ... &#125;);
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: UV MAPPING */}
        {activeTab === 'uv' && (
          <div className="space-y-6">
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 mb-2">
                <Layers className="w-3.5 h-3.5" /> UV Coordinates & Canvas Texture
              </span>
              <h3 className="text-xl font-bold text-slate-900">Arsitektur UV Atlas 2048x2048</h3>
              <p className="text-xs text-slate-600 mt-1">
                Koordinat presisi proyeksi tekstur untuk model Polo SJ-01 Sujaya.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Zona UV Layout Model SJ-01
              </h4>
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-xs text-left text-slate-700">
                  <thead className="bg-slate-100 text-slate-800 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Elemen</th>
                      <th className="p-3">U Center</th>
                      <th className="p-3">V Center (Y Canvas)</th>
                      <th className="p-3">Keterangan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr className="hover:bg-slate-50">
                      <td className="p-3 font-semibold text-slate-900">Back Center</td>
                      <td className="p-3 font-mono text-indigo-600">0.258 w</td>
                      <td className="p-3 font-mono text-indigo-600">—</td>
                      <td className="p-3 text-[11px]">Sumbu simetri horizontal punggung</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-3 font-semibold text-slate-900">Back Name (DIGID)</td>
                      <td className="p-3 font-mono text-indigo-600">0.258 w</td>
                      <td className="p-3 font-mono text-indigo-600">0.525 h</td>
                      <td className="p-3 text-[11px]">Arched / Straight, jarak pas dari neckline</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-3 font-semibold text-slate-900">Back Number (10)</td>
                      <td className="p-3 font-mono text-indigo-600">0.258 w</td>
                      <td className="p-3 font-mono text-indigo-600">0.640 h</td>
                      <td className="p-3 text-[11px]">Scale horizontal 0.85, athletic outline</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-3 font-semibold text-slate-900">Front Chest Badge</td>
                      <td className="p-3 font-mono text-indigo-600">0.725 w</td>
                      <td className="p-3 font-mono text-indigo-600">0.590 h</td>
                      <td className="p-3 text-[11px]">Dada kiri pengamat (viewer left), turun dari collar</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-3 font-semibold text-slate-900">Front Number</td>
                      <td className="p-3 font-mono text-indigo-600">0.585 w</td>
                      <td className="p-3 font-mono text-indigo-600">0.590 h</td>
                      <td className="p-3 text-[11px]">Dada kanan sejajar logo (opposite mode)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
              <span className="font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" /> Catatan Penting Transformasi Kanvas:
              </span>
              <p>
                Pada model SJ-01, UV panel punggung dan depan memiliki sumbu horizontal terbalik secara natural. Oleh karena itu, seluruh rendering teks dan gambar menggunakan transformasi balik <code className="bg-amber-100 font-mono px-1 py-0.5 rounded">ctx.scale(-1, 1)</code> di sekeliling titik tengahnya agar orientasi tulisan dan logo terbaca normal dari sudut pandang kamera 3D.
              </p>
            </div>
          </div>
        )}

        {/* TAB 4: PERSONALIZATION */}
        {activeTab === 'personalization' && (
          <div className="space-y-6">
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-700 mb-2">
                <Sparkles className="w-3.5 h-3.5" /> Typography & Personalization
              </span>
              <h3 className="text-xl font-bold text-slate-900">Engine Tipografi & Personalization</h3>
              <p className="text-xs text-slate-600 mt-1">
                Kalkulasi teks melengkung (*arched text*), kompresi horizontal nomor, dan dynamic stroke.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                1. Formula Arched Text (Nama Punggung)
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Teks melengkung dihitung dengan fungsi <code className="text-indigo-600 font-mono">drawArchedText</code> di mana setiap karakter dihitung sudut rotasinya berdasarkan radius busur lingkar (<code className="text-indigo-600 font-mono">arcRadius = Math.max(textLen * 1.35, h * 0.16)</code>) dengan titik puncak di <code className="text-indigo-600 font-mono">apexY = h * 0.525</code>.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                2. Horizontal Compression Nomor Punggung (85%)
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Nomor punggung jersey olahraga harus memiliki proporsi atletis (tidak terlalu lebar/gemuk). Diimplementasikan via transformasi kanvas lokal:
              </p>
              <div className="bg-slate-950 p-4 rounded-xl font-mono text-[11px] text-slate-200 border border-slate-800 leading-relaxed">
                ctx.save();<br />
                ctx.translate(backCenterX, numY);<br />
                ctx.scale(0.85, 1); // Lebar 85%, tinggi 100%<br />
                ctx.textAlign = 'center';<br />
                ctx.textBaseline = 'middle';<br />
                ctx.lineJoin = 'round';<br />
                ctx.strokeText(playerNumber, 0, 0);<br />
                ctx.fillText(playerNumber, 0, 0);<br />
                ctx.restore();
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: TROUBLESHOOTING */}
        {activeTab === 'troubleshooting' && (
          <div className="space-y-6">
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 mb-2">
                <AlertTriangle className="w-3.5 h-3.5" /> Troubleshooting Guide
              </span>
              <h3 className="text-xl font-bold text-slate-900">Solusi Masalah Umum</h3>
              <p className="text-xs text-slate-600 mt-1">
                Langkah mitigasi error WebGL, tekstur hitam, dan isu load model.
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  Model 3D muncul berwarna hitam pekat
                </h4>
                <p className="text-xs text-slate-600">
                  Periksa apakah <code className="text-indigo-600 font-mono">needsUpdate = true</code> dipanggil pada material Three.js setelah canvas selesai digambar. Periksa juga apakah ambient & directional light menyala di <code className="text-indigo-600 font-mono">JerseyViewer.tsx</code>.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  Logo yang diunggah tidak muncul di dada
                </h4>
                <p className="text-xs text-slate-600">
                  Logo diunggah sebagai format Base64 / Blob URL. Pastikan gambar sudah memicu event <code className="text-indigo-600 font-mono">onload</code> sebelum memanggil synthesizer tekstur kanvas.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  Font kustom tidak ter-render di kanvas 3D
                </h4>
                <p className="text-xs text-slate-600">
                  Browser membutuhkan waktu untuk memuat Google Fonts (`Chakra Petch`, `Teko`, `Montserrat`). Gunakan <code className="text-indigo-600 font-mono">document.fonts.ready</code> sebelum melakukan re-render pertama.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: DEVELOPER NOTES */}
        {activeTab === 'notes' && (
          <div className="space-y-6">
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-800 mb-2">
                <Cpu className="w-3.5 h-3.5" /> Maintenance & Roadmap Notes
              </span>
              <h3 className="text-xl font-bold text-slate-900">Developer Notes & Roadmap</h3>
              <p className="text-xs text-slate-600 mt-1">
                Catatan teknis arsitektur konfigurator dan rencana pengembangan jangka panjang.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase">Roadmap Menuju Produksi Apparel</h4>
              <ul className="list-disc pl-5 text-xs text-slate-600 space-y-1.5">
                <li>Integrasi model 3D CAD jersey industri (Clo3D / Marvelous Designer ke GLTF).</li>
                <li>Multi-zone customization (custom warna cuffs, side mesh panels, back collar tag).</li>
                <li>Ekspor artwork print-ready vector PDF/SVG untuk mesin dye-sublimation.</li>
                <li>Koneksi backend REST/GraphQL untuk customer design ID dan approval token.</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
