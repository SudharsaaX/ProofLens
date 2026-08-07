import React, { useState } from 'react'
import { Box, Collapse, Button } from '@mui/material'
import { Code2, ChevronDown, ChevronUp } from 'lucide-react'
import JsonViewer from './JsonViewer'
import { colors } from '../utils/tokens'

export default function DeveloperTools({ analysis }) {
  const [open, setOpen] = useState(false)

  if (!analysis) return null

  return (
    <Box sx={{ mt: 3, mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          onClick={() => setOpen(!open)}
          startIcon={<Code2 size={15} />}
          endIcon={open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          sx={{
            color: colors.outline,
            fontSize: '13px',
            fontWeight: 500,
            px: 2,
            textTransform: 'none',
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.03)',
              color: colors.outline,
            },
          }}
        >
          {open ? 'Hide Developer JSON' : 'Show Developer JSON'}
        </Button>
      </Box>

      <Collapse in={open} timeout="auto" unmountOnExit>
        <Box sx={{ mt: 2 }}>
          <JsonViewer data={analysis} />
        </Box>
      </Collapse>
    </Box>
  )
}
