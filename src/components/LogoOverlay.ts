/**
 * LogoOverlay
 * Handles loading, caching, and positioning the customer crest/logo on the jersey chest.
 */

const imageCache = new Map<string, HTMLImageElement>();

export function loadLogoImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    if (imageCache.has(url)) {
      const cached = imageCache.get(url)!;
      if (cached.complete) {
        resolve(cached);
        return;
      }
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageCache.set(url, img);
      resolve(img);
    };
    img.onerror = (err) => {
      console.warn('Failed to load logo image:', url, err);
      reject(err);
    };
    img.src = url;
  });
}

export function drawLogoOnChest(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  img: HTMLImageElement | null
) {
  if (!img) return;

  ctx.save();
  // Target position: Left chest
  // In standard athletic jerseys, club crest is on chest (approx x = 30%, y = 28%)
  const chestX = width * 0.30;
  const chestY = height * 0.28;
  // Reduced by ~22.7% (from 0.22 to 0.17) for standard athletic emblem proportions
  const targetSize = Math.round(width * 0.17);

  // Preserve aspect ratio
  const imgAspect = (img.naturalWidth || 100) / (img.naturalHeight || 100);
  let drawW = targetSize;
  let drawH = targetSize;

  if (imgAspect > 1) {
    drawH = Math.round(targetSize / imgAspect);
  } else {
    drawW = Math.round(targetSize * imgAspect);
  }

  const posX = chestX - drawW / 2;
  const posY = chestY - drawH / 2;

  // Add subtle drop shadow for realistic fabric badge appearance
  ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
  ctx.shadowBlur = 3;
  ctx.shadowOffsetX = 1;
  ctx.shadowOffsetY = 2;

  try {
    ctx.drawImage(img, posX, posY, drawW, drawH);
  } catch (e) {
    console.warn('Could not draw logo image:', e);
  }

  ctx.restore();
}
