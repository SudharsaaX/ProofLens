import React from 'react'
import { Box, Typography } from '@mui/material'
import { ScanEye } from 'lucide-react'
import { colors, typography } from '../../utils/tokens'

/**
 * ProofLens brand mark: "lens_blur" icon + wordmark (Stitch nav header).
 */
export default function Brand({ size = 28, variant = 'nav', sx }) {
  const wordmarkSize = variant === 'footer'
    ? { ...typography.headlineMd }
    : { ...typography.headlineMd }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, ...sx }}>
      <ScanEye size={size} color={colors.primary} strokeWidth={1.75} />
      <Typography
        sx={{
          ...wordmarkSize,
          fontWeight: 600,
          color: variant === 'nav' ? colors.primary : colors.onSurface,
          letterSpacing: '-0.02em',
        }}
      >
        ProofLens
      </Typography>
    </Box>
  )
}
