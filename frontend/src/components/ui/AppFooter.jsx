import React from 'react'
import { Box, Link, Typography } from '@mui/material'
import { Linkedin, Globe, Github } from 'lucide-react'
import { colors, spacing } from '../../utils/tokens'

const SOCIALS = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/sudharsan-aiml/',
    icon: <Linkedin size={20} />,
    round: true,
  },
  {
    label: 'Portfolio',
    href: 'https://sudharsaax.web.app/',
    icon: <Globe size={20} />,
    round: true,
  },
  {
    label: 'GitHub',
    href: 'https://github.com/SudharsaaX',
    icon: <Github size={20} />,
    round: true,
  },
]

/**
 * Footer matching the Stitch landing / workspace footers.
 * variant="landing": round icon links on the right
 * variant="inline":  inline text links (workspace footer)
 */
export default function AppFooter({ variant = 'landing', version = 'v2.0' }) {
  if (variant === 'inline') {
    return (
      <Box
        component="footer"
        sx={{
          mt: 'auto',
          pt: 2,
          borderTop: '1px solid rgba(145, 94, 255, 0.15)',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1.5,
          pb: 0.5,
        }}
      >
        <Typography
          sx={{
            fontSize: '12px',
            color: colors.onSurfaceVariant,
            letterSpacing: '0.01em',
          }}
        >
          ProofLens {version} | Built by <Box component="span" sx={{ color: colors.primary, fontWeight: 600 }}>Sudharsan S</Box> © 2026
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {SOCIALS.map((s) => (
            <Link
              key={s.label}
              href={s.href}
              target="_blank"
              underline="none"
              sx={{
                color: colors.onSurfaceVariant,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                fontSize: '12px',
                '&:hover': { color: colors.primary },
              }}
            >
              {s.icon}
              {s.label}
            </Link>
          ))}
        </Box>
      </Box>
    )
  }

  return (
    <Box
      component="footer"
      sx={{
        width: '100%',
        bgcolor: colors.surfaceContainerLowest,
        borderTop: '1px solid rgba(145, 94, 255, 0.25)',
        mt: 'auto',
      }}
    >
      <Box
        sx={{
          maxWidth: spacing.containerMax,
          mx: 'auto',
          px: spacing.gutter,
          py: spacing.xl,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 3,
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, alignItems: { xs: 'center', md: 'flex-start' } }}>
          <Typography sx={{ ...(variant === 'landing' && { fontWeight: 600, fontSize: '20px' }), color: colors.onSurface, letterSpacing: '-0.02em' }}>
            ProofLens <Box component="span" sx={{ fontSize: '13px', color: colors.outline, fontWeight: 400, ml: 0.5 }}>{version}</Box>
          </Typography>
          <Typography sx={{ fontSize: '13px', color: colors.onSurfaceVariant, opacity: 0.8 }}>
            AI-powered Image Provenance &amp; Privacy Toolkit
          </Typography>
          <Typography sx={{ fontSize: '13px', color: colors.onSurfaceVariant }}>
            Built by <Box component="span" sx={{ color: colors.primary, fontWeight: 600 }}>Sudharsan S.</Box>
          </Typography>
          <Typography sx={{ fontSize: '13px', color: colors.outline }}>
            © 2026 ProofLens. All rights reserved.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, md: 2.5 } }}>
          {SOCIALS.map((s) => (
            <Link
              key={s.label}
              href={s.href}
              target="_blank"
              aria-label={s.label}
              title={s.label}
              underline="none"
              sx={{
                width: 48,
                height: 48,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                bgcolor: colors.surfaceContainer,
                border: '1px solid rgba(145, 94, 255, 0.22)',
                color: colors.onSurfaceVariant,
                transition: 'all 0.3s',
                '&:hover': {
                  color: colors.primary,
                  borderColor: colors.primary,
                  bgcolor: colors.surfaceContainerHigh,
                },
              }}
            >
              {s.icon}
            </Link>
          ))}
        </Box>
      </Box>
    </Box>
  )
}
