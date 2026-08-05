import React from 'react'
import { Box, CardContent, Typography, Chip } from '@mui/material'
import AnimatedCard from './AnimatedCard'
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react'

export default function SummaryCard({ analysis }) {
  if (!analysis) return null

  const { provenance, summary } = analysis
  const score = provenance?.score || 'unknown'

  let Icon = AlertTriangle
  let iconColor = '#D97706'
  let bgColor = 'rgba(217, 119, 6, 0.08)'
  let borderColor = 'rgba(217, 119, 6, 0.25)'
  let label = 'Partial Provenance'

  if (score === 'verified') {
    Icon = CheckCircle
    iconColor = '#16A34A'
    bgColor = 'rgba(22, 163, 74, 0.08)'
    borderColor = 'rgba(22, 163, 74, 0.25)'
    label = 'Verified Provenance'
  } else if (score === 'none') {
    Icon = XCircle
    iconColor = '#6B7280'
    bgColor = 'rgba(107, 114, 128, 0.08)'
    borderColor = 'rgba(107, 114, 128, 0.25)'
    label = 'No Provenance'
  } else if (score === 'metadata_only') {
    label = 'Metadata Present'
  }

  return (
    <AnimatedCard>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="body2" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: 1, mb: 2 }}>
          Image Provenance
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 48,
              height: 48,
              borderRadius: '50%',
              bgcolor: bgColor,
              border: `1px solid ${borderColor}`,
            }}
          >
            <Icon size={24} color={iconColor} />
          </Box>
          <Typography variant="h5" fontWeight={600} color="text.primary">
            {label}
          </Typography>
        </Box>

        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '80%' }}>
          {summary?.human_explanation || 'This image was analyzed for digital provenance and metadata.'}
        </Typography>
      </CardContent>
    </AnimatedCard>
  )
}
