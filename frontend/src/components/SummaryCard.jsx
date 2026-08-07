import React from 'react'
import { Box, Typography } from '@mui/material'
import { ShieldCheck, ShieldAlert, ShieldQuestion, ShieldX } from 'lucide-react'
import { colors, radius, typography } from '../utils/tokens'

const STATUS_STYLES = {
  'Verified Provenance': {
    Icon: ShieldCheck,
    accent: '#4ade80',
    badge: 'Integrity Intact',
  },
  'No Provenance': {
    Icon: ShieldX,
    accent: colors.outline,
    badge: 'No Source Trail',
  },
  'Metadata Present': {
    Icon: ShieldAlert,
    accent: colors.primaryContainer,
    badge: 'Metadata Found',
  },
  'Partial Provenance': {
    Icon: ShieldAlert,
    accent: colors.warning,
    badge: 'Partial Trail',
  },
}

const FALLBACK = {
  Icon: ShieldQuestion,
  accent: colors.warning,
  badge: 'Unknown',
}

export default function SummaryCard({ analysis }) {
  if (!analysis) return null

  const { provenance, summary } = analysis
  const score = provenance?.score || 'unknown'
  const style = STATUS_STYLES[score] || FALLBACK
  const { Icon, accent, badge } = style

  return (
    <Box
      className="glass-panel"
      sx={{
        borderRadius: radius.md,
        p: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        border: '1px solid',
        borderColor: colors.outlineVariant,
        borderLeft: `4px solid ${accent}`,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            bgcolor: `${accent}18`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: accent,
            flexShrink: 0,
          }}
        >
          <Icon size={22} />
        </Box>
        <Box>
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: '18px',
              color: colors.onSurface,
              lineHeight: 1.3,
              letterSpacing: '-0.01em',
            }}
          >
            {score}
          </Typography>
          <Typography sx={{ ...typography.labelMd, color: colors.onSurfaceVariant }}>
            {summary?.human_explanation || 'This image was analyzed for digital provenance and metadata.'}
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          display: { xs: 'none', sm: 'inline-flex' },
          px: 1,
          py: 0.5,
          borderRadius: radius.full,
          bgcolor: `${accent}18`,
          border: `1px solid ${accent}35`,
          color: accent,
          fontSize: '12px',
          fontWeight: 500,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          whiteSpace: 'nowrap',
        }}
      >
        {badge}
      </Box>
    </Box>
  )
}
