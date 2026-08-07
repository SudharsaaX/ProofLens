import React, { useState } from 'react'
import { Box, Typography, IconButton, Tooltip } from '@mui/material'
import { Copy, Check } from 'lucide-react'
import { formatBytes, truncateHash } from '../utils/formatters'
import { colors, radius, typography } from '../utils/tokens'

export default function FileInfoSection({ fileInfo }) {
  const [copied, setCopied] = useState(false)

  if (!fileInfo) return null

  const handleCopy = () => {
    navigator.clipboard.writeText(fileInfo.sha256)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const items = [
    {
      label: 'Format',
      value: fileInfo.format || (fileInfo.mime_type || 'Unknown').split('/')[1]?.toUpperCase() || 'Unknown',
    },
    {
      label: 'Dimensions',
      value: `${fileInfo.width || 0} × ${fileInfo.height || 0}`,
    },
    {
      label: 'File Size',
      value: formatBytes(fileInfo.size_bytes),
    },
    {
      label: 'SHA-256',
      value: fileInfo.sha256 ? truncateHash(fileInfo.sha256, 10) : 'N/A',
      mono: true,
      copyable: !!fileInfo.sha256,
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
        File Information
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 2,
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <Typography
                sx={{
                  fontWeight: 500,
                  color: colors.onSurface,
                  fontSize: '13px',
                  fontFamily: item.mono ? '"JetBrains Mono", monospace' : 'inherit',
                  wordBreak: 'break-all',
                }}
              >
                {item.value}
              </Typography>
              {item.copyable && (
                <Tooltip title={copied ? 'Copied!' : 'Copy full hash'} placement="top" arrow>
                  <IconButton
                    size="small"
                    onClick={handleCopy}
                    aria-label="Copy full SHA-256 hash"
                    sx={{
                      p: 0.25,
                      color: colors.outlineVariant,
                      '&:hover': { color: colors.outline },
                    }}
                  >
                    {copied ? <Check size={13} color={colors.success} /> : <Copy size={13} />}
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
