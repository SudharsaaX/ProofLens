import React from 'react'
import { Button } from '@mui/material'
import { motion } from 'framer-motion'
import { radius } from '../../utils/tokens'

const MotionButton = motion(Button)

/**
 * Primary CTA button matching the Stitch design's button language.
 * - variant="gradient":  linear-gradient(135deg, #005ac2, #009eb9), white text
 * - variant="hero":      primary-container -> tertiary gradient, dark text (landing)
 * - variant="pill":      bg-primary (#adc6ff) pill with on-primary text (cleaner)
 */
export default function PrimaryButton({
  children,
  variant = 'gradient',
  sx,
  ...props
}) {
  const styles = {
    gradient: {
      background: 'linear-gradient(135deg, #7c3aed 0%, #c026d3 100%)',
      color: '#FFFFFF',
      '&:hover': {
        background: 'linear-gradient(135deg, #6d28d9 0%, #a21caf 100%)',
        opacity: 0.95,
      },
    },
    hero: {
      background: 'linear-gradient(90deg, #915eff 0%, #c026d3 100%)',
      color: '#ffffff',
      boxShadow: '0 0 30px rgba(145, 94, 255, 0.4)',
      borderRadius: radius.md,
      '&:hover': {
        background: 'linear-gradient(90deg, #915eff 0%, #c026d3 100%)',
        boxShadow: '0 0 40px rgba(145, 94, 255, 0.6)',
      },
    },
    pill: {
      background: '#915eff',
      color: '#ffffff',
      borderRadius: radius.full,
      fontWeight: 700,
      '&:hover': {
        background: '#7c3aed',
        boxShadow: '0 0 15px rgba(145, 94, 255, 0.4)',
      },
    },
    green: {
      background: '#22c55e',
      color: '#000000',
      borderRadius: radius.full,
      fontWeight: 700,
      '&:hover': {
        background: '#4ade80',
        boxShadow: '0 0 15px rgba(74, 222, 128, 0.3)',
      },
    },
  }[variant]

  return (
    <MotionButton
      whileHover={{ scale: 1.015 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      sx={{ ...styles, ...sx }}
      {...props}
    >
      {children}
    </MotionButton>
  )
}
