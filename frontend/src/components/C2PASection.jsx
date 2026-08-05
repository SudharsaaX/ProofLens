import React from 'react'
import { Box, CardContent, Typography, Grid } from '@mui/material'
import AnimatedCard from './AnimatedCard'
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react'
import { formatDate } from '../utils/formatters'

export default function C2PASection({ c2pa }) {
  if (!c2pa || c2pa.status === 'no_manifest' || !c2pa.found) return null

  const { status, signer, signing_time, error } = c2pa

  let Icon = AlertTriangle
  let iconColor = '#D97706'
  let bgColor = 'rgba(217, 119, 6, 0.08)'
  let borderColor = 'rgba(217, 119, 6, 0.25)'
  let title = 'Unverified Content Credentials'
  let reason = 'Content Credentials detected but could not be verified.'

  if (status === 'verified') {
    Icon = CheckCircle
    iconColor = '#16A34A'
    bgColor = 'rgba(22, 163, 74, 0.08)'
    borderColor = 'rgba(22, 163, 74, 0.25)'
    title = 'Verified Content Credentials'
    reason = null
  } else if (status === 'parse_error') {
    iconColor = '#DC2626'
    bgColor = 'rgba(220, 38, 38, 0.08)'
    borderColor = 'rgba(220, 38, 38, 0.25)'
    title = 'Parse Error'
    reason = 'Content Credentials detected but could not be verified. Reason: Unsupported CBOR/Specification version.'
  } else if (status === 'validation_failed') {
    iconColor = '#DC2626'
    bgColor = 'rgba(220, 38, 38, 0.08)'
    borderColor = 'rgba(220, 38, 38, 0.25)'
    title = 'Validation Failed'
    reason = 'Content Credentials detected but cryptographic validation failed.'
  }

  return (
    <AnimatedCard>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="body2" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: 1, mb: 3 }}>
          Content Credentials
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: '50%',
              bgcolor: bgColor,
              border: `1px solid ${borderColor}`,
            }}
          >
            <Icon size={20} color={iconColor} />
          </Box>
          <Typography variant="h6" fontWeight={600}>
            {title}
          </Typography>
        </Box>

        {reason && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {reason}
          </Typography>
        )}

        {status === 'verified' && (signer || signing_time) && (
          <Grid container spacing={4}>
            {signer && (
              <Grid item xs={6} sm={4}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                  Creator
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {signer}
                </Typography>
              </Grid>
            )}
            {signing_time && (
              <Grid item xs={6} sm={4}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                  Signing Time
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {formatDate(signing_time)}
                </Typography>
              </Grid>
            )}
          </Grid>
        )}
      </CardContent>
    </AnimatedCard>
  )
}
