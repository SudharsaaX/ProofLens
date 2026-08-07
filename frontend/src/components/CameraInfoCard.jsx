import React from 'react'
import { Box, Typography } from '@mui/material'
import { Camera } from 'lucide-react'
import { colors, radius } from '../utils/tokens'

export default function CameraInfoCard({ cameraInfo }) {
  if (!cameraInfo) return null

  const items = [
    { label: 'Camera', value: cameraInfo.manufacturer ? `${cameraInfo.manufacturer} ${cameraInfo.model || ''}`.trim() : cameraInfo.model },
    { label: 'Lens', value: cameraInfo.lens },
    { label: 'ISO', value: cameraInfo.iso },
    { label: 'Exposure', value: cameraInfo.exposure },
    { label: 'Focal Length', value: cameraInfo.focal_length },
    { label: 'Capture Date', value: cameraInfo.capture_date },
  ].filter(i => i.value)

  if (items.length === 0) return null

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
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          pb: 1,
          mb: 1.5,
          borderBottom: '1px solid rgba(66, 71, 84, 0.2)',
        }}
      >
        <Camera size={20} color={colors.secondary} />
        <Typography sx={{ fontSize: '16px', fontWeight: 600, color: colors.onSurface }}>
          Camera Information
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 1.5,
        }}
      >
        {items.map((item) => (
          <Box key={item.label}>
            <Typography
              sx={{
                color: colors.outline,
                display: 'block',
                mb: 0.5,
                fontSize: '11px',
                fontWeight: 500,
              }}
            >
              {item.label}
            </Typography>
            <Typography
              sx={{
                fontWeight: 500,
                color: colors.onSurface,
                fontSize: '13px',
                wordBreak: 'break-word',
              }}
            >
              {item.value}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
