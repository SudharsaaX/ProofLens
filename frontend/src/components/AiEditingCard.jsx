import React from 'react'
import { Box, Typography, Chip } from '@mui/material'
import { Sparkles, Paintbrush } from 'lucide-react'
import { colors, radius, typography } from '../utils/tokens'

export default function AiEditingCard({ generatorInfo, software }) {
  if (!generatorInfo && !software) return null

  const isAI = !!generatorInfo
  const items = []

  if (generatorInfo) {
    if (generatorInfo.generator_name) {
      items.push({ label: 'AI Generator', value: generatorInfo.generator_name, highlight: true })
    }
    if (generatorInfo.software) {
      items.push({ label: 'Software', value: generatorInfo.software })
    }
    if (generatorInfo.model) {
      items.push({ label: 'Model', value: generatorInfo.model })
    }
    if (generatorInfo.prompt_found) {
      items.push({ label: 'Prompt', value: 'Detected' })
    }
    if (generatorInfo.negative_prompt_found) {
      items.push({ label: 'Negative Prompt', value: 'Detected' })
    }
    if (generatorInfo.seed_found) {
      items.push({ label: 'Seed', value: 'Detected' })
    }
    if (generatorInfo.steps_found) {
      items.push({ label: 'Steps', value: 'Detected' })
    }
    if (generatorInfo.sampler_found) {
      items.push({ label: 'Sampler', value: 'Detected' })
    }
    if (generatorInfo.cfg_found) {
      items.push({ label: 'CFG Scale', value: 'Detected' })
    }
  }

  if (software) {
    items.push({ label: 'Editing Software', value: software })
  }

  if (items.length === 0) return null

  const accentColor = isAI ? colors.tertiary : colors.secondary
  const Icon = isAI ? Sparkles : Paintbrush

  const CodeBlock = ({ title, content }) => (
    <Box sx={{ mt: 1.5 }}>
      <Typography
        sx={{
          color: colors.outline,
          display: 'block',
          mb: 0.5,
          fontSize: '11px',
          fontWeight: 500,
        }}
      >
        {title}
      </Typography>
      <Box
        className="code-block code-scroll"
        sx={{
          p: 1.5,
          maxHeight: 120,
          overflowY: 'auto',
        }}
      >
        <Typography
          sx={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '11px',
            lineHeight: 1.6,
            color: colors.outline,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all',
          }}
        >
          {content}
        </Typography>
      </Box>
    </Box>
  )

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
          {isAI ? 'AI Generation Detected' : 'Software Detection'}
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 1.5,
        }}
      >
        {items.map((item, i) => (
          <Box key={`${item.label}-${i}`}>
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
            {item.highlight ? (
              <Chip
                label={item.value}
                size="small"
                sx={{
                  fontWeight: 600,
                  fontSize: '12px',
                  bgcolor: `${accentColor}20`,
                  color: accentColor,
                  border: `1px solid ${accentColor}40`,
                  borderRadius: radius.sm,
                  height: 26,
                }}
              />
            ) : (
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
            )}
          </Box>
        ))}
      </Box>

      {generatorInfo?.workflow && (
        <CodeBlock title="Workflow Snapshot" content={generatorInfo.workflow} />
      )}

      {generatorInfo?.parameters && (
        <CodeBlock title="Generation Parameters" content={generatorInfo.parameters} />
      )}

      {isAI && (
        <Box
          sx={{
            mt: 1.5,
            p: 1,
            borderRadius: radius.sm,
            bgcolor: colors.surfaceContainerLow,
            border: '1px solid rgba(66, 71, 84, 0.2)',
            display: 'flex',
            gap: 1,
            alignItems: 'flex-start',
          }}
        >
          <Typography sx={{ fontSize: '13px', color: colors.tertiary, lineHeight: 1.4, ...typography.bodyMd }}>
            Metadata signatures consistent with AI image generation were detected in this file.
          </Typography>
        </Box>
      )}
    </Box>
  )
}
