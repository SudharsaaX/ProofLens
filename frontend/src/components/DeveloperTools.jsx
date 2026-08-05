import React, { useState } from 'react'
import { Box, Collapse } from '@mui/material'
import { Code2, ChevronDown, ChevronUp } from 'lucide-react'
import JsonViewer from './JsonViewer'
import AnimatedButton from './AnimatedButton'

export default function DeveloperTools({ analysis }) {
  const [open, setOpen] = useState(false)

  if (!analysis) return null

  return (
    <Box sx={{ mt: 4, mb: 8 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <AnimatedButton
          variant="text"
          color="inherit"
          onClick={() => setOpen(!open)}
          startIcon={<Code2 size={16} />}
          endIcon={open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          sx={{
            color: 'text.secondary',
            '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' }
          }}
        >
          {open ? 'Hide Developer JSON' : 'Show Developer JSON'}
        </AnimatedButton>
      </Box>

      <Collapse in={open} timeout="auto" unmountOnExit>
        <Box sx={{ mt: 2 }}>
          <JsonViewer data={analysis} />
        </Box>
      </Collapse>
    </Box>
  )
}
