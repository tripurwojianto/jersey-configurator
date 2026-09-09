import React, { useRef } from 'react';
import {
  Palette,
  Type,
  Image as ImageIcon,
  RotateCcw,
  Save,
  Shirt,
  Sparkles,
  Upload,
  Trash2,
  Box,
  Layers,
  ChevronDown,
  Info,
  CheckCircle2,
  FileBadge,
  Download,
  Loader2,
} from 'lucide-react';
import { JerseyConfig, PatternType } from '../types/design';
import { COLOR_PRESETS, SAMPLE_LOGOS } from '../state/designState';
import { APPAREL_MODELS, ApparelModelInfo } from '../data/models';

interface ConfiguratorPanelProps {
  config: JerseyConfig;
  onUpdate: (updates: Partial<JerseyConfig>) => void;
  onReset: () => void;
  onSave: () => void;
  onExportGLB?: () => void;
  isExportingGLB?: boolean;
  className?: string;
}

export const ConfiguratorPanel: React.FC<ConfiguratorPanelProps> = ({
  config,
  onUpdate,
  onReset,
  onSave,
  onExportGLB,
  isExportingGLB = false,
  className = '',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const patterns: { id: PatternType; label: string; description: string }[] = [
    { id: 'solid', label: 'Solid', description: 'Clean monochrome style' },
    { id: 'stripe', label: 'Stripe', description: 'Classic vertical match stripes' },
    { id: 'diagonal', label: 'Diagonal', description: 'Athletic dynamic sash' },
    { id: 'gradient', label: 'Gradient', description: 'Modern ombré fade' },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Mohon pilih file gambar (PNG / JPG / SVG)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      onUpdate({
        logoUrl: result,
        logoName: file.name,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    onUpdate({
      logoUrl: null,
      logoName: undefined,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <aside
      id="configurator-panel"
      className={`bg-white md:border-r border-[#e2e8f0] text-[#0f172a] flex flex-col md:h-full md:overflow-hidden ${className}`}
    >
      {/* Panel Top Header */}
      <div className="p-4 border-b border-[#e2e8f0] bg-white flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-md bg-teal-50 border border-teal-200 flex items-center justify-center text-[#0D9488]">
            <Shirt className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#0B2F64]">
              CONFIGURATION PANEL
            </h2>
            <p className="text-[10px] text-[#64748b]">Apparel Customizer Controls</p>
          </div>
        </div>

        {/* Quick Reset */}
        <button
          id="btn-reset-design"
          onClick={onReset}
          className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-[#64748b] hover:text-[#0f172a] hover:bg-slate-50 rounded-md transition-colors border border-slate-200"
          title="Reset to default configuration"
        >
          <RotateCcw className="w-3 h-3" />
          <span>RESET</span>
        </button>
      </div>

      {/* Scrollable Customization Controls */}
      <div className="md:flex-1 md:overflow-y-auto p-4 sm:p-5 space-y-6">
        {/* 1. 3D APPAREL MODEL SELECTION */}
        <div>
          <label className="block text-[11px] font-bold text-[#94a3b8] uppercase tracking-wider mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Box className="w-3.5 h-3.5 text-[#0B2F64]" />
              3D Apparel Model
            </span>
            <span className="text-[10px] text-[#0D9488] font-semibold bg-teal-50 border border-teal-200 px-1.5 py-0.5 rounded">
              Real 3D Asset
            </span>
          </label>

          <div className="space-y-2">
            {APPAREL_MODELS.map((model) => {
              const isSelected =
                (config.modelId && config.modelId === model.id) ||
                (!config.modelId && config.modelSource === model.sourceType && (model.sourceType === 'procedural' || config.customGlbUrl === model.glbUrl));

              return (
                <div
                  key={model.id}
                  onClick={() => {
                    onUpdate({
                      modelSource: model.sourceType,
                      modelId: model.id,
                      customGlbUrl: model.glbUrl || '',
                      productName: model.name,
                    });
                  }}
                  className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'border-[#0B2F64] bg-teal-50/40 shadow-xs ring-1 ring-[#0B2F64]/30'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-slate-900">{model.name}</p>
                        <span className={`text-[9px] font-semibold px-1.5 py-0.2 rounded border ${model.badgeColor}`}>
                          {model.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{model.description}</p>
                    </div>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-[#0D9488] flex-shrink-0 mt-0.5" />}
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <span>License: <strong className="text-slate-700">{model.license}</strong></span>
                    {model.fileSize && <span>Size: <strong className="text-slate-700">{model.fileSize}</strong></span>}
                    <span>{model.customizableIn3D.sleeveColor ? 'Multi-Part' : 'Unified PBR'}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Custom GLB URL Input for Testing */}
          <div className="mt-3 p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
            <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
              Custom GLB URL (Optional)
            </label>
            <input
              type="text"
              placeholder="/models/athletic_jersey.glb or https://..."
              value={config.customGlbUrl || ''}
              onChange={(e) =>
                onUpdate({
                  modelSource: 'gltf',
                  customGlbUrl: e.target.value,
                })
              }
              className="w-full text-xs font-mono bg-white border border-slate-200 rounded px-2.5 py-1 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* 2. BASE COLORS */}
        <div>
          <label className="block text-[11px] font-bold text-[#94a3b8] uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-[#0B2F64]" />
            Base Colors
          </label>

          {/* Architectural note for material separation integrity */}
          {config.modelSource === 'gltf' && (
            <div className="mb-3 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-[#0B2F64] text-[11px]">
                <Info className="w-3.5 h-3.5 text-[#0D9488] flex-shrink-0" />
                <span>3D Asset Material Architecture</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">
                This photorealistic 3D asset utilizes a single unified fabric mesh. <strong>Body Color</strong> customizes the entire jersey with PBR shading, and badges/numbers are projected as 3D surface decals. Independent sleeve/collar contrasting is active on the Procedural model.
              </p>
            </div>
          )}

          <div className="space-y-4">
            {/* Body Color */}
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-800">Body Color</span>
                  {config.modelSource === 'gltf' && (
                    <span className="ml-1.5 text-[10px] text-[#0D9488] font-semibold">(Primary 3D Hue)</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] text-slate-500">{config.bodyColor}</span>
                  <input
                    type="color"
                    value={config.bodyColor}
                    onChange={(e) => onUpdate({ bodyColor: e.target.value })}
                    className="w-5 h-5 rounded cursor-pointer border border-slate-300 bg-transparent p-0"
                    id="color-picker-body"
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {COLOR_PRESETS.slice(0, 8).map((preset) => (
                  <button
                    key={`body-${preset.name}`}
                    onClick={() => onUpdate({ bodyColor: preset.hex })}
                    className={`w-6 h-6 rounded-full border border-slate-200 transition-all ${
                      config.bodyColor.toLowerCase() === preset.hex.toLowerCase()
                        ? 'ring-2 ring-offset-2 ring-[#0B2F64] scale-105'
                        : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: preset.hex }}
                    title={`${preset.name} (${preset.hex})`}
                  />
                ))}
              </div>
            </div>

            {/* Sleeve Color */}
            <div className={`p-2.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2 ${config.modelSource === 'gltf' ? 'opacity-70' : ''}`}>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-800">Sleeve Color</span>
                  {config.modelSource === 'gltf' && (
                    <span className="ml-1.5 text-[10px] text-slate-400 font-normal">(Multi-part models)</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] text-slate-500">{config.sleeveColor}</span>
                  <input
                    type="color"
                    value={config.sleeveColor}
                    onChange={(e) => onUpdate({ sleeveColor: e.target.value })}
                    className="w-5 h-5 rounded cursor-pointer border border-slate-300 bg-transparent p-0"
                    id="color-picker-sleeve"
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {COLOR_PRESETS.slice(0, 8).map((preset) => (
                  <button
                    key={`sleeve-${preset.name}`}
                    onClick={() => onUpdate({ sleeveColor: preset.hex })}
                    className={`w-6 h-6 rounded-full border border-slate-200 transition-all ${
                      config.sleeveColor.toLowerCase() === preset.hex.toLowerCase()
                        ? 'ring-2 ring-offset-2 ring-[#0B2F64] scale-105'
                        : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: preset.hex }}
                    title={`${preset.name} (${preset.hex})`}
                  />
                ))}
              </div>
            </div>

            {/* Collar Accent */}
            <div className={`p-2.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2 ${config.modelSource === 'gltf' ? 'opacity-70' : ''}`}>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-800">Collar Accent</span>
                  {config.modelSource === 'gltf' && (
                    <span className="ml-1.5 text-[10px] text-slate-400 font-normal">(Multi-part models)</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] text-slate-500">{config.collarColor}</span>
                  <input
                    type="color"
                    value={config.collarColor}
                    onChange={(e) => onUpdate({ collarColor: e.target.value })}
                    className="w-5 h-5 rounded cursor-pointer border border-slate-300 bg-transparent p-0"
                    id="color-picker-collar"
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {COLOR_PRESETS.slice(0, 8).map((preset) => (
                  <button
                    key={`collar-${preset.name}`}
                    onClick={() => onUpdate({ collarColor: preset.hex })}
                    className={`w-6 h-6 rounded-full border border-slate-200 transition-all ${
                      config.collarColor.toLowerCase() === preset.hex.toLowerCase()
                        ? 'ring-2 ring-offset-2 ring-[#0B2F64] scale-105'
                        : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: preset.hex }}
                    title={`${preset.name} (${preset.hex})`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 3. PATTERN & GRAPHICS */}
        <div>
          <label className="block text-[11px] font-bold text-[#94a3b8] uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#0B2F64]" />
            Pattern & Graphics
          </label>

          <div className="grid grid-cols-2 gap-2">
            {patterns.map((p) => {
              const isSelected = config.pattern === p.id;
              return (
                <button
                  key={p.id}
                  id={`pattern-btn-${p.id}`}
                  onClick={() => onUpdate({ pattern: p.id })}
                  className={`p-3 rounded-lg border text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#0B2F64] bg-teal-50/50 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="h-7 w-full bg-slate-100 mb-2 rounded flex items-center justify-center overflow-hidden border border-slate-200">
                    {p.id === 'diagonal' && (
                      <div
                        className="w-full h-full"
                        style={{
                          background:
                            'repeating-linear-gradient(45deg, #cbd5e1 0px, #cbd5e1 4px, #f1f5f9 4px, #f1f5f9 8px)',
                        }}
                      />
                    )}
                    {p.id === 'stripe' && (
                      <div
                        className="w-full h-full"
                        style={{
                          background:
                            'repeating-linear-gradient(90deg, #cbd5e1 0px, #cbd5e1 4px, #f1f5f9 4px, #f1f5f9 8px)',
                        }}
                      />
                    )}
                    {p.id === 'gradient' && (
                      <div
                        className="w-full h-full"
                        style={{
                          background: 'linear-gradient(180deg, #cbd5e1 0%, #f1f5f9 100%)',
                        }}
                      />
                    )}
                    {p.id === 'solid' && <div className="w-full h-full bg-slate-200" />}
                  </div>
                  <span
                    className={`text-[11px] font-bold uppercase tracking-wide block ${
                      isSelected ? 'text-[#0B2F64]' : 'text-slate-700'
                    }`}
                  >
                    {p.label}
                  </span>
                  <span className="text-[9px] text-slate-400 block mt-0.5">{p.description}</span>
                </button>
              );
            })}
          </div>

          {/* Secondary Pattern Accent Color if not solid */}
          {config.pattern !== 'solid' && (
            <div className="mt-2.5 p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
              <span className="text-xs text-slate-600 font-medium">Pattern Accent Color</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] text-slate-500">
                  {config.patternSecondaryColor}
                </span>
                <input
                  type="color"
                  value={config.patternSecondaryColor}
                  onChange={(e) => onUpdate({ patternSecondaryColor: e.target.value })}
                  className="w-5 h-5 rounded cursor-pointer border border-slate-300 bg-transparent p-0"
                />
              </div>
            </div>
          )}
        </div>

        {/* 4. PLAYER PERSONALIZATION */}
        <div>
          <label className="block text-[11px] font-bold text-[#94a3b8] uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5 text-[#0B2F64]" />
            Personalization
          </label>

          <div className="space-y-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500">Player Name</span>
              <input
                type="text"
                id="input-player-name"
                maxLength={14}
                value={config.playerName}
                onChange={(e) => onUpdate({ playerName: e.target.value.toUpperCase() })}
                placeholder="SYAMANAH"
                className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm font-semibold text-[#0f172a] uppercase placeholder-slate-400 focus:ring-1 focus:ring-[#0D9488] focus:border-[#0D9488] outline-none transition-all"
              />

              {/* Gaya Nama Punggung: Melengkung vs Lurus */}
              <div className="mt-2 pt-1">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] uppercase font-bold text-slate-500">
                    Gaya Nama Punggung
                  </span>
                  <span className="text-[9px] font-medium text-slate-400">
                    {(config.backNameStyle || 'arched') === 'arched' ? 'Melengkung (Arched)' : 'Lurus (Straight)'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100/80 rounded-lg border border-slate-200">
                  <button
                    type="button"
                    id="btn-name-style-arched"
                    onClick={() => onUpdate({ backNameStyle: 'arched' })}
                    className={`py-1.5 px-2.5 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      (config.backNameStyle || 'arched') === 'arched'
                        ? 'bg-white text-[#0B2F64] shadow-xs border border-slate-200/80 font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                    }`}
                  >
                    <span className="text-sm font-bold leading-none select-none">⌒</span>
                    <span>Melengkung</span>
                  </button>
                  <button
                    type="button"
                    id="btn-name-style-straight"
                    onClick={() => onUpdate({ backNameStyle: 'straight' })}
                    className={`py-1.5 px-2.5 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      config.backNameStyle === 'straight'
                        ? 'bg-white text-[#0B2F64] shadow-xs border border-slate-200/80 font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                    }`}
                  >
                    <span className="text-sm font-bold leading-none select-none">—</span>
                    <span>Lurus</span>
                  </button>
                </div>
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500">Number</span>
              <input
                type="text"
                id="input-player-number"
                maxLength={3}
                value={config.playerNumber}
                onChange={(e) => onUpdate({ playerNumber: e.target.value })}
                placeholder="10"
                className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm font-bold font-mono text-[#0f172a] placeholder-slate-400 focus:ring-1 focus:ring-[#0D9488] focus:border-[#0D9488] outline-none transition-all"
              />
            </div>

            {/* Posisi Nomor Depan */}
            <div className="pt-1">
              <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1.5">
                Posisi Nomor Depan
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  id="btn-front-num-opposite"
                  onClick={() => onUpdate({ frontNumberPosition: 'opposite' })}
                  className={`px-2.5 py-2 rounded-lg text-xs font-semibold border flex flex-col items-center justify-center transition-all cursor-pointer ${
                    (config.frontNumberPosition || 'opposite') === 'opposite'
                      ? 'bg-teal-50 border-[#0B2F64] text-[#0B2F64] shadow-xs ring-1 ring-[#0B2F64]/20'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="font-bold">Dada Seberang</span>
                  <span className="text-[9px] text-slate-500 font-normal mt-0.5">Sejajar Logo (Kanan Layar)</span>
                </button>
                <button
                  type="button"
                  id="btn-front-num-center"
                  onClick={() => onUpdate({ frontNumberPosition: 'center' })}
                  className={`px-2.5 py-2 rounded-lg text-xs font-semibold border flex flex-col items-center justify-center transition-all cursor-pointer ${
                    config.frontNumberPosition === 'center'
                      ? 'bg-teal-50 border-[#0B2F64] text-[#0B2F64] shadow-xs ring-1 ring-[#0B2F64]/20'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="font-bold">Tengah Dada</span>
                  <span className="text-[9px] text-slate-500 font-normal mt-0.5">Center Chest</span>
                </button>
              </div>
            </div>

            {/* Print Ink Color */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-slate-600 font-medium">Print Ink Color</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => onUpdate({ textColor: '#ffffff', numberColor: '#ffffff' })}
                  className={`px-2 py-1 rounded text-[10px] font-semibold border transition-all ${
                    config.numberColor === '#ffffff'
                      ? 'border-[#0B2F64] bg-teal-50 text-[#0B2F64]'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  White
                </button>
                <button
                  type="button"
                  onClick={() => onUpdate({ textColor: '#0B2F64', numberColor: '#0B2F64' })}
                  className={`px-2 py-1 rounded text-[10px] font-semibold border transition-all ${
                    config.numberColor === '#0B2F64' || config.numberColor === '#0f172a' || config.numberColor === '#111111'
                      ? 'border-[#0B2F64] bg-teal-50 text-[#0B2F64]'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Navy
                </button>
                <button
                  type="button"
                  onClick={() => onUpdate({ textColor: '#eab308', numberColor: '#eab308' })}
                  className={`px-2 py-1 rounded text-[10px] font-semibold border transition-all ${
                    config.numberColor === '#eab308'
                      ? 'border-[#0B2F64] bg-teal-50 text-[#0B2F64]'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Gold
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 5. CHEST LOGO / CREST */}
        <div>
          <label className="block text-[11px] font-bold text-[#94a3b8] uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-[#0B2F64]" />
            Chest Logo / Crest
          </label>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
            {config.logoUrl ? (
              <div className="flex items-center justify-between gap-3 bg-white p-2.5 rounded-md border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-slate-50 border border-slate-200 p-1 flex items-center justify-center">
                    <img
                      src={config.logoUrl}
                      alt="Crest"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-800 block truncate max-w-[130px]">
                      {config.logoName || 'Active Crest'}
                    </span>
                    <span className="text-[10px] text-[#0D9488] font-medium">Applied to 3D mesh</span>
                  </div>
                </div>
                <button
                  id="btn-remove-logo"
                  onClick={handleRemoveLogo}
                  className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                  title="Remove Logo"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <p className="text-xs text-slate-500">Upload custom crest or choose sample badge</p>
            )}

            <input
              type="file"
              ref={fileInputRef}
              accept="image/png, image/jpeg, image/svg+xml"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload-logo"
            />

            <button
              id="btn-trigger-upload"
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-md text-xs font-semibold transition-colors shadow-sm cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-[#0B2F64]" />
              <span>Upload Custom Logo (PNG/JPG)</span>
            </button>

            <div className="pt-2 border-t border-slate-200">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1.5">
                Sample Badges:
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                {SAMPLE_LOGOS.map((sample) => (
                  <button
                    key={sample.name}
                    onClick={() =>
                      onUpdate({
                        logoUrl: sample.url,
                        logoName: sample.name,
                      })
                    }
                    className={`flex items-center gap-1.5 p-1.5 rounded-md border text-left transition-colors cursor-pointer ${
                      config.logoName === sample.name
                        ? 'bg-teal-50 border-[#0B2F64] text-[#0B2F64]'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <img src={sample.url} alt={sample.name} className="w-4 h-4 object-contain flex-shrink-0" />
                    <span className="text-[10px] font-semibold truncate">{sample.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Panel Bottom CTA */}
      <div className="p-4 border-t border-[#e2e8f0] bg-white space-y-2">
        {onExportGLB && (
          <button
            id="btn-export-glb-panel"
            onClick={onExportGLB}
            disabled={isExportingGLB}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-slate-900 hover:bg-slate-800 active:scale-[0.99] text-white font-semibold rounded-md text-xs transition-all shadow-xs disabled:opacity-60 cursor-pointer"
            title="Download file 3D Jersey format .GLB siap pakai di Blender / Unity / 3D Viewer"
          >
            {isExportingGLB ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#0D9488]" />
                <span>Mengekspor 3D Model (.GLB)...</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 text-[#0D9488]" />
                <span>Download 3D Model (.GLB)</span>
              </>
            )}
          </button>
        )}

        <button
          id="btn-save-design"
          onClick={onSave}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#0B2F64] hover:bg-[#082247] text-white font-semibold rounded-md text-sm shadow-sm transition-all active:scale-[0.99] cursor-pointer"
        >
          <Save className="w-4 h-4 text-[#0D9488]" />
          <span>SAVE & RINGKASAN ORDER</span>
        </button>
        <p className="text-[10px] text-center text-slate-400">
          Model 3D (.GLB), pola sablon & detail pesanan WhatsApp
        </p>
      </div>
    </aside>
  );
};
