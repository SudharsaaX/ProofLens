import React from 'react'
import { Box, Typography, Tooltip, IconButton } from '@mui/material'
import { Check, X, Info } from 'lucide-react'
import { colors, radius, typography } from '../utils/tokens'

export default function MetadataChecklist({ analysis }) {
  if (!analysis) return null

  const { exif, iptc, xmp, c2pa, png_metadata } = analysis

  const items = [
    {
      label: 'Camera Metadata (EXIF)',
      found: exif?.found,
      description: 'Camera settings like aperture, exposure, and GPS coordinates stored by your phone or camera.',
    },
    {
      label: 'Editing Metadata (XMP)',
      found: xmp?.found,
      description: 'Editing metadata created by software like Photoshop or Lightroom.',
    },
    {
      label: 'Editorial Metadata (IPTC)',
      found: iptc?.found,
      description: 'Standardized details like copyright and photographer name used by news agencies.',
    },
    {
      label: 'Content Credentials (C2PA)',
      found: c2pa?.found,
      description: 'Cryptographically signed provenance information indicating origin and edits.',
    },
    {
      label: 'Format-Specific Metadata',
      found: !!png_metadata,
      description: 'PNG text chunks, JPEG APP segments, ICC color profiles, or AI generation parameters.',
    },
  ]

  return (
    <Box
      className="glass-panel"
      sx={{
        borderRadius: radius.md,
        p: 2,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography
        sx={{
          ...typography.labelMd,
          color: colors.onSurfaceVariant,
          borderBottom: `1px solid rgba(66, 71, 84, 0.1)`,
          pb: 1,
          mb: 1,
          fontWeight: 600,
        }}
      >
        Detected Metadata
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        {items.map((item, index) => (
          <Box
            key={item.label}
            sx={{
              display: 'flex',
              alignItems: 'center',
              py: 1,
              justifyContent: 'space-between',
              borderBottom: index < items.length - 1 ? '1px solid rgba(66, 71, 84, 0.1)' : 'none',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 22,
                  height: 22,
                  borderRadius: radius.sm,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: item.found ? 'rgba(74, 222, 128, 0.1)' : 'rgba(113, 113, 122, 0.08)',
                  border: '1px solid',
                  borderColor: item.found ? 'rgba(74, 222, 128, 0.2)' : 'rgba(113, 113, 122, 0.15)',
                }}
              >
                {item.found ? (
                  <Check size={13} color="#4ade80" strokeWidth={2.5} />
                ) : (
                  <X size={13} color="#52525b" strokeWidth={2.5} />
                )}
              </Box>
              <Typography
                sx={{
                  fontWeight: 500,
                  color: item.found ? colors.onSurface : '#52525b',
                  fontSize: '13px',
                }}
              >
                {item.label}
              </Typography>
            </Box>
            <Tooltip title={item.description} placement="left" arrow>
              <IconButton
                size="small"
                aria-label={`About ${item.label}`}
                sx={{
                  color: colors.outlineVariant,
                  width: 26,
                  height: 26,
                  '&:hover': { color: colors.outline, bgcolor: 'rgba(255,255,255,0.04)' },
                }}
              >
                <Info size={14} />
              </IconButton>
            </Tooltip>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
