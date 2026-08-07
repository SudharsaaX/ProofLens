import React from 'react'
import { Box } from '@mui/material'
import { colors, radius, typography } from '../../utils/tokens'

/**
 * Pill / provenance chip. Small, 1px border, low-opacity fill matching
 * its status color (primary, tertiary, error, outline...).
 */
export default function Pill({
  children,
  color = colors.primary,
  tone = 'primary',
  dot = false,
  startIcon = null,
  sx,
  ...props
}) {
  const fill = {
    primary: `${color}14`,
    tertiary: 'rgba(172, 237, 255, 0.1)',
    error: `${color}18`,
    neutral: colors.surfaceContainerHigh,
  }[tone] || `${color}14`

  const border = {
    primary: `${color}40`,
    tertiary: 'rgba(172, 237, 255, 0.3)',
    error: `${color}40`,
    neutral: `rgba(66, 71, 84, 0.3)`,
  }[tone] || `${color}40`

  return (
    <Box
      component="span"
      sx={{
        px: 1.5,
        py: 0.5,
        borderRadius: radius.full,
        bgcolor: fill,
        border: '1px solid',
        borderColor: border,
        color,
        fontSize: typography.codeSm.fontSize,
        fontWeight: 500,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.75,
        lineHeight: 1.4,
        ...sx,
      }}
      {...props}
    >
      {dot && (
        <Box
          component="span"
          sx={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            bgcolor: colors.tertiary,
            boxShadow: '0 0 5px #38bdf8',
            flexShrink: 0,
          }}
        />
      )}
      {startIcon}
      {children}
    </Box>
  )
}
