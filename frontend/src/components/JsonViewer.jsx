import React, { useState } from 'react'
import { Box, Typography, IconButton, Tooltip } from '@mui/material'
import { Copy, Check, Code2 } from 'lucide-react'
import { colors, radius, typography } from '../utils/tokens'

/**
 * Highlights JSON tokens using the Results Dashboard palette:
 * keys #adc6ff, strings #4cd7f6, booleans/numbers #c0c1ff.
 */
function highlightJson(jsonString) {
  const regex = /("(?:[^"\\]|\\.)*")(\s*:)?|\b(true|false)\b|\b(null)\b|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g

  const parts = []
  let lastIndex = 0
  let match

  while ((match = regex.exec(jsonString)) !== null) {
    if (match.index > lastIndex) {
      parts.push(jsonString.slice(lastIndex, match.index))
    }

    if (match[1]) {
      if (match[2]) {
        parts.push(
          <span key={match.index} className="code-key">{match[1]}{match[2]}</span>
        )
      } else {
        parts.push(
          <span key={match.index} className="code-string">{match[1]}</span>
        )
      }
    } else if (match[3] || match[4]) {
      parts.push(
        <span key={match.index} className="code-boolean">{match[0]}</span>
      )
    } else if (match[5]) {
      parts.push(
        <span key={match.index} className="code-boolean">{match[0]}</span>
      )
    }

    lastIndex = match.index + match[0].length
  }

  if (lastIndex < jsonString.length) {
    parts.push(jsonString.slice(lastIndex))
  }

  return parts
}

export default function JsonViewer({ data }) {
  const [copied, setCopied] = useState(false)

  if (!data) return null

  const jsonString = JSON.stringify(data, null, 2)

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Box
      className="glass-panel"
      sx={{
        borderRadius: radius.md,
        border: '1px solid',
        borderColor: colors.outlineVariant,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 1.25,
          bgcolor: 'rgba(28, 27, 27, 0.5)',
          borderBottom: '1px solid rgba(66, 71, 84, 0.2)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Code2 size={18} color={colors.onSurfaceVariant} />
          <Typography
            sx={{
              ...typography.labelMd,
              fontSize: '14px',
              color: colors.onSurface,
              fontWeight: 500,
            }}
          >
            Raw Provenance JSON
          </Typography>
        </Box>
        <Tooltip title={copied ? 'Copied!' : 'Copy JSON'} arrow>
          <IconButton
            size="small"
            onClick={handleCopy}
            sx={{
              color: colors.onSurfaceVariant,
              width: 28,
              height: 28,
              '&:hover': { color: colors.primary, bgcolor: 'rgba(255,255,255,0.04)' },
            }}
          >
            {copied ? <Check size={14} color={colors.success} /> : <Copy size={14} />}
          </IconButton>
        </Tooltip>
      </Box>

      {/* JSON content */}
      <Box
        className="code-block code-scroll"
        sx={{
          p: 2.5,
          m: 1,
          bgcolor: '#0a0a0a',
          maxHeight: 300,
          overflowY: 'auto',
        }}
      >
        <pre
          style={{
            margin: 0,
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '13px',
            lineHeight: 1.6,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {highlightJson(jsonString)}
        </pre>
      </Box>
    </Box>
  )
}
