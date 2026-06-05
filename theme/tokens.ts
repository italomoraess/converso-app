/* CONVERSO — Design tokens (ported from styles/tokens.css)
   CRM para autônomos. "Converso" = conversa + conversão.
   RN has no CSS variables, so colors are resolved in JS here.
   Dark theme is the default look of the app. */

export type ThemeColors = {
  // Brand indigo scale
  cv50: string;
  cv100: string;
  cv200: string;
  cv300: string;
  cv400: string;
  cv500: string;
  cv600: string;
  cv700: string;
  cv800: string;
  cv900: string;

  // Dynamic primary
  primary: string;
  primarySoft: string;
  primaryPress: string;
  onPrimary: string;

  // Funnel stage hues
  stageLead: string;
  stageContato: string;
  stageProp: string;
  stageNego: string;
  stageGanho: string;
  stagePerdido: string;

  // Semantic
  money: string;
  moneySoft: string;
  warn: string;
  danger: string;

  // Neutrals
  bg: string;
  surface: string;
  surface2: string;
  border: string;
  borderStrong: string;
  text: string;
  textMuted: string;
  textSubtle: string;
};

const brand = {
  cv50: '#EEF0FF',
  cv100: '#E0E3FF',
  cv200: '#C7CBFF',
  cv300: '#A5A8FB',
  cv400: '#8385F4',
  cv500: '#6366F1',
  cv600: '#4F46E5',
  cv700: '#4338CA',
  cv800: '#3730A3',
  cv900: '#312E81',

  primary: '#4F46E5',
  primaryPress: '#4338CA',
  onPrimary: '#FFFFFF',

  stageLead: '#64748B',
  stageContato: '#0EA5E9',
  stageProp: '#F59E0B',
  stageNego: '#8B5CF6',
  stageGanho: '#10B981',
  stagePerdido: '#F43F5E',

  money: '#059669',
  moneySoft: '#D1FAE5',
  warn: '#D97706',
  danger: '#E11D48',
};

export const lightColors: ThemeColors = {
  ...brand,
  primarySoft: '#EEF0FF',
  bg: '#F5F6FB',
  surface: '#FFFFFF',
  surface2: '#FBFBFE',
  border: '#E8EAF3',
  borderStrong: '#D6D9E8',
  text: '#11152A',
  textMuted: '#586079',
  textSubtle: '#8A92A8',
};

export const darkColors: ThemeColors = {
  ...brand,
  // color-mix(in srgb, primary 22%, #0C0E18) precomputed for the default indigo
  primarySoft: '#1B1E40',
  bg: '#0C0E18',
  surface: '#161A2B',
  surface2: '#1C2138',
  border: '#262C44',
  borderStrong: '#333A57',
  text: '#F3F4FB',
  textMuted: '#A2AAC4',
  textSubtle: '#6B7393',
};

// Dark theme is the default
export const colors = darkColors;

export const radii = {
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  pill: 999,
};

export const fonts = {
  // Custom Sora / Plus Jakarta Sans are optional; fall back to system fonts.
  display: 'System',
  ui: 'System',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
};

// Funnel stage id -> color
export const stageColor: Record<string, string> = {
  lead: colors.stageLead,
  contato: colors.stageContato,
  prop: colors.stageProp,
  nego: colors.stageNego,
  ganho: colors.stageGanho,
  perdido: colors.stagePerdido,
};

// Service category -> color (mirrors data.js catColor)
export const categoryColor: Record<string, string> = {
  Consultoria: '#4F46E5',
  Fotografia: '#0EA5E9',
  Reparos: '#F59E0B',
  'Bem-estar': '#10B981',
  Design: '#8B5CF6',
  Educação: '#EC4899',
};

/**
 * Mix a hex color with a base color by a percentage of the foreground.
 * Mirrors CSS `color-mix(in srgb, fg pct%, base)`.
 */
export function mix(fg: string, pct: number, base = colors.bg): string {
  const f = hexToRgb(fg);
  const b = hexToRgb(base);
  if (!f || !b) return fg;
  const p = pct / 100;
  const r = Math.round(f.r * p + b.r * (1 - p));
  const g = Math.round(f.g * p + b.g * (1 - p));
  const bl = Math.round(f.b * p + b.b * (1 - p));
  return `rgb(${r}, ${g}, ${bl})`;
}

/** Translucent rgba version of a hex color. */
export function alpha(hex: string, a: number): string {
  const c = hexToRgb(hex);
  if (!c) return hex;
  return `rgba(${c.r}, ${c.g}, ${c.b}, ${a})`;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  let h = hex.replace('#', '');
  if (h.length === 3) {
    h = h
      .split('')
      .map((c) => c + c)
      .join('');
  }
  if (h.length !== 6) return null;
  const num = parseInt(h, 16);
  if (Number.isNaN(num)) return null;
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}
