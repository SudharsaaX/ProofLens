/**
 * ProofLens Design Tokens
 * Source of truth: Stitch design system "ProofLens Identity"
 * (stitch_prooflens_image_provenance_platform/prooflens_identity/DESIGN.md)
 */

export const colors = {
  background: '#050816',
  surface: '#050816',
  surfaceDim: '#050816',
  surfaceBright: '#1d1836',
  surfaceContainerLowest: '#03050f',
  surfaceContainerLow: '#100d25',
  surfaceContainer: '#151030',
  surfaceContainerHigh: '#1d1836',
  surfaceContainerHighest: '#241e45',
  onSurface: '#ffffff',
  onSurfaceVariant: '#aaa6c3',
  outline: '#aaa6c3',
  outlineVariant: 'rgba(145, 94, 255, 0.25)',
  primary: '#915eff',
  onPrimary: '#ffffff',
  primaryContainer: '#8b5cf6',
  onPrimaryContainer: '#ffffff',
  inversePrimary: '#7c3aed',
  primaryFixed: '#a78bfa',
  primaryFixedDim: '#915eff',
  onPrimaryFixedVariant: '#6d28d9',
  secondary: '#c026d3',
  onSecondary: '#ffffff',
  secondaryContainer: 'rgba(145, 94, 255, 0.18)',
  onSecondaryContainer: '#d8b4fe',
  tertiary: '#38bdf8',
  onTertiary: '#003640',
  tertiaryContainer: '#0284c7',
  onTertiaryContainer: '#e0f2fe',
  error: '#ffb4ab',
  onError: '#690005',
  errorContainer: '#93000a',
  onErrorContainer: '#ffdad6',
  success: '#4ade80',
  successContainer: 'rgba(74, 222, 128, 0.1)',
  warning: '#facc15',
}

export const typography = {
  displayLg: {
    fontFamily: 'Poppins',
    fontSize: '48px',
    fontWeight: 700,
    lineHeight: 1.1,
    letterSpacing: '-0.02em',
  },
  headlineLg: {
    fontFamily: 'Poppins',
    fontSize: '32px',
    fontWeight: 600,
    lineHeight: 1.2,
    letterSpacing: '-0.01em',
  },
  headlineMd: {
    fontFamily: 'Poppins',
    fontSize: '24px',
    fontWeight: 600,
    lineHeight: 1.3,
  },
  bodyLg: {
    fontFamily: 'Poppins',
    fontSize: '18px',
    fontWeight: 400,
    lineHeight: 1.6,
  },
  bodyMd: {
    fontFamily: 'Poppins',
    fontSize: '16px',
    fontWeight: 400,
    lineHeight: 1.6,
  },
  labelMd: {
    fontFamily: 'Poppins',
    fontSize: '14px',
    fontWeight: 500,
    lineHeight: 1.4,
    letterSpacing: '0.01em',
  },
  codeSm: {
    fontFamily: 'Poppins',
    fontSize: '13px',
    fontWeight: 400,
    lineHeight: 1.5,
  },
}

export const radius = {
  sm: '4px',
  default: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  full: '9999px',
}

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '40px',
  gutter: '24px',
  containerMax: '1280px',
}

/** Hero gradient used across Stitch screens (primary-container -> tertiary). */
export const gradient = {
  hero: 'linear-gradient(135deg, #915eff 0%, #c026d3 100%)',
  accentText: 'linear-gradient(135deg, #915eff 0%, #38bdf8 100%)',
  primaryButton: 'linear-gradient(135deg, #7c3aed 0%, #c026d3 100%)',
}

export const shadow = {
  glowPrimary: '0 0 30px rgba(145, 94, 255, 0.35)',
  glowTertiary: '0 0 15px rgba(192, 38, 211, 0.35)',
}
