import React, { useState } from 'react'
import { Box, CardContent, Typography, Grid, IconButton, Tooltip } from '@mui/material'
import AnimatedCard from './AnimatedCard'
import { Copy, Check } from 'lucide-react'
import { formatBytes, truncateHash } from '../utils/formatters'

export default function FileInfoSection({ fileInfo }) {
  if (!fileInfo) return null
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(fileInfo.file_hash)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const items = [
    { label: 'Format', value: (fileInfo.mime_type || 'Unknown').split('/')[1]?.toUpperCase() || 'Unknown' },
    { label: 'Dimensions', value: `${fileInfo.width || 0} × ${fileInfo.height || 0}` },
    { label: 'File Size', value: formatBytes(fileInfo.file_size_bytes) },
    { label: 'SHA-256', value: fileInfo.file_hash ? truncateHash(fileInfo.file_hash, 8) : 'N/A' },
  ]

  return (
    <AnimatedCard>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="body2" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: 1, mb: 3 }}>
          Image Information
        </Typography>

        <Grid container spacing={4}>
          {items.map((item, index) => (
            <Grid item xs={6} sm={3} key={index}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                {item.label}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body1" fontWeight={500} sx={{ fontFamily: item.label === 'SHA-256' ? 'monospace' : 'inherit' }}>
                  {item.value}
                </Typography>
                {item.label === 'SHA-256' && fileInfo.file_hash && (
                  <Tooltip title={copied ? "Copied!" : "Copy Full Hash"} placement="top">
                    <IconButton size="small" onClick={handleCopy} sx={{ p: 0.5 }}>
                      {copied ? <Check size={14} color="#16A34A" /> : <Copy size={14} />}
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </AnimatedCard>
  )
}
