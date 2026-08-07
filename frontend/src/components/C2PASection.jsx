import React from 'react'
import { Box, Typography } from '@mui/material'
import { ShieldCheck, ShieldX, ShieldAlert } from 'lucide-react'
import { formatDate } from '../utils/formatters'
import { colors, radius } from '../utils/tokens'

export default function C2PASection({ c2pa }) {
  if (!c2pa || c2pa.status === 'no_manifest' || !c2pa.found) return null

  const { status, signer, signing_time } = c2pa

  let Icon = ShieldAlert
  let accentColor = colors.warning
  let title = 'Unverified Content Credentials'
  let reason = 'Content Credentials detected but could not be verified.'

  if (status === 'verified') {
    Icon = ShieldCheck
    accentColor = colors.success
    title = 'Verified Content Credentials'
    reason = null
  } else if (status === 'parse_error') {
    Icon = ShieldX
    accentColor = colors.error
    title = 'Parse Error'
    reason = 'Content Credentials detected but could not be parsed. The manifest may use an unsupported CBOR/specification version.'
  } else if (status === 'validation_failed') {
    Icon = ShieldX
    accentColor = colors.error
    title = 'Validation Failed'
    reason = 'Content Credentials detected but cryptographic validation failed.'
  }

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
        <Icon size={20} color={accentColor} />
        <Typography sx={{ fontSize: '16px', fontWeight: 600, color: colors.onSurface }}>
          Content Credentials (C2PA)
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: reason ? 1 : 0 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 36,
            height: 36,
            borderRadius: '10px',
            bgcolor: `${accentColor}18`,
            border: `1px solid ${accentColor}30`,
            flexShrink: 0,
          }}
        >
          <Icon size={20} color={accentColor} />
        </Box>
        <Typography sx={{ fontWeight: 600, color: colors.onSurface, fontSize: '15px' }}>
          {title}
        </Typography>
      </Box>

      {reason && (
        <Typography
          sx={{
            color: colors.onSurfaceVariant,
            fontSize: '13px',
            lineHeight: 1.6,
            mb: (status === 'verified' && (signer || signing_time)) ? 1.5 : 0,
          }}
        >
          {reason}
        </Typography>
      )}

      {status === 'verified' && (signer || signing_time) && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: 1.5,
            mt: 1.5,
            pt: 1.5,
            borderTop: '1px solid rgba(66, 71, 84, 0.2)',
          }}
        >
          {signer && (
            <Box>
              <Typography sx={{ color: colors.outline, display: 'block', mb: 0.5, fontSize: '11px', fontWeight: 500 }}>
                Signed By
              </Typography>
              <Typography sx={{ fontWeight: 500, color: colors.onSurface, fontSize: '13px', wordBreak: 'break-word' }}>
                {signer}
              </Typography>
            </Box>
          )}
          {signing_time && (
            <Box>
              <Typography sx={{ color: colors.outline, display: 'block', mb: 0.5, fontSize: '11px', fontWeight: 500 }}>
                Signing Time
              </Typography>
              <Typography sx={{ fontWeight: 500, color: colors.onSurface, fontSize: '13px' }}>
                {formatDate(signing_time)}
              </Typography>
            </Box>
          )}
        </Box>
      )}
    </Box>
  )
}
