import React from 'react'
import { Box, CardContent, Typography, Grid } from '@mui/material'
import AnimatedCard from './AnimatedCard'

export default function CameraInfoCard({ cameraInfo }) {
  if (!cameraInfo) return null

  const items = [
    { label: 'Camera', value: cameraInfo.manufacturer ? `${cameraInfo.manufacturer} ${cameraInfo.model || ''}` : cameraInfo.model },
    { label: 'Lens', value: cameraInfo.lens },
    { label: 'ISO', value: cameraInfo.iso },
    { label: 'Exposure', value: cameraInfo.exposure },
    { label: 'Focal Length', value: cameraInfo.focal_length },
    { label: 'Capture Date', value: cameraInfo.capture_date },
  ].filter(i => i.value)

  if (items.length === 0) return null

  return (
    <AnimatedCard>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="body2" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: 1, mb: 3 }}>
          Camera Information
        </Typography>

        <Grid container spacing={4}>
          {items.map((item, i) => (
            <Grid item xs={6} sm={4} key={i}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                {item.label}
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {item.value}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </AnimatedCard>
  )
}
