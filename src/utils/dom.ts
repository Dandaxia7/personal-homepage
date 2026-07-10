export function getCssVar(name: string, fallback = ''): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
}

export function hexToRgba(hex: string, alpha: number): string {
  const normalized = hex.replace('#', '');
  if (normalized.length !== 6) return `rgba(255, 105, 180, ${alpha})`;
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function getHexVertex(
  index: number,
  sides: number,
  radius: number,
  cx: number,
  cy: number
): [number, number] {
  const angle = ((Math.PI * 2 * index) / sides) - Math.PI / 2;
  return [cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)];
}

export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
