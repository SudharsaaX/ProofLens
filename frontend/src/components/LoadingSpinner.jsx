import React from 'react'
import { Box, Card, CardContent, Skeleton, Typography } from '@mui/material'

export default function LoadingSpinner({ message = 'Analyzing image provenance and metadata...' }) {
  return (
    <Box sx={{ width: '100%', mt: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            bgcolor: 'secondary.main',
            animation: 'pulse 1.5s infinite ease-in-out',
            '@keyframes pulse': {
              '0%, 100%': { opacity: 1, transform: 'scale(1)' },
              '50%': { opacity: 0.4, transform: 'scale(1.2)' },
            },
          }}
        />
        <Typography variant="body2" fontWeight={500} color="text.secondary">
          {message}
        </Typography>
      </Box>
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Skeleton variant="text" width="30%" height={28} sx={{ mb: 2 }} />
          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
            <Skeleton variant="rounded" width={100} height={28} />
            <Skeleton variant="rounded" width={100} height={28} />
            <Skeleton variant="rounded" width={120} height={28} />
            <Skeleton variant="rounded" width={160} height={28} />
          </Box>
          <Skeleton variant="text" width="85%" height={20} />
          <Skeleton variant="text" width="60%" height={20} />
        </CardContent>
      </Card>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Skeleton variant="text" width="40%" height={24} sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" height={80} sx={{ borderRadius: 1 }} />
          </CardContent>
        </Card>
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Skeleton variant="text" width="40%" height={24} sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" height={80} sx={{ borderRadius: 1 }} />
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}
