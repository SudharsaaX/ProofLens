import React from 'react'
import { Box, Button, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { Code2, Home } from 'lucide-react'
import Brand from '../ui/Brand'
import { colors, spacing, radius, typography } from '../../utils/tokens'

/**
 * Fixed top navigation for the marketing screens (Landing / Features),
 * matching the Stitch top nav: brand, Home link, GitHub, CTA button.
 */
export default function LandingNav() {
  const navigate = useNavigate()

  return (
    <Box
      component="header"
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        bgcolor: 'rgba(5, 8, 22, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(145, 94, 255, 0.15)',
      }}
    >
      <Box
        sx={{
          maxWidth: spacing.containerMax,
          mx: 'auto',
          px: spacing.gutter,
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box
          component="a"
          href="/"
          onClick={(e) => {
            e.preventDefault()
            navigate('/')
          }}
          sx={{ textDecoration: 'none', cursor: 'pointer' }}
        >
          <Brand size={26} />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3.5 }}>
          <Typography
            component="a"
            href="/"
            onClick={(e) => {
              e.preventDefault()
              navigate('/')
            }}
            sx={{
              ...typography.labelMd,
              color: colors.onSurfaceVariant,
              textDecoration: 'none',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: 0.75,
              cursor: 'pointer',
              '&:hover': { color: colors.primary },
              transition: 'color 0.3s ease',
            }}
          >
            <Home size={17} /> Home
          </Typography>

          <Typography
            component="a"
            href="https://github.com/SudharsaaX/ProofLens"
            target="_blank"
            rel="noreferrer"
            sx={{
              ...typography.labelMd,
              color: colors.onSurfaceVariant,
              textDecoration: 'none',
              fontWeight: 500,
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              gap: 0.75,
              '&:hover': { color: colors.primary },
              transition: 'color 0.3s ease',
            }}
          >
            <Code2 size={18} /> GitHub
          </Typography>

          <Button
            onClick={() => navigate('/workspace')}
            sx={{
              background: 'linear-gradient(135deg, #7c3aed 0%, #c026d3 100%)',
              color: '#ffffff',
              px: 3,
              py: 1,
              borderRadius: radius.default,
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '14px',
              fontFamily: 'Poppins',
              boxShadow: '0 0 20px rgba(145, 94, 255, 0.35)',
              '&:hover': {
                background: 'linear-gradient(135deg, #6d28d9 0%, #a21caf 100%)',
                boxShadow: '0 0 30px rgba(145, 94, 255, 0.55)',
                opacity: 0.95,
              },
              transition: 'all 0.3s ease',
            }}
          >
            Analyze Image
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
