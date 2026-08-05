import React from 'react'
import { Card } from '@mui/material'
import { motion } from 'framer-motion'

const MotionCard = motion(Card)

// Variants for staggering children inside a container
export const cardVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 24
    }
  }
}

export default function AnimatedCard({ children, sx, ...props }) {
  return (
    <MotionCard
      variants={cardVariants}
      whileHover={{
        y: -4,
        boxShadow: '0 12px 24px -10px rgba(0,0,0,0.08)',
        borderColor: '#D1D5DB'
      }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      sx={{
        mb: 3,
        willChange: 'transform, box-shadow',
        ...sx
      }}
      {...props}
    >
      {children}
    </MotionCard>
  )
}
