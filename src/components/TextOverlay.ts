/**
 * TextOverlay
 * Handles typesetting, measurement, and rendering of player name and player number
 * onto the 2D canvas texture for the 3D model and 2D design pattern.
 */

export interface TextOverlayOptions {
  name: string;
  number: string;
  textColor?: string;
  numberColor?: string;
  fontFamily?: string;
  side: 'front' | 'back';
}

export function drawBackTextOverlay(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  options: {
    name: string;
    number: string;
    textColor: string;
    numberColor: string;
    fontFamily: string;
    backNameStyle?: 'straight' | 'arched';
  }
) {
  const { name, number, textColor, numberColor, fontFamily, backNameStyle = 'arched' } = options;

  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // 1. Draw Player Name (Upper Back)
  if (name && name.trim().length > 0) {
    const cleanName = name.toUpperCase().trim();
    const fontSize = Math.round(height * (cleanName.length > 10 ? 0.072 : 0.08));
    ctx.font = `bold ${fontSize}px '${fontFamily}', 'Chakra Petch', sans-serif`;

    const strokeWidth = Math.max(3, Math.round(fontSize * 0.06));
    const strokeColor = 'rgba(0, 0, 0, 0.45)';

    if (backNameStyle === 'arched') {
      const chars = cleanName.split('');
      const charWidths = chars.map((c) => ctx.measureText(c).width);
      const letterSpacing = ctx.measureText('M').width * 0.12;
      const totalLength =
        charWidths.reduce((sum, w) => sum + w, 0) + (chars.length - 1) * letterSpacing;

      const apexY = height * 0.24;
      const radius = Math.max(totalLength * 1.35, height * 0.45);
      const centerY = apexY + radius;
      const totalAngle = totalLength / radius;
      let currentAngle = -totalAngle / 2;

      for (let i = 0; i < chars.length; i++) {
        const char = chars[i];
        const charW = charWidths[i];
        const halfCharAngle = (charW / 2) / radius;
        const charAngle = currentAngle + halfCharAngle;

        const x = width * 0.5 + radius * Math.sin(charAngle);
        const y = centerY - radius * Math.cos(charAngle);

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(charAngle);

        ctx.lineWidth = strokeWidth;
        ctx.strokeStyle = strokeColor;
        ctx.strokeText(char, 0, 0);

        ctx.fillStyle = textColor;
        ctx.fillText(char, 0, 0);
        ctx.restore();

        currentAngle += (charW + letterSpacing) / radius;
      }
    } else {
      const nameY = height * 0.27;
      const nameX = width * 0.5;

      ctx.lineWidth = strokeWidth;
      ctx.strokeStyle = strokeColor;
      ctx.strokeText(cleanName, nameX, nameY);

      ctx.fillStyle = textColor;
      ctx.fillText(cleanName, nameX, nameY);
    }
  }

  // 2. Draw Player Number (Mid Back) - scaled up ~22% and positioned lower for breathing room
  if (number && number.trim().length > 0) {
    const cleanNumber = number.trim();
    const numberFontSize = Math.round(height * 0.34);
    ctx.font = `800 ${numberFontSize}px '${fontFamily}', 'Chakra Petch', sans-serif`;

    const numY = height * 0.60;
    const numX = width * 0.5;

    // Border / Outline for athletic look
    ctx.lineWidth = Math.max(4, Math.round(numberFontSize * 0.04));
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.strokeText(cleanNumber, numX, numY);

    // Fill
    ctx.fillStyle = numberColor;
    ctx.fillText(cleanNumber, numX, numY);
  }

  ctx.restore();
}

export function drawFrontTextOverlay(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  options: {
    number: string;
    numberColor: string;
    fontFamily: string;
    position?: 'opposite' | 'center';
  }
) {
  const { number, numberColor, fontFamily, position = 'opposite' } = options;

  if (!number || number.trim().length === 0) return;

  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const numFontSize = Math.round(height * 0.1);
  ctx.font = `700 ${numFontSize}px '${fontFamily}', 'Chakra Petch', sans-serif`;

  const isOpposite = position === 'opposite';
  const numX = isOpposite ? width * 0.70 : width * 0.5;
  const numY = isOpposite ? height * 0.28 : height * 0.32;

  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.strokeText(number.trim(), numX, numY);

  ctx.fillStyle = numberColor;
  ctx.fillText(number.trim(), numX, numY);

  ctx.restore();
}
