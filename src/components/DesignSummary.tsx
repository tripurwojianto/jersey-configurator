import React, { useState } from 'react';
import { X, Copy, Check, Download, Send, CheckCircle2, ShieldCheck, Code, MessageCircle, Loader2, Box } from 'lucide-react';
import { JerseyConfig } from '../types/design';

interface DesignSummaryProps {
  isOpen: boolean;
  onClose: () => void;
  config: JerseyConfig;
  onExportGLB?: () => void;
  isExportingGLB?: boolean;
}

export const DesignSummary: React.FC<DesignSummaryProps> = ({
  isOpen,
  onClose,
  config,
  onExportGLB,
  isExportingGLB = false,
}) => {
  const [copied, setCopied] = useState(false);
  const [isSimulatingApi, setIsSimulatingApi] = useState(false);
  const [apiSuccess, setApiSuccess] = useState(false);

  if (!isOpen) return null;

  // Clean payload matching prompt specification
  const productionPayload = {
    designId: `DES-${Date.now().toString(36).toUpperCase()}`,
    createdAt: new Date().toISOString(),
    status: 'customer_approved',
    product: {
      id: config.productId,
      name: config.productName,
      category: 'custom_jersey',
    },
    specs: {
      bodyColor: config.bodyColor,
      sleeveColor: config.sleeveColor,
      collarColor: config.collarColor,
      pattern: config.pattern,
      patternSecondaryColor: config.patternSecondaryColor,
      playerName: config.playerName,
      playerNumber: config.playerNumber,
      textColor: config.textColor,
      numberColor: config.numberColor,
      fontFamily: config.fontFamily,
      hasLogo: Boolean(config.logoUrl),
      logoName: config.logoName || (config.logoUrl ? 'custom_crest.png' : null),
      logoUrl: config.logoUrl ? (config.logoUrl.startsWith('data:') ? '[BASE64_IMAGE_DATA]' : config.logoUrl) : null,
    },
    production: {
      readyForCutting: true,
      patternTemplate: 'STD_JERSEY_UNFOLD_V1',
      dyeSublimation: true,
    },
  };

  const jsonString = JSON.stringify(productionPayload, null, 2);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jersey-design-${config.playerName || 'custom'}-${config.playerNumber || '00'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSimulateApi = () => {
    setIsSimulatingApi(true);
    setApiSuccess(false);
    setTimeout(() => {
      setIsSimulatingApi(false);
      setApiSuccess(true);
      setTimeout(() => setApiSuccess(false), 4000);
    }, 900);
  };

  const getWhatsAppUrl = () => {
    const model = config.productName || 'Athletic Fit Jersey';
    const pattern = (config.pattern || 'DIAGONAL').toUpperCase();
    const playerName = config.playerName || 'DIGID';
    const playerNumber = config.playerNumber || '10';
    const playerPrint = `${playerName} #${playerNumber} (${(config.backNameStyle || 'arched') === 'arched' ? 'Melengkung' : 'Lurus'})`;

    const lines = [
      `Halo Admin DIGID Apparel, saya ingin melakukan pemesanan custom apparel melalui DIGID Engine:`,
      ``,
      `*DETAIL PESANAN DIGID ENGINE:*`,
      `• Model: ${model}`,
      `• Pattern: ${pattern}`,
      `• Player Print: ${playerPrint}`,
      `• Gaya Nama Punggung: ${(config.backNameStyle || 'arched') === 'arched' ? 'Melengkung (Arched)' : 'Lurus (Straight)'}`,
      `• Warna Body: ${config.bodyColor}`,
      `• Warna Lengan: ${config.sleeveColor}`,
      `• Warna Kerah: ${config.collarColor}`,
      `• Warna Sablon / Tinta: ${config.textColor}`,
      `• Posisi Nomor Depan: ${config.frontNumberPosition === 'center' ? 'Tengah Dada (Center Chest)' : 'Dada Seberang (Sejajar Logo)'}`,
      config.logoUrl ? `• Logo Dada: ${config.logoName || 'Custom Logo'}` : `• Logo Dada: Tanpa Logo`,
      ``,
      `Mohon konfirmasi ketersediaan bahan, estimasi waktu produksi, dan total biayanya. Terima kasih!`,
    ];

    return `https://wa.me/6285141396021?text=${encodeURIComponent(lines.join('\n'))}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        id="modal-design-summary"
        className="bg-white border border-slate-200 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] my-auto"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-200 bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                DIGID ENGINE — Order Specification
                <span className="text-[11px] font-mono bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200 font-semibold">
                  Approved Spec
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                DIGID Apparel customer approval record & serialized JSON parameters
              </p>
            </div>
          </div>
          <button
            id="btn-close-summary"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 sm:space-y-6 flex-1">
          {/* 1. Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* Product */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
              <span className="text-[11px] text-slate-500 uppercase font-semibold">Product</span>
              <p className="text-sm font-bold text-slate-900 mt-1 truncate">{config.productName}</p>
              <span className="text-[10px] text-slate-400 font-mono">{config.productId}</span>
            </div>

            {/* Pattern */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
              <span className="text-[11px] text-slate-500 uppercase font-semibold">Pattern</span>
              <p className="text-sm font-bold text-[#2563eb] mt-1 uppercase">{config.pattern}</p>
              <div className="flex items-center gap-1.5 mt-1 text-[10px] text-slate-600">
                <span>Secondary:</span>
                <span
                  className="w-2.5 h-2.5 rounded-full inline-block border border-slate-300"
                  style={{ backgroundColor: config.patternSecondaryColor }}
                />
              </div>
            </div>

            {/* Player Info */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
              <span className="text-[11px] text-slate-500 uppercase font-semibold">Player Print</span>
              <p className="text-sm font-bold text-slate-900 mt-1 truncate">
                {config.playerName || '(No Name)'}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs font-mono font-bold text-[#0B2F64]">
                  #{config.playerNumber || '00'}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 font-medium">
                  {(config.backNameStyle || 'arched') === 'arched' ? 'Melengkung' : 'Lurus'}
                </span>
              </div>
            </div>

            {/* Logo */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-500 uppercase font-semibold">Chest Logo</span>
                <p className="text-xs font-semibold text-slate-800 mt-1 truncate">
                  {config.logoUrl ? config.logoName || 'Custom Crest' : 'None'}
                </p>
              </div>
              {config.logoUrl && (
                <img
                  src={config.logoUrl}
                  alt="Crest"
                  className="w-8 h-8 object-contain rounded bg-white p-0.5 border border-slate-200 shadow-xs"
                />
              )}
            </div>
          </div>

          {/* 2. Color Palette Breakdown */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
              Color Configuration Palette
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex items-center gap-3 bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-xs">
                <div
                  className="w-7 h-7 rounded-lg shadow-xs border border-slate-300 flex-shrink-0"
                  style={{ backgroundColor: config.bodyColor }}
                />
                <div>
                  <span className="text-[11px] text-slate-500">Body Color</span>
                  <p className="text-xs font-mono font-semibold text-slate-900">{config.bodyColor}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-xs">
                <div
                  className="w-7 h-7 rounded-lg shadow-xs border border-slate-300 flex-shrink-0"
                  style={{ backgroundColor: config.sleeveColor }}
                />
                <div>
                  <span className="text-[11px] text-slate-500">Sleeve Color</span>
                  <p className="text-xs font-mono font-semibold text-slate-900">{config.sleeveColor}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-xs">
                <div
                  className="w-7 h-7 rounded-lg shadow-xs border border-slate-300 flex-shrink-0"
                  style={{ backgroundColor: config.collarColor }}
                />
                <div>
                  <span className="text-[11px] text-slate-500">Collar / Trim</span>
                  <p className="text-xs font-mono font-semibold text-slate-900">{config.collarColor}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Serialized JSON Config Block */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-[#0D9488]" />
                <span className="text-xs font-mono text-slate-200 font-semibold">
                  Serialized JSON Configuration (API Schema)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  id="btn-copy-json"
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-md transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#0D9488]" />
                      <span className="text-[#0D9488]">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy JSON</span>
                    </>
                  )}
                </button>
                <button
                  id="btn-download-json"
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-md transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download JSON</span>
                </button>
                {onExportGLB && (
                  <button
                    id="btn-json-download-glb"
                    onClick={onExportGLB}
                    disabled={isExportingGLB}
                    className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-teal-300 hover:text-teal-200 bg-teal-950/80 hover:bg-teal-900/80 border border-teal-700/80 rounded-md transition-colors disabled:opacity-60 cursor-pointer"
                  >
                    {isExportingGLB ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-[#0D9488]" />
                    ) : (
                      <Download className="w-3.5 h-3.5 text-[#0D9488]" />
                    )}
                    <span>Download .GLB</span>
                  </button>
                )}
              </div>
            </div>
            <pre className="p-4 text-[11px] font-mono text-emerald-400 overflow-x-auto max-h-52 bg-slate-950 selection:bg-emerald-950">
              {jsonString}
            </pre>
          </div>

          {/* 4. Backend / API Readiness Notice */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-200/80 text-xs text-slate-700">
            <div>
              <p className="font-bold text-slate-900">
                DIGID Apparel Production Hand-off Ready
              </p>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Parameter JSON ini memuat seluruh spesifikasi cetak sublimasi, penempatan logo, dan detail nomor pesanan.
              </p>
            </div>
            <button
              id="btn-simulate-api"
              onClick={handleSimulateApi}
              disabled={isSimulatingApi}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-xs transition-all shadow-sm active:scale-95 disabled:opacity-50 whitespace-nowrap cursor-pointer"
            >
              {isSimulatingApi ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : apiSuccess ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  <span>Approved & Sent!</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5 text-white" />
                  <span>Simulate Send to API</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3 px-5 sm:px-6 py-3.5 sm:py-4 border-t border-slate-200 bg-slate-50 shrink-0">
          <button
            id="btn-back-editor"
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-300 hover:bg-slate-100 active:bg-slate-200 rounded-lg transition-colors shadow-xs text-center cursor-pointer"
          >
            Back to Editor
          </button>
          {onExportGLB && (
            <button
              id="btn-modal-export-glb"
              onClick={onExportGLB}
              disabled={isExportingGLB}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-800 hover:text-slate-950 bg-white hover:bg-slate-100 border border-slate-300 active:scale-[0.98] rounded-lg transition-all shadow-xs text-center disabled:opacity-60 cursor-pointer"
              title="Download 3D Model (.GLB) dengan tekstur sablon permanen"
            >
              {isExportingGLB ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#0D9488]" />
                  <span>Mengekspor 3D...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-[#0D9488]" />
                  <span>Download 3D Model (.GLB)</span>
                </>
              )}
            </button>
          )}
          <a
            id="btn-send-whatsapp"
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] rounded-lg transition-all shadow-sm text-center"
          >
            <MessageCircle className="w-4 h-4 text-white" />
            <span>Kirim Pesanan ke WhatsApp DIGID</span>
          </a>
        </div>
      </div>
    </div>
  );
};
