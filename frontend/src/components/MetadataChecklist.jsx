import React from 'react'
import { Box, CardContent, Typography, Tooltip, IconButton, Divider } from '@mui/material'
import AnimatedCard from './AnimatedCard'
import { Check, X, Info } from 'lucide-react'

export default function MetadataChecklist({ analysis }) {
  if (!analysis) return null

  const { exif, iptc, xmp, c2pa } = analysis

  const items = [
    {
      label: 'Camera Metadata (EXIF)',
      found: exif?.found,
      description: 'Camera settings like aperture and location stored by your phone or camera.',
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
      label: 'Content Credentials',
      found: c2pa?.found,
      description: 'Cryptographically signed provenance information indicating origin and edits.',
    },
  ]

  return (
    <AnimatedCard>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="body2" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: 1, mb: 3 }}>
          Metadata Found
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          {items.map((item, index) => (
            <React.Fragment key={item.label}>
              <Box sx={{ display: 'flex', alignItems: 'center', py: 1.5, justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {item.found ? (
                    <Check size={20} color="#16A34A" />
                  ) : (
                    <X size={20} color="#9CA3AF" />
                  )}
                  <Typography variant="body1" fontWeight={500} color={item.found ? 'text.primary' : 'text.secondary'}>
                    {item.label}
                  </Typography>
                </Box>
                <Tooltip title={item.description} placement="left" arrow>
                  <IconButton size="small" sx={{ color: 'text.secondary' }}>
                    <Info size={16} />
                  </IconButton>
                </Tooltip>
              </Box>
              {index < items.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </Box>
      </CardContent>
    </AnimatedCard>
  )
}
