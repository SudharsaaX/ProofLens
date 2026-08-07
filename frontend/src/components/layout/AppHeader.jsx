import React from 'react'
import { Box, IconButton, Tooltip, Typography } from '@mui/material'
import { Github } from 'lucide-react'
import { colors, spacing, typography } from '../../utils/tokens'

/**
 * Contextual top header for the workspace shell
 * (bg-surface/80, backdrop-blur, border-bottom).
 */
export default function AppHeader({ icon = null, title = '', actions = null }) {
  return (
    <Box
      component="header"
      sx={{
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: { xs: 2, md: spacing.gutter },
        borderBottom: '1px solid rgba(145, 94, 255, 0.15)',
        bgcolor: 'rgba(5, 8, 22, 0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        flexShrink: 0,
        zIndex: 10,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        {icon}
        <Typography sx={{ ...typography.labelMd, color: colors.onSurface }}>{title}</Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        {actions}
        <Tooltip title="View Source on GitHub" arrow>
          <IconButton
            size="small"
            component="a"
            href="https://github.com/SudharsaaX/ProofLens"
            target="_blank"
            rel="noreferrer"
            sx={{
              color: colors.onSurfaceVariant,
              '&:hover': { color: colors.onSurface },
            }}
          >
            <Github size={20} />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  )
}
