import React, { useState, useEffect } from 'react'
import { Box, Grid, Typography, Checkbox, FormControlLabel, Alert, IconButton } from '@mui/material'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, CheckCircle, XCircle, SprayCan, Shield, FileCheck, X } from 'lucide-react'
import UploadZone from './UploadZone'
import LoadingSpinner from './LoadingSpinner'
import PrimaryButton from './ui/PrimaryButton'
import GhostButton from './ui/GhostButton'
import Pill from './ui/Pill'
import { useUpload } from '../context/UploadContext'
import { colors, radius, typography } from '../utils/tokens'
import { fetchApi } from '../utils/api'

export default function PrivacyCleanerTab() {
  const { file, setFile } = useUpload()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)
  const [showNotification, setShowNotification] = useState(false)
  const [options, setOptions] = useState({
    remove_exif: true,
    remove_gps: true,
    remove_camera: true,
    remove_iptc: true,
    remove_xmp: true,
  })

  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(false)
      }, 6000)
      return () => clearTimeout(timer)
    }
  }, [showNotification])

  const handleOptionChange = (key) => (event) => {
    setOptions((prev) => ({
      ...prev,
      [key]: event.target.checked,
    }))
  }

  const handleCleanImage = async () => {
    if (!file) return

    setLoading(true)
    setError(null)
    setResult(null)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('remove_exif', String(options.remove_exif))
    formData.append('remove_gps', String(options.remove_gps))
    formData.append('remove_camera', String(options.remove_camera))
    formData.append('remove_iptc', String(options.remove_iptc))
    formData.append('remove_xmp', String(options.remove_xmp))

    const { data, error: apiError } = await fetchApi('/api/clean', {
      method: 'POST',
      body: formData,
    })

    if (apiError) {
      setError(apiError)
    } else {
      setResult(data)
    }

    setLoading(false)
  }

  const handleDownload = () => {
    if (!result?.download_id) return
    const apiBase = import.meta.env.VITE_API_URL
    window.location.href = `${apiBase}/api/download/${result.download_id}`
    setShowNotification(true)
  }

  const origExifData = result?.original?.exif?.data || {}
  const cleanExifData = result?.cleaned?.exif?.data || {}

  const originalExif = result?.original?.exif?.found
  const originalIptc = result?.original?.iptc?.found
  const originalXmp = result?.original?.xmp?.found
  const origHasGps = Object.keys(origExifData).some((k) => k.startsWith('GPS'))
  const origHasCam = Object.keys(origExifData).some((k) => ['Make', 'Model', 'Software'].includes(k))

  const afterExif = result?.cleaned?.exif?.found
  const afterIptc = result?.cleaned?.iptc?.found
  const afterXmp = result?.cleaned?.xmp?.found

  const compareItems = []
  if (result) {
    if (options.remove_exif && originalExif) {
      const success = result.report?.exif_removed ?? !afterExif
      compareItems.push({ label: 'All EXIF Metadata', status: success ? 'Removed' : 'Failed to Remove', success })
    } else {
      if (options.remove_gps && origHasGps) {
        const success = result.report?.gps_removed ?? !Object.keys(cleanExifData).some((k) => k.startsWith('GPS'))
        compareItems.push({ label: 'GPS Location', status: success ? 'Removed' : 'Failed to Remove', success })
      }
      if (options.remove_camera && origHasCam) {
        const success = result.report?.camera_removed ?? !Object.keys(cleanExifData).some((k) => ['Make', 'Model', 'Software'].includes(k))
        compareItems.push({ label: 'Camera Information', status: success ? 'Removed' : 'Failed to Remove', success })
      }
    }
    if (options.remove_iptc && originalIptc) {
      const success = result.report?.iptc_removed ?? !afterIptc
      compareItems.push({ label: 'IPTC Attributes', status: success ? 'Removed' : 'Failed to Remove', success })
    }
    if (options.remove_xmp && originalXmp) {
      const success = result.report?.xmp_removed ?? !afterXmp
      compareItems.push({ label: 'XMP Manifests', status: success ? 'Removed' : 'Failed to Remove', success })
    }

    const originalC2pa = result?.original?.c2pa?.found
    const afterC2pa = result?.cleaned?.c2pa?.found
    const originalPng = result?.original?.png_metadata?.found
    const afterPng = result?.cleaned?.png_metadata?.found

    if (originalC2pa) {
      const success = result.report?.c2pa_removed ?? !afterC2pa
      compareItems.push({ label: 'Content Credentials (C2PA)', status: success ? 'Removed' : 'Failed to Remove', success })
    }
    if (originalPng) {
      const success = result.report?.png_removed ?? !afterPng
      compareItems.push({ label: 'Format-Specific Metadata', status: success ? 'Removed' : 'Failed to Remove', success })
    }
  }

  const checkboxItems = [
    { key: 'remove_exif', label: 'All EXIF Metadata', desc: 'Camera settings, timestamps, device info' },
    { key: 'remove_gps', label: 'GPS Location', desc: 'Latitude, longitude coordinates' },
    { key: 'remove_camera', label: 'Camera Information', desc: 'Make, model, lens identifiers' },
    { key: 'remove_iptc', label: 'IPTC Attributes', desc: 'Copyright, photographer, captions' },
    { key: 'remove_xmp', label: 'XMP Manifests', desc: 'Editing history, creator tools' },
  ]

  return (
    <Box sx={{ width: '100%', maxWidth: 1120, mx: 'auto', display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1.5 }}>
          <Pill tone="error" color={colors.error} startIcon={<SprayCan size={14} />}>
            Metadata Remover
          </Pill>
        </Box>
        <Typography sx={{ ...typography.headlineLg, color: colors.onSurface }}>
          Sanitize before you share
        </Typography>
        <Typography sx={{ ...typography.bodyMd, color: colors.onSurfaceVariant, maxWidth: 540, mx: 'auto', mt: 0.5 }}>
          Strip GPS coordinates, device identifiers, and editing history from your images before public distribution.
        </Typography>
      </Box>

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

      {/* 2-Column Side-by-Side Workspace */}
      <Grid container spacing={3} alignItems="stretch">
        {/* Left Column: Image Upload & Preview */}
        <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: { xs: 360, md: 440 } }}>
            <UploadZone
              onFileSelect={(f) => {
                setFile(f)
                setResult(null)
                setError(null)
              }}
              selectedFile={file}
              onClear={() => {
                setFile(null)
                setResult(null)
                setError(null)
              }}
              isLoading={loading}
            />
          </Box>
        </Grid>

        {/* Right Column: Removal Options / Cleaning Results */}
        <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box className="animated-border-wrap" sx={{ width: '100%', height: '100%', minHeight: { xs: 360, md: 440 } }}>
            <Box className="animated-border-content" sx={{ p: { xs: 2.5, md: 3.5 }, height: '100%', display: 'flex', flexDirection: 'column' }}>
              {file && !loading && !result && (
                <>
                  <Typography
                    variant="caption"
                    sx={{
                      color: colors.outline,
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      fontSize: '0.6875rem',
                      mb: 2,
                      display: 'block',
                    }}
                  >
                    Select Metadata to Remove
                  </Typography>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 3, flex: 1 }}>
                    {checkboxItems.map((item) => (
                      <FormControlLabel
                        key={item.key}
                        control={
                          <Checkbox
                            checked={options[item.key]}
                            onChange={handleOptionChange(item.key)}
                            size="small"
                            sx={{
                              color: colors.outline,
                              '&.Mui-checked': { color: colors.primary },
                              p: 0.75,
                            }}
                          />
                        }
                        label={
                          <Box sx={{ ml: 0.5 }}>
                            <Typography
                              variant="body2"
                              sx={{ color: colors.onSurface, fontWeight: 500, fontSize: '0.8125rem', lineHeight: 1.3 }}
                            >
                              {item.label}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{ color: colors.outline, fontSize: '0.6875rem' }}
                            >
                              {item.desc}
                            </Typography>
                          </Box>
                        }
                        sx={{
                          mx: 0,
                          py: 0.5,
                          px: 1,
                          borderRadius: radius.default,
                          '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' },
                          alignItems: 'flex-start',
                        }}
                      />
                    ))}
                  </Box>

                  <PrimaryButton
                    variant="pill"
                    fullWidth
                    size="large"
                    onClick={handleCleanImage}
                    startIcon={<Shield size={16} />}
                    sx={{ py: 1.25, fontSize: '0.875rem', mt: 'auto' }}
                  >
                    Clean Image
                  </PrimaryButton>
                </>
              )}

              {loading && (
                <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <LoadingSpinner message="Cleaning metadata losslessly…" />
                </Box>
              )}

              {result && (
                <>
                  <Typography
                    variant="caption"
                    sx={{
                      color: colors.outline,
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      fontSize: '0.6875rem',
                      mb: 2,
                      display: 'block',
                    }}
                  >
                    Cleaning Results
                  </Typography>

                  {compareItems.length > 0 ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3, flex: 1 }}>
                      {compareItems.map((item) => (
                        <Box
                          key={item.label}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            py: 1,
                            px: 1.5,
                            borderRadius: radius.default,
                            bgcolor: item.success ? colors.successContainer : 'rgba(255, 180, 171, 0.04)',
                            border: '1px solid',
                            borderColor: item.success ? 'rgba(74, 222, 128, 0.2)' : `${colors.error}1F`,
                          }}
                        >
                          <Typography variant="body2" sx={{ color: colors.onSurface, fontWeight: 500, fontSize: '0.8125rem' }}>
                            {item.label}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                            {item.success ? (
                              <CheckCircle size={15} color={colors.success} />
                            ) : (
                              <XCircle size={15} color={colors.error} />
                            )}
                            <Typography
                              variant="caption"
                              sx={{
                                color: item.success ? colors.success : colors.error,
                                fontWeight: 600,
                                fontSize: '0.75rem',
                              }}
                            >
                              {item.status}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        py: 3,
                        px: 2,
                        textAlign: 'center',
                        borderRadius: radius.default,
                        bgcolor: colors.surfaceContainerLow,
                        border: `1px solid ${colors.outlineVariant}`,
                        mb: 3,
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography variant="body2" sx={{ color: colors.outline, fontSize: '0.8125rem' }}>
                        No removable metadata was found in the original image.
                      </Typography>
                    </Box>
                  )}

                  <PrimaryButton
                    variant="green"
                    fullWidth
                    size="large"
                    onClick={handleDownload}
                    startIcon={<Download size={16} />}
                    sx={{ py: 1.25, fontSize: '0.875rem', mt: 'auto' }}
                  >
                    Download Clean Image
                  </PrimaryButton>

                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1.5 }}>
                    <GhostButton size="small" onClick={() => { setResult(null); setFile(null) }} sx={{ fontSize: '0.75rem', color: colors.outline }}>
                      Start a new cleaning
                    </GhostButton>
                  </Box>
                </>
              )}

              {!file && (
                <>
                  <Typography
                    variant="caption"
                    sx={{
                      color: colors.outline,
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      fontSize: '0.6875rem',
                      mb: 2,
                      display: 'block',
                    }}
                  >
                    Protection Capabilities
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25, flex: 1, justifyContent: 'center' }}>
                    {checkboxItems.map((item) => (
                      <Box key={item.key} sx={{ p: 1.25, borderRadius: radius.default, bgcolor: colors.surfaceContainerLow, border: `1px solid ${colors.outlineVariant}20` }}>
                        <Typography sx={{ color: colors.onSurface, fontSize: '13px', fontWeight: 600 }}>{item.label}</Typography>
                        <Typography sx={{ color: colors.outline, fontSize: '11px', mt: 0.25 }}>{item.desc}</Typography>
                      </Box>
                    ))}
                  </Box>
                </>
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Side Download Notification Toast */}
      <AnimatePresence>
        {showNotification && (
          <Box
            component={motion.div}
            initial={{ opacity: 0, x: 80, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 80, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            sx={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              zIndex: 9999,
              maxWidth: 380,
              width: 'calc(100vw - 48px)',
              bgcolor: 'rgba(16, 13, 37, 0.95)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(74, 222, 128, 0.4)',
              borderLeft: '4px solid #4ade80',
              borderRadius: radius.md,
              p: 2,
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(74, 222, 128, 0.2)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 1.5,
            }}
          >
            <Box
              sx={{
                p: 1,
                bgcolor: 'rgba(74, 222, 128, 0.15)',
                borderRadius: radius.full,
                color: '#4ade80',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                mt: 0.25,
              }}
            >
              <FileCheck size={20} />
            </Box>

            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.25 }}>
                <Typography sx={{ color: '#ffffff', fontWeight: 600, fontSize: '0.875rem', fontFamily: 'Poppins' }}>
                  Cleaned Image Downloaded!
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => setShowNotification(false)}
                  sx={{ color: colors.outline, p: 0.25, '&:hover': { color: '#ffffff' } }}
                >
                  <X size={14} />
                </IconButton>
              </Box>
              <Typography sx={{ color: colors.onSurfaceVariant, fontSize: '0.75rem', fontFamily: 'Poppins', lineHeight: 1.45 }}>
                Your sanitized image has been saved without GPS coordinates or sensitive EXIF metadata.
              </Typography>
            </Box>
          </Box>
        )}
      </AnimatePresence>
    </Box>
  )
}
