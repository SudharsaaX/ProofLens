import React, { useState, useEffect } from 'react'
import { Box, Typography, Alert } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { Search, Verified, Info, Terminal, Image as ImageIcon } from 'lucide-react'
import UploadZone from './UploadZone'
import AnalysisReport from './AnalysisReport'
import PrimaryButton from './ui/PrimaryButton'
import GhostButton from './ui/GhostButton'
import GradientText from './ui/GradientText'
import { useUpload } from '../context/UploadContext'
import { colors, radius, typography } from '../utils/tokens'
import { fetchApi } from '../utils/api'

export default function InspectImageTab() {
  const navigate = useNavigate()
  const { file, setFile } = useUpload()
  const [previewUrl, setPreviewUrl] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [analysis, setAnalysis] = useState(null)

  const [progress, setProgress] = useState(0)
  const [logs, setLogs] = useState([])

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      return () => URL.revokeObjectURL(url)
    } else {
      setPreviewUrl(null)
    }
  }, [file])

  useEffect(() => {
    if (loading) {
      setProgress(0)
      setLogs(['[00:00:00] Initialization complete.'])

      const interval = setInterval(() => {
        setProgress((p) => {
          if (p >= 99) return 99
          return p + Math.floor(Math.random() * 5)
        })
      }, 500)

      const logSeq = [
        '[00:00:01] Fetching file header... OK',
        '[00:00:02] Parsing EXIF directory...',
        '[00:00:03] Extracting thumbnail data...',
        '[00:00:04] Querying C2PA trust chain...',
        '[00:00:05] Scanning pixel integrity...',
        '[00:00:06] Running deep-fake heuristic models...',
      ]

      let step = 0
      const logInt = setInterval(() => {
        if (step < logSeq.length) {
          setLogs((prev) => [...prev, logSeq[step]])
          step++
        }
      }, 800)

      return () => {
        clearInterval(interval)
        clearInterval(logInt)
      }
    }
  }, [loading])

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile)
    setAnalysis(null)
    setError(null)
  }

  const handleClearFile = () => {
    setFile(null)
    setAnalysis(null)
    setError(null)
  }

  const handleAnalyze = async () => {
    if (!file) return

    setLoading(true)
    setError(null)
    setAnalysis(null)

    const formData = new FormData()
    formData.append('file', file)

    const { data, error: apiError } = await fetchApi('/api/analyze', {
      method: 'POST',
      body: formData,
    })

    if (apiError) {
      setError(apiError)
    } else {
      setAnalysis(data)
    }

    setLoading(false)
  }

  // ---- Empty state: hero + upload ----
  if (!file) {
    return (
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box sx={{ textAlign: 'center', maxWidth: 800, mb: 6, mt: { xs: 3, md: 6 } }}>
          <Typography variant="h1" sx={{ ...typography.displayLg, fontSize: { xs: '32px', md: '56px' }, color: colors.onSurface, mb: 3 }}>
            Know the truth behind <br />
            <GradientText>every pixel.</GradientText>
          </Typography>
          <Typography variant="body1" sx={{ ...typography.bodyLg, color: colors.onSurfaceVariant, maxWidth: 650, mx: 'auto', mb: 5 }}>
            Uncover the invisible history of your digital media. Our forensic-grade engine analyzes cryptographic signatures, metadata, and pixel-level anomalies to verify authenticity in real-time.
          </Typography>
        </Box>

        <Box sx={{ width: '100%', maxWidth: '800px', mx: 'auto', mb: 8 }}>
          <UploadZone
            onFileSelect={handleFileSelect}
            selectedFile={file}
            onClear={handleClearFile}
            isLoading={loading}
          />
        </Box>
      </Box>
    )
  }

  // ---- File selected / analyzing / results ----
  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}>
      {error && (
        <Alert
          severity="error"
          sx={{
            borderRadius: radius.default,
            bgcolor: colors.errorContainer,
            color: colors.onErrorContainer,
            border: `1px solid ${colors.error}40`,
            '& .MuiAlert-icon': { color: colors.error },
          }}
        >
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 3 }}>
          {/* Left column: media + log */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
            <Box className="glass-panel" sx={{ borderRadius: radius.md, overflow: 'hidden', position: 'relative', height: { xs: 280, md: 380 }, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#0a0a0b' }}>
              {previewUrl && (
                <>
                  <Box
                    component="img"
                    src={previewUrl}
                    sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(24px) opacity(0.25)', transform: 'scale(1.15)', pointerEvents: 'none' }}
                  />
                  <Box
                    component="img"
                    src={previewUrl}
                    sx={{ position: 'relative', zIndex: 1, maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', opacity: loading ? 0.75 : 1, transition: 'all 0.5s' }}
                  />
                </>
              )}
              <Box className="scanner-line" sx={{ zIndex: 2 }} />
              <Box sx={{ position: 'absolute', inset: 0, zIndex: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                <Box sx={{ width: 96, height: 96, borderRadius: '50%', border: `4px solid ${colors.surfaceContainerHighest}`, borderTopColor: colors.primary, animation: 'spin 1s linear infinite', mb: 2, boxShadow: `0 0 20px ${colors.primary}1A` }} />
                <Box sx={{ bgcolor: 'rgba(19,19,19,0.85)', backdropFilter: 'blur(12px)', px: 3, py: 1, borderRadius: radius.full, border: `1px solid ${colors.outline}40`, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Typography sx={{ fontSize: '48px', fontWeight: 700, color: colors.primary, letterSpacing: '-0.02em', lineHeight: 1 }}>{progress}%</Typography>
                  <Typography sx={{ fontSize: '13px', color: colors.onSurfaceVariant, textTransform: 'uppercase', letterSpacing: '0.1em', mt: 0.5 }}>Extracting Vectors</Typography>
                </Box>
              </Box>
            </Box>

            <Box className="glass-panel" sx={{ borderRadius: radius.md, p: 2, height: 192, display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(140,144,159,0.1)', pb: 1, mb: 1, flexShrink: 0 }}>
                <Typography sx={{ fontSize: '14px', color: colors.onSurfaceVariant, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Terminal size={16} /> Analysis Pipeline Log
                </Typography>
                <Box sx={{ position: 'relative', display: 'flex', width: 8, height: 8 }}>
                  <Box sx={{ position: 'absolute', width: '100%', height: '100%', borderRadius: '50%', bgcolor: colors.primary, opacity: 0.75, animation: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite' }} />
                  <Box sx={{ position: 'relative', width: 8, height: 8, borderRadius: '50%', bgcolor: colors.primary }} />
                </Box>
              </Box>
              <Box className="custom-scrollbar" sx={{ flex: 1, overflowY: 'auto', fontSize: '13px', color: colors.onSurfaceVariant, opacity: 0.8, display: 'flex', flexDirection: 'column', gap: 0.5, fontFamily: 'monospace' }}>
                {logs.map((l, i) => (
                  <Box key={i} sx={{ color: i === logs.length - 1 ? colors.primary : 'inherit' }}>{l}</Box>
                ))}
              </Box>
            </Box>
          </Box>

          {/* Right column: metadata skeletons */}
          <Box sx={{ width: { xs: '100%', lg: 384 }, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box className="glass-panel" sx={{ borderRadius: radius.md, p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pb: 1, borderBottom: '1px solid rgba(140,144,159,0.1)' }}>
                <Verified size={20} color={colors.outlineVariant} />
                <Typography sx={{ fontSize: '14px', color: colors.onSurfaceVariant }}>Provenance Chain</Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box className="skeleton-shimmer" sx={{ height: 48, width: '100%', borderRadius: 1 }} />
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Box className="skeleton-shimmer" sx={{ height: 32, width: '33%', borderRadius: 1 }} />
                  <Box className="skeleton-shimmer" sx={{ height: 32, width: '66%', borderRadius: 1 }} />
                </Box>
                <Box className="skeleton-shimmer" sx={{ height: 80, width: '100%', borderRadius: 1, mt: 1 }} />
              </Box>
            </Box>
            <Box className="glass-panel" sx={{ borderRadius: radius.md, p: 2, display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pb: 1, borderBottom: '1px solid rgba(140,144,159,0.1)' }}>
                <Info size={20} color={colors.outlineVariant} />
                <Typography sx={{ fontSize: '14px', color: colors.onSurfaceVariant }}>Technical EXIF</Typography>
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                {[1, 2, 3, 4].map((i) => (
                  <Box key={i} sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: i > 2 ? 1 : 0 }}>
                    <Box className="skeleton-shimmer" sx={{ height: 12, width: `${Math.random() * 40 + 40}%`, borderRadius: radius.sm }} />
                    <Box className="skeleton-shimmer" sx={{ height: 20, width: `${Math.random() * 50 + 50}%`, borderRadius: radius.sm }} />
                  </Box>
                ))}
              </Box>
              <Box sx={{ mt: 'auto', pt: 2, borderTop: '1px solid rgba(140,144,159,0.1)' }}>
                <Box className="skeleton-shimmer" sx={{ height: 40, width: '100%', borderRadius: 1 }} />
              </Box>
            </Box>
          </Box>
        </Box>
      ) : analysis ? (
        <AnalysisReport
          analysis={analysis}
          previewUrl={previewUrl}
          file={file}
          onClear={() => navigate('/privacy-cleaner')}
          onReset={handleClearFile}
        />
      ) : (
        <>
          {/* Media focus */}
          <Box className="glass-panel" sx={{ borderRadius: radius.md, overflow: 'hidden', position: 'relative', height: { xs: 280, md: 380 }, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#0a0a0b' }}>
            {previewUrl && (
              <>
                <Box
                  component="img"
                  src={previewUrl}
                  sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(24px) opacity(0.25)', transform: 'scale(1.15)', pointerEvents: 'none' }}
                />
                <Box component="img" src={previewUrl} sx={{ position: 'relative', zIndex: 1, maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
              </>
            )}
            <Box sx={{ position: 'absolute', top: 16, left: 16, zIndex: 2, display: 'flex', gap: 1 }}>
              <Box sx={{ px: 1.5, py: 0.5, borderRadius: radius.sm, fontSize: '12px', fontWeight: 500, border: '1px solid rgba(172,237,255,0.3)', color: colors.tertiaryFixed, bgcolor: 'rgba(172,237,255,0.1)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <ImageIcon size={14} /> {file?.type?.split('/')[1]?.toUpperCase() || 'IMAGE'}
              </Box>
              <Box sx={{ px: 1.5, py: 0.5, borderRadius: radius.sm, fontSize: '12px', fontWeight: 500, border: '1px solid rgba(66,71,84,0.3)', color: colors.onSurfaceVariant, bgcolor: 'rgba(32,31,31,0.5)', backdropFilter: 'blur(4px)' }}>
                {(file?.size / (1024 * 1024)).toFixed(1)} MB
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mt: 1 }}>
            <PrimaryButton variant="gradient" onClick={handleAnalyze} startIcon={<Search size={15} />} fullWidth sx={{ py: 1.5, borderRadius: radius.default, fontSize: '14px', fontWeight: 600 }}>
              Start Verification Scan
            </PrimaryButton>
            <GhostButton onClick={handleClearFile} fullWidth sx={{ py: 1.5, borderRadius: radius.default, fontSize: '14px', fontWeight: 600, color: colors.error, borderColor: `${colors.error}40`, '&:hover': { borderColor: colors.error, bgcolor: `${colors.error}0D` } }}>
              Clear Image
            </GhostButton>
          </Box>

          <Box className="glass-panel" sx={{ borderRadius: radius.md, p: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 160 }}>
            <Typography sx={{ color: colors.outline, fontSize: '14px', textAlign: 'center', lineHeight: 1.6 }}>
              Waiting for analysis...<br />
              Click <Box component="span" sx={{ color: colors.primary }}>Start Verification Scan</Box> to proceed.
            </Typography>
          </Box>
        </>
      )}
    </Box>
  )
}
