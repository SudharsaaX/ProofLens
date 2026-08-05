import React from 'react'
import { Box, CardContent, Typography, Grid, Chip } from '@mui/material'
import AnimatedCard from './AnimatedCard'

export default function AiEditingCard({ generatorInfo, software }) {
  if (!generatorInfo && !software) return null

  const items = []

  if (generatorInfo) {
    if (generatorInfo.tool) items.push({ label: 'Created With', value: generatorInfo.tool, highlight: true })
    if (generatorInfo.workflow) items.push({ label: 'Workflow', value: 'Found' })
    if (generatorInfo.parameters?.prompt) items.push({ label: 'Prompt Found', value: 'Yes' })
    if (generatorInfo.parameters?.negative_prompt) items.push({ label: 'Negative Prompt', value: 'Yes' })
  }

  if (software) {
    items.push({ label: 'Software', value: software })
  }

  if (items.length === 0) return null

  return (
    <AnimatedCard>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="body2" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: 1, mb: 3 }}>
          AI / Editing Information
        </Typography>

        <Grid container spacing={4}>
          {items.map((item, i) => (
            <Grid item xs={6} sm={4} key={i}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                {item.label}
              </Typography>
              {item.highlight ? (
                <Chip label={item.value} size="small" color="primary" sx={{ fontWeight: 600, mt: 0.5 }} />
              ) : (
                <Typography variant="body1" fontWeight={500}>
                  {item.value}
                </Typography>
              )}
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </AnimatedCard>
  )
}
