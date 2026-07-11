import type { PlaceholderShape } from "../types";
import { getManifestedImage } from "./ArtManifest";

/** Draws a single stylized primitive shape centred at the current canvas origin. */
export function drawPlaceholderShape(
  ctx: CanvasRenderingContext2D,
  shape: PlaceholderShape,
  scale = 1,
): void {
  const r = shape.radius * scale;
  ctx.save();

  if (shape.glowColor) {
    ctx.shadowColor = shape.glowColor;
    ctx.shadowBlur = r * 0.9;
  }

  ctx.fillStyle = shape.colorPrimary;
  ctx.strokeStyle = shape.colorSecondary;
  ctx.lineWidth = Math.max(1.5, r * 0.12);

  switch (shape.kind) {
    case "circle": {
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      break;
    }
    case "triangle": {
      drawRegularPolygon(ctx, r, 3, -Math.PI / 2);
      ctx.fill();
      ctx.stroke();
      break;
    }
    case "diamond": {
      drawRegularPolygon(ctx, r, 4, -Math.PI / 2);
      ctx.fill();
      ctx.stroke();
      break;
    }
    case "polygon": {
      drawRegularPolygon(ctx, r, shape.sides ?? 6, -Math.PI / 2);
      ctx.fill();
      ctx.stroke();
      break;
    }
    case "star": {
      drawStar(ctx, r, shape.sides ?? 5);
      ctx.fill();
      ctx.stroke();
      break;
    }
  }

  // Inner accent core for a bit of depth without needing real shading.
  ctx.shadowBlur = 0;
  ctx.fillStyle = shape.colorSecondary;
  ctx.globalAlpha = 0.55;
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.32, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawRegularPolygon(
  ctx: CanvasRenderingContext2D,
  r: number,
  sides: number,
  rotationOffset: number,
): void {
  ctx.beginPath();
  for (let i = 0; i < sides; i++) {
    const a = rotationOffset + (i / sides) * Math.PI * 2;
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
}

function drawStar(ctx: CanvasRenderingContext2D, r: number, points: number): void {
  ctx.beginPath();
  const inner = r * 0.5;
  for (let i = 0; i < points * 2; i++) {
    const rad = i % 2 === 0 ? r : inner;
    const a = -Math.PI / 2 + (i / (points * 2)) * Math.PI * 2;
    const x = Math.cos(a) * rad;
    const y = Math.sin(a) * rad;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
}

/**
 * Draws an entity at (screenX, screenY) facing `angle` radians. Prefers a
 * manifested sprite image (once real art exists) and falls back to the
 * placeholder shape — callers never need to know which was used.
 */
export function drawEntitySprite(
  ctx: CanvasRenderingContext2D,
  artId: string,
  shape: PlaceholderShape,
  screenX: number,
  screenY: number,
  angle: number,
  scale = 1,
  flash = 0,
): void {
  ctx.save();
  ctx.translate(screenX, screenY);
  ctx.rotate(angle);
  if (flash > 0) ctx.filter = `brightness(${100 + flash * 180}%)`;

  const img = getManifestedImage(artId);
  if (img) {
    const size = shape.radius * 2 * scale;
    ctx.drawImage(img, -size / 2, -size / 2, size, size);
  } else {
    drawPlaceholderShape(ctx, shape, scale);
  }

  ctx.restore();
}
