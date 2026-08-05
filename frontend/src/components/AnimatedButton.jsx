import React from 'react'
import { Button } from '@mui/material'
import { motion } from 'framer-motion'

const MotionButton = motion(Button)

export default function AnimatedButton({ children, ...props }) {
  return (
    <MotionButton
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      {...props}
    >
      {children}
    </MotionButton>
  )
}
