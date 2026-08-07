import React from 'react'
import { Button } from '@mui/material'
import { motion } from 'framer-motion'
import { colors } from '../../utils/tokens'

const MotionButton = motion(Button)

/**
 * Ghost / secondary button: transparent with a subtle #262626 border
 * that becomes slightly more opaque on hover (400ms transition).
 */
export default function GhostButton({ children, sx, ...props }) {
  return (
    <MotionButton
      whileHover={{ scale: 1.015 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      sx={{
        border: '1px solid',
        borderColor: '#262626',
        background: 'transparent',
        color: colors.onSurface,
        '&:hover': {
          background: 'rgba(38, 38, 38, 0.5)',
          borderColor: colors.outlineVariant,
        },
        ...sx,
      }}
      {...props}
    >
      {children}
    </MotionButton>
  )
}
