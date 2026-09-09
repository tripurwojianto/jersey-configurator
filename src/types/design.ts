export type PatternType = 'solid' | 'stripe' | 'diagonal' | 'gradient';

export type ProductType = 'jersey-short-sleeve' | 'jersey-long-sleeve' | 'jersey-sleeveless';

export type FrontNumberPosition = 'opposite' | 'center';

export type BackNameStyle = 'straight' | 'arched';

export interface JerseyConfig {
  productId: string;
  productName: string;
  bodyColor: string;
  sleeveColor: string;
  collarColor: string;
  pattern: PatternType;
  patternSecondaryColor: string;
  playerName: string;
  playerNumber: string;
  textColor: string;
  numberColor: string;
  fontFamily: string;
  logoUrl?: string | null;
  logoName?: string;
  frontNumberPosition?: FrontNumberPosition;
  backNameStyle?: BackNameStyle;
  // Model configuration
  modelSource: 'procedural' | 'gltf';
  modelId?: string;
  customGlbUrl?: string;
}

export interface ColorPreset {
  name: string;
  hex: string;
}

export interface DesignSummaryData {
  config: JerseyConfig;
  savedAt: string;
  designId: string;
  version: string;
}
