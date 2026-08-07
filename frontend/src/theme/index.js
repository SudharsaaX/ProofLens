import { createTheme } from '@mui/material/styles'
import { colors, radius, typography } from '../utils/tokens'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: colors.primary,
      light: colors.primaryFixed,
      dark: colors.inversePrimary,
      contrastText: colors.onPrimary,
    },
    secondary: {
      main: colors.secondary,
      dark: colors.secondaryContainer,
      contrastText: colors.onSecondary,
    },
    tertiary: {
      main: colors.tertiary,
      dark: colors.tertiaryContainer,
      contrastText: colors.onTertiary,
    },
    background: {
      default: colors.background,
      paper: colors.surface,
    },
    text: {
      primary: colors.onSurface,
      secondary: colors.onSurfaceVariant,
    },
    success: {
      main: colors.success,
    },
    warning: {
      main: colors.warning,
    },
    error: {
      main: colors.error,
    },
    divider: colors.outlineVariant,
    action: {
      hover: 'rgba(255, 255, 255, 0.04)',
      selected: 'rgba(77, 142, 255, 0.12)',
    },
  },
  typography: {
    fontFamily: '"Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h1: { ...typography.displayLg },
    h2: { ...typography.headlineLg },
    h3: { ...typography.headlineMd },
    h4: {
      fontWeight: 600,
      letterSpacing: '-0.02em',
    },
    h5: {
      fontWeight: 600,
      letterSpacing: '-0.02em',
    },
    h6: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    subtitle1: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
      fontSize: '1rem',
    },
    subtitle2: { ...typography.labelMd },
    body1: { ...typography.bodyLg },
    body2: { ...typography.bodyMd },
    caption: { ...typography.codeSm },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      fontSize: '0.8125rem',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        'html, body': {
          backgroundColor: '#0a0a0a',
          color: colors.onSurface,
          scrollBehavior: 'smooth',
        },
        '::selection': {
          backgroundColor: colors.primaryContainer,
          color: colors.onPrimaryContainer,
        },
        '::-webkit-scrollbar': {
          width: 8,
          height: 8,
        },
        '::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '::-webkit-scrollbar-thumb': {
          background: colors.outlineVariant,
          borderRadius: 4,
        },
        '::-webkit-scrollbar-thumb:hover': {
          background: colors.surfaceContainerHighest,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: 'rgba(23, 23, 23, 0.4)',
          border: '1px solid',
          borderColor: colors.outlineVariant,
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: 'none',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderRadius: radius.xl,
          transition: 'border-color 0.3s ease, background-color 0.3s ease',
          '&:hover': {
            borderColor: 'rgba(173, 198, 255, 0.4)',
            backgroundColor: 'rgba(23, 23, 23, 0.6)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: radius.default,
          boxShadow: 'none',
          padding: '8px 16px',
          transition: 'all 400ms ease',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #005ac2 0%, #009eb9 100%)',
          color: '#FFFFFF',
          '&:hover': {
            background: 'linear-gradient(135deg, #004395 0%, #004e5c 100%)',
            opacity: 0.9,
          },
        },
        outlined: {
          borderColor: '#262626',
          color: colors.onSurface,
          backgroundColor: 'transparent',
          '&:hover': {
            borderColor: colors.outlineVariant,
            backgroundColor: 'rgba(38, 38, 38, 0.5)',
          },
        },
        text: {
          color: colors.onSurfaceVariant,
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: colors.surfaceContainerLow,
          color: colors.onSurface,
          fontSize: '0.75rem',
          fontWeight: 500,
          borderRadius: radius.default,
          border: `1px solid ${colors.outlineVariant}`,
          padding: '8px 12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
        },
        arrow: {
          color: colors.surfaceContainerLow,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: radius.sm,
          fontWeight: 500,
          fontSize: '0.75rem',
          backgroundColor: colors.surfaceContainerHigh,
        },
        outlined: {
          borderColor: colors.outlineVariant,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: radius.md,
          border: '1px solid',
        },
        standardError: {
          backgroundColor: colors.errorContainer,
          borderColor: 'rgba(255, 180, 171, 0.2)',
          color: colors.onErrorContainer,
          '& .MuiAlert-icon': { color: colors.onErrorContainer },
        },
        standardSuccess: {
          backgroundColor: 'rgba(74, 222, 128, 0.1)',
          borderColor: 'rgba(74, 222, 128, 0.2)',
          color: colors.success,
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: colors.surfaceContainerHighest,
          '&.Mui-checked': {
            color: colors.primaryContainer,
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: colors.outlineVariant,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: colors.onSurfaceVariant,
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.06)',
          },
        },
      },
    },
    MuiSkeleton: {
      styleOverrides: {
        root: {
          backgroundColor: colors.surfaceContainerLow,
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 40,
          height: 20,
          padding: 0,
          '& .MuiSwitch-switchBase': {
            padding: 2,
            color: colors.surface,
            '&.Mui-checked': {
              transform: 'translateX(20px)',
              color: colors.surface,
              '& + .MuiSwitch-track': {
                backgroundColor: colors.success,
                opacity: 1,
              },
            },
          },
          '& .MuiSwitch-thumb': {
            width: 16,
            height: 16,
          },
          '& .MuiSwitch-track': {
            borderRadius: 20,
            backgroundColor: colors.surfaceContainerHighest,
            opacity: 1,
            border: `2px solid ${colors.surfaceContainerHighest}`,
          },
        },
      },
    },
  },
})

export default theme
