import { spacing, borderRadius, elevation, typography, animation } from './tokens';

export const ACCENT = '#6366F1';
const ACCENT_START = '#6366F1';
const ACCENT_END = '#8B5CF6';

export const lightTheme = {
  // Base
// Light Theme Improvements

background: '#F7F8FA',
backgroundSecondary: '#FBFCFD',

surface: '#FFFFFF',
surfaceSecondary: '#FFFFFF',
surfaceTertiary: '#F1F3F5',

surfaceOverlay: 'rgba(255,255,255,0.82)',
surfaceGlass: 'rgba(255,255,255,0.72)',

border: '#E6E8EB',
  // Text
  text: '#18181B',
  textSecondary: '#71717A',
  textTertiary: '#A1A1AA',
  textInverse: '#FAFAFA',
  // Border
  borderFocus: ACCENT,
  // Accent
  accent: ACCENT,
  accentMuted: '#A5B4FC',
  accentGradient: [ACCENT_START, ACCENT_END] as const,
  // Semantic
  error: '#DC2626',
  errorMuted: '#FEE2E2',
  success: '#16A34A',
  successMuted: '#DCFCE7',
  warning: '#D97706',
  warningMuted: '#FEF3C7',
  // Urgency
  urgencyHigh: '#DC2626',
  urgencyMedium: '#D97706',
  urgencyLow: '#16A34A',
  // Tokens (nested to avoid key clash with spacing)
  ...spacing,
  borderRadius,
  elevation,
  ...typography,
  ...animation,
};

export const darkTheme = {
  background: '#09090B',
  backgroundSecondary: '#0C0C0E',
  surface: '#18181B',
  surfaceSecondary: '#27272A',
  surfaceTertiary: '#3F3F46',
  surfaceOverlay: 'rgba(24,24,27,0.88)',
  surfaceGlass: 'rgba(39,39,42,0.9)',
  text: '#FAFAFA',
  textSecondary: '#A1A1AA',
  textTertiary: '#71717A',
  textInverse: '#18181B',
  border: '#3F3F46',
  borderFocus: ACCENT,
  accent: ACCENT,
  accentMuted: '#818CF8',
  accentGradient: [ACCENT_START, ACCENT_END] as const,
  error: '#EF4444',
  errorMuted: '#450A0A',
  success: '#22C55E',
  successMuted: '#052E16',
  warning: '#F59E0B',
  warningMuted: '#451A03',
  urgencyHigh: '#EF4444',
  urgencyMedium: '#F59E0B',
  urgencyLow: '#22C55E',
  ...spacing,
  borderRadius,
  elevation,
  ...typography,
  ...animation,
};

export type Theme = typeof lightTheme;

export { spacing, borderRadius, elevation, typography, animation };
