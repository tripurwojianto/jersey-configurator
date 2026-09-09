import { useState, useCallback } from 'react';
import { JerseyConfig, ColorPreset } from '../types/design';

export const DEFAULT_JERSEY_CONFIG: JerseyConfig = {
  productId: 'athletic-jersey-glb',
  productName: 'Athletic Fit Jersey (3D GLB)',
  bodyColor: '#0B2F64',
  sleeveColor: '#082247',
  collarColor: '#ffffff',
  pattern: 'diagonal',
  patternSecondaryColor: '#0D9488',
  playerName: 'SYAMANAH',
  playerNumber: '10',
  textColor: '#ffffff',
  numberColor: '#ffffff',
  fontFamily: 'Chakra Petch',
  logoUrl: null,
  logoName: undefined,
  frontNumberPosition: 'opposite',
  backNameStyle: 'arched',
  modelSource: 'gltf',
  modelId: 'athletic-jersey-glb',
  customGlbUrl: '/models/athletic_jersey.glb',
};

export const COLOR_PRESETS: ColorPreset[] = [
  { name: 'Syamanah Navy', hex: '#0B2F64' },
  { name: 'Syamanah Teal', hex: '#0D9488' },
  { name: 'Pitch Black', hex: '#111111' },
  { name: 'Crimson Red', hex: '#dc2626' },
  { name: 'Pure White', hex: '#ffffff' },
  { name: 'Royal Blue', hex: '#2563eb' },
  { name: 'Navy Blue', hex: '#0f172a' },
  { name: 'Emerald Green', hex: '#059669' },
  { name: 'Cyber Gold', hex: '#eab308' },
  { name: 'Electric Orange', hex: '#ea580c' },
  { name: 'Volt Yellow', hex: '#84cc16' },
  { name: 'Deep Purple', hex: '#7c3aed' },
  { name: 'Graphite Grey', hex: '#475569' },
  { name: 'Sky Cyan', hex: '#0284c7' },
];

export const SAMPLE_LOGOS = [
  {
    name: 'Striker Falcon',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><polygon points="50,10 90,35 75,85 25,85 10,35" fill="%23dc2626" stroke="%23ffffff" stroke-width="3"/><polygon points="50,22 80,42 68,78 32,78 20,42" fill="%23111111"/><text x="50" y="60" font-family="sans-serif" font-weight="bold" font-size="28" fill="%23ffffff" text-anchor="middle">FC</text></svg>',
  },
  {
    name: 'Apex Shield',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M50 8 L85 22 C85 60 50 92 50 92 C50 92 15 60 15 22 Z" fill="%232563eb" stroke="%23ffffff" stroke-width="4"/><circle cx="50" cy="45" r="22" fill="%23ffffff"/><polygon points="50,30 55,42 67,42 58,50 61,62 50,54 39,62 42,50 33,42 45,42" fill="%232563eb"/></svg>',
  },
  {
    name: 'Thunderbolt',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" fill="%230f172a" stroke="%23eab308" stroke-width="4"/><polygon points="54,16 28,52 48,52 42,84 72,44 52,44" fill="%23eab308"/></svg>',
  },
];

export function useDesignState(initialConfig: JerseyConfig = DEFAULT_JERSEY_CONFIG) {
  const [config, setConfig] = useState<JerseyConfig>(initialConfig);

  const updateConfig = useCallback((updates: Partial<JerseyConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  }, []);

  const resetConfig = useCallback(() => {
    setConfig(DEFAULT_JERSEY_CONFIG);
  }, []);

  const serializeConfig = useCallback((): string => {
    return JSON.stringify(config, null, 2);
  }, [config]);

  const loadPreset = useCallback((preset: Partial<JerseyConfig>) => {
    setConfig((prev) => ({ ...prev, ...preset }));
  }, []);

  return {
    config,
    updateConfig,
    resetConfig,
    serializeConfig,
    loadPreset,
  };
}
