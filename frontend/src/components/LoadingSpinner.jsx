import React from 'react'
import { Box, Skeleton, Typography } from '@mui/material'
import { motion } from 'framer-motion'
import { colors, radius } from '../utils/tokens'

const MotionBox = motion(Box)

const SkeletonCard = ({ children, sx }) => (
  <Box
    className="glass-panel"
    sx={{ borderRadius: radius.md, p: 3, display: 'flex', flexDirection: 'column', ...sx }}
  >
    {children}
  </Box>
)

export default function LoadingSpinner({ message = 'Analyzing image provenance and metadata…' }) {
  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      {/* Status indicator */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <MotionBox
          animate={{
            scale: [1, 1.4, 1],
            opacity: [1, 0.5, 1],
          }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            bgcolor: colors.primary,
            boxShadow: `0 0 8px ${colors.primary}80`,
          }}
        />
        <Typography
          variant="body2"
          sx={{ fontWeight: 500, color: colors.onSurfaceVariant, fontSize: '0.8125rem' }}
        >
          {message}
        </Typography>
      </Box>

      {/* Skeleton cards */}
      <SkeletonCard>
        <Skeleton variant="text" width="35%" height={24} sx={{ mb: 2, bgcolor: colors.surfaceContainerHigh }} />
        <Box sx={{ display: 'flex', gap: 2, mb: 2.5, flexWrap: 'wrap' }}>
          <Skeleton variant="rounded" width={90} height={24} sx={{ borderRadius: radius.default, bgcolor: colors.surfaceContainerHigh }} />
          <Skeleton variant="rounded" width={110} height={24} sx={{ borderRadius: radius.default, bgcolor: colors.surfaceContainerHigh }} />
          <Skeleton variant="rounded" width={80} height={24} sx={{ borderRadius: radius.default, bgcolor: colors.surfaceContainerHigh }} />
          <Skeleton variant="rounded" width={140} height={24} sx={{ borderRadius: radius.default, bgcolor: colors.surfaceContainerHigh }} />
        </Box>
        <Skeleton variant="text" width="80%" height={16} sx={{ bgcolor: colors.surfaceContainerHigh }} />
        <Skeleton variant="text" width="55%" height={16} sx={{ bgcolor: colors.surfaceContainerHigh }} />
      </SkeletonCard>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
        <SkeletonCard>
          <Skeleton variant="text" width="45%" height={20} sx={{ mb: 2, bgcolor: colors.surfaceContainerHigh }} />
          <Skeleton variant="rectangular" height={70} sx={{ borderRadius: radius.default, bgcolor: colors.surfaceContainerHigh }} />
        </SkeletonCard>
        <SkeletonCard>
          <Skeleton variant="text" width="45%" height={20} sx={{ mb: 2, bgcolor: colors.surfaceContainerHigh }} />
          <Skeleton variant="rectangular" height={70} sx={{ borderRadius: radius.default, bgcolor: colors.surfaceContainerHigh }} />
        </SkeletonCard>
      </Box>
    </Box>
  )
}
