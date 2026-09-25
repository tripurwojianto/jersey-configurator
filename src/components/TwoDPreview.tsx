import React, { useState } from 'react';
import { Layers, Maximize2, Minimize2, Check, FileText } from 'lucide-react';
import { JerseyConfig, PatternType } from '../types/design';

interface TwoDPreviewProps {
  config: JerseyConfig;
  className?: string;
}

export const TwoDPreview: React.FC<TwoDPreviewProps> = ({ config, className = '' }) => {
  const [activeTab, setActiveTab] = useState<'flat-layout' | 'front-piece' | 'back-piece'>('flat-layout');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Helper to generate pattern background style for 2D pieces
  const getPatternStyle = (pattern: PatternType, primary: string, secondary: string): React.CSSProperties => {
    switch (pattern) {
      case 'stripe':
        return {
          background: `repeating-linear-gradient(90deg, ${primary}, ${primary} 12px, ${secondary} 12px, ${secondary} 24px)`,
        };
      case 'diagonal':
        return {
          background: `repeating-linear-gradient(45deg, ${primary}, ${primary} 14px, ${secondary} 14px, ${secondary} 28px)`,
        };
      case 'gradient':
        return {
          background: `linear-gradient(180deg, ${primary} 0%, ${secondary} 100%)`,
        };
      case 'solid':
      default:
        return {
          backgroundColor: primary,
        };
    }
  };

  const patternStyle = getPatternStyle(config.pattern, config.bodyColor, config.patternSecondaryColor);

  return (
    <div
      id="two-d-design-data-container"
      className={`bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm transition-all ${
        isExpanded ? 'fixed inset-6 z-50 flex flex-col bg-white shadow-2xl border-slate-300' : className
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-white">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-teal-50 text-[#0D9488] border border-teal-200">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              2D DESIGN DATA
            </h3>
            <p className="text-[10px] text-slate-500">
              One Design State → 3D Visual + 2D Production Schematics
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* Subtabs */}
          <div className="hidden sm:flex items-center bg-slate-100 border border-slate-200 rounded-lg p-0.5 text-[11px]">
            <button
              onClick={() => setActiveTab('flat-layout')}
              className={`px-2.5 py-1 rounded font-semibold transition-colors ${
                activeTab === 'flat-layout'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              All Pieces
            </button>
            <button
              onClick={() => setActiveTab('front-piece')}
              className={`px-2.5 py-1 rounded font-semibold transition-colors ${
                activeTab === 'front-piece'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Front
            </button>
            <button
              onClick={() => setActiveTab('back-piece')}
              className={`px-2.5 py-1 rounded font-semibold transition-colors ${
                activeTab === 'back-piece'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Back
            </button>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors ml-1"
            title={isExpanded ? 'Minimize' : 'Expand View'}
            aria-label="Toggle Expand"
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className={`p-4 overflow-y-auto ${isExpanded ? 'flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 bg-slate-50' : 'bg-slate-50/50'}`}>
        {/* Main 2D Pattern Pieces Diagram */}
        <div className={`${isExpanded ? 'lg:col-span-3' : 'w-full'}`}>
          {activeTab === 'flat-layout' && (
            <div className="grid grid-cols-12 gap-3 items-start justify-center">
              {/* Left Sleeve Piece */}
              <div className="col-span-3 flex flex-col items-center">
                <span className="text-[10px] font-semibold text-slate-600 mb-1">Left Sleeve</span>
                <div
                  className="w-full h-28 rounded-lg relative overflow-hidden shadow-sm border border-slate-300 flex flex-col justify-between"
                  style={{ backgroundColor: config.sleeveColor }}
                >
                  <div className="text-[9px] text-white/90 p-1 font-mono font-bold">SLV-L</div>
                  {/* Cuff trim */}
                  <div
                    className="h-3 w-full border-t border-white/20"
                    style={{ backgroundColor: config.collarColor }}
                  />
                </div>
                <span className="text-[9px] font-mono text-slate-500 mt-1">{config.sleeveColor}</span>
              </div>

              {/* Front Torso Piece */}
              <div className="col-span-3 flex flex-col items-center">
                <span className="text-[10px] font-semibold text-slate-600 mb-1">Front Torso</span>
                <div
                  className="w-full h-36 rounded-lg relative overflow-hidden shadow-sm border border-slate-300 p-2 flex flex-col justify-between"
                  style={patternStyle}
                >
                  {/* Collar Notch */}
                  <div
                    className="w-10 h-3 mx-auto rounded-b-md shadow-xs border border-black/20"
                    style={{ backgroundColor: config.collarColor }}
                  />

                  {/* Chest Logo & Front Number (Opposite or Center) */}
                  <div className="relative w-full my-auto flex items-center justify-center px-1">
                    <div className="absolute left-1 top-1/2 -translate-y-1/2">
                      {config.logoUrl ? (
                        <img
                          src={config.logoUrl}
                          alt="Logo"
                          className="w-4 h-4 object-contain drop-shadow"
                        />
                      ) : null}
                    </div>
                    {config.playerNumber && (
                      <span
                        className={`text-xs font-black drop-shadow font-mono ${
                          config.frontNumberPosition === 'center'
                            ? 'text-center'
                            : 'absolute right-1 top-1/2 -translate-y-1/2'
                        }`}
                        style={{ color: config.numberColor }}
                      >
                        {config.playerNumber}
                      </span>
                    )}
                  </div>

                  <div className="text-center text-[8px] text-white font-mono font-bold">FRONT</div>
                </div>
                <span className="text-[9px] font-mono text-slate-500 mt-1">{config.bodyColor}</span>
              </div>

              {/* Back Torso Piece */}
              <div className="col-span-3 flex flex-col items-center">
                <span className="text-[10px] font-semibold text-slate-600 mb-1">Back Torso</span>
                <div
                  className="w-full h-36 rounded-lg relative overflow-hidden shadow-sm border border-slate-300 p-2 flex flex-col items-center justify-between"
                  style={patternStyle}
                >
                  {/* Collar Notch Back */}
                  <div
                    className="w-10 h-2 mx-auto rounded-b-sm border border-black/20"
                    style={{ backgroundColor: config.collarColor }}
                  />

                  {/* Name & Big Number */}
                  <div className="flex flex-col items-center my-auto w-full">
                    {(config.backNameStyle || 'arched') === 'arched' ? (
                      <svg viewBox="0 0 120 22" className="w-24 h-5 overflow-visible">
                        <defs>
                          <path id="mini-back-arch" d="M 5 18 Q 60 5 115 18" fill="transparent" />
                        </defs>
                        <text
                          fill={config.textColor}
                          fontSize="9"
                          fontWeight="bold"
                          letterSpacing="0.04em"
                          textAnchor="middle"
                          className="uppercase select-none"
                        >
                          <textPath href="#mini-back-arch" startOffset="50%">
                            {config.playerName}
                          </textPath>
                        </text>
                      </svg>
                    ) : (
                      <span
                        className="text-[10px] font-bold tracking-wider uppercase drop-shadow truncate max-w-full"
                        style={{ color: config.textColor }}
                      >
                        {config.playerName}
                      </span>
                    )}
                    {config.playerNumber && (
                      <span
                        className="text-3xl font-black drop-shadow font-mono leading-none mt-1"
                        style={{ color: config.numberColor }}
                      >
                        {config.playerNumber}
                      </span>
                    )}
                  </div>

                  <div className="text-center text-[8px] text-white font-mono font-bold">BACK</div>
                </div>
                <span className="text-[9px] font-mono text-slate-500 mt-1">{config.bodyColor}</span>
              </div>

              {/* Right Sleeve Piece */}
              <div className="col-span-3 flex flex-col items-center">
                <span className="text-[10px] font-semibold text-slate-600 mb-1">Right Sleeve</span>
                <div
                  className="w-full h-28 rounded-lg relative overflow-hidden shadow-sm border border-slate-300 flex flex-col justify-between"
                  style={{ backgroundColor: config.sleeveColor }}
                >
                  <div className="text-[9px] text-white/90 p-1 font-mono text-right font-bold">SLV-R</div>
                  {/* Cuff trim */}
                  <div
                    className="h-3 w-full border-t border-white/20"
                    style={{ backgroundColor: config.collarColor }}
                  />
                </div>
                <span className="text-[9px] font-mono text-slate-500 mt-1">{config.sleeveColor}</span>
              </div>
            </div>
          )}

          {activeTab === 'front-piece' && (
            <div className="flex flex-col items-center justify-center p-2">
              <div
                className="w-56 h-64 rounded-xl relative overflow-hidden shadow-md border border-slate-300 p-4 flex flex-col justify-between"
                style={patternStyle}
              >
                <div
                  className="w-20 h-5 mx-auto rounded-b-lg shadow-xs border border-black/20 flex items-center justify-center text-[8px] font-bold text-slate-900"
                  style={{ backgroundColor: config.collarColor }}
                >
                  COLLAR
                </div>

                {/* Chest Area: Left Crest & Front Number (Opposite or Center) */}
                <div className="relative w-full my-auto flex items-center justify-center py-2 px-3">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    {config.logoUrl ? (
                      <img src={config.logoUrl} alt="Logo" className="w-9 h-9 object-contain drop-shadow-md" />
                    ) : (
                      <div className="w-7 h-7 rounded border border-dashed border-white/60 flex items-center justify-center text-[7px] text-white font-bold">
                        CREST
                      </div>
                    )}
                  </div>
                  {config.playerNumber && (
                    <span
                      className={`text-2xl font-black drop-shadow font-mono ${
                        config.frontNumberPosition === 'center'
                          ? 'text-center'
                          : 'absolute right-4 top-1/2 -translate-y-1/2'
                      }`}
                      style={{ color: config.numberColor }}
                    >
                      {config.playerNumber}
                    </span>
                  )}
                </div>

                <div className="text-center text-[10px] font-mono tracking-widest text-white font-bold">
                  FRONT PATTERN SPEC
                </div>
              </div>
            </div>
          )}

          {activeTab === 'back-piece' && (
            <div className="flex flex-col items-center justify-center p-2">
              <div
                className="w-56 h-64 rounded-xl relative overflow-hidden shadow-md border border-slate-300 p-4 flex flex-col items-center justify-between"
                style={patternStyle}
              >
                <div
                  className="w-20 h-4 mx-auto rounded-b-md shadow-xs border border-black/20"
                  style={{ backgroundColor: config.collarColor }}
                />

                <div className="flex flex-col items-center my-auto">
                  {(config.backNameStyle || 'arched') === 'arched' ? (
                    <svg viewBox="0 0 220 44" className="w-48 h-10 overflow-visible">
                      <defs>
                        <path id="large-back-arch" d="M 10 38 Q 110 10 210 38" fill="transparent" />
                      </defs>
                      <text
                        fill={config.textColor}
                        fontSize="17"
                        fontWeight="800"
                        letterSpacing="0.08em"
                        textAnchor="middle"
                        className="uppercase select-none"
                      >
                        <textPath href="#large-back-arch" startOffset="50%">
                          {config.playerName}
                        </textPath>
                      </text>
                    </svg>
                  ) : (
                    <span
                      className="text-lg font-bold tracking-widest uppercase drop-shadow"
                      style={{ color: config.textColor }}
                    >
                      {config.playerName}
                    </span>
                  )}
                  {config.playerNumber && (
                    <span
                      className="text-6xl font-black drop-shadow font-mono leading-none mt-2"
                      style={{ color: config.numberColor }}
                    >
                      {config.playerNumber}
                    </span>
                  )}
                </div>

                <div className="text-center text-[10px] font-mono tracking-widest text-white font-bold">
                  BACK PRINT SPEC
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Parameter Verification Checklist (proves exact parameter mapping) */}
        <div className={`mt-3 pt-3 border-t border-slate-200 ${isExpanded ? 'lg:mt-0 lg:pt-0 lg:border-t-0 lg:border-l lg:pl-6' : ''}`}>
          <div className="text-[11px] font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-[#2563eb]" />
            <span>Synchronized Parameters</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded border border-slate-200">
              <span className="text-slate-500 font-medium">Body Color:</span>
              <span className="font-mono text-slate-800 font-semibold flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full inline-block border border-slate-200" style={{ backgroundColor: config.bodyColor }} />
                {config.bodyColor}
              </span>
            </div>

            <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded border border-slate-200">
              <span className="text-slate-500 font-medium">Sleeve Color:</span>
              <span className="font-mono text-slate-800 font-semibold flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full inline-block border border-slate-200" style={{ backgroundColor: config.sleeveColor }} />
                {config.sleeveColor}
              </span>
            </div>

            <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded border border-slate-200">
              <span className="text-slate-500 font-medium">Collar Color:</span>
              <span className="font-mono text-slate-800 font-semibold flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full inline-block border border-slate-200" style={{ backgroundColor: config.collarColor }} />
                {config.collarColor}
              </span>
            </div>

            <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded border border-slate-200">
              <span className="text-slate-500 font-medium">Pattern:</span>
              <span className="font-bold text-[#2563eb] uppercase">{config.pattern}</span>
            </div>

            <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded border border-slate-200">
              <span className="text-slate-500 font-medium">Name Style:</span>
              <span className="font-bold text-slate-800 capitalize">
                {(config.backNameStyle || 'arched') === 'arched' ? 'Melengkung' : 'Lurus'}
              </span>
            </div>

            <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded border border-slate-200">
              <span className="text-slate-500 font-medium">Name / No:</span>
              <span className="font-mono text-slate-900 font-bold">
                {config.playerName || '-'} / #{config.playerNumber || '-'}
              </span>
            </div>

            <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded border border-slate-200">
              <span className="text-slate-500 font-medium">Crest:</span>
              <span className="font-mono text-slate-800 font-medium truncate max-w-[70px]">
                {config.logoUrl ? (config.logoName || 'Custom Logo') : 'None'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
