import React from 'react'
import { Box, Typography, Grid } from '@mui/material'
import { Sparkles } from 'lucide-react'

export default function AIGeneratorCard({ generatorInfo }) {
  if (!generatorInfo) return null

  const items = [
    { label: 'Generator', value: generatorInfo.generator_name },
    { label: 'Software', value: generatorInfo.software },
    { label: 'Model', value: generatorInfo.model },
    { label: 'Prompt Found', value: generatorInfo.prompt_found ? 'Yes' : 'No' },
    { label: 'Negative Prompt', value: generatorInfo.negative_prompt_found ? 'Yes' : 'No' },
    { label: 'Seed Found', value: generatorInfo.seed_found ? 'Yes' : 'No' },
  ].filter(i => i.value && i.value !== 'No')

  return (
    <Box sx={{
      p: 2.5,
      borderRadius: 2,
      border: '1px solid',
      borderColor: 'info.main',
      backgroundColor: 'info.main',
      backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.95))',
      ...(theme => theme.palette.mode === 'dark' && {
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8))',
      })
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, color: 'info.main' }}>
        <Sparkles size={18} />
        <Typography variant="subtitle1" fontWeight="600">
          AI Generator Metadata
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {items.map((item, i) => (
          <Grid item xs={6} sm={4} key={i}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              {item.label}
            </Typography>
            <Typography variant="body2" fontWeight="500">
              {item.value}
            </Typography>
          </Grid>
        ))}
      </Grid>

      {generatorInfo.workflow && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
            Workflow Snapshot
          </Typography>
          <Box sx={{ p: 1.5, bgcolor: 'background.default', borderRadius: 1, border: '1px solid', borderColor: 'divider', maxHeight: 150, overflowY: 'auto' }}>
            <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
              {generatorInfo.workflow}
            </Typography>
          </Box>
        </Box>
      )}

      {generatorInfo.parameters && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
            Generation Parameters
          </Typography>
          <Box sx={{ p: 1.5, bgcolor: 'background.default', borderRadius: 1, border: '1px solid', borderColor: 'divider', maxHeight: 150, overflowY: 'auto' }}>
            <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
              {generatorInfo.parameters}
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  )
}
