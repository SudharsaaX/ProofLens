import React, { useState } from 'react'
import { Box, Card, CardContent, Typography, Button, Collapse, IconButton, Tooltip } from '@mui/material'
import { Code, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react'

export default function JsonViewer({ data }) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  if (!data) return null

  const jsonString = JSON.stringify(data, null, 2)

  const handleCopy = (e) => {
    e.stopPropagation()
    navigator.clipboard.writeText(jsonString)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card sx={{ mb: 4, bgcolor: 'background.paper' }}>
      <CardContent sx={{ p: 2.5 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
          }}
          onClick={() => setOpen((prev) => !prev)}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Code size={18} color="#6B7280" />
            <Typography variant="subtitle2" fontWeight={600}>
              Raw Analysis JSON
            </Typography>
            <Typography variant="caption" color="text.secondary">
              (Developer Inspector)
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {open && (
              <Tooltip title={copied ? 'Copied!' : 'Copy raw JSON'}>
                <IconButton size="small" onClick={handleCopy}>
                  {copied ? <Check size={14} color="#16A34A" /> : <Copy size={14} />}
                </IconButton>
              </Tooltip>
            )}

            <Button
              size="small"
              endIcon={open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              sx={{ color: 'text.secondary' }}
            >
              {open ? 'Hide JSON' : 'Show JSON'}
            </Button>
          </Box>
        </Box>

        <Collapse in={open} timeout="auto" unmountOnExit>
          <Box
            sx={{
              mt: 2,
              p: 2,
              bgcolor: '#0B0F19',
              color: '#E5E7EB',
              borderRadius: 1.5,
              fontFamily: 'mono',
              fontSize: '0.8125rem',
              maxHeight: 450,
              overflow: 'auto',
              border: '1px solid #1E293B',
            }}
          >
            <pre style={{ margin: 0 }}>
              {jsonString}
            </pre>
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  )
}
