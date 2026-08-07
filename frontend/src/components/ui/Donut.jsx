import React from 'react'
import { Box, Typography } from '@mui/material'

/**
 * SVG circular progress ring used for AI confidence / synthetic probability
 * in the Results Dashboard and Features screens.
 */
export default function Donut({
  value = 0,
  label = '',
  size = 128,
  strokeWidth = 6,
  color = '#adc6ff',
  trackColor = '#262626',
  displayValue = null,
  fontSize = null,
  labelFontSize = null,
  sx,
}) {
  const radius = 42
  const circumference = 2 * Math.PI * radius
  const clamped = Math.max(0, Math.min(100, value))
  const offset = circumference * (1 - clamped / 100)

  // Dynamically calculate font sizes relative to the Donut size if not explicitly provided
  const valFontSize = fontSize || `${Math.max(16, Math.round(size * 0.22))}px`
  const lblFontSize = labelFontSize || `${Math.max(8, Math.round(size * 0.08))}px`

  return (
    <Box sx={{ position: 'relative', width: size, height: size, flexShrink: 0, ...sx }}>
      <svg
        viewBox="0 0 100 100"
        style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}
      >
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={color}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          strokeWidth={strokeWidth}
          style={{
            transition: 'stroke-dashoffset 1s ease-out',
          }}
        />
      </svg>
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          px: 1,
        }}
      >
        <Typography
          sx={{
            fontSize: valFontSize,
            fontWeight: 700,
            lineHeight: 1,
            color: '#e5e2e1',
            letterSpacing: '-0.02em',
          }}
        >
          {displayValue ?? value}
          <Typography component="span" sx={{ fontSize: '0.6em', fontWeight: 600, ml: 0.2 }}>
            %
          </Typography>
        </Typography>
        {label && (
          <Typography
            sx={{
              fontSize: lblFontSize,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              color: '#c2c6d6',
              mt: 0.5,
              lineHeight: 1.15,
              maxWidth: '85%',
              wordBreak: 'break-word',
            }}
          >
            {label}
          </Typography>
        )}
      </Box>
    </Box>
  )
}
