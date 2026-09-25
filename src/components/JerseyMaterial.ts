import * as THREE from 'three';
import { JerseyConfig, PatternType } from '../types/design';
import { drawBackTextOverlay, drawFrontTextOverlay } from './TextOverlay';
import { drawLogoOnChest, loadLogoImage } from './LogoOverlay';

export interface GeneratedTextures {
  unifiedTexture: THREE.CanvasTexture;
  frontTorsoTexture: THREE.CanvasTexture;
  backTorsoTexture: THREE.CanvasTexture;
  sleeveTexture: THREE.CanvasTexture;
  collarTexture: THREE.CanvasTexture;
}

export interface JerseyMaterials {
  unifiedMaterial: THREE.MeshStandardMaterial;
  frontTorsoMaterial: THREE.MeshStandardMaterial;
  backTorsoMaterial: THREE.MeshStandardMaterial;
  sleeveMaterial: THREE.MeshStandardMaterial;
  collarMaterial: THREE.MeshStandardMaterial;
}

/**
 * Creates dynamic canvas textures for the 3D jersey model based on configuration.
 * Generates high-resolution HTML5 Canvas textures that update in real-time when
 * player name, number, print ink color, or jersey body colors are changed.
 */
export class JerseyMaterialManager {
  // Unified dynamic canvas for single-mesh GLB models
  private unifiedCanvas: HTMLCanvasElement;
  private unifiedTexture: THREE.CanvasTexture;

  // Segmented canvases for modular procedural model
  private frontCanvas: HTMLCanvasElement;
  private backCanvas: HTMLCanvasElement;
  private sleeveCanvas: HTMLCanvasElement;
  private collarCanvas: HTMLCanvasElement;

  private frontTexture: THREE.CanvasTexture;
  private backTexture: THREE.CanvasTexture;
  private sleeveTexture: THREE.CanvasTexture;
  private collarTexture: THREE.CanvasTexture;

  private materials: JerseyMaterials;
  private currentLogoImage: HTMLImageElement | null = null;
  private lastLogoUrl: string | null = null;

  constructor() {
    // 1. High-resolution 2048x2048 canvas for crisp typography and number rendering
    this.unifiedCanvas = document.createElement('canvas');
    this.unifiedCanvas.width = 2048;
    this.unifiedCanvas.height = 2048;

    this.unifiedTexture = new THREE.CanvasTexture(this.unifiedCanvas);
    this.unifiedTexture.colorSpace = THREE.SRGBColorSpace;
    this.unifiedTexture.flipY = false; // Aligns with glTF UV convention (V=0 at top)
    this.unifiedTexture.generateMipmaps = true;
    this.unifiedTexture.minFilter = THREE.LinearMipmapLinearFilter;
    this.unifiedTexture.magFilter = THREE.LinearFilter;

    // 2. Segmented canvases (1024x1024) for procedural parts
    const res = 1024;
    this.frontCanvas = document.createElement('canvas');
    this.frontCanvas.width = res;
    this.frontCanvas.height = res;

    this.backCanvas = document.createElement('canvas');
    this.backCanvas.width = res;
    this.backCanvas.height = res;

    this.sleeveCanvas = document.createElement('canvas');
    this.sleeveCanvas.width = res / 2;
    this.sleeveCanvas.height = res / 2;

    this.collarCanvas = document.createElement('canvas');
    this.collarCanvas.width = res / 2;
    this.collarCanvas.height = res / 4;

    this.frontTexture = new THREE.CanvasTexture(this.frontCanvas);
    this.frontTexture.colorSpace = THREE.SRGBColorSpace;

    this.backTexture = new THREE.CanvasTexture(this.backCanvas);
    this.backTexture.colorSpace = THREE.SRGBColorSpace;

    this.sleeveTexture = new THREE.CanvasTexture(this.sleeveCanvas);
    this.sleeveTexture.colorSpace = THREE.SRGBColorSpace;

    this.collarTexture = new THREE.CanvasTexture(this.collarCanvas);
    this.collarTexture.colorSpace = THREE.SRGBColorSpace;

    // 3. Create MeshStandardMaterials with realistic athletic fabric roughness
    const fabricRoughness = 0.65;
    const fabricMetalness = 0.05;

    this.materials = {
      unifiedMaterial: new THREE.MeshStandardMaterial({
        map: this.unifiedTexture,
        roughness: fabricRoughness,
        metalness: fabricMetalness,
        side: THREE.DoubleSide,
      }),
      frontTorsoMaterial: new THREE.MeshStandardMaterial({
        map: this.frontTexture,
        roughness: fabricRoughness,
        metalness: fabricMetalness,
        side: THREE.DoubleSide,
      }),
      backTorsoMaterial: new THREE.MeshStandardMaterial({
        map: this.backTexture,
        roughness: fabricRoughness,
        metalness: fabricMetalness,
        side: THREE.DoubleSide,
      }),
      sleeveMaterial: new THREE.MeshStandardMaterial({
        map: this.sleeveTexture,
        roughness: fabricRoughness,
        metalness: fabricMetalness,
        side: THREE.DoubleSide,
      }),
      collarMaterial: new THREE.MeshStandardMaterial({
        map: this.collarTexture,
        roughness: 0.8,
        metalness: 0.02,
        side: THREE.DoubleSide,
      }),
    };
  }

  public getMaterials(): JerseyMaterials {
    return this.materials;
  }

  public getUnifiedTexture(): THREE.CanvasTexture {
    return this.unifiedTexture;
  }

  public getUnifiedMaterial(): THREE.MeshStandardMaterial {
    return this.materials.unifiedMaterial;
  }

  public async updateFromConfig(config: JerseyConfig): Promise<void> {
    // 1. Handle logo loading if changed
    if (config.logoUrl && config.logoUrl !== this.lastLogoUrl) {
      try {
        this.currentLogoImage = await loadLogoImage(config.logoUrl);
        this.lastLogoUrl = config.logoUrl;
      } catch {
        this.currentLogoImage = null;
      }
    } else if (!config.logoUrl) {
      this.currentLogoImage = null;
      this.lastLogoUrl = null;
    }

    // 2. Render Unified Canvas (for GLB single-mesh models)
    this.renderUnifiedCanvas(config);

    // 3. Render Front Canvas (for procedural)
    this.renderFrontCanvas(config);
    this.frontTexture.needsUpdate = true;

    // 4. Render Back Canvas (for procedural)
    this.renderBackCanvas(config);
    this.backTexture.needsUpdate = true;

    // 5. Render Sleeve Canvas (for procedural)
    this.renderSleeveCanvas(config);
    this.sleeveTexture.needsUpdate = true;

    // 6. Render Collar Canvas (for procedural)
    this.renderCollarCanvas(config);
    this.collarTexture.needsUpdate = true;
  }

  /**
   * Renders the full unified dynamic canvas texture for the 3D model:
   * - Jersey base color
   * - Pattern / motif (solid, stripe, diagonal, gradient)
   * - Player Name (e.g. DIGID) at upper back with Print Ink Color
   * - Player Number (e.g. 10) at mid back with Print Ink Color
   * - Front match number & chest badge/crest
   */
  public renderUnifiedCanvas(config: JerseyConfig): void {
    const ctx = this.unifiedCanvas.getContext('2d');
    if (!ctx) return;
    const w = this.unifiedCanvas.width;
    const h = this.unifiedCanvas.height;

    ctx.clearRect(0, 0, w, h);

    // 1. Base Garment Fill
    ctx.fillStyle = config.bodyColor;
    ctx.fillRect(0, 0, w, h);

    // 2. Athletic Motif / Pattern
    this.drawPattern(ctx, w, h, config.bodyColor, config.patternSecondaryColor, config.pattern);

    // 3. Typography & Ink Colors
    const inkColor = config.textColor || config.numberColor || '#ffffff';
    const numberInkColor = config.numberColor || config.textColor || '#ffffff';
    const fontName = config.fontFamily || 'Chakra Petch';

    const isSujaya =
      config.productId === 'sujaya-sj-01' ||
      config.modelId === 'sujaya-sj-01' ||
      Boolean(config.customGlbUrl && config.customGlbUrl.includes('jersey_revisi'));

    if (isSujaya) {
      // Sleeve & Collar accent fills for Polo SJ-01 UV layout
      if (config.sleeveColor && config.sleeveColor !== config.bodyColor) {
        ctx.fillStyle = config.sleeveColor;
        ctx.fillRect(w * 0.45, h * 0.115, w * 0.405, h * 0.295);
      }
      if (config.collarColor && config.collarColor !== config.bodyColor) {
        ctx.fillStyle = config.collarColor;
        ctx.fillRect(w * 0.855, h * 0.435, w * 0.09, h * 0.515);
      }

      // 4. BACK OF JERSEY (Polo SJ-01: Back Center is at U ≈ 0.258)
      // UV on back has screen-left at higher U (U ≈ 0.314) and screen-right at lower U (U ≈ 0.201).
      // We flip horizontally across backCenterX so glyphs and character order read normally.
      const backCenterX = w * 0.258;
      const nameStyle = config.backNameStyle || 'arched';

      // 4a. Player Name
      const playerName = (config.playerName ?? '').toUpperCase().trim();
      if (playerName.length > 0) {
        const nameFontSize = Math.round(h * (playerName.length > 10 ? 0.026 : 0.03));
        ctx.font = `bold ${nameFontSize}px '${fontName}', 'Chakra Petch', sans-serif`;
        const strokeWidth = Math.max(3, Math.round(nameFontSize * 0.08));
        const strokeColor = 'rgba(0, 0, 0, 0.45)';

        ctx.save();
        ctx.translate(backCenterX, 0);
        ctx.scale(-1, 1);
        ctx.translate(-backCenterX, 0);

        if (nameStyle === 'arched') {
          const apexY = h * 0.525;
          const textLen = ctx.measureText(playerName).width;
          const arcRadius = Math.max(textLen * 1.35, h * 0.16);
          this.drawArchedText(
            ctx,
            playerName,
            backCenterX,
            apexY,
            arcRadius,
            inkColor,
            strokeColor,
            strokeWidth
          );
        } else {
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          const nameY = h * 0.525;
          ctx.lineWidth = strokeWidth;
          ctx.strokeStyle = strokeColor;
          ctx.strokeText(playerName, backCenterX, nameY);
          ctx.fillStyle = inkColor;
          ctx.fillText(playerName, backCenterX, nameY);
        }
        ctx.restore();
      }

      // 4b. Player Number (Mid Back)
      const playerNumber = (config.playerNumber ?? '').trim();
      if (playerNumber.length > 0) {
        ctx.save();
        ctx.translate(backCenterX, 0);
        ctx.scale(-1, 1);
        ctx.translate(-backCenterX, 0);

        const numFontSize = Math.round(h * 0.155);
        ctx.font = `800 ${numFontSize}px '${fontName}', 'Chakra Petch', sans-serif`;

        const numY = h * 0.640;
        const isLightNumber = (() => {
          try {
            const hex = (numberInkColor || '#ffffff').replace('#', '');
            if (hex.length === 6) {
              const r = parseInt(hex.substring(0, 2), 16);
              const g = parseInt(hex.substring(2, 4), 16);
              const b = parseInt(hex.substring(4, 6), 16);
              const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
              return lum > 0.45;
            }
          } catch {
            // fallback
          }
          return true;
        })();
        const outlineColor = isLightNumber ? '#0f172a' : '#f8fafc';
        const strokeWidth = Math.max(6, Math.round(numFontSize * 0.085));

        ctx.save();
        ctx.translate(backCenterX, numY);
        ctx.scale(0.85, 1);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.lineJoin = 'round';

        ctx.strokeStyle = outlineColor;
        ctx.lineWidth = strokeWidth;
        ctx.strokeText(playerNumber, 0, 0);

        ctx.fillStyle = numberInkColor;
        ctx.fillText(playerNumber, 0, 0);
        ctx.restore();

        ctx.restore();
      }

      // 5. FRONT OF JERSEY (Polo SJ-01: Front Center is at U ≈ 0.656)
      // Screen-left (viewer's left) is at higher U ≈ 0.725; Screen-right is at lower U ≈ 0.585
      const frontPos = config.frontNumberPosition || 'opposite';
      const isOpposite = frontPos === 'opposite';
      const frontNumCenterX = isOpposite ? w * 0.585 : w * 0.656;
      const frontNumY = isOpposite ? h * 0.590 : h * 0.620;
      const badgeCenterX = w * 0.725;
      const badgeCenterY = h * 0.590;

      // 5a. Small Front Match Number
      if (playerNumber.length > 0) {
        ctx.save();
        ctx.translate(frontNumCenterX, frontNumY);
        ctx.scale(-1, 1);
        ctx.translate(-frontNumCenterX, -frontNumY);

        const smallNumFontSize = Math.round(h * (isOpposite ? 0.04 : 0.042));
        ctx.font = `700 ${smallNumFontSize}px '${fontName}', 'Chakra Petch', sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.lineWidth = 3;
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.strokeText(playerNumber, frontNumCenterX, frontNumY);

        ctx.fillStyle = numberInkColor;
        ctx.fillText(playerNumber, frontNumCenterX, frontNumY);
        ctx.restore();
      }

      // 5b. Left Chest Crest / Logo
      if (this.currentLogoImage) {
        ctx.save();
        const img = this.currentLogoImage;
        const maxBadgeSize = Math.round(w * 0.052);
        const imgAspect = (img.naturalWidth || 100) / (img.naturalHeight || 100);
        let drawW = maxBadgeSize;
        let drawH = maxBadgeSize;
        if (imgAspect > 1) {
          drawH = Math.round(maxBadgeSize / imgAspect);
        } else {
          drawW = Math.round(maxBadgeSize * imgAspect);
        }

        const badgeX = badgeCenterX - drawW / 2;
        const badgeY = badgeCenterY - drawH / 2;

        ctx.translate(badgeCenterX, badgeCenterY);
        ctx.scale(-1, 1);
        ctx.translate(-badgeCenterX, -badgeCenterY);

        ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
        ctx.shadowBlur = 5;
        ctx.drawImage(img, badgeX, badgeY, drawW, drawH);
        ctx.restore();
      }

      this.unifiedTexture.needsUpdate = true;
      return;
    }

    // 4. BACK OF JERSEY: Player Name & Player Number (No-Collar / DIGID Vanguard Esports)
    // Baseline logic and proportions adopted directly from Polo SJ-01 reference
    const backCenterX = w * 0.758;
    const nameStyle = config.backNameStyle || 'arched';

    // 4a. Player Name (Polo SJ-01 scale, stroke, and arch radius reference)
    const playerName = (config.playerName ?? '').toUpperCase().trim();
    if (playerName.length > 0) {
      // Name font size follows Polo SJ-01 baseline proportion
      const nameFontSize = Math.round(h * (playerName.length > 10 ? 0.026 : 0.03));
      ctx.font = `bold ${nameFontSize}px '${fontName}', 'Chakra Petch', sans-serif`;

      // Athletic outline matching Polo SJ-01
      const strokeWidth = Math.max(3, Math.round(nameFontSize * 0.08));
      const strokeColor = 'rgba(0, 0, 0, 0.45)';

      // Shifted down ~8.5% of torso height to leave natural breathing room from the neckline
      const apexY = h * 0.205;

      if (nameStyle === 'arched') {
        const textLen = ctx.measureText(playerName).width;
        const arcRadius = Math.max(textLen * 1.35, h * 0.16);

        this.drawArchedText(
          ctx,
          playerName,
          backCenterX,
          apexY,
          arcRadius,
          inkColor,
          strokeColor,
          strokeWidth
        );
      } else {
        // Straight horizontal text
        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const nameY = apexY;

        ctx.lineWidth = strokeWidth;
        ctx.strokeStyle = strokeColor;
        ctx.strokeText(playerName, backCenterX, nameY);

        ctx.fillStyle = inkColor;
        ctx.fillText(playerName, backCenterX, nameY);
        ctx.restore();
      }
    }

    // 4b. Player Number (Mid Back)
    // Scale, 85% horizontal compression, outline luminance, and spacing follow Polo SJ-01 reference
    const playerNumber = (config.playerNumber ?? '').trim();
    if (playerNumber.length > 0) {
      const numFontSize = Math.round(h * 0.155);
      ctx.font = `800 ${numFontSize}px '${fontName}', 'Chakra Petch', sans-serif`;

      // Spacing between name apex and number center maintains exact delta (0.115 * h) from Polo SJ-01
      const numY = h * 0.320;

      const isLightNumber = (() => {
        try {
          const hex = (numberInkColor || '#ffffff').replace('#', '');
          if (hex.length === 6) {
            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 6), 16);
            const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
            return lum > 0.45;
          }
        } catch {
          // fallback
        }
        return true;
      })();
      const outlineColor = isLightNumber ? '#0f172a' : '#f8fafc';
      const strokeWidth = Math.max(6, Math.round(numFontSize * 0.085));

      ctx.save();
      ctx.translate(backCenterX, numY);
      ctx.scale(0.85, 1); // Athletic 85% horizontal compression identical to Polo SJ-01
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.lineJoin = 'round';

      ctx.strokeStyle = outlineColor;
      ctx.lineWidth = strokeWidth;
      ctx.strokeText(playerNumber, 0, 0);

      ctx.fillStyle = numberInkColor;
      ctx.fillText(playerNumber, 0, 0);
      ctx.restore();
    }

    // 5. FRONT OF JERSEY: Front Match Number & Chest Crest
    // Position options:
    // - 'opposite' (default): Opposite chest (wearer's left / screen right, U ≈ 0.330, V ≈ 0.215),
    //   symmetrically mirroring the shield crest at the exact same Y-axis height.
    // - 'center': True center chest (U ≈ 0.260, V ≈ 0.245), centered between left & right chest.
    const frontPos = config.frontNumberPosition || 'opposite';
    const isOpposite = frontPos === 'opposite';

    const frontCenterX = isOpposite ? w * 0.330 : w * 0.260;
    const frontNumY = isOpposite ? h * 0.215 : h * 0.245;

    // 5a. Small Front Match Number
    if (playerNumber.length > 0) {
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const smallNumFontSize = Math.round(h * (isOpposite ? 0.058 : 0.055));
      ctx.font = `700 ${smallNumFontSize}px '${fontName}', 'Chakra Petch', sans-serif`;

      ctx.lineWidth = 3;
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.strokeText(playerNumber, frontCenterX, frontNumY);

      ctx.fillStyle = numberInkColor;
      ctx.fillText(playerNumber, frontCenterX, frontNumY);
      ctx.restore();
    }

    // 5b. Left Chest Crest / Logo (Center: U ≈ 0.185, V ≈ 0.215)
    // Sized proportionally to standard apparel emblems (scaled down ~22% from 0.08 to 0.062)
    if (this.currentLogoImage) {
      ctx.save();
      const img = this.currentLogoImage;
      const maxBadgeSize = Math.round(w * 0.062);

      // Preserve aspect ratio for any custom uploaded logo
      const imgAspect = (img.naturalWidth || 100) / (img.naturalHeight || 100);
      let drawW = maxBadgeSize;
      let drawH = maxBadgeSize;

      if (imgAspect > 1) {
        drawH = Math.round(maxBadgeSize / imgAspect);
      } else {
        drawW = Math.round(maxBadgeSize * imgAspect);
      }

      // Stable center point aligned horizontally with the front number (V ≈ 0.215)
      const centerX = w * 0.185;
      const centerY = h * 0.215;
      const badgeX = centerX - drawW / 2;
      const badgeY = centerY - drawH / 2;

      ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
      ctx.shadowBlur = 5;
      ctx.drawImage(img, badgeX, badgeY, drawW, drawH);
      ctx.restore();
    }

    // Trigger Three.js GPU texture re-upload
    this.unifiedTexture.needsUpdate = true;
  }

  private drawPattern(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    baseColor: string,
    secondaryColor: string,
    pattern: PatternType
  ) {
    // Base fill
    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, width, height);

    if (pattern === 'solid') {
      // Add subtle athletic micro-texture
      this.drawFabricMicroTexture(ctx, width, height);
      return;
    }

    if (pattern === 'stripe') {
      const numStripes = 8;
      const stripeWidth = width / (numStripes * 2);
      ctx.fillStyle = secondaryColor;
      for (let i = 0; i < numStripes * 2; i += 2) {
        ctx.fillRect(i * stripeWidth, 0, stripeWidth, height);
      }
    } else if (pattern === 'diagonal') {
      ctx.save();
      ctx.fillStyle = secondaryColor;
      const stripeWidth = width * 0.08;
      const gap = width * 0.08;
      const totalSpan = width + height * 1.5;

      for (let offset = -height; offset < totalSpan; offset += stripeWidth + gap) {
        ctx.beginPath();
        ctx.moveTo(offset, 0);
        ctx.lineTo(offset + stripeWidth, 0);
        ctx.lineTo(offset + stripeWidth + height * 0.8, height);
        ctx.lineTo(offset + height * 0.8, height);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
    } else if (pattern === 'gradient') {
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, baseColor);
      grad.addColorStop(0.4, baseColor);
      grad.addColorStop(1, secondaryColor);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    }

    // Micro fabric texture overlay for realistic realism
    this.drawFabricMicroTexture(ctx, width, height);
  }

  private drawFabricMicroTexture(ctx: CanvasRenderingContext2D, width: number, height: number) {
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
    for (let y = 0; y < height; y += 4) {
      ctx.fillRect(0, y, width, 1.5);
    }
    ctx.restore();
  }

  /**
   * Helper to render smooth arched athletic jersey typography across shoulder contour
   */
  private drawArchedText(
    ctx: CanvasRenderingContext2D,
    text: string,
    centerX: number,
    apexY: number,
    radius: number,
    fillColor: string,
    strokeColor?: string,
    strokeWidth?: number
  ) {
    const chars = text.split('');
    const count = chars.length;
    if (count === 0) return;

    // Calculate individual character dimensions and letter spacing
    const charWidths = chars.map((c) => ctx.measureText(c).width);
    const letterSpacing = ctx.measureText('M').width * 0.12;
    const totalLength =
      charWidths.reduce((sum, w) => sum + w, 0) + (count - 1) * letterSpacing;

    // Center of curvature circle is below the apex
    const centerY = apexY + radius;
    const totalAngle = totalLength / radius;

    // Initial radial angle starting from left side
    let currentAngle = -totalAngle / 2;

    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let i = 0; i < count; i++) {
      const char = chars[i];
      const charW = charWidths[i];
      const halfCharAngle = (charW / 2) / radius;
      const charAngle = currentAngle + halfCharAngle;

      // Calculate coordinates on the arc
      const x = centerX + radius * Math.sin(charAngle);
      const y = centerY - radius * Math.cos(charAngle);

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(charAngle);

      if (strokeColor && strokeWidth && strokeWidth > 0) {
        ctx.lineWidth = strokeWidth;
        ctx.strokeStyle = strokeColor;
        ctx.strokeText(char, 0, 0);
      }

      ctx.fillStyle = fillColor;
      ctx.fillText(char, 0, 0);
      ctx.restore();

      currentAngle += (charW + letterSpacing) / radius;
    }

    ctx.restore();
  }

  private renderFrontCanvas(config: JerseyConfig) {
    const ctx = this.frontCanvas.getContext('2d');
    if (!ctx) return;
    const w = this.frontCanvas.width;
    const h = this.frontCanvas.height;

    ctx.clearRect(0, 0, w, h);
    this.drawPattern(ctx, w, h, config.bodyColor, config.patternSecondaryColor, config.pattern);

    // Front small player number
    drawFrontTextOverlay(ctx, w, h, {
      number: config.playerNumber || '',
      numberColor: config.numberColor,
      fontFamily: config.fontFamily,
      position: config.frontNumberPosition || 'opposite',
    });

    // Chest Logo / Badge
    if (this.currentLogoImage) {
      drawLogoOnChest(ctx, w, h, this.currentLogoImage);
    }
  }

  private renderBackCanvas(config: JerseyConfig) {
    const ctx = this.backCanvas.getContext('2d');
    if (!ctx) return;
    const w = this.backCanvas.width;
    const h = this.backCanvas.height;

    ctx.clearRect(0, 0, w, h);
    this.drawPattern(ctx, w, h, config.bodyColor, config.patternSecondaryColor, config.pattern);

    // Back Name and Number
    drawBackTextOverlay(ctx, w, h, {
      name: config.playerName || '',
      number: config.playerNumber || '',
      textColor: config.textColor,
      numberColor: config.numberColor,
      fontFamily: config.fontFamily,
      backNameStyle: config.backNameStyle || 'arched',
    });
  }

  private renderSleeveCanvas(config: JerseyConfig) {
    const ctx = this.sleeveCanvas.getContext('2d');
    if (!ctx) return;
    const w = this.sleeveCanvas.width;
    const h = this.sleeveCanvas.height;

    ctx.clearRect(0, 0, w, h);
    // Base sleeve color
    ctx.fillStyle = config.sleeveColor;
    ctx.fillRect(0, 0, w, h);

    // Cuff accent trim
    ctx.fillStyle = config.collarColor;
    ctx.fillRect(0, h - h * 0.12, w, h * 0.12);

    this.drawFabricMicroTexture(ctx, w, h);
  }

  private renderCollarCanvas(config: JerseyConfig) {
    const ctx = this.collarCanvas.getContext('2d');
    if (!ctx) return;
    const w = this.collarCanvas.width;
    const h = this.collarCanvas.height;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = config.collarColor;
    ctx.fillRect(0, 0, w, h);

    // Ribbed collar texture lines
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    for (let x = 0; x < w; x += 8) {
      ctx.fillRect(x, 0, 2, h);
    }
  }

  public dispose() {
    this.unifiedTexture.dispose();
    this.frontTexture.dispose();
    this.backTexture.dispose();
    this.sleeveTexture.dispose();
    this.collarTexture.dispose();
    this.materials.unifiedMaterial.dispose();
    this.materials.frontTorsoMaterial.dispose();
    this.materials.backTorsoMaterial.dispose();
    this.materials.sleeveMaterial.dispose();
    this.materials.collarMaterial.dispose();
  }
}
