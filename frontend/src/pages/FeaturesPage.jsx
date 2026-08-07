import React from 'react'
import { Box, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { ShieldCheck, Cpu, Braces, Lock, MapPin, Fingerprint, User, CheckCircle, Zap } from 'lucide-react'
import LandingNav from '../components/layout/LandingNav'
import AppFooter from '../components/ui/AppFooter'
import GlassPanel from '../components/ui/GlassPanel'
import Donut from '../components/ui/Donut'
import PrimaryButton from '../components/ui/PrimaryButton'
import GradientText from '../components/ui/GradientText'
import { colors, spacing, radius, typography } from '../utils/tokens'

const FORMATS = [
  { label: '.JPG / .JPEG', soon: false },
  { label: '.PNG', soon: false },
  { label: '.WEBP', soon: false },
  { label: '.HEIC', soon: false },
  { label: '.MP4', soon: false },
  { label: '.MOV', soon: false },
  { label: '.RAW (Soon)', soon: true },
]

function CardHeader({ icon, color, title }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2, position: 'relative', zIndex: 1 }}>
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: radius.default,
          bgcolor: colors.surfaceContainer,
          border: `1px solid ${colors.outlineVariant}30`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color,
        }}
      >
        {icon}
      </Box>
      <Typography sx={{ ...typography.headlineMd, color: colors.onSurface, fontSize: '20px' }}>{title}</Typography>
    </Box>
  )
}

export default function FeaturesPage() {
  const navigate = useNavigate()

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: colors.background, overflowX: 'hidden' }}>
      <LandingNav />

      <Box component="main" sx={{ flexGrow: 1 }}>
        {/* Hero */}
        <Box component="section" sx={{ maxWidth: spacing.containerMax, mx: 'auto', px: spacing.gutter, py: { xs: 8, md: 16 }, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, px: 1.5, py: 0.75, borderRadius: radius.full, border: `1px solid ${colors.outlineVariant}50`, bgcolor: 'rgba(28, 27, 27, 0.5)', mb: 4, backdropFilter: 'blur(4px)' }}>
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: colors.primary, boxShadow: `0 0 8px ${colors.primary}` }} />
            <Typography sx={{ ...typography.labelMd, color: colors.onSurfaceVariant, fontSize: '13px' }}>
              v2.0 Platform Update Now Live
            </Typography>
          </Box>
          <Typography
            component="h1"
            sx={{
              ...typography.displayLg,
              mb: 4,
              maxWidth: 896,
              mx: 'auto',
              lineHeight: 1.1,
              fontSize: { xs: '40px', md: '72px' },
              color: colors.onSurface,
            }}
          >
            Forensic-Grade <br />
            <GradientText>Image Intelligence</GradientText>
          </Typography>
          <Typography sx={{ ...typography.bodyLg, color: colors.onSurfaceVariant, maxWidth: 576, mx: 'auto', mb: 8 }}>
            Uncover the absolute truth of any digital asset. Real-time verification, deep metadata extraction, and AI generation detection built for security-conscious developers.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
            <PrimaryButton variant="gradient" onClick={() => navigate('/workspace')} sx={{ px: 6, py: 1.5, fontSize: '14px', fontWeight: 500, boxShadow: `0 4px 16px ${colors.primary}1A` }}>
              Start Analyzing
            </PrimaryButton>
          </Box>
        </Box>

        {/* Feature Bento Grid */}
        <Box component="section" sx={{ maxWidth: spacing.containerMax, mx: 'auto', px: spacing.gutter, py: 6 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
            {/* C2PA Verification (2 cols) */}
            <GlassPanel hover sx={{ p: 4, display: 'flex', flexDirection: 'column', gridColumn: { xs: 'span 1', md: 'span 2' }, position: 'relative', overflow: 'hidden' }}>
              <Box sx={{ position: 'absolute', top: -80, right: -80, width: 256, height: 256, borderRadius: '50%', bgcolor: `${colors.primary}1A`, filter: 'blur(64px)', pointerEvents: 'none', transition: 'all 0.5s' }} />
              <CardHeader icon={<ShieldCheck size={20} />} color={colors.primary} title="C2PA Verification" />
              <Typography sx={{ ...typography.bodyMd, color: colors.onSurfaceVariant, mb: 6, maxWidth: 448, position: 'relative', zIndex: 1 }}>
                Cryptographically verify the origin and history of media files. Ensure the content hasn't been tampered with since its creation.
              </Typography>
              <Box sx={{ mt: 'auto', bgcolor: colors.surfaceDim, border: `1px solid ${colors.outlineVariant}20`, borderRadius: radius.default, p: 3, position: 'relative', zIndex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography sx={{ ...typography.codeSm, color: colors.outline, fontFamily: '"JetBrains Mono", monospace' }}>trust_seal.sig</Typography>
                  <Box sx={{ bgcolor: `${colors.primary}33`, color: colors.primary, px: 1, py: 0.5, borderRadius: radius.sm, border: `1px solid ${colors.primary}50`, fontSize: '11px', fontWeight: 600 }}>
                    Valid Signature
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, ...typography.codeSm, fontSize: '13px' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 0.5 }}>
                    <Typography sx={{ color: colors.outlineVariant }}>Issuer:</Typography>
                    <Typography sx={{ color: colors.onSurface, wordBreak: 'break-word' }}>Content Authenticity Initiative</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 0.5 }}>
                    <Typography sx={{ color: colors.outlineVariant }}>Timestamp:</Typography>
                    <Typography sx={{ color: colors.onSurface, wordBreak: 'break-word' }}>2024-05-20T14:32:00Z</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 0.5 }}>
                    <Typography sx={{ color: colors.outlineVariant }}>Hash Check:</Typography>
                    <Typography sx={{ color: colors.tertiary, wordBreak: 'break-word' }}>Match (SHA-256)</Typography>
                  </Box>
                </Box>
              </Box>
            </GlassPanel>

            {/* AI Detection */}
            <GlassPanel hover sx={{ p: 4, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
              <Box sx={{ position: 'absolute', bottom: -40, right: -40, width: 160, height: 160, borderRadius: '50%', bgcolor: `${colors.error}1A`, filter: 'blur(40px)', pointerEvents: 'none', transition: 'all 0.5s' }} />
              <CardHeader icon={<Cpu size={20} />} color={colors.error} title="AI Detection" />
              <Typography sx={{ ...typography.bodyMd, color: colors.onSurfaceVariant, mb: 6, position: 'relative', zIndex: 1, fontSize: '14px' }}>
                Identify synthetic media generated by Midjourney, DALL-E, Stable Diffusion, and more with 95%+ confidence.
              </Typography>
              <Box sx={{ mt: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 3, border: `1px solid ${colors.outlineVariant}20`, borderRadius: radius.default, bgcolor: colors.surfaceDim, position: 'relative', zIndex: 1 }}>
                <Donut value={98.2} color={colors.error} size={112} strokeWidth={7} label="Synthetic Probability" />
              </Box>
            </GlassPanel>

            {/* Deep Metadata */}
            <GlassPanel hover sx={{ p: 4, display: 'flex', flexDirection: 'column' }}>
              <CardHeader icon={<Braces size={20} />} color={colors.tertiary} title="Deep Metadata" />
              <Typography sx={{ ...typography.bodyMd, color: colors.onSurfaceVariant, mb: 6, fontSize: '14px' }}>
                Extract every hidden byte of EXIF, IPTC, and XMP data instantly.
              </Typography>
              <Box sx={{ mt: 'auto', bgcolor: colors.surfaceDim, p: 2, borderRadius: radius.default, border: `1px solid ${colors.outlineVariant}20`, ...typography.codeSm, fontSize: '12px', color: colors.outline, overflow: 'hidden', fontFamily: '"JetBrains Mono", monospace' }}>
                <Typography sx={{ color: colors.primary, mb: 0.5 }}>&gt;&gt; extract_exif(image_path)</Typography>
                <Box sx={{ color: colors.outline }}>{'{'}</Box>
                <Box sx={{ pl: 3, color: colors.onSurfaceVariant }}>"Make": <Box component="span" sx={{ color: colors.tertiary }}>"Sony"</Box>,</Box>
                <Box sx={{ pl: 3, color: colors.onSurfaceVariant }}>"Model": <Box component="span" sx={{ color: colors.tertiary }}>"ILCE-7M3"</Box>,</Box>
                <Box sx={{ pl: 3, color: colors.onSurfaceVariant }}>"Lens": <Box component="span" sx={{ color: colors.tertiary }}>"FE 24-70mm F2.8 GM"</Box>,</Box>
                <Box sx={{ pl: 3, color: colors.onSurfaceVariant }}>"GPSLatitude": <Box component="span" sx={{ color: colors.tertiary }}>"34.0522° N"</Box></Box>
                <Box sx={{ color: colors.outline }}>{'}'}</Box>
              </Box>
            </GlassPanel>

            {/* Privacy Stripping (2 cols) */}
            <GlassPanel hover sx={{ p: 4, display: 'flex', flexDirection: 'column', gridColumn: { xs: 'span 1', md: 'span 2' } }}>
              <CardHeader icon={<Lock size={20} />} color={colors.secondary} title="Privacy Stripping" />
              <Typography sx={{ ...typography.bodyMd, color: colors.onSurfaceVariant, mb: 6, maxWidth: 448 }}>
                Sanitize images before public distribution. Automatically remove sensitive location data, device identifiers, and hidden trackers while preserving image quality.
              </Typography>
              <Box sx={{ mt: 'auto', display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                <Box sx={{ bgcolor: colors.surfaceDim, p: 2, borderRadius: radius.default, border: `1px solid ${colors.error}40`, position: 'relative' }}>
                  <Box sx={{ position: 'absolute', top: 8, right: 8, bgcolor: `${colors.error}33`, color: colors.error, px: 1, py: 0.25, borderRadius: radius.sm, fontSize: '11px', fontWeight: 600 }}>Before</Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 4, ...typography.codeSm, fontSize: '13px', color: colors.onSurfaceVariant }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <MapPin size={16} color={colors.error} /> GPS Coordinates Found
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Fingerprint size={16} color={colors.error} /> Device Serial Present
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <User size={16} color={colors.error} /> Author Details Exposed
                    </Box>
                  </Box>
                </Box>
                <Box sx={{ bgcolor: colors.surfaceDim, p: 2, borderRadius: radius.default, border: `1px solid ${colors.tertiary}40`, position: 'relative' }}>
                  <Box sx={{ position: 'absolute', top: 8, right: 8, bgcolor: `${colors.tertiary}33`, color: colors.tertiary, px: 1, py: 0.25, borderRadius: radius.sm, fontSize: '11px', fontWeight: 600 }}>After</Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 4, ...typography.codeSm, fontSize: '13px', color: colors.onSurfaceVariant }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CheckCircle size={16} color={colors.tertiary} /> Location Data Stripped
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CheckCircle size={16} color={colors.tertiary} /> Hardware IDs Removed
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CheckCircle size={16} color={colors.tertiary} /> Fully Sanitized
                    </Box>
                  </Box>
                </Box>
              </Box>
            </GlassPanel>
          </Box>
        </Box>

        {/* Technical Specs & Performance */}
        <Box component="section" sx={{ maxWidth: spacing.containerMax, mx: 'auto', px: spacing.gutter, py: { xs: 8, md: 16 }, display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 6, borderTop: `1px solid ${colors.outlineVariant}10`, mt: 6 }}>
          <Box>
            <Typography sx={{ ...typography.headlineLg, color: colors.onSurface, mb: 4 }}>Supported Formats</Typography>
            <Typography sx={{ ...typography.bodyMd, color: colors.onSurfaceVariant, mb: 6 }}>
              Our engine supports deep analysis across a wide spectrum of modern and legacy digital asset formats.
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
              {FORMATS.map((f) => (
                <Box
                  key={f.label}
                  sx={{
                    px: 2,
                    py: 1,
                    bgcolor: colors.surfaceContainerLow,
                    border: f.soon ? `1px dashed ${colors.outlineVariant}` : `1px solid ${colors.outlineVariant}30`,
                    borderRadius: radius.default,
                    ...typography.codeSm,
                    color: f.soon ? colors.outlineVariant : colors.onSurface,
                    cursor: f.soon ? 'not-allowed' : 'default',
                    transition: 'border-color 0.3s',
                    '&:hover': f.soon ? {} : { borderColor: `${colors.primary}50` },
                  }}
                >
                  {f.label}
                </Box>
              ))}
            </Box>
          </Box>
          <GlassPanel sx={{ p: { xs: 4, md: 8 }, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
            <Zap size={40} color={colors.primary} style={{ marginBottom: 16 }} />
            <Typography sx={{ ...typography.headlineLg, color: colors.onSurface, mb: 1 }}>Real-time analysis</Typography>
            <Typography sx={{ ...typography.bodyMd, color: colors.onSurfaceVariant, mb: 4 }}>Complete forensic processing in under</Typography>
            <Box sx={{ fontSize: { xs: '40px', md: '48px' }, fontWeight: 700, color: colors.primary, display: 'flex', alignItems: 'baseline', gap: 1 }}>
              &lt; 10 to 20
              <Typography sx={{ fontSize: '20px', fontWeight: 400, color: colors.outlineVariant }}>seconds</Typography>
            </Box>
          </GlassPanel>
        </Box>
      </Box>

      <AppFooter variant="landing" />
    </Box>
  )
}
