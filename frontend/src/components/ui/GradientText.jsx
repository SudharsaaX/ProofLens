import React from 'react'
import { Box } from '@mui/material'

/**
 * Gradient-clipped text used for hero headlines:
 * from-primary (#adc6ff) via-primary-container (#4d8eff) to-tertiary (#4cd7f6).
 */
export default function GradientText({ children, sx, ...props }) {
  return (
    <Box
      component="span"
      sx={{
        background: 'linear-gradient(to right, #915eff, #c026d3, #38bdf8)',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent',
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  )
}
