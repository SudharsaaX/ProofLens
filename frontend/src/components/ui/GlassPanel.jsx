import React from 'react'
import { Box } from '@mui/material'
import { radius } from '../../utils/tokens'

/**
 * Glassmorphic panel used across all Stitch screens.
 * Elevated containers at rgba(23,23,23,0.4) with a rim-light top border.
 */
export default function GlassPanel({
  children,
  sx,
  hover = false,
  className = '',
  ...props
}) {
  return (
    <Box
      className={`glass-panel ${hover ? 'glass-panel-hover' : ''} ${className}`}
      sx={{
        borderRadius: radius.md,
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  )
}
