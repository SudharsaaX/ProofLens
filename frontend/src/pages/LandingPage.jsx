import React from 'react'
import { Box, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, ScrollText, BrainCircuit, Braces, ScanSearch } from 'lucide-react'
import LandingNav from '../components/layout/LandingNav'
import UploadZone from '../components/UploadZone'
import AppFooter from '../components/ui/AppFooter'
import GlassPanel from '../components/ui/GlassPanel'
import Pill from '../components/ui/Pill'
import GradientText from '../components/ui/GradientText'
import { useUpload } from '../context/UploadContext'
import { colors, spacing, radius, typography } from '../utils/tokens'

const FORENSIC_CARDS = [
  {
    title: 'C2PA Provenance Verification',
    desc: 'Cryptographically verify the origin and history of media. Detect if an asset has been tampered with or stripped of its original source signatures.',
    icon: <ScrollText size={24} />,
    iconColor: colors.tertiary,
    span: 2,
  },
  {
    title: 'AI Generation Detection',
    desc: 'Advanced heuristics identify pixel-level artifacts and noise patterns characteristic of Midjourney, DALL-E, and Stable Diffusion.',
    icon: <BrainCircuit size={24} />,
    iconColor: colors.primary,
    span: 1,
  },
  {
    title: 'Metadata Deep Dive',
    desc: 'Extract and analyze EXIF, IPTC, and XMP blocks. Instantly flag suspicious edits to capture dates, GPS coordinates, or software modification tags.',
    icon: <Braces size={24} />,
    iconColor: colors.secondary,
    span: 1,
  },
]

export default function LandingPage() {
  const navigate = useNavigate()
  const { setFile } = useUpload()

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', overflowX: 'hidden', bgcolor: colors.background }}>
      <Box className="ambient-glow" />
      <Box className="bg-grid-pattern" sx={{ position: 'absolute', inset: 0, zIndex: 0, opacity: 0.5, pointerEvents: 'none' }} />

      <LandingNav />

      <Box component="main" sx={{ position: 'relative', zIndex: 10, flexGrow: 1, display: 'flex', flexDirection: 'column', width: '100%', maxWidth: spacing.containerMax, mx: 'auto', px: spacing.gutter, pt: { xs: 6, md: 10 }, pb: { xs: 10, md: 16 } }}>
        {/* Hero */}
        <Box component="section" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', maxWidth: 896, mx: 'auto', mb: { xs: 6, md: 10 } }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1.5, mb: 3 }}>
            <Pill tone="primary" dot> C2PA Compliant</Pill>
            <Pill color={colors.onSurfaceVariant}>EXIF Extraction</Pill>
            <Pill color={colors.onSurfaceVariant}>AI Manipulation Detect</Pill>
          </Box>
          <Typography
            component="h1"
            sx={{
              ...typography.displayLg,
              fontSize: { xs: '32px', sm: '44px', md: '56px' },
              color: colors.onSurface,
              mb: 2.5,
              lineHeight: 1.15,
            }}
          >
            Know the truth behind <br /> <GradientText>every pixel.</GradientText>
          </Typography>
          <Typography sx={{ ...typography.bodyLg, color: colors.onSurfaceVariant, maxWidth: 576, mx: 'auto', fontSize: { xs: '15px', md: '18px' } }}>
            Uncover the invisible history of your digital media. Our forensic-grade engine analyzes cryptographic signatures, metadata, and pixel-level anomalies to verify authenticity in real-time.
          </Typography>
        </Box>

        {/* Upload Area */}
        <Box component="section" sx={{ width: '100%', maxWidth: 768, mx: 'auto', mb: { xs: 10, md: 16 } }}>
          <Box className="animated-border-wrap" sx={{ width: '100%', height: { xs: 280, sm: 340, md: 400 } }}>
            <Box className="animated-border-content" sx={{ height: '100%' }}>
              <UploadZone
                onFileSelect={(f) => {
                  setFile(f)
                  navigate('/workspace')
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* Features Preview (Bento) */}
        <Box component="section" id="features" sx={{ width: '100%', mb: 12 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mb: 4 }}>
            <Typography sx={{ ...typography.headlineLg, color: colors.onSurface, letterSpacing: '-0.01em', fontSize: { xs: '22px', sm: '28px', md: '32px' } }}>
              Forensic Capabilities
            </Typography>
            <Typography
              component="a"
              href="#/features"
              onClick={(e) => {
                e.preventDefault()
                navigate('/features')
              }}
              sx={{
                ...typography.labelMd,
                color: colors.primary,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                '&:hover': { color: colors.tertiary },
                transition: 'color 0.3s',
              }}
            >
              View full spec <ArrowRight size={18} />
            </Typography>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
            {/* Card 1: C2PA (2 cols) */}
            <GlassPanel hover sx={{ p: { xs: 3, md: 4 }, display: 'flex', flexDirection: 'column', gridColumn: { xs: 'span 1', md: 'span 2' }, position: 'relative', overflow: 'hidden' }}>
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  p: 4,
                  opacity: 0.1,
                  transform: 'translate(16px, -16px)',
                  color: colors.primary,
                  pointerEvents: 'none',
                  display: { xs: 'none', sm: 'block' },
                }}
              >
                <ScrollText size={120} />
              </Box>
              <Box sx={{ width: 48, height: 48, borderRadius: radius.default, bgcolor: colors.surfaceContainerHigh, border: `1px solid ${colors.outlineVariant}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3, color: colors.tertiary }}>
                {FORENSIC_CARDS[0].icon}
              </Box>
              <Typography sx={{ ...typography.headlineMd, color: colors.onSurface, mb: 1.5, fontSize: { xs: '18px', md: '22px' } }}>
                {FORENSIC_CARDS[0].title}
              </Typography>
              <Typography sx={{ ...typography.bodyMd, color: colors.onSurfaceVariant, mb: 4, maxWidth: 480, fontSize: { xs: '14px', md: '16px' } }}>
                {FORENSIC_CARDS[0].desc}
              </Typography>
              <Box sx={{ bgcolor: colors.surfaceContainer, border: `1px solid ${colors.outlineVariant}20`, borderRadius: radius.default, p: 2, mt: 'auto' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1, borderBottom: `1px solid ${colors.outlineVariant}20`, pb: 1, mb: 1 }}>
                  <Typography sx={{ ...typography.codeSm, color: colors.outline }}>Signature Status</Typography>
                  <Typography sx={{ ...typography.codeSm, color: colors.tertiaryFixed, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box component="span" sx={{ width: 14, height: 14, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>✓</Box> Valid
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
                  <Typography sx={{ ...typography.codeSm, color: colors.outline }}>Originator</Typography>
                  <Typography sx={{ ...typography.codeSm, color: colors.onSurface, wordBreak: 'break-word' }}>Sony A7RV [0x4f...9a]</Typography>
                </Box>
              </Box>
            </GlassPanel>

            {/* Card 2: AI Detect */}
            <GlassPanel hover sx={{ p: { xs: 3, md: 4 }, display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ width: 48, height: 48, borderRadius: radius.default, bgcolor: colors.surfaceContainerHigh, border: `1px solid ${colors.outlineVariant}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3, color: colors.primary }}>
                {FORENSIC_CARDS[1].icon}
              </Box>
              <Typography sx={{ ...typography.headlineMd, color: colors.onSurface, mb: 1.5, fontSize: { xs: '18px', md: '22px' } }}>
                {FORENSIC_CARDS[1].title}
              </Typography>
              <Typography sx={{ ...typography.bodyMd, color: colors.onSurfaceVariant, mb: 4, fontSize: { xs: '14px', md: '16px' } }}>
                {FORENSIC_CARDS[1].desc}
              </Typography>
              <Box sx={{ mt: 'auto' }}>
                <Box sx={{ width: '100%', bgcolor: colors.surfaceContainer, borderRadius: radius.full, height: 8, mb: 1, overflow: 'hidden' }}>
                  <Box sx={{ width: '87%', height: '100%', background: 'linear-gradient(90deg, #ffb4ab, #93000a)' }} />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', ...typography.codeSm, flexWrap: 'wrap', gap: 0.5 }}>
                  <Typography sx={{ color: colors.onSurfaceVariant }}>Synthetic Probability</Typography>
                  <Typography sx={{ color: colors.error, fontWeight: 500 }}>87%</Typography>
                </Box>
              </Box>
            </GlassPanel>

            {/* Card 3: Metadata Deep Dive */}
            <GlassPanel hover sx={{ p: { xs: 3, md: 4 }, display: 'flex', flexDirection: 'column', gridColumn: { xs: 'span 1', md: 'span 1' } }}>
              <Box sx={{ width: 48, height: 48, borderRadius: radius.default, bgcolor: colors.surfaceContainerHigh, border: `1px solid ${colors.outlineVariant}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3, color: colors.secondary }}>
                {FORENSIC_CARDS[2].icon}
              </Box>
              <Typography sx={{ ...typography.headlineMd, color: colors.onSurface, mb: 1.5, fontSize: { xs: '18px', md: '22px' } }}>
                {FORENSIC_CARDS[2].title}
              </Typography>
              <Typography sx={{ ...typography.bodyMd, color: colors.onSurfaceVariant, fontSize: { xs: '14px', md: '16px' } }}>
                {FORENSIC_CARDS[2].desc}
              </Typography>
            </GlassPanel>

            {/* Card 4: Visual example (2 cols) */}
            <GlassPanel hover sx={{ p: 1, display: 'flex', flexDirection: 'column', gridColumn: { xs: 'span 1', md: 'span 2' }, position: 'relative', overflow: 'hidden' }}>
              <Box
                className="bg-grid-pattern"
                sx={{
                  width: '100%',
                  flex: 1,
                  minHeight: 220,
                  borderRadius: radius.default,
                  background: 'linear-gradient(135deg, #201f1f 0%, #0e0e0e 60%, #1c1b1b 100%)',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ScanSearch size={96} color={colors.primary} style={{ opacity: 0.35 }} />
                <Box className="scanner-line" sx={{ opacity: 0.6 }} />
              </Box>
              <Box sx={{ position: 'absolute', bottom: 20, left: 20 }}>
                <Box
                  sx={{
                    px: 1.5,
                    py: 0.75,
                    borderRadius: radius.full,
                    bgcolor: 'rgba(14, 14, 14, 0.8)',
                    backdropFilter: 'blur(8px)',
                    border: `1px solid ${colors.outlineVariant}30`,
                    color: colors.onSurface,
                    ...typography.labelMd,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: colors.error, animation: 'pulse 1.5s ease-in-out infinite' }} />
                  Anomaly Detected
                </Box>
              </Box>
            </GlassPanel>
          </Box>
        </Box>
      </Box>

      <AppFooter variant="landing" />
    </Box>
  )
}
